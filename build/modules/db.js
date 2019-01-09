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
const mongodb_1 = require("mongodb");
// Connection URL
const url = 'mongodb://ttsx:112439416@119.23.238.67:27017/ttsx';
// Database name
const dbName = 'ttsx';
function default_1(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let client;
        let result;
        try {
            // Use connect method to connect to the server
            client = yield mongodb_1.MongoClient.connect(url);
            const db = client.db(dbName);
            result = yield callback(null, db);
        }
        catch (err) {
            console.log(err.stack);
            callback(err);
        }
        if (client) {
            client.close();
        }
        return result;
    });
}
exports.default = default_1;
//# sourceMappingURL=db.js.map