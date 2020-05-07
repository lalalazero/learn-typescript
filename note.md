# ts 对 es 模块和 commonjs 模块的支持

1. 不能直接执行 `node a.ts` 因为 `node` 只能执行 `.js` 文件。可以要么用 `tsc` 编译 `.ts` 文件，要么用 `ts-node` 代替 `node` 执行 `.ts` 文件

2. `tsconfig.json` 的 `target` 属性和 `module` 属性
    - 如果用 `tsc` 命令行编译，`target` 默认值是 `es3`.
    - `tsconfig.json` 中 `target` 默认值是 `es5`
    - `target` 的可选值有 `es3` `es5` `es6` 等
    - `module` 属性默认值是 `commonjs`（无论是 `tsconfig.json` 还是 `tsc` 命令行中）
    - `module` 的可选值有 `commonjs`, `umd`,`amd`,`system` 等

用不同的选项编译如下 ts 看看结果有什么不同：

```ts
// 直接导出
export let a = 1

let b = 2
let c = 3
// 导出对象
export {
    b,
    c
}
// 导出接口
export interface P {
    x: number,
    y: number
}

// 导出函数
export function f() { }

function g() { }
// 修改名字导出
export { g as G }

// 默认导出
export default function () {

}
// 引入外部模块，重新导出
export { str as hello } from './b'
```

- `tsc a.ts -t es3` 编译输出：

```js
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

```
可以看到 es 模块被编译成 commonjs 模块，并且多了 exports['default'] 属性，它的值就是 es 模块默认导出的值。还多了 `exports.__esModule` 属性，表示这原来是一个 es 模块。

- `tsc a.ts -t es5` 编译输出：

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = default_1;
// 引入外部模块，重新导出
var b_1 = require("./b");
exports.hello = b_1.str;

```
可以看到还是编译成了 `commonjs` 模块，多了 es5 的 `Object.defineProperty` 方法，声明了 `__esModule` 属性，同样的有 `exports.default` 属性。

- `tsc a.ts -t es6` 编译输出：

```js
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

```
可以看到指定 `target` 为 `es6` 编译后，输出就是 `esModule` 而不是 commonjs module ，文件内容没啥变化。

还可以继续指定 `tsc a.ts -m amd` 和 `tsc a.ts -m umd` 查看编译后的效果。

3. 对于默认导出的处理。

假如有一个 es 模块 `foo.ts`，内容是 
```ts
export default function(){ console.log('foo') }
```
默认导出了一个函数。如果在 commonjs 模块比如 `bar.ts` 中引入这个模块并使用它，需要这么写：
```js
var foo = require('foo') // 假定文件名是这个
foo.default() 
```
运行 `ts-node bar.ts` 才能正确看到输出。这是因为 `tsconfig.json` 的默认配置通常是 `module: commonjs` 和 `target: es5`，经过编译后 es 模块的默认导出被挂载到了 commonjs 模块的 `default` 属性上。

针对上面的情况，es 提供了另外一种写法。
```ts
export = function() { console.log('foo' )}
```

相应的，commonjs 中可以直接写:
```ts
import foo = require('foo')
foo()
```

如果打开了 `tsconfig.json` 配置中的 `esModuleInterop` 属性，那么还可以写成
```ts
import foo from 'foo'
foo()
```



