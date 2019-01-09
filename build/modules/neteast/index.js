"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const controller_1 = require("./controller");
const base_1 = require("./base");
const router = new Router({
    prefix: '/neteast'
});
base_1.controller(router, controller_1.default);
router.get('/cloudsearch', controller_1.default.cloudsearch);
exports.default = router;
//# sourceMappingURL=index.js.map