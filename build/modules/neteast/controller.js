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
const Neteast = require('./model').default;
exports.default = {
    getIndex: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const list = yield Neteast.getUserlist(93828616);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getUserlist: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let uid = ctx.params.itemId;
            if (!uid) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            let { offset = 0, limit = 60 } = ctx.query;
            const list = yield Neteast.getUserlist(uid, offset, limit);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getPlaylist: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let playlist_id = ctx.params.itemId;
            if (!playlist_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getPlaylist(playlist_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getPlaylist2: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let playlist_id = ctx.params.itemId;
            if (!playlist_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getPlaylist2(playlist_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getSong: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getSong(song_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getAlbum: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let album_id = ctx.params.itemId;
            console.log(album_id);
            if (!album_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getAlbum(album_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getUrl: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getUrl(song_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getLyric: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            const list = yield Neteast.getLyric(song_id);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    getComment: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let song_id = ctx.params.itemId;
            if (!song_id) {
                ctx.body = { status: false, message: '缺少ID' };
                return;
            }
            let { type = 'R_SO_4_', offset = 0, limit = 20 } = ctx.query;
            const list = yield Neteast.getComment(song_id, type, offset, limit);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    }),
    cloudsearch: (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let { keywords, type = 1, offset = 0, limit = 20 } = ctx.query;
            const list = yield Neteast.cloudsearch(keywords, type, offset, limit);
            ctx.body = list;
        }
        catch (err) {
            console.log(err);
            ctx.body = { status: false, message: '查询失败' };
        }
    })
};
//# sourceMappingURL=controller.js.map