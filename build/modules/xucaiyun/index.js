"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const base_1 = require("../base");
const crud_1 = require("../../utils/crud");
const router = new Router({
    prefix: '/xucaiyun'
});
// 相册
crud_1.default(router, 'albums');
// 相片
crud_1.default(router, 'photos');
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=index.js.map