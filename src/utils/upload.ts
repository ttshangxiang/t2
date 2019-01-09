/**
 * 上传文件
 */
import { ParameterizedContext } from 'koa';
import * as Busboy from 'busboy';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

function tmpName (filename: string) {
  const nameList = filename.split('.');
  const suffix = nameList[nameList.length - 1];
  return Math.random().toString(16).substr(2) + '.' + suffix;
}

export interface i_file {
  fieldname: string,
  path: string
}

export interface i_result {
  files?: i_file[],
  [index: string]: any,
  [index: number]: any
}

export default (ctx: ParameterizedContext) => {
  return new Promise((resolve, reject) => {
    const req = ctx.req;
    const busboy = new Busboy({headers: req.headers});
    const result: i_result = {};
    const files: i_file[] = [];
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      var saveTo = path.join(os.tmpdir(), tmpName(filename));
      file.pipe(fs.createWriteStream(saveTo));
      file.on('end', () => {
        files.push({fieldname, path: saveTo});
      })
    });
    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
      result[fieldname] = val;
    });
    busboy.on('finish', () => {
      console.log('upload success');
      result.files = files;
      resolve(result);
    });
    busboy.on('error', () => {
      console.log('upload fail');
      reject();
    });
    req.pipe(busboy);
  });
}