import * as Router from 'koa-router'
import DB from '../utils/db';
const router = new Router({
  prefix: '/user'
})

// 登录
router.post('/login', async (ctx, next) => {
  const { u, p } = ctx.body
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .findOne({username: u, password: p});
  });
  if (r) {
    delete r.password;
    ctx.session.info = r;
    ctx.body = { code: 0, data: r };
  } else {
    ctx.body = { code: 1, msg: '密码错误' };
  }
})

// 注册
router.post('/register', async (ctx, next) => {
  const { u, p, ph } = ctx.body;
  // 唯一查询
  const exist = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .findOne({username: u});
  });
  if (exist) {
    ctx.body = { code: 1, msg: '用户名已存在' };
    return;
  }
  // 插入
  const now = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .insert({username: u, password: p, phone: ph, ctime: now, utime: now});
  });
  if (r && r.result && r.result.ok) {
    const info = r.ops[0];
    delete info.password;
    ctx.session.info = info;
    ctx.body = { code: 0, data: info };
  } else {
    ctx.body = { code: 1, msg: '插入失败' };
  }
})

// 登录和注册
// 登录
router.post('/loginAndRegister', async (ctx, next) => {
  const { u, p } = ctx.body
  const r2 = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .findOne({username: u, password: p});
  });
  if (r2) {
    delete r2.password;
    ctx.session.info = r2;
    ctx.body = { code: 0, data: r2 };
    return;
  }

  // 唯一查询
  const exist = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .findOne({username: u});
  });
  if (exist) {
    ctx.body = { code: 1, msg: '用户名已存在' };
    return;
  }
  // 插入
  const now = new Date();
  const r = await DB(async (err, db) => {
    return !err && await db
      .collection('users')
      .insert({username: u, password: p, ctime: now, utime: now});
  });
  if (r && r.result && r.result.ok) {
    const info = r.ops[0];
    delete info.password;
    ctx.session.info = info;
    ctx.body = { code: 0, data: info };
  } else {
    ctx.body = { code: 1, msg: '插入失败' };
  }

})

// 登出
router.get('/logout', (ctx, next) => {
  ctx.session = null
  ctx.body = { code: 0, msg: 'success' };
})

// 用户信息
router.get('/info', (ctx, next) => {
  const info = ctx.session.info;
  if (info) {
    delete info.password;
    ctx.body = { code: 0, data: ctx.session.info };
  } else {
    ctx.body = { code: -3, msg: '未登录' };
  }
})

export default router
