# 类型保护

在特定的区块中保证变量属于某个确定的类型，以此可以放心调用类型的方法或者访问属性。

如何创建类型保护区块？
- `instanceof` 
- `in` 
- `typeof`
- 类型尾词

考虑下面的例子，根据传入参数是什么类型，初始化一个强或者弱类型语言对象并调用它的方法。由于预先无法知道初始化的语言类型，因此难免要写 `if` 加 `as` 来做类型判断，代码很丑。 
```ts
enum Type {
    Strong,
    Weak
}

class Java {
    helloJava() {
        console.log('Hello Java')
    }
}
class JavaScript {
    helloJavaScript() {
        console.log('Hello JavaScript')
    }
}

function getLanguage(type: Type) {
    const lang = type === Type.Strong ? new Java() : new JavaScript()
    if ((lang as Java).helloJava) {
        (lang as Java).helloJava()
    } else {
        (lang as JavaScript).helloJavaScript()
    }
}

```

改用 `instanceof` 关键字进行改写。

```ts
if (lang instanceof Java) { // 创建了一个类型保护区块
    lang.helloJava()
} else {
    lang.helloJavaScript()
}
```

增加一个属性并用 `in` 关键字来改写。

```ts
class Java {
    java: any
}
class JavaScript {
    javascript: any
}

if ('java' in lang) { // 创建了一个类型保护区块
    lang.helloJava()
} else {
    lang.helloJavaScript()
}
```

用 `typeof` 关键字来判断类型

```ts
function Foo(x: string | number) {
    if (typeof x === 'string') {
        console.log(x.length)
    } else {
        console.log(x.toFixed(2))
    }
}
```

用类型尾词返回确定的类型。

```ts
function getLanguage(type: Type) {
    const lang = type === Type.Strong ? new Java() : new JavaScript()
    if (isJava(lang)) {
        lang.helloJava()
    } else {
        lang.helloJavaScript()
    }
    
}
// lang is Java 这种返回值叫做类型尾词
function isJava(lang: Java | JavaScript): lang is Java {
    return (lang as Java).helloJava !== undefined
}
```