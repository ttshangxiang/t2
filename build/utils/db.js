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
const fs = require("fs");
const path = require("path");
// Connection URL
let url;
const filePath = path.resolve(__dirname, '../../../mongodb.txt');
function loadUrl() {
    try {
        return fs.readFileSync(filePath).toString('utf-8');
    }
    catch (error) {
        console.log(error);
    }
}
// Database name
const dbName = 'ttsx';
function default_1(operation) {
    return __awaiter(this, void 0, void 0, function* () {
        !url && (url = loadUrl());
        const client = yield mongodb_1.MongoClient.connect(url, { useNewUrlParser: true });
        const db = client.db(dbName);
        const result = yield operation(db);
        if (client) {
            client.close();
        }
        return result;
    });
}
exports.default = default_1;
//# sourceMappingURL=db.js.map