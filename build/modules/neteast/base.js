"use strict";
/*
 * controller通用方法
 * 仿laravel
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
let notFound = (ctx, next) => {
    ctx.body = 'notFound';
    ctx.status = 404;
    return;
};
function resource(router, controller) {
    router.get('/', controller.getIndex || notFound) //列表
        .get('/:key/:value', controller['get' + controller.suffix] || notFound) //精确查找单个
        .post('/', controller['add' + controller.suffix] || notFound) //新增
        .put('/', controller['update' + controller.suffix] || notFound) //修改
        .delete('/:key', controller['delete' + controller.suffix] || notFound) //删除
        .get('/query', controller['query' + controller.suffix] || notFound); //模糊查询
}
exports.resource = resource;
function controller(router, controller) {
    router.get('/', controller.getIndex)
        .all('/:method/:itemId', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        let pre = ctx.method.toLowerCase();
        let suf = ctx.params.method.substr(0, 1).toUpperCase() + ctx.params.method.substr(1).toLowerCase();
        yield controller[pre + suf](ctx, next);
    }));
}
exports.controller = controller;
//# sourceMappingURL=base.js.map