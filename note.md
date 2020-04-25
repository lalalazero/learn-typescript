# chap1

## 基本类型

- ES6 的数据类型

    `Boolean Number String Array Function Object Symbol undefined null`

- TypeScript 的数据类型

    ES6的类型 + `void any never 元祖(tuple) 枚举 高级类型`

### 原始类型
```ts
let bool: boolean = true 
let num: number = 3
let str: string = 'hello'
```
TypeScript 一旦声明了类型，那么不同类型的变量之间不能互相赋值，比如 `num=str` 会报错，除非进行强转。（类似 java）

### 数组
```ts
let arr1: number[] = [1,2,3]
let arr2: Array<number> = [1,2,3]
```

### 元组
```ts
let tuple:[number, string] = [1,'hello']
```
元祖应当是声明一组不可变的数据，如果访问不存在的元素会报错。比如 `tuple[2]` 数组越界。元祖有一个bug是还是可以做操作，比如`tuple.push(3)`，`tuple[0]=3`

### 函数
```ts
let add = (x: number, y: number) => x + y // 类型自动推断
let compute: (x: number, y: number) => number // 相当于 java 的接口
compute = (a,b) => a + b // 相当于 java 的实现类
```

### 对象
```ts
// let obj: object = { x: 1, y: 2 } // 不好
let obj: {x: number, y: number} = { x: 1, y: 2 }
// obj.z = '3' // 错误，没有声明z属性不能赋值
```

### Symbol
```ts
let s1: symbol = Symbol()
let s2: symbol = Symbol()
console.log(s1 === s2) // false
```
### undefined || null
```ts
let un: undefined = undefined // 只能赋值为 undefined 
// un = num // 不能赋值给 undefined
let nu: null = null 
// nu = num // 不能赋值给 null

// 如果要把其他类型的值赋值给 unfined || null，需要设置 tsconfig.json 中 strictNullChecks: false
// 或者在本例中，num 的类型使用联合类型声明
```

### void 类型
```ts
let noReturn = () => {} // 没有返回值的就是 void 类型，也可以理解返回 undefined 的就是 void 类型。
```
有了`undefined`类型为什么还要多此一举声明`void`类型？因为在`js`中`undefined`不是一个保留字，可以被重写，比如：
```js
function bar(){
    var undefined = 'undefined'
    return undefined
}
```

### any 
```ts
let x: any
x = 1
x = undefined 
x = true 
x = 'string'
```
`any`相当于不定义类型，因为任何类型都可以，除非必要否则不应当使用`any`

### never 永远不会有返回值的类型
```ts
let error = () => {
    throw new Error('error')
}
let yy = () => { while(true) {} }
```

### 联合类型
```ts
let a: string | number | undefined = 'hello'
a = 1
a = un // undefined

let arr3: Array<string | number> = ['hello',1,2,'hello']
arr3 = [1,2,3,4]
```
联合类型的关键在于`|`符号

## 枚举 
定义枚举的关键字是 `enum`

### 数字枚举
```ts
enum Role {
    Reporter,
    Developer,
    Maintainer,
    Owner,
    Guest
}
```
不单独初始化的时候，枚举的值从`0`开始自增长。
反向映射 —— 对于数字枚举，不仅会有枚举名->枚举值的映射，同时有枚举值到枚举名的一个映射，叫做反向映射。比如 `Role.Reporter = 0` 反过来 `Role.0 = 'Reporter'`

将上述枚举定义拷贝到 `ts` 的 [playground](https://www.typescriptlang.org/play/index.html) 运行看看。
```js
"use strict";
var Role;
(function (Role) {
    Role[Role["Reporter"] = 0] = "Reporter";
    Role[Role["Developer"] = 1] = "Developer";
    Role[Role["Maintainer"] = 2] = "Maintainer";
    Role[Role["Owner"] = 3] = "Owner";
    Role[Role["Guest"] = 4] = "Guest";
})(Role || (Role = {}));

```

### 字符串枚举

```ts
enum Message {
    Success = 'Success',
    Fail = 'Fail'
}
```
同样的去 [playground](https://www.typescriptlang.org/play/index.html)运行看看，会发现字符串枚举没有反向映射。因为字符串是动态的，数字是固定的，数字当作 `object` 的 `key` 是完全可行的，但是字符串有可能不符合 `key` 的要求，毕竟字符串是允许用户随便定义的。

```js
"use strict";
var Message;
(function (Message) {
    Message["Success"] = "Success";
    Message["Fail"] = "Fail";
})(Message || (Message = {}));

```

### 异构枚举
同时混用字符串和数字枚举，不推荐。
```ts
enum Answer {
    N,
    Yes = 'Yes'
}
```

#### 枚举的属性
1. 枚举定义了不可修改
```ts
enum X {
    y
}
X.y = 'yyy'  // 提示报错，不可修改
```
2. 枚举成员的类型
    - 常量成员（编译的时候值就有了且不可修改）
    - 计算成员（动态计算的，只有运行时才能确定枚举的值）
```ts
enum Char {
    // const
    a,
    b = Char.a,
    c = 1 + 3,
    // computed
    d = Math.random(),
    e = '123'.length,
    f = 4 // 必须要手动赋值，无法通过自增长自动赋值
}
```
在动态计算的属性后面出现的枚举不能自动赋值，必须要手动赋值。

### 常量枚举
用 `const` 关键字修饰的枚举值
```ts
const enum Month {
    Jan,
    Feb,
    Mar
}
```
常量枚举值编译后没有代码！
```js
"use strict"; 
```
为什么会这样？

常量枚举值在编译过程中会被完全去掉，当你没有使用常量枚举对象时，就只能看到 `use strict`。

常量枚举值适合什么？当不需要 `Month` 对象，而需要对象的值的时候可以使用常量枚举,在使用的地方会被直接内联枚举的值。

常量枚举可以减少不必要的代码量，而且去掉了访问枚举对象的其他非定义属性的可能。比如 `Month.May`

比如加上使用后的编译结果
```ts
const enum Month {
    Jan,
    Feb,
    Mar
}
let months = [Month.Jan, Month.Feb, Month.Mar]
let jan = Month.Jan
```
编译后的结果

```js
"use strict";
let months = [0 /* Jan */, 1 /* Feb */, 2 /* Mar */];
let jan = 0 /* Jan */;
```


