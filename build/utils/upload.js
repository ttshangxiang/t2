"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");
const mongodb_1 = require("mongodb");
function getTmpFile(filename) {
    const index = filename.lastIndexOf('.');
    let suffix = '';
    const name = new mongodb_1.ObjectId().toHexString();
    let newFile = name;
    if (index > -1) {
        suffix = filename.substr(index + 1).toLowerCase();
        newFile += '.' + suffix;
    }
    return {
        suffix: suffix,
        name: name,
        filename: newFile
    };
}
exports.default = (ctx) => {
    return new Promise((resolve, reject) => {
        const req = ctx.req;
        const busboy = new Busboy({ headers: req.headers });
        const result = {};
        const files = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const tmpfile = getTmpFile(filename);
            const saveTo = path.join(os.tmpdir(), tmpfile.filename);
            file.pipe(fs.createWriteStream(saveTo));
            file.on('end', () => {
                files.push(Object.assign({ fieldname, path: saveTo }, tmpfile));
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