"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gm = require("gm");
gm('/path/to/my/img.jpg')
    .resize(240, 240)
    .noProfile()
    .write('/path/to/resize.png', function (err) {
    if (!err)
        console.log('done');
});
//# sourceMappingURL=photos.js.map