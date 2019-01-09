import * as fs from 'fs';
import * as sharp from 'sharp';

/**
 * 获取图片信息
 * @param path 图片路径
 */
export async function getImageInfo (path: string) {
  return new Promise((resolve, reject) => {
    sharp(path)
    .metadata((err, metadata) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
}

function appendPath (path: string, appends: string) {
  const index = path.lastIndexOf('.');
  let path_ = '';
  if (index > -1) {
    path_ = path.substr(0, index - 1) + '-' + appends + path.substr(index);
  } else {
    path_ = path.substr(0, index - 1) + '-' + appends;
  }
  return path_;
}

/**
 * 获取缩略图
 * @param path 
 */
export async function getThumb (path: string) {
  return new Promise((resolve, reject) => {
    const newPath = appendPath(path, 'thumb');
    sharp(path)
      .resize(240)
      .toFile(newPath, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(newPath);
        }
      });
  });
}

/**
 * 获取720P
 * @param path 
 */
export async function get720p (path: string) {
  const metadata = <sharp.Metadata> await getImageInfo(path);
  return new Promise((resolve, reject) => {
    let width = 1280
    if (metadata.width <= 1280) {
      width = metadata.width;
    }
    const newPath = appendPath(path, '720');
    sharp(path)
      .resize(width)
      .toFile(newPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(newPath);
        }
      });
  });
}