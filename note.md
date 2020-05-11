# 编译工具 ts-loader 和 babel

## ts-loader

1. 内部用的 `tsc` 编译，官网血统，新项目推荐用。
2. transpileOnly 选项，开启后只做编译不做类型检查
3. 配合 fork-ts-checker-webpack-plugin 独立的类型检查进程

## awesome-typescript-loader

针对官网编译器编译速度太慢，做了缓存和优化，更适合和 babel 集成

1. 内置独立的类型检查进程 (CheckerPlugin)
2. transpileOnly 选项同 ts-loader

## 两者对比

主要从编译时间(ms)对比

| loader | 默认配置 | 开启 transpileOnly | transpileOnly + 独立类型检查 
| ------ | ----- | ----- |  ----- |
| ts-loader | 1600+ | 500+ | 3000+(fork-ts-checker-webpack-plugin 时间还变长了...)
| awesome-typescript-loader | 2200+ | 1600+ | 1600+( CheckerPlugin() 类型检查有遗漏)

## babel

利用  babel 强大的生态插件做 ts 的编译，需要用到的插件有：
- `@babel/preset-typescript`
- `@babel/plugin-proposal-class-properties` 这个插件用来支持写 class
- `@babel/plugin-proposal-object-rest-spread` 这个插件用来支持 ... 扩展运算符

由于 babel 只做 ts 的编译，也就是语言转换，所以需要单独一个进程开启来做类型检查，这里还是用 `tsc --watch ` 模式随时对修改的文件做类型检查。

同时 babel 存在无法编译的 ts 特性，分别有：
1. namespace
    >不要在 babel 编译 ts 的项目里写命名空间
2. `<typename>` 类型断言
    > 改用 as 关键字做类型断言 `as typename`
3. const enum
    > 以后会支持
4. export = 
    > 不写这个语法


babel7 之前
- ts -> tsc(ts-loader/awesome-typescript-loader) -> js -> babel -> js

babel7 之后
- ts -> babel -> js + tsc 单独做类型检查
