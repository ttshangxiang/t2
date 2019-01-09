import * as Router from 'koa-router'
import DB from '../utils/db';
import { ObjectId } from 'mongodb';
const router = new Router({
  prefix: '/comment'
});

interface Comment {
  _id?: object, // id
  fid: object, // 所属文件
  pid?: object, // 从属id
  status: Number, // 状态，0: 正常, -1:被删除
  uid: object, // 用户id
  touid?: object, // 对用户id
  content: string, // 内容
  ctime: Date, // 创建时间
  utime: Date // 修改时间
}

// 获取某个项目的评论
router.get('/:id', async (ctx, next) => {
  const offset = parseInt(ctx.query.offset) || 0;
  const count = parseInt(ctx.query.count) || 10;
  let fid = ctx.params.id
  try {
    fid = new ObjectId(ctx.params.id);
  } catch (error) {
  }
  const query = async (err, db) => {
    if (err) {
      return null;
    }
    // 评论
    const data: Array<Comment> = await db
      .collection('comments')
      .aggregate([
        {$match: { fid: fid, pid: { $exists: false }, status: {$gte: 0}}},
        {$sort: {ctime: -1}},
        {$limit: count},
        {$skip: offset},
        {$lookup: { from: 'users', localField: 'uid', foreignField: '_id', as: 'user' }}
      ])
      .toArray()
    // 总数
    const total = await db
      .collection('comments')
      .find({ fid: fid, pid: { $exists: false }, status: {$gte: 0} })
      .count();
    // 评论
    let ids = [];
    data.forEach(item => {
      ids.push(item._id);
    });
    const sub: Array<Comment> = await db
      .collection('comments')
      .aggregate([
        {$match: { fid: fid, pid: { $in: ids }, status: {$gte: 0} }},
        {$sort: {ctime: -1}},
        {$lookup: { from: 'users', localField: 'uid', foreignField: '_id', as: 'user' }},
        {$lookup: { from: 'users', localField: 'touid', foreignField: '_id', as: 'touser' }}
      ])
      .toArray();
    return { data, sub, total };
  }
  const r = await DB(query);
  if (r) {
    ctx.body = { code: 0, data: r };
  } else {
    ctx.body = { code: -1, msg: '获取数据失败' };
  }
});

// 添加一条评论
router.post('/:id', async (ctx, next) => {
  const info = ctx.session.info;
  if (!info || !info._id) {
    ctx.body = { code: -3, msg: '未登录' };
    return;
  }
  const body = ctx.body;
  const now = new Date();
  let fid = ctx.params.id
  try {
    fid = new ObjectId(ctx.params.id);
  } catch (error) {
  }
  let comment: Comment = {
    fid: fid,
    status: 0,
    uid: new ObjectId(ctx.session.info._id),
    content: body.content,
    ctime: now,
    utime: now
  }
  body.pid && (comment.pid = new ObjectId(body.pid));
  body.touid && (comment.touid = new ObjectId(body.touid));
  const r = await DB(async (err, db) => {
    return !err && db
      .collection('comments')
      .insert(comment);
  });
  if (r && r.result && r.result.ok) {
    const info = r.ops[0];
    ctx.body = { code: 0, data: info };
  } else {
    ctx.body = { code: 1, msg: '插入失败' };
  }
});

// 删除评论
router.delete('/', async (ctx, next) => {
  let ids = ctx.query.id;
  if (ids === undefined) {
    ctx.body = { code: 1, msg: '未传入任何id' };
    return;
  }
  if (Object.prototype.toString.call(ids) !== '[object Array]') {
    ids = [ids];
  }
  ids = ids.map(item => new ObjectId(item));
  const r = await DB(async (err, db) => {
    return !err && db
      .collection('comments')
      // .deleteMany({_id: {$in: ids}})
      .update({ _id: { $in: ids }}, { $set: { status: -1 }});
  });
  if (r && r.result && r.result.ok) {
    ctx.body = { code: 0, msg: '删除成功' };
  } else {
    ctx.body = { code: 1, msg: '删除失败' };
  }
});

export default router
