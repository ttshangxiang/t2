import * as fs from 'fs';
import * as sharp from 'sharp';

/**
 * 获取图片信息
 * @param pathname 图片路径
 */
export async function getImageInfo (pathname: string) {
  return await sharp(pathname).metadata();
}

function appendPath (pathname: string, appends: string) {
  const index = pathname.lastIndexOf('.');
  let path_ = '';
  if (index > -1) {
    path_ = pathname.substr(0, index) + '-' + appends + pathname.substr(index);
  } else {
    path_ = pathname.substr(0, index) + '-' + appends;
  }
  return path_;
}

/**
 * 压缩图片
 * @param pathname 源文件路径
 * @param width 压缩宽度
 * @returns 压缩后的文件路径
 */
async function compress (pathname: string, width: number) {
  const metadata = await getImageInfo(pathname);
  // 小于压缩大小，返回原路径
  if (metadata.width <= width) {
    return pathname;
  }
  const newPath = appendPath(pathname, width + '');
  await sharp(pathname).resize(width).toFile(newPath);
  return newPath;
}

/**
 * 获取缩略图
 * @param pathname 
 */
export async function getThumb (pathname: string) {
  return await compress(pathname, 360);
}

/**
 * 获取正常大小
 * @param pathname 
 */
export async function getNormal (pathname: string) {
  return await compress(pathname, 1280);
}