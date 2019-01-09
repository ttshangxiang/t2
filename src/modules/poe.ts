import * as Router from 'koa-router'
import DB from '../utils/db';
import { ObjectId } from 'mongodb';
const router = new Router({
  prefix: '/poe'
});

// 获取点
router.get('/point', async (ctx, next) => {
  
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_points')
      .find()
      .sort({utime: -1})
      .toArray();
  });
  if (r) {
    ctx.body = { code: 0, data: r };
  } else {
    ctx.body = { code: 1, msg: '获取' };
  }
})

// 创建点
router.post('/point', async (ctx, next) => {
  const body = ctx.body;

  // 插入
  body.ctime = new Date();
  body.utime = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_points')
      .insert(body);
  });
  if (r && r.result && r.result.ok) {
    const info = r.ops[0];
    ctx.body = { code: 0, data: info };
  } else {
    ctx.body = { code: 1, msg: '插入失败' };
  }
})

// 修改点
router.put('/point/:id', async (ctx, next) => {
  const body = ctx.body;
  const id = ctx.params.id;

  // 插入
  body.utime = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_points')
      .update({_id: new ObjectId(id)}, {$set: body})
  });
  if (r && r.result && r.result.ok) {
    ctx.body = { code: 0, data: '修改成功' };
  } else {
    ctx.body = { code: 1, msg: '插入失败' };
  }
})

// 删除点
router.delete('/point/:id', async (ctx, next) => {
  const id = ctx.params.id;
  if (id === undefined) {
    ctx.body = { code: 1, msg: '未传入任何id' };
    return;
  }
  const r = await DB(async (err, db) => {
    return !err && db
      .collection('poe_points')
      .deleteMany({_id: {$in: [new ObjectId(id)]}})
  });
  if (r && r.result && r.result.ok) {
    ctx.body = { code: 0, msg: '删除成功' };
  } else {
    ctx.body = { code: 1, msg: '删除失败' };
  }
})

// 获取线
router.get('/line', async (ctx, next) => {
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_lines')
      .find()
      .sort({utime: -1})
      .toArray();
  });
  if (r) {
    ctx.body = { code: 0, data: r };
  } else {
    ctx.body = { code: 1, msg: '获取失败' };
  }
})

// 创建线
router.post('/line', async (ctx, next) => {
  const body = ctx.body;

  // 插入
  body.ctime = new Date();
  body.utime = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_lines')
      .insert(body);
  });
  if (r && r.result && r.result.ok) {
    const info = r.ops[0];
    ctx.body = { code: 0, data: info };
  } else {
    ctx.body = { code: 1, msg: '修改失败' };
  }
})


// 修改线
router.put('/line/:id', async (ctx, next) => {
  const body = ctx.body;
  const id = ctx.params.id;

  // 插入
  body.utime = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('poe_lines')
      .update({_id: new ObjectId(id)}, {$set: body})
  });
  if (r && r.result && r.result.ok) {
    ctx.body = { code: 0, data: '修改成功' };
  } else {
    ctx.body = { code: 1, msg: '修改失败' };
  }
})

// 删除线
router.delete('/line/:id', async (ctx, next) => {
  const id = ctx.params.id;
  if (id === undefined) {
    ctx.body = { code: 1, msg: '未传入任何id' };
    return;
  }
  const r = await DB(async (err, db) => {
    return !err && db
      .collection('poe_lines')
      .deleteMany({_id: {$in: [new ObjectId(id)]}})
  });
  if (r && r.result && r.result.ok) {
    ctx.body = { code: 0, msg: '删除成功' };
  } else {
    ctx.body = { code: 1, msg: '删除失败' };
  }
})

export default router
