"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const base_1 = require("./modules/base");
require("./modules");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-static");
const app = new Koa();
app.use(serve('.'));
// 错误返回
app.use((ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield next();
        if (ctx.status === 404) {
            ctx.status = 404;
            ctx.body = { code: 404, message: 'Not Found' };
        }
        else {
            let body = ctx.body;
            // 让“Converting circular structure to JSON”暴露出来
            if (typeof ctx.body === 'object') {
                body = JSON.stringify(ctx.body);
            }
            ctx.body = body;
        }
    }
    catch (err) {
        ctx.status = 500;
        ctx.body = { code: 500, message: err.message };
        console.log(err);
    }
}));
// 错误捕获
app.on('error', err => {
    console.log(err);
});
// 未catch的Promise
process.on('unhandledRejection', err => {
    console.log(err);
});
app.use(bodyParser());
app.use(base_1.default.routes());
app.use(base_1.default.allowedMethods());
app.listen(3000);
//# sourceMappingURL=app.js.map