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
const Router = require("koa-router");
const db_1 = require("../utils/db");
const moment = require("moment");
const request = require("request");
const mongodb_1 = require("mongodb");
const neteast_1 = require("./neteast");
const user_1 = require("./user");
const comment_1 = require("./comment");
const router = new Router({
    prefix: '/api'
});
// 网易云接口
router.use(neteast_1.default.routes());
router.use(neteast_1.default.allowedMethods());
// 用户接口
router.use(user_1.default.routes());
router.use(user_1.default.allowedMethods());
// 评论接口
router.use(comment_1.default.routes());
router.use(comment_1.default.allowedMethods());
// kumo
const kumo_1 = require("./kumo");
router.use(kumo_1.default.routes());
router.use(kumo_1.default.allowedMethods());
// poe
const poe_1 = require("./poe");
router.use(poe_1.default.routes());
router.use(poe_1.default.allowedMethods());
router.get('/article/:id', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return { code: 1 };
        }
        var r = yield db.collection('article').findOne({ _id: new mongodb_1.ObjectId(ctx.params.id) });
        return {
            code: 0,
            data: r
        };
    });
    const data = yield db_1.default(query);
    if (data.code !== 0) {
        ctx.status = 500;
    }
    ctx.body = data;
}));
router.get('/article', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const type = ctx.query.type;
    let queryObj = {};
    if (type) {
        queryObj = { type: parseInt(type) };
    }
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return { code: 1 };
        }
        let r = yield db.collection('article').find(queryObj).toArray();
        return {
            code: 0,
            data: r
        };
    });
    const data = yield db_1.default(query);
    if (data.code !== 0) {
        ctx.status = 500;
    }
    ctx.body = data;
}));
router.get('/visited', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const { results, page = 1 } = ctx.query;
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return '错误';
        }
        let count = yield db.collection('visited').count();
        let r = yield db.collection('visited').find()
            .sort({ create_date: -1 })
            .skip((page - 1) * results)
            .limit(parseInt(results))
            .toArray();
        return {
            data: r,
            totalCount: count
        };
    });
    ctx.body = yield db_1.default(query);
}));
router.get('/ips', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const { results, page = 1 } = ctx.query;
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return '错误';
        }
        let count = yield db.collection('ips').count();
        let r = yield db.collection('ips').find()
            .sort({ create_date: -1 })
            .skip((page - 1) * results)
            .limit(parseInt(results))
            .toArray();
        return {
            data: r,
            totalCount: count
        };
    });
    ctx.body = yield db_1.default(query);
}));
router.get('/xiaoqingjiao', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const offset = parseInt(ctx.query.offset) || 0;
    const count = parseInt(ctx.query.count) || 10;
    const query = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return '错误';
        }
        // 内容
        const words = yield db.collection('xiaoqingjiao')
            .find({ parent_id: { $in: [0, -1] } })
            .sort({ id: -1 })
            .limit(count)
            .skip(offset)
            .toArray();
        // 总数
        const total = yield db.collection('xiaoqingjiao')
            .find({ parent_id: { $in: [0, -1] } })
            .count();
        // 评论
        let ids = [];
        words.forEach(item => {
            ids.push(item.id);
        });
        const comments = yield db.collection('xiaoqingjiao')
            .find({ parent_id: { $in: ids } })
            .toArray();
        return { words, total, comments };
    });
    ctx.body = yield db_1.default(query);
}));
router.get('/visit', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const ip = ctx.headers['x-real-ip'];
    const { pathname, renderer } = ctx.query;
    const uid = ctx.cookies.get('uid');
    let ipAddress = {};
    if (ip) {
        const queryIp = (err, db) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                return '';
            }
            let r = yield db.collection('ips').findOne({ ip });
            return r;
        });
        const queryIpR = yield db_1.default(queryIp);
        if (queryIpR && queryIpR._id) {
            ipAddress = queryIpR;
        }
        else {
            ipAddress = yield requestIp(ip);
            yield db_1.default((err, db) => __awaiter(this, void 0, void 0, function* () {
                !err && (yield db.collection('ips').insert(Object.assign({}, ipAddress)));
            }));
        }
    }
    const insert = (err, db) => __awaiter(this, void 0, void 0, function* () {
        if (err) {
            return '错误';
        }
        let r = yield db.collection('visited').insert(Object.assign({ ip, pathname, renderer, uid, ipAddress }, now()));
        return r.result;
    });
    ctx.body = yield db_1.default(insert);
}));
function now() {
    const create_date = moment().format('YYYY-MM-DD HH:mm:ss');
    const update_date = create_date;
    return { create_date, update_date };
}
function requestIp(ip) {
    const options = {
        method: 'get',
        url: `https://dm-81.data.aliyun.com/rest/160601/ip/getIpInfo.json?ip=${ip}`,
        rejectUnauthorized: false,
        headers: {
            'Authorization': 'APPCODE e1b1da03861f4b4abe6477503d9fdc54'
        }
    };
    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (err) {
                resolve({});
                console.log(err);
                return;
            }
            try {
                const json = JSON.parse(body);
                resolve(json.data);
            }
            catch (error) {
                console.log(error);
                resolve({});
            }
        });
    });
}
exports.default = router;
//# sourceMappingURL=router.js.map