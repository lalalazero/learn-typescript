# 类型检查机制

## 概念
指的是 `typescript` 编译器在做类型检查时，遵循的一些原则和相应的表现行为。

## 分类

1. 类型推断
2. 类型兼容性
3. 类型保护

## 类型推断

在一些情况下不用指定变量或者函数的返回值类型， `typescript` 可以根据某些规则自动的推断类型。规则如下：

- 基础类型推断
- 最佳通用类型推断
- 上下文类型推断

1. 基础类型推断

```ts
let a // any
let b =  1 // number 
let c = [1,2] // number 数组
```

2. 最佳通用类型推断

在关闭了 `tsconfig.json` 的 `strictNullChecks` 后，如下的代码 `null` 类型和 `number` 类型就兼容了，`a` 数组的类型会被推断为 `number` 数组。
```ts
let a = [1, null] 
```
看类型不兼容的例子，这里 `number` 和 `string` 是不兼容的，那么 `ts` 就会推断 `b` 的类型为联合类型，也就是 `number | string`。
```ts
let b = [1, 'hello']
```

3. 上下文类型推断

基础类型推断和最佳通用类型推断都是从右往左的推断，上下文类型推断是反向推断，通常发生在事件绑定中。比如：
```ts
window.onkeydown = event => console.log(event)
```
这里 `event` 会被自动推断为 `keyboardevent`（用 `vscode` 编辑会有，在 `ts` `playground` 没有）

## 类型断言

我比 `typescript` 更确定这个类型。（不推荐滥用类型断言，很容易 gg ）

```ts
interface Foo {
    bar: number
}

// let foo = {} as Foo // bad，写了类型断言但是没有给 bar 赋值很容易 gg
let foo: Foo = { bar: 1 }
```

## 类型兼容

X 类型能被 Y 类型赋值，那么就说 X 兼容 Y。`x = y` X 叫做目标类型，Y 叫做源类型。