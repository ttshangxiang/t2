const Crypto = require('./Crypto').default;

export default function (param) {
    param.csrf_token = '';
    var code = Crypto.aesRsaEncrypt(JSON.stringify(param));
    return 'params=' + encodeURIComponent(code.params) + '&encSecKey=' + encodeURIComponent(code.encSecKey);
};