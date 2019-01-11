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
// 相册
crud_1.default(router, 'albums');
// 相片
router.post('/photos', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const _a = yield upload_1.default(ctx), { files } = _a, body = __rest(_a, ["files"]);
    const dest = path.resolve(__dirname, '../../../uploads/photos', dateUtil_1.today());
    for (const o of files) {
        body.origin = yield files_1.move(o.path, path.resolve(dest, o.filename));
        body.normal = yield photos_1.get720p(body.origin);
        body.thumb = yield photos_1.getThumb(body.origin);
    }
    body.ctime = body.utime = dateUtil.now();
    // 状态0，正常
    body.status = 0;
    const r = yield db_1.default((db) => __awaiter(this, void 0, void 0, function* () {
        return yield db
            .collection('photos')
            .insertOne(body);
    }));
    ctx.body = { code: 0, data: r };
}));
crud_1.default(router, 'photos');
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=index.js.map