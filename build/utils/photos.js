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
const sharp = require("sharp");
/**
 * 获取图片信息
 * @param path 图片路径
 */
function getImageInfo(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            sharp(path)
                .metadata((err, metadata) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(metadata);
                }
            });
        });
    });
}
exports.getImageInfo = getImageInfo;
function appendPath(path, appends) {
    const index = path.lastIndexOf('.');
    let path_ = '';
    if (index > -1) {
        path_ = path.substr(0, index - 1) + '-' + appends + path.substr(index);
    }
    else {
        path_ = path.substr(0, index - 1) + '-' + appends;
    }
    return path_;
}
/**
 * 获取缩略图
 * @param path
 */
function getThumb(path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const newPath = appendPath(path, 'thumb');
            sharp(path)
                .resize(240)
                .toFile(newPath, (err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(newPath);
                }
            });
        });
    });
}
exports.getThumb = getThumb;
/**
 * 获取720P
 * @param path
 */
function get720p(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadata = yield getImageInfo(path);
        return new Promise((resolve, reject) => {
            let width = 1280;
            if (metadata.width <= 1280) {
                width = metadata.width;
            }
            const newPath = appendPath(path, '720');
            sharp(path)
                .resize(width)
                .toFile(newPath, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(newPath);
                }
            });
        });
    });
}
exports.get720p = get720p;
//# sourceMappingURL=photos.js.map