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
const crud_1 = require("../../utils/crud");
const upload_1 = require("../../utils/upload");
const router = new Router({
    prefix: '/xucaiyun'
});
// 相册
crud_1.default(router, 'albums');
// 相片
router.post('/photos', (ctx) => __awaiter(this, void 0, void 0, function* () {
    const r = yield upload_1.default(ctx);
    r.files.forEach(o => {
        o.fieldname;
    });
    ctx.body = { code: 0, data: r };
}));
crud_1.default(router, 'photos');
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=index.js.map