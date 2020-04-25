# 函数

## 定义方式

函数定义的方式
1. 完整定义
```ts
function Add(a: number, b: number) {
    return a + b
}
```
2. 变量定义
`let Add(a: number, b: number) => number`
3. 接口定义
```ts
interface Add {
    (a: number, b: number): number
}
```
4. 函数别名定义
`type Add = (x: number, y: number) => number`

除了1之外，其他都是声明函数签名，没有具体实现

## 参数可选

可选参数必须位于必填参数之后

```ts
function Add(x: number, y?: number) {
    return y? x + y : x
}
```

## 参数默认值

```ts
function Add(x: number, y = 0, z: number, q = 1) {
    return x + y + z + q
}
```
必填参数的前面，带默认值的参数如果不传，也要用 `undefined` 占位。
`Add(1, undefined, 2)` 这里 `y` 取默认值为 `0`，但是也要占位，`q` 可以省略。

## 参数长度不固定，用剩余参数代替

```ts
function Add(x: number, ...rest: number[]) {
    return x + rest.reduce((pre, cur) => pre + cur)
}
console.log(Add(1,2,3,4,5))
```

## 函数重载

1. 将所有的函数声明写到一起
2. 按照严格度从小到大排列

`ts` 会查找函数重载的列表，也就是我们定义的一堆重载函数，并且挨个匹配。`ts`要求将限制最宽松的函数写到最下面。

```ts
function add(...rest: number[]): number;
function add(...rest: string[]): string;
function add(...rest: any[]): any {
    let first = rest[0]
    if (typeof first === 'string') {
        return rest.join('')
    }
    if (typeof first === 'number') {
        return rest.reduce((pre, cur) => pre + cur)
    }
}
```
