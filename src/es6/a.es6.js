// 直接导出
export let a = 1;
let b = 2;
let c = 3;
// 导出对象
export { b, c };
// 导出函数
export function f() { }
function g() { }
// 修改名字导出
export { g as G };
// 默认导出
export default function () {
}
// 引入外部模块，重新导出
export { str as hello } from './b';
