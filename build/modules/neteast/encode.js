"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Crypto = require('./Crypto').default;
function default_1(param) {
    param.csrf_token = '';
    var code = Crypto.aesRsaEncrypt(JSON.stringify(param));
    return 'params=' + encodeURIComponent(code.params) + '&encSecKey=' + encodeURIComponent(code.encSecKey);
}
exports.default = default_1;
;
//# sourceMappingURL=encode.js.map