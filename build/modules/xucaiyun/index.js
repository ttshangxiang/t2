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
const Router = require("koa-router");
const mongodb_1 = require("mongodb");
const base_1 = require("../base");
const path = require("path");
const dateUtil_1 = require("../../utils/dateUtil");
const crud_1 = require("../../utils/crud");
const upload_1 = require("../../utils/upload");
const files_1 = require("../../utils/files");
const photos_1 = require("../../utils/photos");
const db_1 = require("../../utils/db");
const dateUtil = require("../../utils/dateUtil");
const router = new Router({
    prefix: '/xucaiyun'
});
// 新增资源
router.post('/res', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const groupId = ctx.query.groupId;
    const _a = yield upload_1.default(ctx), { files } = _a, body = __rest(_a, ["files"]);
    if (groupId) {
        body.groups = [groupId];
    }
    const t2 = path.resolve(__dirname, '../../../');
    const dest = path.resolve(t2, './uploads/res', dateUtil_1.today());
    for (const o of files) {
        // 只支持一个文件
        if (o === files[0]) {
            body.path = yield files_1.move(o.path, path.resolve(dest, o.filename));
            if (body.type && body.type.slice(0, 5) === 'image') {
                const metadata = yield photos_1.getImageInfo(body.path);
                body.width = metadata.width;
                body.height = metadata.height;
                // 压缩
                body.normal = yield photos_1.getNormal(body.path);
                body.thumb = yield photos_1.getThumb(body.path);
                body.normal = path.join('/', path.relative(t2, body.normal));
                body.thumb = path.join('/', path.relative(t2, body.thumb));
            }
            body.path = path.join('/', path.relative(t2, body.path));
        }
        else {
            yield files_1.unlink(o.path);
        }
    }
    body.ctime = body.utime = dateUtil.now();
    // 状态0，正常
    body.status = 0;
    const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
        return yield db
            .collection('res')
            .insertOne(body);
    }));
    ctx.body = { code: 0, data: r, insert: body, _id: r.insertedId };
}));
// 资源修改分组
router.put('/res/group/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const id = ctx.params.id;
    const { adds = [], subs = [] } = ctx.request.body;
    const result = [];
    // 新增
    if (adds.length > 0) {
        const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
            return yield db
                .collection('res')
                .updateMany({ _id: { $in: adds.map((o) => new mongodb_1.ObjectId(o)) } }, { $addToSet: { groups: id } });
        }));
        result.push(r);
    }
    // 取消
    if (subs.length > 0) {
        const r2 = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
            return yield db
                .collection('res')
                .updateMany({ _id: { $in: subs.map((o) => new mongodb_1.ObjectId(o)) } }, { $pull: { groups: id } });
        }));
        result.push(r2);
    }
    ctx.body = { code: 0, data: result };
}));
crud_1.default(router, 'res');
// 资源分组
router.put('/resgroup/refresh/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const id = ctx.params.id;
    const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
        return yield db
            .collection('res')
            .find({ groups: { $elemMatch: { $eq: id } }, type: new RegExp('image') })
            .sort({ ctime: -1 })
            .limit(1)
            .toArray();
    }));
    if (r && r[0] && r[0].thumb) {
        const r2 = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
            return yield db
                .collection('resgroup')
                .updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: {
                    thumb: r[0].thumb
                } });
        }));
        ctx.body = { code: 0, data: r2 };
    }
    else {
        ctx.body = { code: 0, message: 'no thumb' };
    }
}));
crud_1.default(router, 'resgroup');
// 相册
router.get('/albums', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
        return yield db
            .collection('resgroup')
            .find({ status: 1, type: 'albums' })
            .sort({ ctime: -1 })
            .toArray();
    }));
    ctx.body = { code: 0, data: r };
}));
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=index.js.map