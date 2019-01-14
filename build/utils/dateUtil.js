"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
// 现在的时间
function now() {
    return moment().format('YYYY/MM/DD HH:mm:ss');
}
exports.now = now;
// 今天的日期
function today() {
    return moment().format('YYYYMMDD');
}
exports.today = today;
//# sourceMappingURL=dateUtil.js.map