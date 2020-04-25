# 接口

## 对象类型接口
### 接口的定义
```ts
interface List {
    id: number,
    name: string
}

interface Result {
    data: List[]
}

function render(result: Result) {
    result.data.forEach(value => console.log(value.id, value.name))
}

let result = {
    data: [
        {
            id: 1, name: 'A', gender: 'male',
        },
        {
            id: 2, name: 'B'
        }
    ]
}
render(result)
```
为什么多传了一个 `gender` 属性 `ts` 不会提醒类型不符合规范？因为 `ts` 对类型定义用到了“鸭式辨型法”或“结构性子类型化”。“鸭式辩型法”通俗的讲是只要有个东西吃起来像鸭子，闻起来像鸭子，叫起来像鸭子，就认为它是鸭子。具体到代码里，只要符合了接口定义的字段类型，那么`ts`就认为正确。

凡事总有例外，如果是用对象字面量的话，`ts` 就会进行类型检查了。
将上述的 `render` 方法调用改写一下。
```ts
render({
    data: [
       {
            id: 1, name: 'A', gender: 'male', // gender 会提示类型不正确
        },
        {
            id: 2, name: 'B'
        } 
    ]
})
```

绕过这个检查的方法
1. 不用对象字面量，把它赋值给一个对象
2. 类型断言，`as` 关键字或者 `<>` 符号
```ts
render({
    data: [
       {
            id: 1, name: 'A', gender: 'male', // gender 会提示类型不正确
        },
        {
            id: 2, name: 'B'
        } 
    ]
} as Result) // 推荐

// 或者

render(<Result>{
    data: [
       {
            id: 1, name: 'A', gender: 'male', // gender 会提示类型不正确
        },
        {
            id: 2, name: 'B'
        } 
    ]
}) // 这种写法 React 不友好，甚至会报错
```
3. 使用字符串索引签名
如果 `List` 有多个其他字符串属性，那么可以修改接口为。
```ts
interface List {
    id: number,
    name: string,
    [propName: string]: any // propName 在这里只是占位用，这句话的意思是用一个字符串去索引 List 会得到任意类型，也就是 List 可以包含任意个字符串属性 
}
```

### 接口成员的属性

1. 可选属性 `?` 
```ts
interface List {
    name: string,
    age?: number
}
```
2. 只读属性 `readonly`
```ts
interface List {
    readonly id: number,
    name: string,
    age?: number
}
```
3. 可索引类型，当接口的属性不确定时
    - 可索引数字类型
    - 可索引字符串类型
```ts
interface StringArray {
    [index: number]: string // 用 number 去索引 StringArray 得到的是一个 string
}
let chars:StringArray = ['a','b']
```

```ts
interface Names {
    [x: string]: string, // 这句话的含义是用字符串去索引 Names 得到的也是一个字符串，和下面y声明矛盾
    // y: number // 会报错,
    [z: number]: string // 数字索引签名的类型一定要是字符串索引签名类型的子类型
}
```
为什么数字索引签名的类型一定要是字符串索引签名类型的子类型?

因为在`js`中，用`number`去索引一个对象会转换成`string`去索引，也就是`obj.0`会转成`obj.'0'` ，所以要保证数字索引签名的类型要是字符串索引签名类型的子类型。

4. 只读索引
```ts
interface ReadOnlyArray {
    readonly [x: number]: string
}
let a: ReadOnlyArray = ['a','b']
// a[0] = 'aa' // 错误
```

## 函数类型接口

声明一个函数的方法

1. 变量定义函数
`let add(x: number, y: number) => number`
2. 接口定义函数
```ts
interface Add {
    (x: number, y: number): number
}
```
3. 类型别名定义函数
```ts
type Add = (x: number, y: number) => number
```

函数的实现

```ts
let add: Add = (a, b) => a + b
```

## 混合接口
一个对象同时作为函数和对象使用，并带有额外的属性。在写第三方库的时候，有可能需要用到。
```ts
interface Lib {
    (): void;
    version: string;
    doSomething(): void
}

let lib: Lib = (() => {}) as Lib
lib.version = '1.0'
lib.doSomething = () => {}
```

上述定义方式像全局暴露了一个 Lib 类型，并且是单例模式创建。可以封装一个函数返回 Lib 类型的实例，多次调用就返回多个实例。

```ts
function getLib(): Lib {
    let lib: Lib = (() => {}) as Lib
    lib.version = '1.0'
    lib.doSomething = () => {}
    return lib
}
```