import * as Router from 'koa-router';
import DB from './db';
import { ObjectId, InsertOneWriteOpResult } from 'mongodb';
import * as dateUtil from './dateUtil';

export default function (router: Router, model: string, method: string = 'crud') {

  // 查询
  if (method.includes('r')) {
    // 列表
    router.get(`/${model}`, async (ctx) => {
      const { query = {} } = ctx;
      const { offset = 0, count = 200, ...filters } = query;
      Object.keys(filters).forEach(k => {
        const item: string = filters[k];
        // 模糊查询
        if (item.substr(0,5) === 'like.') {
          filters[k] = new RegExp(item.substr(5));
        }
        // 被包含
        if (item.substr(0,9) === 'includes.') {
          filters[k] = {$elemMatch: {$eq: item.substr(9)}}
        }
        // _id
        if (k === '_id') {
          filters[k] = new ObjectId(item);
        }
      });
      // 状态非-1，正常
      filters.status = {$ne: -1};
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
          .sort({ctime: -1})
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
          .findOne({ _id: new ObjectId(id), status: 0 });
      }) || {};
      ctx.body = { code: 0, data: r };
    });
  }

  // 新增
  method.includes('c') &&
  router.post(`/${model}`, async (ctx) => {
    const body = ctx.request.body;
    body.ctime = body.utime = dateUtil.now();
    // 状态0，正常
    body.status = body.status || 0;
    const r = <InsertOneWriteOpResult>await DB(async (db) => {
      return await db
        .collection(model)
        .insertOne(body);
    });
    ctx.body = { code: 0, data: r, _id: r.insertedId };
  });

  // 修改
  method.includes('u') &&
  router.put(`/${model}/:id`, async (ctx) => {
    const body = ctx.request.body;
    const id = ctx.params.id;
    body.utime = dateUtil.now();
    const r = await DB(async (db) => {
      return await db
        .collection(model)
        .updateOne({_id: new ObjectId(id)}, {$set: body});
    });
    ctx.body = { code: 0, data: r };
  });

  // 删除：软
  method.includes('d') &&
  router.delete(`/${model}`, async (ctx) => {
    let id: string | string[] = ctx.query.id;
    typeof id === 'string' && (id = [id]);
    const ids = id.map(o => new ObjectId(o));
    // 删除状态 -1
    const body: any = { status: -1 };
    body.utime = dateUtil.now();
    const r = await DB(async (db) => {
      return await db
        .collection(model)
        .updateMany({_id: {$in: ids}}, {$set: body});
    });
    ctx.body = { code: 0, data: r };
  });
}