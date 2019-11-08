"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const base_1 = require("./base");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
const hljs = require("highlight.js");
const md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: true,
    quotes: '“”‘’',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            }
            catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
function saveHTML(path) {
    fs.readFile(path, (err, content) => {
        if (err) {
        }
        const html = md.render(content.toString('utf-8'));
        fs.writeFileSync(path, html);
    });
}
const router = new Router({
    prefix: '/article'
});
// 获取文章
router.get('/:id', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const id = ctx.params.id;
    ctx.body = { code: 0, data: id };
}));
base_1.default.use(router.routes());
base_1.default.use(router.allowedMethods());
//# sourceMappingURL=article.js.map