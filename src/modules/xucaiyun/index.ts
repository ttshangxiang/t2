import * as Router from 'koa-router';
import base from '../base';
import crud from '../../utils/crud';
import upload, { i_result } from '../../utils/upload';

const router = new Router({
  prefix: '/xucaiyun'
});

// 相册
crud(router, 'albums');

// 相片
router.post('/photos', async (ctx) => {
  const r: i_result = await upload(ctx);
  r.files.forEach(o => {
    o.fieldname
  });
  ctx.body = { code: 0, data: r };
});
crud(router, 'photos');


base.use(router.routes());
base.use(router.allowedMethods());

