# 编写声明文件

在开发中总是会引用其他类库，这些类库总体可以分为全局类库和其他。

1. 全局类库
2. 其他
    - UMD
    - CommonJS
    - esModule

以 `jquery` 为例，`npm i jquery` 之后使用的时候 ts 会提示找不到 `jquery` 的类型声明文件，提示我们去 `npm i @types/jquery` 下载。有的类库声明文件在源码中，有的在 @types/xxx 中。如果都没有，是时候给社区贡献自己的力量了。查看类库的 ts 类型声明，看的是 `package.json` 中的 `types` 属性值。
比如 `jquery` 的类型声明是 `"types": "index.d.ts"`
  


## 给类库编写 .d.ts 类型声明文件

1. 全局类库
2. esModule / commonjs Module 类库
3. umd 类库

怎么查找这些已有类库的声明文件？甚至自己写一个？这里都要用到一个关键字 `declare`

### 给全局类库编写声明文件 

1. 全局类库要在 `html` 文件中用 `<script>` 标签引入，同时代码中就不要写 `import` 了，直接用
2. 全局类库用 `declare` 声明，没有 `export` 关键字(没有 `export` `import` 所以它是全局可见的)
3. 全局类库用了命名空间和函数的声明合并，意为给函数赋予属性
4. 全局类库中的接口应当写在命名空间之内，避免对全局变量的污染

```ts
// 全局类库 global-lib.d.ts
// 利用函数和声明空间的合并，为函数添加属性

declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    // interface 放在命名空间中，避免对全局变量的污染
    interface Options {
        [key: string]: any
    }
}
```

### 给 esModule/ commonjs 类库编写声明文件

1. 要写 `export = `，不能写 `module.exports = `（注意这是 .d.ts 不是 .js）

    `export=`的兼容性是最好的，因为这样写在 `esModule` 中可以 `import xxx from 'xxx'` 导入默认的使用，在 `commonjs` 中可以 `import xxx = require('xxx')` 也可以 `import xxx from 'xxx'` 导入，然后直接用 `xxx`。如果是 `export default` 导出，在 `commonjs` 中就会变成 `const xxx = require('xxx').default`，注意这个 `default`，用起来非常违反直觉。

2. 由于本身是有模块限制的，所以接口不必写在命名空间之内，不会污染全局变量。
3. 需要 `import` 导入之后才能使用

commonjs 类库编写 .d.ts 示例

```ts
// module-lib.d.ts
declare function moduleLib(options: Options): void

interface Options {
    [key: string]: any
}

declare namespace moduleLib {
    const version: string;
    function doSomething(): void;
}

export = moduleLib

// index.ts
import moduleLib from './module-lib.js'
moduleLib.doSomething()
```

esModule 编写 .d.ts 示例，跟 commonjs 没差别，略。

### 给 UMD 类库编写声明文件

1. UMD 类库 .d.ts 文件的书写类似 esModule 类库的编写
2. `export as namespace xxx` 这句是 UMD 类库必须要写的
3. UMD 类库可以通过 `import` 方式导入使用，也可以通过 `<script>` 标签引入使用
    umd 类库 ts 会提示不要不 `import` 然后直接用，关掉这个提示需要配置 `allowUmdGlobalAccess` 为 `true`

4. 当 UMD 类库作为 umd global 对象全局使用时，不能在 `module` 使用它（比如 `index.ts` 文件就是一个 `module` ），只能用传统的 `<script>` 标签方式引入


## 类库插件

对于已经有 `.d.ts` 声明文件的类库，怎么拓展它的属性或者方法来满足开发需求？

1. 全局类库插件
2. 模块类库插件

### 全局类库插件

给前面举例的全局类库 `globalLib` 声明一个自定义方法。
```ts
// index.ts
declare global {
    namespace globalLib {
        function doAnything(): void
    }
}

globalLib.doAnything = () => { console.log('globalLib do anything') }
globalLib.doAnything()
```

### 模块类库插件

以 `moment` 为例，给 `moment` 添加自定义方法。
```ts
// index.ts
import m from 'moment'
declare module 'moment' {
    export function myFunction(): void
}
m.myFunction = () => {
    console.log('moment. myFunction')
}
```

## 声明文件的依赖

对于大型的类库来说，可能内部还分了好多个模块，类型声明文件不是一个 `index.d.ts` 文件就能描述完的，以 `jquery` 为例，它的声明文件的依赖关系为：
```ts
/// <reference types="sizzle" />
/// <reference path="JQueryStatic.d.ts" />
/// <reference path="JQuery.d.ts" />
/// <reference path="misc.d.ts" />
/// <reference path="legacy.d.ts" />

export = jQuery;
```

这里有 `///` 三斜线指令，`<reference path='xxx'>` 用来声明一个路径依赖，xxx 是一个相对路径的类型声明文件（`.d.ts`）。之前写命名空间的时候也有一样的依赖。`<reference types="xxx">` 表示的是一个模块依赖，即 ts 会继续去找 `@types/xxx` 的类型声明文件。