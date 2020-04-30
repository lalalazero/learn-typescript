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

// let foo = {} as Foo // bad，写了类型断言但是没有给 bar 赋值很容易 gg（ts 也不会提示你这里 bar 没有赋值，就很容易 gg）
let foo: Foo = { bar: 1 }
```

## 类型兼容

1. null 和 undefined 兼容
2. 接口兼容
3. 函数兼容

### null 和 undefined 兼容

X 类型能被 Y 类型赋值，那么就说 X 兼容 Y。`x = y` X 叫做目标类型，Y 叫做源类型。

在关闭了 `tsconfig.json` 中的 `strictNullChecks` 之后，可以把 `null` 赋值给字符串 `string` 类型，这样的转换可以给代码提供更多的灵活性。

```ts
let s: string = 'a'
s = null
```

### 接口兼容

成员少的接口兼容成员多的接口。

```ts
interface X {
    a: any,
    b: any
}

interface Y {
    a: any,
    b: any,
    c: any
}
let x: X = {
    a: '1',
    b: '2'
}

let y: Y = {
    a: '1',
    b: '2',
    c: '3'
}

x = y  // 兼容
// y = x  // 不兼容
```

### 函数兼容

函数兼容也发生在两个函数进行赋值的时候，比如函数作为参数值进行传递。
函数兼容必须满足 3 个条件：

1. 参数个数
2. 参数类型
3. 返回值类型

#### 参数个数

- 参数个数固定

    当参数个数固定时，参数个数必须小于或者等于才兼容。
    ```ts
    type Handler = (a: number, b: number) => void

    // 高阶函数 hof
    function hof(handler: Handler) {
        return handler
    }

    let handler1 = (a: number) => { }
    hof(handler1)
    let handler2 = (a: number, b: number) => { }
    hof(handler2)
    let handler3 = (a: number, b: number, c: number) => { }
    // hof(handler3) // 不兼容
    ```

- 可选参数和剩余参数

    1. 固定参数兼容可选和剩余参数。
    2. 可选兼容固定和剩余，剩余兼容固定和可选（需要关闭 `strictFunctionTypes` 选项。但是我在 `playground` 测试的时候，v3.8.3 关不关都不影响）

    ```ts
    let a = (p1: number, p2: number) => {}
    let b = (p1?: number, p2?: number) => {}
    let c = (...args: number[]) => {}

    a = b
    a = c 
    b = a
    b = c
    c = a 
    c = b
    ```
#### 参数类型

显然类型要一致否则不兼容。

- 基础类型

```ts
let handler4 = (a: string) =>  {}
// hof(handler4) // string 类型不能兼容 number 类型
```

- 复杂类型

```ts
interface Point3D {
    x: number,
    y: number,
    z: number
}

interface Point2D {
    x: number,
    y: number
}

let p3d = (point: Point3D) => { }
let p2d = (point: Point2D) => { }

// p2d = p3d // 不兼容,除非关闭 strictFunctionsTypes 选项。将一个精确的参数 --> 不那么精确的参数叫做函数参数的双向协变
p3d = p2d // 兼容。可以理解为3个参数兼容2个参数，也就是参数多的兼容参数少的。
```

#### 返回值类型

返回值类型必须相同或者是子类型。

```ts
let f = () => ({ name: 'alice' })
let g = () => ({ name: 'Bob', age: 11 })
f = g
// g = f
```

### 枚举兼容性

不同的枚举不兼容，枚举和 `number` 兼容。（枚举的值本身也是从 0 自增）

```ts
enum Fruit {
    Apple, Banana
}
enum Color {
    Red,
    Yellow
}

let fruit: Fruit = Fruit.Apple 
fruit = 3
let no: Number = Fruit.Apple

// let color: Color.Red = Fruit.Banana
```

### 类兼容性

静态成员和构造函数是不参与类兼容性比较的。当具有相同的实例属性时，两个类兼容。

```ts
class A {
    constructor(p: number, q: number) { }
    id: number = 1
}
class B {
    static $ = 1
    constructor(p: number) { }
    id: number = 2
}
let a = new A(1, 2)
let b = new B(1)
a = b
b = a
```

如果类中含有 `private` 私有成员，那么两个类是不兼容的。只有父子类才可以兼容。

```ts
class A {
    constructor(p: number, q: number) { }
    id: number = 1
    private name: string = ''
}
class B {
    static $ = 1
    constructor(p: number) { }
    id: number = 2
}
let a = new A(1, 2)
let b = new B(1)
// a = b // A 类中有私有成员 name，无法兼容 b
b = a

class C extends A{
    constructor(p: number) { super(p, 1)}
}
let c = new C(1)
c = a
a = c
```

### 泛型兼容性

#### 泛型接口

泛型接口的兼容性取决于：
- 接口是否含有成员
- 泛型 T 是否一致

```ts
interface Empty<T> {

}

let obj1: Empty<number> = {}
let obj2: Empty<string> = {}
obj1 = obj2
obj2 = obj1

interface NotEmpty<T> {
    value: T
}

let obj3: NotEmpty<number> = { value: 1 }
let obj4: NotEmpty<string> = { value: 'hello' }
// 泛型接口不为空时，T 不一样完全不兼容
// obj3 = obj4 
// obj4 = obj3

interface Optional<T> {
    value?: T
}

let obj5: Optional<number> = {}
let obj6: Optional<number> = { value: 1 }
obj5 = obj6
obj6 = obj5
```

#### 泛型函数

同样的，在没有指定 T 类型的时候，泛型函数之间是完全兼容的。

```ts
let log1 = <T>(x: T): T => {
    console.log('x')
    return x
}

let log2 = <U>(x: U): U => {
    console.log('y')
    return x
}

log1 = log2 
log2 = log1
```


兼容性整体总结：
1. 结构比较——成员少的兼容成员多的。
2. 函数比较——参数多的兼容参数少的。


