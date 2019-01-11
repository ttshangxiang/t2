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
    path_ = pathname.substr(0, index - 1) + '-' + appends + pathname.substr(index);
  } else {
    path_ = pathname.substr(0, index - 1) + '-' + appends;
  }
  return path_;
}

/**
 * 获取缩略图
 * @param pathname 
 */
export async function getThumb (pathname: string) {
  const newPath = appendPath(pathname, 'thumb');
  await sharp(pathname).resize(240).toFile(newPath);
  return newPath;
}

/**
 * 获取720P
 * @param pathname 
 */
export async function get720p (pathname: string) {
  const metadata = await getImageInfo(pathname);
  let width = 1280
  if (metadata.width <= 1280) {
    width = metadata.width;
  }
  const newPath = appendPath(pathname, '720');
  await sharp(pathname).resize(width).toFile(newPath);
  return newPath;
}