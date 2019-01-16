"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 文件操作
 */
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
/**
 * 移动文件
 */
function move(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const base = path.resolve(to, '..');
            !fs.existsSync(base) && mkdirp.sync(base);
            try {
                fs.renameSync(from, to);
                resolve(to);
            }
            catch (error) {
                const rs = fs.createReadStream(from);
                const ws = fs.createWriteStream(to);
                rs.pipe(ws);
                rs.on('end', () => {
                    fs.unlinkSync(from);
                    resolve(to);
                });
                rs.on('error', err => {
                    reject(err);
                });
            }
        });
    });
}
exports.move = move;
/**
 * 删除文件
 */
function unlink(from) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            fs.unlinkSync(from);
            resolve(from);
        });
    });
}
exports.unlink = unlink;
//# sourceMappingURL=files.js.map