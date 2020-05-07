# 高级类型

1. 交叉类型 &
2. 联合类型 |
3. 索引类型


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
