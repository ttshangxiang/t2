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
    prefix: '/poe'
});
// 获取点
router.get('/point', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_points')
            .find()
            .sort({ utime: -1 })
            .toArray());
    }));
    if (r) {
        ctx.body = { code: 0, data: r };
    }
    else {
        ctx.body = { code: 1, msg: '获取' };
    }
}));
// 创建点
router.post('/point', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const body = ctx.body;
    // 插入
    body.ctime = new Date();
    body.utime = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_points')
            .insert(body));
    }));
    if (r && r.result && r.result.ok) {
        const info = r.ops[0];
        ctx.body = { code: 0, data: info };
    }
    else {
        ctx.body = { code: 1, msg: '插入失败' };
    }
}));
// 修改点
router.put('/point/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const body = ctx.body;
    const id = ctx.params.id;
    // 插入
    body.utime = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_points')
            .update({ _id: new mongodb_1.ObjectId(id) }, { $set: body }));
    }));
    if (r && r.result && r.result.ok) {
        ctx.body = { code: 0, data: '修改成功' };
    }
    else {
        ctx.body = { code: 1, msg: '插入失败' };
    }
}));
// 删除点
router.delete('/point/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const id = ctx.params.id;
    if (id === undefined) {
        ctx.body = { code: 1, msg: '未传入任何id' };
        return;
    }
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && db
            .collection('poe_points')
            .deleteMany({ _id: { $in: [new mongodb_1.ObjectId(id)] } });
    }));
    if (r && r.result && r.result.ok) {
        ctx.body = { code: 0, msg: '删除成功' };
    }
    else {
        ctx.body = { code: 1, msg: '删除失败' };
    }
}));
// 获取线
router.get('/line', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_lines')
            .find()
            .sort({ utime: -1 })
            .toArray());
    }));
    if (r) {
        ctx.body = { code: 0, data: r };
    }
    else {
        ctx.body = { code: 1, msg: '获取失败' };
    }
}));
// 创建线
router.post('/line', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const body = ctx.body;
    // 插入
    body.ctime = new Date();
    body.utime = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_lines')
            .insert(body));
    }));
    if (r && r.result && r.result.ok) {
        const info = r.ops[0];
        ctx.body = { code: 0, data: info };
    }
    else {
        ctx.body = { code: 1, msg: '修改失败' };
    }
}));
// 修改线
router.put('/line/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const body = ctx.body;
    const id = ctx.params.id;
    // 插入
    body.utime = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('poe_lines')
            .update({ _id: new mongodb_1.ObjectId(id) }, { $set: body }));
    }));
    if (r && r.result && r.result.ok) {
        ctx.body = { code: 0, data: '修改成功' };
    }
    else {
        ctx.body = { code: 1, msg: '修改失败' };
    }
}));
// 删除线
router.delete('/line/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const id = ctx.params.id;
    if (id === undefined) {
        ctx.body = { code: 1, msg: '未传入任何id' };
        return;
    }
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && db
            .collection('poe_lines')
            .deleteMany({ _id: { $in: [new mongodb_1.ObjectId(id)] } });
    }));
    if (r && r.result && r.result.ok) {
        ctx.body = { code: 0, msg: '删除成功' };
    }
    else {
        ctx.body = { code: 1, msg: '删除失败' };
    }
}));
exports.default = router;
//# sourceMappingURL=poe.js.map