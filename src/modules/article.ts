import * as Router from 'koa-router';
import base from './base';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import * as hljs from 'highlight.js';

const md: MarkdownIt = new MarkdownIt({
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
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

function saveHTML (path: string) {
  fs.readFile(path, (err, content) => {
    if (err) {

    }
    const html = md.render(content.toString('utf-8'));
    fs.writeFileSync(path, html);
  })
}

const router = new Router({
  prefix: '/article'
});

// 获取文章
router.get('/:id', async (ctx) => {
  const id = ctx.params.id;
  ctx.body = { code: 0, data: id };
});

base.use(router.routes());
base.use(router.allowedMethods());

