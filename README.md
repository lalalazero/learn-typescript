# learn-typescript

## 初始化

`npm i typescript -g` 全局安装 `typescript` 以便于使用 `tsc` 命令

`tsc --init` 初始化 `tsconfig.json` 文件

`touch src/index.ts` 生成一个 index.ts 文件

`let hello: string = 'Hello TypeScript'` 写一个字符串

`tsc src/index.ts` tsc 编译 ts 生成 js

## 搭建项目

安装 webpack 相关

`npm i webpack webpack-cli webpack-dev-server webpack-merge -D`

安装 ts-loader 和 typescript 到本项目

`npm i ts-loader typescript -D`

安装 HtmlWebpackPlugin 插件

`npm i html-webpack-plugin -D`

安装 cleanWebpackPlugin 插件

`npm i clean-webpack-plugin -D`