"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
// 现在的时间
function now() {
    return moment().format('YYYY/MM/DDTHH:mm:ss');
}
exports.now = now;
//# sourceMappingURL=dateUtil.js.map