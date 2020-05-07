# 高级类型

1. 交叉类型 `&`
2. 联合类型 `|`
3. 索引类型 `keyof T ` `T[K]` `T extends U`
4. 映射类型 `Partial<T>` `Readonly<T>` `Pick<T>` `Record<T,U>`
5. 条件类型 `Exclude<T,U>` `NotNullable<T>` `Extract<T,U>`
6. `ReturnType<T>`


## 交叉类型

```ts
interface DogInterface {
    run(): void
}

interface CatInterface {
    jump(): void
}

let pet: DogInterface & CatInterface = {
    run() { },
    jump() { }
}
```
特别适合对象混入的场景，用 & 符号链接。交叉类型从名称看起来取类型交集，实际上是取类型并集。

## 联合类型

声明的类型并不确定，可能是多个中的一个。比如 `let a: number | string = 'a'`。

- 字面量联合类型
```ts
let b: 'a' | 'b' | 'c'
let c: 1 | 2 | 3
```

- 对象联合类型

联合类型从名称上看起来是取类型的并集，实际上是取类型的交集。
```ts
interface DogInterface {
    run(): void
}

interface CatInterface {
    jump(): void
}

class Dog implements DogInterface {
    run() { console.log('dog run') }
    eat() { console.log('dog eat') }
}
class Cat implements CatInterface {
    jump() { console.log('cat run') }
    eat() { console.log('cat eat') }
}

enum Master { Boy, Girl }

function getPet(master: Master) {
    let pet = master === Master.Boy ? new Dog() : new Cat()
    pet.eat() // 只能访问共有的方法
}
```

- 可区分的联合类型

创建特定的类型保护区块。
```ts
interface Square {
    kind: 'square',
    size: number
}

interface Rectangle {
    kind: 'rectangle',
    width: number,
    height: number
}

type Shape = Square | Rectangle 
function area(s: Shape) {
    switch (s.kind) {
        case 'square':
            return s.size * s.size
        case 'rectangle':
            return s.height * s.width
    }
}
```

如果 `Shape` 新增了一个类型，比如 `Circle`，并且由于疏忽漏写了 `area` 对于该类型的实现计算。如何修改 `area` 类型使得 `ts` 在编译的时候能够智能的提示？

1. 给 `area` 函数增加一个返回值类型，比如 `number`
2. 增加一个 `default` 分支，利用参数不是 `never` 类型来返回一个错误

```ts
interface Square {
    kind: 'square',
    size: number
}

interface Rectangle {
    kind: 'rectangle',
    width: number,
    height: number
}

interface Circle {
    kind: 'circle',
    r: number
}

type Shape = Square | Rectangle | Circle
function area(s: Shape) {
    switch (s.kind) {
        case 'square':
            return s.size * s.size
        case 'rectangle':
            return s.height * s.width
        case 'circle':
            return Math.PI * s.r ** 2
        default:
            return ((e: never) => { throw new Error(e)})(s)
    }
}
```

## 索引类型
```ts
let obj = {
    a: 1,
    b: 2,
    c: 3
}
function getValue(obj: any, keys: string[]) {
    return keys.map(key => obj[key])
}

console.log(getValue(obj, ['a', 'b']))
console.log(getValue(obj, ['e','f']))
```
当访问 `obj` 没有的 `key`,比如 `e` `f` 的时候，输出的是`[undefined, undefined]` 数组，但是 `ts` 并没有报错。如何修改并增加 `ts` 的约束？

1. 索引类型的查询操作符 `keyof T` 表示类型 T 的所有公共属性的字面量的联合类型（有点绕 = =) 

    ```ts
    interface Obj {
        a: number,
        b: string
    }
    let key: keyof Obj 
    ```
    这里 key 的类型就是 `'a' | 'b'` 字面量联合类型

2. `T[K]` 表示对象属性的类型。比如 `let value: Obj['a']` 这里 `value` 的类型就是 `number`

3. 泛型约束 `T extends U`

我们用上述 1,2,3 点对 `getValues` 函数进行改造。

```ts
let obj = {
    a: 1,
    b: 2,
    c: 3
}
function getValue<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key])
}

console.log(getValue(obj, ['a', 'b']))
// console.log(getValue(obj, ['e','f'])) // ts 会提示报错 e f 不属于 obj 的属性
```

改造之后的函数对对象、对象属性以及对象属性返回的值类型做了一个约束。

## 映射类型

从一个类型衍生得到另一个类型。本质上是一系列预先定义的泛型接口。

举个例子，得到一个类型的只读版。
```ts
interface Obj {
    a: string,
    b: number,
    c: boolean
}

type ReadonlyObj = Readonly<Obj>
```
通过 ts 预定义的 `Readonly` 类型(在 `lib.es5.d.ts` 文件中定义的），得到了 `ReadonlyObj` 类型，它的属性和 `Obj` 完全一样，只是每个属性都是只读的。

Readonly 预定义类型的实现：
```ts
/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

其他常用类型举例：
```ts
type PartialObj = Partial<Obj> // 得到所有属性可选的 PartialObj 类型
type PickObj = Pick<Obj, 'a' | 'b'> // 抽取属性的子集

```
以上是同派接口，作用于 Obj 类型，区别于非同派接口，比如 `Record` 预定义类型。

```ts
type RecordObj = Record<'x' | 'y', Obj>
```
RecordObj 得到的新的类型为：
```ts
{
    x: Obj,
    y: Obj
}
```

## 条件类型

`T extends U ? X : Y`，如果 T 可以被赋值给类型 U，那么结果类型就是 X，否则就是 Y

条件类型使得类型可以具备不唯一性，更加灵活。

```ts
type TypeName<T> = 
    T extends string ? "string" : 
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object"
type T1 = TypeName<string>  // T1=string
type T2 = TypeName<string[]> // T2=object
```

分布式条件类型：`(A | B) extends U ? X : Y`

拆解之后等同于： `(A extends U ? X : Y) | (B extends U ? X : Y)`

```ts
type T3 = TypeName<string | string[]> // T3='string' | 'object' 联合类型
```

分布式条件类型可以用来过滤类型。
```ts
type Filter<T, U> = T extends U ? never : T 
type T4 = Filter<'a' | 'b' | 'c', 'a' | 'e'> // T4='b' | 'c'
```
拆解类型过滤的过程：
```ts
Filter<'a' | 'b' | 'c', 'a' | 'e'> === 
Filter<'a', 'a' | 'e'> | Filter<'b', 'a' | 'e'> | Filter<'c', 'a' | 'e'> ===
never | "b" | "c" ==== "b" | "c" // 就是 T4 的类型
```

过滤 `undefined` 和 `null` 的例子：

```ts
type NotNull<T> = Filter<T, undefined | null>
type T5 = NotNull<string | number | undefined | null>
```

实际上 `Filter` 和 `NotNull` 都有官方的类型预定义，分别是 `Exclude<T,U>` 类型和 `NonNullable<T>` 类型。其他类型常见的有 `Extract<T,U>`，例如：
```ts
type T6 = Extract<"a" | "b" | "c", "a" | "e">
```


## ReturnType<T> 获取一个函数返回值的类型

`type T7 = ReturnType<() => string>` T7 的类型就是 `string`



