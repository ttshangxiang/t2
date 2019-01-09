
import * as Router from 'koa-router';
import neteastCtrl from './controller';
import {controller} from './base';
const router = new Router({
  prefix: '/neteast'
});

controller(router, neteastCtrl);
router.get('/cloudsearch', neteastCtrl.cloudsearch);

export default router;