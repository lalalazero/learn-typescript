# 声明合并

## 接口合并

1. 同名的接口哪怕位于不同的 .ts 文件都会进行声明合并
2. 接口的成员属性可以定义多次，但是类型必须相同，类型不同不被允许
3. 接口的成员函数会重载，重载顺序遵从：
    - 接口内部按照书写顺序排列
    - 写在前面的接口函数顺序排在后面
    - 函数参数是字符串字面量的顺序排在第一位

## 命名空间的合并

### 命名空间和命名空间的合并

1. 命名空间导出的函数和变量是不能重复定义的(想想闭包的原理)
```ts
namespace Foo {
    export function hello() {
        console.log('hello')
    }
    export const a = 'aaa'
}
namespace Foo {
    export function bar() {
        console.log('bar')
    }
    // 不允许重复定义导出的函数和变量，这点和接口的合并不同
    // export function hello() {
    //     console.log('world')
    // }
    // export const a = 'aa'
}
```

### 命名空间和函数的合并

```ts
function Lib() { }
namespace Lib {
    export const version = '1.0'
}
console.log(Lib.version)
```
- 相当于给函数增加属性，这在 js 中也是常见的。
- 一定要先写函数再写命名空间(why?)。

>个人理解就像不能写这样的代码，先写命名空间相当于声明了一个对象，再写函数相当于声明了一个相同的标志符，肯定是不行的。
```js
var foo = 123
function foo(){}
```

### 命名空间和类的合并

```ts
class C {

}
namespace C {
    export const staticState = 1
}
console.log(C.staticState)
```
- 相当于给类增加了静态属性
- 一定要先写类再写命名空间。（why?)
>参见上一条分析，类的本质也是构造函数嘛。

### 命名空间和枚举的合并

```ts
enum Color {
    Red,
    Yellow
}
namespace Color {
    export function mix() {}
}
console.log(Color)
```

