import * as Router from 'koa-router';
import base from '../base';
import * as path from 'path';
import { today } from '../../utils/dateUtil';
import crud from '../../utils/crud';
import upload, { i_result } from '../../utils/upload';
import { move, unlink } from '../../utils/files';
import { getThumb, get720p } from '../../utils/photos';
import DB from '../../utils/db';
import * as dateUtil from '../../utils/dateUtil';

const router = new Router({
  prefix: '/xucaiyun'
});

// 相册
crud(router, 'albums');

// 相片
router.post('/photos', async (ctx) => {
  const {files, ...body} = <i_result> await upload(ctx);
  const t2 = path.resolve(__dirname, '../../../');
  const dest = path.resolve(t2, './uploads/photos', today());
  for (const o of files) {
    // 只支持一张图片
    if (o === files[0]) {
      body.origin = await move(o.path, path.resolve(dest, o.filename));
      body.normal = await get720p(body.origin);
      body.thumb = await getThumb(body.origin);
      body.origin = path.join('/', path.relative(t2, body.origin));
      body.normal = path.join('/', path.relative(t2, body.normal));
      body.thumb = path.join('/', path.relative(t2, body.thumb));
    } else {
      await unlink(o.path);
    }
  }
  body.ctime = body.utime = dateUtil.now();
  // 状态0，正常
  body.status = 0;
  const r = await DB(async (db) => {
    return await db
      .collection('photos')
      .insertOne(body);
  });
  ctx.body = { code: 0, data: r };
});
crud(router, 'photos');

// 资源
router.post('/res', async (ctx) => {
  const {files, ...body} = <i_result> await upload(ctx);
  const t2 = path.resolve(__dirname, '../../../');
  const dest = path.resolve(t2, './uploads/res', today());
  for (const o of files) {
    // 只支持一个文件
    if (o === files[0]) {
      body.origin = await move(o.path, path.resolve(dest, o.filename));
      body.origin = path.join('/', path.relative(t2, body.origin));
    } else {
      await unlink(o.path);
    }
  }
  body.ctime = body.utime = dateUtil.now();
  // 状态0，正常
  body.status = 0;
  const r = await DB(async (db) => {
    return await db
      .collection('res')
      .insertOne(body);
  });
  ctx.body = { code: 0, data: r };
});
crud(router, 'res');


base.use(router.routes());
base.use(router.allowedMethods());

