/**
 * 上传文件
 */
import { ParameterizedContext } from 'koa';
import * as Busboy from 'busboy';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';

function getTmpFile (filename: string) {
  const index = filename.lastIndexOf('.');
  let suffix = '';
  const name = new ObjectId().toHexString();
  let newFile = name;
  if (index > -1) {
    suffix = filename.substr(index + 1).toLowerCase();
    newFile += '.' + suffix;
  }
  return {
    suffix: suffix,
    name: name,
    filename: newFile
  }
}

export interface i_file {
  fieldname: string,
  path: string,
  suffix: string,
  name: string,
  filename: string
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
      const tmpfile = getTmpFile(filename);
      const saveTo = path.join(os.tmpdir(), tmpfile.filename);
      file.pipe(fs.createWriteStream(saveTo));
      file.on('end', () => {
        files.push({fieldname, path: saveTo, ...tmpfile});
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