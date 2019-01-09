"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
const dateUtil = require("./dateUtil");
function default_1(router, model, method = 'crud') {
    // 查询
    if (method.includes('r')) {
        // 列表
        router.get(`/${model}`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const { query = {} } = ctx;
            const { offset = 0, count = 200 } = query, filters = __rest(query, ["offset", "count"]);
            Object.keys(filters).forEach(k => {
                // 模糊查询
                if (filters[k].substr(0, 5) === 'like.') {
                    filters[k] = new RegExp(filters[k].substr(5));
                }
            });
            // 状态0，正常
            filters.status = 0;
            const total = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .find(filters)
                    .count();
            }));
            const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .find(filters)
                    .sort({ utime: -1 })
                    .skip(+offset)
                    .limit(+count)
                    .toArray();
            }));
            ctx.body = { code: 0, data: { data: r, total } };
        }));
        // 详情
        router.get(`/${model}/:id`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const { params = {} } = ctx;
            const { id } = params;
            const r = (yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .findOne({ _id: new mongodb_1.ObjectId(id), status: 0 });
            }))) || {};
            ctx.body = { code: 0, data: r };
        }));
    }
    // 新增
    method.includes('c') &&
        router.post(`/${model}`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            body.ctime = body.utime = dateUtil.now();
            // 状态0，正常
            body.status = 0;
            const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .insertOne(body);
            }));
            ctx.body = { code: 0, data: r };
        }));
    // 修改
    method.includes('u') &&
        router.put(`/${model}/:id`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            const body = ctx.request.body;
            const id = ctx.params.id;
            body.utime = dateUtil.now();
            const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: body });
            }));
            ctx.body = { code: 0, data: r };
        }));
    // 删除：软
    method.includes('d') &&
        router.delete(`/${model}`, (ctx) => __awaiter(this, void 0, void 0, function* () {
            let id = ctx.query.id;
            typeof id === 'string' && (id = [id]);
            const ids = id.map(o => new mongodb_1.ObjectId(o));
            // 删除状态 -1
            const body = { status: -1 };
            body.utime = dateUtil.now();
            const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
                return yield db
                    .collection(model)
                    .updateMany({ _id: { $in: ids } }, { $set: body });
            }));
            ctx.body = { code: 0, data: r };
        }));
}
exports.default = default_1;
//# sourceMappingURL=crud.js.map