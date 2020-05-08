# 编写声明文件

在开发中总是会引用其他类库，这些类库总体可以分为全局类库和其他。
1. 全局类库
2. 其他
    - UMD
    - CommonJS
    - esModule

以 jquery 为例，`npm i jquery` 之后使用的时候 ts 会提示找不到 jquery 的类型声明文件，提示我们去 `npm i @types/jquery` 下载。