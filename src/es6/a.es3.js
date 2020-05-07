"use strict";
exports.__esModule = true;
// 直接导出
exports.a = 1;
var b = 2;
exports.b = b;
var c = 3;
exports.c = c;
// 导出函数
function f() { }
exports.f = f;
function g() { }
exports.G = g;
// 默认导出
function default_1() {
}
exports["default"] = default_1;
// 引入外部模块，重新导出
var b_1 = require("./b");
exports.hello = b_1.str;
