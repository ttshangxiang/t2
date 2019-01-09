import * as Router from 'koa-router';
import base from '../base';
import crud from '../../utils/crud';

const router = new Router({
  prefix: '/xucaiyun'
});

// 默认接口
crud(router, 'albums', 'cru');


base.use(router.routes());
base.use(router.allowedMethods());

