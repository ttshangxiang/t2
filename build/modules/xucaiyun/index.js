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
const base_1 = require("../base");
const path = require("path");
const dateUtil_1 = require("../../utils/dateUtil");
const crud_1 = require("../../utils/crud");
const upload_1 = require("../../utils/upload");
const files_1 = require("../../utils/files");
const photos_1 = require("../../utils/photos");
const router = new Router({
    prefix: '/xucaiyun'
});
// 相册
crud_1.default(router, 'albums');
// 相片
router.post('/photos', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const r = yield upload_1.default(ctx);
    const dest = path.resolve(__dirname, '../../../uploads/photos', dateUtil_1.today());
    r.files.forEach((o) => __awaiter(this, void 0, void 0, function* () {
        const newFile = yield files_1.move(o.path, path.resolve(dest, o.filename));
        const _720p = yield photos_1.get720p(newFile);
        const thumb = yield photos_1.getThumb(newFile);
    }));
    ctx.body = { code: 0, data: r };
}));
crud_1.default(router, 'photos');
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=index.js.map