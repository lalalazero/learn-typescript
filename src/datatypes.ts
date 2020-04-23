// 原始类型
let bool: boolean = true 
let num: number = 3
let str: string = 'hello'

// 数组
let arr1: number[] = [1,2,3]
let arr2: Array<number> = [1,2,3]

// 元组
let tuple:[number, string] = [1,'hello']

// 函数
let add = (x: number, y: number) => x + y // 类型自动推断
let compute: (x: number, y: number) => number // 相当于 java 的接口
compute = (a,b) => a + b // 相当于 java 的实现类

// 对象
// let obj: object = { x: 1, y: 2 } // 不好
let obj: {x: number, y: number} = { x: 1, y: 2 }
// obj.z = '3' // 错误

// Symbol
let s1: symbol = Symbol()
let s2: symbol = Symbol()
console.log(s1 === s2) // false

// undefined || null
let un: undefined = undefined // 只能赋值为 undefined 
// un = num // 不能赋值给 undefined
let nu: null = null 
// nu = num // 不能赋值给 null

// 如果要把其他类型的值赋值给 unfined || null，需要设置 tsconfig.json 中 strictNullChecks: false
// 或者在本例中，num 的类型使用联合类型声明

// void 类型
let noReturn = () => {} // 没有返回值的就是 void 类型，也可以理解返回 undefined 的就是 void 类型。为什么要多此一举呢？

// any
let x: any
x = 1
x = undefined 
x = true 
x = 'string'

// never 永远不会有返回值的类型
let error = () => {
    throw new Error('error')
}
let yy = () => { while(true) {} }

// 联合类型
let a: string | number | undefined = 'hello'
a = 1
a = un // undefined

let arr3: Array<string | number> = ['hello',1,2,'hello']
arr3 = [1,2,3,4]