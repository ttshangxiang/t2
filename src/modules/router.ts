import * as Router from 'koa-router';
import DB from '../utils/db';
import * as moment from 'moment';
import * as request from 'request';
import { ObjectId } from 'mongodb';
import neteast from './neteast';
import user from './user';
import comment from './comment';

const router = new Router({
    prefix: '/api'
});

// 网易云接口
router.use(neteast.routes());
router.use(neteast.allowedMethods());

// 用户接口
router.use(user.routes());
router.use(user.allowedMethods());

// 评论接口
router.use(comment.routes());
router.use(comment.allowedMethods());

// kumo
import kumo from './kumo'
router.use(kumo.routes());
router.use(kumo.allowedMethods());

// poe
import poe from './poe'
router.use(poe.routes());
router.use(poe.allowedMethods());

router.get('/article/:id', async (ctx, next) => {
    const query = async (err, db) => {
        if (err) {
            return {code: 1};
        }
        var r = await db.collection('article').findOne({_id: new ObjectId(ctx.params.id)});
        return {
            code: 0,
            data: r
        }
    }
    const data = await DB(query);
    if (data.code !== 0) {
        ctx.status = 500;
    }
    ctx.body = data;
});

router.get('/article', async (ctx, next) => {
    const type = ctx.query.type;
    let queryObj = {};
    if (type) {
        queryObj = { type: parseInt(type) };
    }
    const query = async (err, db) => {
        if (err) {
            return {code: 1};
        }
        let r = await db.collection('article').find(queryObj).toArray();
        return {
            code: 0,
            data: r
        };
    }
    const data = await DB(query);
    if (data.code !== 0) {
        ctx.status = 500;
    }
    ctx.body = data;
});

router.get('/visited', async (ctx, next) => {
    const { results, page = 1 } = ctx.query;
    const query = async (err, db) => {
        if (err) {
            return '错误';
        }
        let count = await db.collection('visited').count();
        let r = await db.collection('visited').find()
                        .sort({create_date: -1})
                        .skip((page - 1) * results)
                        .limit(parseInt(results))
                        .toArray();
        return {
            data: r,
            totalCount: count
        };
    }
    ctx.body = await DB(query);
});

router.get('/ips', async (ctx, next) => {
    const { results, page = 1 } = ctx.query;
    const query = async (err, db) => {
        if (err) {
            return '错误';
        }
        let count = await db.collection('ips').count();
        let r = await db.collection('ips').find()
                        .sort({create_date: -1})
                        .skip((page - 1) * results)
                        .limit(parseInt(results))
                        .toArray();
        return {
            data: r,
            totalCount: count
        };
    }
    ctx.body = await DB(query);
});

router.get('/xiaoqingjiao', async (ctx, next) => {
    const offset = parseInt(ctx.query.offset) || 0;
    const count = parseInt(ctx.query.count) || 10;
    const query = async (err, db) => {
        if (err) {
            return '错误';
        }
        // 内容
        const words = await db.collection('xiaoqingjiao')
            .find({parent_id: {$in: [0, -1]}})
            .sort({id: -1})
            .limit(count)
            .skip(offset)
            .toArray();
        // 总数
        const total = await db.collection('xiaoqingjiao')
            .find({parent_id: {$in: [0, -1]}})
            .count();
        // 评论
        let ids = [];
        words.forEach(item => {
            ids.push(item.id);
        });
        const comments = await db.collection('xiaoqingjiao')
            .find({parent_id: {$in: ids}})
            .toArray();
        return {words, total, comments};
    }
    ctx.body = await DB(query);
});

router.get('/visit', async (ctx, next) => {
    const ip = ctx.headers['x-real-ip'];
    const { pathname, renderer } = ctx.query;
    const uid = ctx.cookies.get('uid');
    let ipAddress = {};
    if (ip) {
        const queryIp = async (err, db) => {
            if (err) {
                return '';
            }
            let r = await db.collection('ips').findOne({ ip });
            return r;
        }
        const queryIpR = await DB(queryIp);
        if (queryIpR && queryIpR._id) {
            ipAddress = queryIpR;
        } else {
            ipAddress = await requestIp(ip);
            await DB(async (err, db) => {
                !err && await db.collection('ips').insert({...ipAddress})
            });
        }
    }
    const insert = async (err, db) => {
        if (err) {
            return '错误';
        }
        let r = await db.collection('visited').insert({ ip, pathname, renderer, uid, ipAddress, ...now()});
        return r.result;
    }
    ctx.body = await DB(insert)
});

function now () {
    const create_date = moment().format('YYYY-MM-DD HH:mm:ss');
    const update_date = create_date;
    return {create_date, update_date};
}

function requestIp (ip) {
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
            } catch (error) {
                console.log(error)
                resolve({});
            }
        });
    });
}

export default router;
