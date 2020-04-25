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

