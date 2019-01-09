"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
function tmpName(filename) {
    const nameList = filename.split('.');
    const suffix = nameList[nameList.length - 1];
    return Math.random().toString(16).substr(2) + '.' + suffix;
}
exports.default = (ctx) => {
    return new Promise((resolve, reject) => {
        const req = ctx.req;
        const busboy = new Busboy({ headers: req.headers });
        const result = {};
        const files = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            var saveTo = path.join(os.tmpdir(), tmpName(filename));
            file.pipe(fs.createWriteStream(saveTo));
            file.on('end', () => {
                files.push({ fieldname, path: saveTo });
            });
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
};
//# sourceMappingURL=upload.js.map