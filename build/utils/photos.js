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
 * @param pathname 图片路径
 */
function getImageInfo(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield sharp(pathname).metadata();
    });
}
exports.getImageInfo = getImageInfo;
function appendPath(pathname, appends) {
    const index = pathname.lastIndexOf('.');
    let path_ = '';
    if (index > -1) {
        path_ = pathname.substr(0, index) + '-' + appends + pathname.substr(index);
    }
    else {
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
function compress(pathname, width) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadata = yield getImageInfo(pathname);
        // 小于压缩大小，返回原路径
        if (metadata.width <= width) {
            return pathname;
        }
        const newPath = appendPath(pathname, width + '');
        yield sharp(pathname).resize(width).toFile(newPath);
        return newPath;
    });
}
/**
 * 获取缩略图
 * @param pathname
 */
function getThumb(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compress(pathname, 360);
    });
}
exports.getThumb = getThumb;
/**
 * 获取正常大小
 * @param pathname
 */
function getNormal(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield compress(pathname, 1280);
    });
}
exports.getNormal = getNormal;
//# sourceMappingURL=photos.js.map