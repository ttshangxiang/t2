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
const router = new Router({
    prefix: '/user'
});
// 登录
router.post('/login', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const { u, p } = ctx.body;
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .findOne({ username: u, password: p }));
    }));
    if (r) {
        delete r.password;
        ctx.session.info = r;
        ctx.body = { code: 0, data: r };
    }
    else {
        ctx.body = { code: 1, msg: '密码错误' };
    }
}));
// 注册
router.post('/register', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const { u, p, ph } = ctx.body;
    // 唯一查询
    const exist = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .findOne({ username: u }));
    }));
    if (exist) {
        ctx.body = { code: 1, msg: '用户名已存在' };
        return;
    }
    // 插入
    const now = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .insert({ username: u, password: p, phone: ph, ctime: now, utime: now }));
    }));
    if (r && r.result && r.result.ok) {
        const info = r.ops[0];
        delete info.password;
        ctx.session.info = info;
        ctx.body = { code: 0, data: info };
    }
    else {
        ctx.body = { code: 1, msg: '插入失败' };
    }
}));
// 登录和注册
// 登录
router.post('/loginAndRegister', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const { u, p } = ctx.body;
    const r2 = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .findOne({ username: u, password: p }));
    }));
    if (r2) {
        delete r2.password;
        ctx.session.info = r2;
        ctx.body = { code: 0, data: r2 };
        return;
    }
    // 唯一查询
    const exist = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .findOne({ username: u }));
    }));
    if (exist) {
        ctx.body = { code: 1, msg: '用户名已存在' };
        return;
    }
    // 插入
    const now = new Date();
    const r = yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
        return !err && (yield db
            .collection('users')
            .insert({ username: u, password: p, ctime: now, utime: now }));
    }));
    if (r && r.result && r.result.ok) {
        const info = r.ops[0];
        delete info.password;
        ctx.session.info = info;
        ctx.body = { code: 0, data: info };
    }
    else {
        ctx.body = { code: 1, msg: '插入失败' };
    }
}));
// 登出
router.get('/logout', (ctx, next) => {
    ctx.session = null;
    ctx.body = { code: 0, msg: 'success' };
});
// 用户信息
router.get('/info', (ctx, next) => {
    const info = ctx.session.info;
    if (info) {
        delete info.password;
        ctx.body = { code: 0, data: ctx.session.info };
    }
    else {
        ctx.body = { code: -3, msg: '未登录' };
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map