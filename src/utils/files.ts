/**
 * 文件操作
 */
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

/**
 * 移动文件
 */
export async function move (from: string, to: string) {
  return new Promise ((resolve, reject) => {
    const base = path.resolve(to, '..');
    !fs.existsSync(base) && mkdirp.sync(base);
    try {
      fs.renameSync(from, to);
      resolve(to);
    } catch (error) {
      const rs = fs.createReadStream(from);
      const ws = fs.createWriteStream(to);
      rs.pipe(ws);
      rs.on('end', () => {
        fs.unlinkSync(from);
        resolve(to);
      });
      rs.on('error', err => {
        reject(err);
      })
    }
  });
}

/**
 * 删除文件
 */
export async function unlink (from: string) {
  return new Promise ((resolve, reject) => {
    fs.unlinkSync(from);
    resolve(from);
  });
}