import * as Koa from 'koa';
import base from './modules/base';
import './modules';
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();

// 错误返回
app.use(async(ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.body = { code: 404, message: 'Not Found' };
    } else {
      let body = ctx.body;
      // 让“Converting circular structure to JSON”暴露出来
      if (typeof ctx.body === 'object') {
        body = JSON.stringify(ctx.body);
      }
      ctx.body = body;
    }
  } catch (err) {
    ctx.body = { code: 500, message: err.message };
    console.log(err);
  }
});

// 错误捕获
app.on('error', err => {
  console.log(err);
});

// 未catch的Promise
process.on('unhandledRejection', err => {
  console.log(err);
});

app.use(bodyParser());
app.use(base.routes());
app.use(base.allowedMethods());

app.listen(3000);