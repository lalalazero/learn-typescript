# 代码检查 TSLint 和 ESLint

TSLint 不用学了，官方都已经宣布转向 ESLint

## Lint 存在的必要性

有了类型检查为什么还要 Lint？
1. 保持团队开发风格统一
2. Lint 也有助于检查一些类型错误

## TSLint 和 ESLint

顾名思义，分别是 TS 和 ES 的 Lint 规则集。由于 ESLint 社区已经有很成熟的生态，所以官方也宣布从 TSLint 转向 ESlint，避免再多开发一套工具同时也利于融入社区，有助于社区工作者开发针对 ts 的工作等。

ESLint 的工作流程：
`code -> es AST -> 语法、风格检查 -> 结果`

TSLint 的工作流程：
`code -> ts AST -> 语法、风格检查 + 类型检查、语言转换 -> 结果`

可以看到 TSLint 是要多做一个类型检查和语言转换的功能的，同时由于 es AST 和 ts AST 语法树不兼容，所以 ts 无法直接复用生态丰富的 eslint 社区的工作。这也是为什么官方要迁移到 eslint 的原因。对于 AST 语法树的不兼容，官方提供了 `typescript-eslint` 这个插件使得  ts AST 可以转化为 es AST(es Tree)，从而复用 eslint 生态。



## 实践
npm 安装相关依赖 
`npm i -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser`

配置 .eslintrc.json


## 利用 IDE 的插件 ESLint
编辑 settings.json ，<del>配置 eslint.autoFixOnSave 自动修复</del> 根据最新的更新，要改成这样写了
```json
{
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
 
```



