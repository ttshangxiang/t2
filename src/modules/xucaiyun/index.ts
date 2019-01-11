import * as Router from 'koa-router';
import base from '../base';
import * as path from 'path';
import { today } from '../../utils/dateUtil';
import crud from '../../utils/crud';
import upload, { i_result } from '../../utils/upload';
import { move } from '../../utils/files';
import { getThumb, get720p } from '../../utils/photos';
import DB from '../../utils/db';
import * as dateUtil from '../../utils/dateUtil';

const router = new Router({
  prefix: '/xucaiyun'
});

// 相册
crud(router, 'albums');

// 相片
router.post('/photos', async (ctx) => {
  const {files, ...body} = <i_result> await upload(ctx);
  const dest = path.resolve(__dirname, '../../../uploads/photos', today());
  for (const o of files) {
    body.origin = await move(o.path, path.resolve(dest, o.filename));
    body.normal = await get720p(body.origin);
    body.thumb = await getThumb(body.origin);
  }
  body.ctime = body.utime = dateUtil.now();
  // 状态0，正常
  body.status = 0;
  const r = await DB(async (db) => {
    return await db
      .collection('photos')
      .insertOne(body);
  });
  ctx.body = { code: 0, data: r };
});
crud(router, 'photos');


base.use(router.routes());
base.use(router.allowedMethods());

