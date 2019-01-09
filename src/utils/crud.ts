import * as Router from 'koa-router';
import DB from './db';
import { ObjectId } from 'mongodb';

export default function (router: Router, model: string, method: string = 'crud') {

  // 查询
  if (method.includes('r')) {
    // 列表
    router.get(`/${model}`, async (ctx) => {
      const { query = {} } = ctx;
      const { offset = 0, count = 200, ...filters } = query;
      Object.keys(filters).forEach(k => {
        // 模糊查询
        if (filters[k].substr(0,5) === 'like.') {
          filters[k] = new RegExp(filters[k].substr(5));
        }
      });
      const total = await DB(async (db) => {
        return await db
          .collection(model)
          .find(filters)
          .count();
      });
      const r = await DB(async (db) => {
        return await db
          .collection(model)
          .find(filters)
          .sort({utime: -1})
          .skip(+offset)
          .limit(+count)
          .toArray();
      });
      ctx.body = { code: 0, data: { data: r, total } };
    });

    // 详情
    router.get(`/${model}/:id`, async (ctx) => {
      const { params = {} } = ctx;
      const { id } = params;
      const r = await DB(async (db) => {
        return await db
          .collection(model)
          .findOne({ _id: new ObjectId(id) });
      }) || {};
      ctx.body = { code: 0, data: r };
    });
  }

  // 新增
  method.includes('c') &&
  router.post(`/${model}`, async (ctx) => {
    ctx.body = '新增';
  });

  // 修改
  method.includes('u') &&
  router.put(`/${model}`, async (ctx) => {
    ctx.body = '修改';
  });

  // 删除
  method.includes('d') &&
  router.delete(`/${model}`, async (ctx) => {
    ctx.body = '删除';
  });
}