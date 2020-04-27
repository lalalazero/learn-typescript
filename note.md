# 类

## 类的实现
```ts
class Dog {
    constructor(name: string) {
        this.name = name
    }
    name: string
    run() {}
}
console.log(Dog.prototype)
let dog = new Dog('wang')
console.log(dog)
```
1. 无论在 ES 还是 TS，类成员的属性都是实例属性而不是原型属性
2. 方法挂在原型上，而不是实例上
3. 实例的属性必须在构造函数中初始化或者给一个初始值
```ts
constructor(name: string){
    this.name = name
}
// 或者
name: string = '一个初始值'
```

## 类的继承

1. ES6 规定派生类一定要调用父类的构造函数
2. this 的调用一定要在 super 调用之后
```ts
class Husky extends Dog {
    constructor(name: string, color: string) {
        super(name)
        this.color = color
    }
    color: string
}
```

## 成员修饰符

1. `public` 默认修饰符，没有访问限制
2. `private` 只能在当前类访问
3. `protected` 只能在当前类和子类中访问
4. `readonly` 只读，一定要被初始化(声明的时候或者构造函数里初始化)
5. `static` 修饰符，修饰静态成员，只能通过类名来调用，不能通过实例调用。

成员修饰符不仅可以用来修饰属性，也能用来修饰方法

`protected` 修饰构造函数，不能在外部 `new` 一个实例，只能在当前类或者子类中初始化，相当于声明了一个基类。
```ts
class Base {
    protected constructor(){

    }
}
```

`public` 修饰构造函数的参数，省去了成员属性的额外声明，使代码更简洁。
```ts
class Fun {
    constructor(public foo: string) {
        this.foo = foo
    }
    // foo: string // 这句话被省略了
}
```

## 抽象类和多态

```ts
abstract class Animal {}
// let animal = new Animal() // 抽象类无法被实例化

class Dog extends Animal {
    constructor(name: string) {
        super()
        this.name = name
    }
    run() {}
}
```

1. 抽象类无法被实例化
2. 抽象类可以有抽象方法，也可以有方法的完整实现
3. 抽象类的抽象方法被多个不同的子类实现后，产生多态

```ts
abstract class Animal {
    abstract sleep(): void
}
// let animal = new Animal() // 抽象类无法被实例化

class Dog extends Animal {
    constructor(public name: string) {
        super()
        this.name = name
    }
    run() { }
    sleep() {
        console.log('Dog sleep')
    }
}
class Cat extends Animal {
    constructor() {
        super()
    }
    sleep() {
        console.log('Cat sleep')
    }
}

[new Dog('xx'), new Cat()].forEach(animal => animal.sleep()) // 多态
```

## 类与接口的关系

1. 类`implements`（实现）接口 ， 类`extends`(继承)类，接口`extends`（继承）接口，接口`extends`（继承）类。
1. 类实现接口的时候必须实现接口中所有的东西
2. 接口只能约束类的公有成员，也就是`public`属性和方法。（参见第二点）
3. 但是接口无法约束类的构造函数
```ts
interface Human {
    // new (): void // 硬写会导致 Asian 提示报错
    name: string,
    eat(): void
}

class Asian implements Human {
    constructor() {
        this.name = ''
    }
    name: string
    eat() {}
}
```

## 接口的继承

1. 接口继承接口
```ts
interface Human {
    // new (): void // 硬写会导致 Asian 提示报错
    name: string,
    eat(): void
}

interface Man extends Human {
    run(): void
}

interface Child {
    grow(): void
}

interface Boy extends Child, Man { }

let boy: Boy = {
    name: 'Human',
    eat() { },
    grow() { },
    run() { }
}
```
2. 接口继承类

当接口继承一个类时，会继承包括`public`、`private`、`protected`属性的成员，但是没有具体实现。并且由于 `private` 类属性只能限定当前类访问，所以如果接口A继承类B，实际上这个接口只能由类B类来实现。同理如果存在 `protected` 属性，那么这个接口只能由当前类和类的子类来实现(`implements`)

## 接口和类之间实现和继承的关系

- 类可以继承（多个）类 `extends`
- 接口可以继承（多个）接口 `extends`
- 接口可以继承类 `extends`
    - `public` `private` `protected` 的成员都会继承，但是没有具体实现，相当于抽离出类型
- 类可以实现接口 `implements`
    - 必须实现接口所有的`public`属性
        - 接口自己定义的
        - 接口从别的接口继承的
        - 接口从别的类继承的
    - 如果接口隐式含有 `private` 和 `protected` 属性
        - 只能由接口继承的类或者它的子类来实现这个接口
```ts
class Auto {
    state = 1
    // protected secret = 0
}
interface AutoInterface extends Auto {
    state2: number

}
class C implements AutoInterface {
    state = 2
    state2 = 3
}
// 如果 Auto 的 protected 属性放开，那么 AutoInterface 接口只能由 Bus 来实现，C 不能实现
class Bus extends Auto implements AutoInterface {
    state = 3
    state2 = 4
    // secret = 0
}
console.log(new Bus())
```

