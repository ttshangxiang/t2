import * as Router from 'koa-router';
import base from '../base';
import crud from '../../utils/crud';

const router = new Router({
  prefix: '/xucaiyun'
});

// 相册
crud(router, 'albums');

// 相片
crud(router, 'photos');


base.use(router.routes());
base.use(router.allowedMethods());

