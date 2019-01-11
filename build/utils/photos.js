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
        path_ = pathname.substr(0, index - 1) + '-' + appends + pathname.substr(index);
    }
    else {
        path_ = pathname.substr(0, index - 1) + '-' + appends;
    }
    return path_;
}
/**
 * 获取缩略图
 * @param pathname
 */
function getThumb(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPath = appendPath(pathname, 'thumb');
        yield sharp(pathname).resize(240).toFile(newPath);
        return newPath;
    });
}
exports.getThumb = getThumb;
/**
 * 获取720P
 * @param pathname
 */
function get720p(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
        const metadata = yield getImageInfo(pathname);
        let width = 1280;
        if (metadata.width <= 1280) {
            width = metadata.width;
        }
        const newPath = appendPath(pathname, '720');
        yield sharp(pathname).resize(width).toFile(newPath);
        return newPath;
    });
}
exports.get720p = get720p;
//# sourceMappingURL=photos.js.map