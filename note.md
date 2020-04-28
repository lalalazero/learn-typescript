# 泛型

## 概念
泛型用来约束函数或者类成员的类型，泛型不是一开始确定的，而是在使用的时候确定的（不是运行时）。泛型的关键字是 T

## 泛型函数

没有泛型之前，假设一个函数要达到支持参数类型为多种类型的情况下，可以使用

1. 函数重载
2. 联合类型

```ts
function log(value: string): string 
function log(value: string[]): string[]
function log(value: number): number 
function log(value: number[]): number[]
function log(value: any): any {
    return value
}
```
或者

```ts
function log(value: string | string[] | number | number[]): string | string[] | number | number[] {
    return value
}
```

但是这样都不直观，而且冗余代码很多。采用泛型的方式声明一个泛型函数可以用更少的代码实现更多的灵活性。

```ts
function log<T>(value: T): T {
    return value
}
// 不用显示声明返回值类型，ts 会做类型推断
function log2<T>(value: T) {
    return value
}
console.log(log<string>('hello'))
console.log(log2<number>(1234))
console.log(log(['hello','world'])) // 不指定类型，由参数的类型进行推断

```

还可以结合 `type` 关键字声明一个函数类型

```ts
type Log = <T>(value: T) => T 
let mylog: Log = value => value
console.log(mylog('hello'))
console.log(mylog(1234))
console.log(mylog(['hello','world']))
```

## 泛型接口

泛型接口类似用 `type` 关键字声明一个函数类型。

带默认类型的泛型接口。
```ts
interface Log<T = string> {
    (value: T): T
}

let myLog: Log = value => value
console.log(myLog('hello'))
```

## 泛型类

1. 泛型不能约束类的静态成员

```ts
class Log<T> {
    run(value: T) {
        console.log(value)
        return value
    }
}

let log = new Log<number>()
log.run(1234)

let log2 = new Log() // 不指定类型就是 any
log2.run(1234)
log2.run('hello')
log2.run(['hello','world'])
```

## 泛型约束

泛型可以继承接口，指定某种条件下的泛型，这叫做泛型约束。

```ts
interface Len {
    length: number
}
function log<T extends Len>(value: T) {
    console.log(value, value.length)
}

log([1, 2, 3])
log('hello')
log({ a: 'hello', b: 'world', length: 2 })
// log(123) // 没有 length 属性，会报错
```
