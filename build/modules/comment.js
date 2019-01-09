"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const db_1 = require("../utils/db");
const mongodb_1 = require("mongodb");
const router = new Router({
    prefix: '/comment'
});
// 获取某个项目的评论
router.get('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const offset = parseInt(ctx.query.offset) || 0;
    const count = parseInt(ctx.query.count) || 10;
    let fid = ctx.params.id;
    try {
        fid = new mongodb_1.ObjectId(ctx.params.id);
    }
    catch (error) {
    }
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return null;
        }
        // 评论
        const data = yield db
            .collection('comments')
            .aggregate([
            { $match: { fid: fid, pid: { $exists: false }, status: { $gte: 0 } } },
            { $sort: { ctime: -1 } },
            { $limit: count },
            { $skip: offset },
            { $lookup: { from: 'users', localField: 'uid', foreignField: '_id', as: 'user' } }
        ])
            .toArray();
        // 总数
        const total = yield db
            .collection('comments')
            .find({ fid: fid, pid: { $exists: false }, status: { $gte: 0 } })
            .count();
        // 评论
        let ids = [];
        data.forEach(item => {
            ids.push(item._id);
        });
        const sub = yield db
            .collection('comments')
            .aggregate([
            { $match: { fid: fid, pid: { $in: ids }, status: { $gte: 0 } } },
            { $sort: { ctime: -1 } },
            { $lookup: { from: 'users', localField: 'uid', foreignField: '_id', as: 'user' } },
            { $lookup: { from: 'users', localField: 'touid', foreignField: '_id', as: 'touser' } }
        ])
            .toArray();
        return { data, sub, total };
    });
    const r = yield db_1.default(query);
    if (r) {
        ctx.body = { code: 0, data: r };
    }
    else {
        ctx.body = { code: -1, msg: '获取数据失败' };
    }
}));
// 添加一条评论
router.post('/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const info = ctx.session.info;
    if (!info || !info._id) {
        ctx.body = { code: -3, msg: '未登录' };
        return;
    }
    const body = ctx.body;
    const now = new Date();
    let fid = ctx.params.id;
    try {
        fid = new mongodb_1.ObjectId(ctx.params.id);
    }
    catch (error) {
    }
    let comment = {
        fid: fid,
        status: 0,
        uid: new mongodb_1.ObjectId(ctx.session.info._id),
        content: body.content,
        ctime: now,
        utime: now
    };
    body.pid && (comment.pid = new mongodb_1.ObjectId(body.pid));
    body.touid && (comment.touid = new mongodb_1.ObjectId(body.touid));
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && db
            .collection('comments')
            .insert(comment);
    }));
    if (r && r.result && r.result.ok) {
        const info = r.ops[0];
        ctx.body = { code: 0, data: info };
    }
    else {
        ctx.body = { code: 1, msg: '插入失败' };
    }
}));
// 删除评论
router.delete('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    let ids = ctx.query.id;
    if (ids === undefined) {
        ctx.body = { code: 1, msg: '未传入任何id' };
        return;
    }
    if (Object.prototype.toString.call(ids) !== '[object Array]') {
        ids = [ids];
    }
    ids = ids.map(item => new mongodb_1.ObjectId(item));
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && db
            .collection('comments')
            // .deleteMany({_id: {$in: ids}})
            .update({ _id: { $in: ids } }, { $set: { status: -1 } });
    }));
    if (r && r.result && r.result.ok) {
        ctx.body = { code: 0, msg: '删除成功' };
    }
    else {
        ctx.body = { code: 1, msg: '删除失败' };
    }
}));
exports.default = router;
//# sourceMappingURL=comment.js.map