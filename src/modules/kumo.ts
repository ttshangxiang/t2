import * as Router from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'
const router = new Router({
  prefix: '/kumo'
})

router.get('/', (ctx) => {
  let arr = fs.readdirSync(path.resolve(__dirname, '../../kumovideo'));
  arr.sort(function (a: any, b: any) {
    return a - b;
  })
  arr = arr.map(o => {
    return `<a href="/api/kumo/${o}">${o}</a>`
  })
  ctx.set('Content-Type', 'text/html')
  let body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>_(:_」∠)_</title>
    <style>
      * {margin: 0;padding: 0;}
      a {color: #008cff; font-size: 14px; line-height: 20px; margin: 12px 24px; display: inline-block;}
      a:visited {color: #aaa;}
    </style>
  </head>
  <body>
    ${arr.join('')}
  </body>
  </html>
  `
  ctx.body = body;
})

router.get('/:id', (ctx) => {
  const path = '/kumovideo/' + ctx.params.id;
  ctx.set('Content-Type', 'text/html')
  let body = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${ctx.params.id}</title>
    <style>
      * {margin: 0;padding: 0;}
      html, body {height: 100%}
      video {width: 100%;height: 100%;}
    </style>
  </head>
  <body>
    <video src="${path}" controls="controls">
    您的浏览器不支持 video 标签。
    </video>
  </body>
  </html>
  `
  ctx.body = body;
})

export default router