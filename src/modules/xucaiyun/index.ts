import * as Router from 'koa-router';
import { InsertOneWriteOpResult, ObjectId } from 'mongodb';
import base from '../base';
import * as path from 'path';
import { today } from '../../utils/dateUtil';
import crud from '../../utils/crud';
import upload, { i_result } from '../../utils/upload';
import { move, unlink } from '../../utils/files';
import { getThumb, getNormal, getImageInfo } from '../../utils/photos';
import DB from '../../utils/db';
import * as dateUtil from '../../utils/dateUtil';
import * as fs from 'fs';

const router = new Router({
  prefix: '/xucaiyun'
});

// 新增资源
router.post('/res', async (ctx) => {
  const groupId = ctx.query.groupId;
  const {files, ...body} = <i_result> await upload(ctx);
  if (groupId) {
    body.groups = [groupId];
  }
  const t2 = path.resolve(__dirname, '../../../');
  const dest = path.resolve(t2, './uploads/res', today());
  for (const o of files) {
    // 只支持一个文件
    if (o === files[0]) {
      body.path = await move(o.path, path.resolve(dest, o.filename));
      if (body.type && body.type.slice(0, 5) === 'image') {
        const metadata = await getImageInfo(body.path);
        body.width = metadata.width;
        body.height = metadata.height;
        // 压缩
        body.normal = await getNormal(body.path);
        body.thumb = await getThumb(body.path);
        body.normal = path.join('/', path.relative(t2, body.normal));
        body.thumb = path.join('/', path.relative(t2, body.thumb));
      }
      body.path = path.join('/', path.relative(t2, body.path));
    } else {
      await unlink(o.path);
    }
  }
  body.ctime = body.utime = dateUtil.now();
  // 状态0，正常
  body.status = 0;
  const r = <InsertOneWriteOpResult>await DB(async (db) => {
    return await db
      .collection('res')
      .insertOne(body);
  });
  ctx.body = { code: 0, data: r, insert: body, _id: r.insertedId };
});
// 资源修改分组
router.put('/res/group/:id', async (ctx) => {
  const id = ctx.params.id;
  const {adds = [], subs = []} = ctx.request.body;
  const result = [];
  // 新增
  if (adds.length > 0) {
    const r = await DB(async (db) => {
      return await db
        .collection('res')
        .updateMany(
          {_id : {$in: adds.map((o:string) => new ObjectId(o))}}, 
          {$addToSet: {groups: id}}
        );
    });
    result.push(r);
  }
  // 取消
  if (subs.length > 0) {
    const r2 = await DB(async (db) => {
      return await db
        .collection('res')
        .updateMany(
          {_id : {$in: subs.map((o:string) => new ObjectId(o))}}, 
          {$pull: {groups: id}}
        );
    });
    result.push(r2);
  }
  ctx.body = { code: 0, data: result };
});
crud(router, 'res');

// 资源分组
router.put('/resgroup/refresh/:id', async ctx => {
  const id = ctx.params.id;
  const r:any = await DB(async (db) => {
    return await db
      .collection('res')
      .find({groups: {$elemMatch: {$eq: id}}, type: new RegExp('image')})
      .sort({ctime: -1})
      .limit(1)
      .toArray();
  });
  if (r && r[0] && r[0].thumb) {
    const r2 = await DB(async (db) => {
      return await db
        .collection('resgroup')
        .updateOne({_id: new ObjectId(id)}, {$set: {
          thumb: r[0].thumb
        }});
    });
    ctx.body = { code: 0, data: r2 };
  } else {
    ctx.body = { code: 0, message: 'no thumb' };
  }
});
crud(router, 'resgroup');

// 相册
router.get('/albums', async ctx => {
  const r:any = await DB(async (db) => {
    return await db
      .collection('resgroup')
      .find({status: 1, type: 'albums'})
      .sort({ctime: -1})
      .toArray();
  });
  ctx.body = { code: 0, data: r };
});

// 文章类型
router.get('/words', async ctx => {
  const r:any = await DB(async (db) => {
    return await db
      .collection('resgroup')
      .find({status: 1, type: 'words'})
      .sort({ctime: -1})
      .toArray();
  });
  ctx.body = { code: 0, data: r };
});

// 硬核密码
router.post('/res/password', async ctx => {
  const body = ctx.request.body;
  let r = { code: -1, message: 'error'};
  const filePath = path.resolve(__dirname, '../../../../respassword.txt');
  try {
    let pswd = fs.readFileSync(filePath).toString('utf-8');
    pswd = pswd.replace(/[\s\n\t\r]/g, '');
    if (body.password === pswd) {
      r = { code: 0, message: 'success' };
    }
  } catch (error) {}
  ctx.body = r;
});

// 评论 (查询屏蔽email)
crud(router, 'comments', 'crud', {projection: {email: 0, 'reply.email': 0}});
// 回复
router.post('/comments/reply/:id', async ctx => {
  const body = ctx.request.body;
  const id = ctx.params.id;
  body.utime = dateUtil.now();
  body._id = new ObjectId().toHexString();
  const r = await DB(async (db) => {
    return await db
      .collection('comments')
      .updateOne({_id: new ObjectId(id)}, {$push: {reply: body}});
  });
  ctx.body = { code: 0, data: r };
});

base.use(router.routes());
base.use(router.allowedMethods());

