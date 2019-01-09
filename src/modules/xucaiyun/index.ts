import * as Router from 'koa-router';
import base from '../base';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import { today } from '../../utils/dateUtil';
import crud from '../../utils/crud';
import upload, { i_result } from '../../utils/upload';
import { move } from '../../utils/files';
import { getThumb, get720p } from '../../utils/photos';

const router = new Router({
  prefix: '/xucaiyun'
});

// 相册
crud(router, 'albums');

// 相片
router.post('/photos', async (ctx) => {
  const r: i_result = await upload(ctx);
  const dest = path.resolve(__dirname, '../../../uploads/photos', today());
  r.files.forEach(async (o) => {
    const newFile: any = await move(o.path, path.resolve(dest, o.filename));
    const _720p = await get720p(newFile);
    const thumb = await getThumb(newFile);
  });
  ctx.body = { code: 0, data: r };
});
crud(router, 'photos');


base.use(router.routes());
base.use(router.allowedMethods());

