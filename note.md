# 命名空间 namespace

- 命名空间很好的解决了全局变量污染的问题
- 自从 es 模块化标准出来之后，命名空间的作用发挥其实不太大了，因为 es 模块化很好的处理了这个问题
- 但是在使用一些全局的类库的时候，声明命名空间仍然是很有用的
- 命名空间应当声明在全局环境中，而不应该在 es 模块内混用
- 相同的命名空间即便声明在两个不同的 `.ts` 文件中，也是可以合并的，相当于只有一个同名的命名空间
- `///` 三斜线引用，用来引用声明其他命名空间的文件

    ```ts
    /// <reference path="a.ts" />

    namespace Shape {
        export function circle(x: number) {
            return Math.PI * x ** 2
        }
    }

    Shape.circle(1)
    Shape.square(1)
    ```
    编译这个命名空间文件，其实会发现就是闭包和立即执行函数。

    ```js
    /// <reference path="a.ts" />
    var Shape;
    (function (Shape) {
        function circle(x) {
            return Math.PI * Math.pow(x, 2);
        }
        Shape.circle = circle;
    })(Shape || (Shape = {}));
    Shape.circle(1);
    Shape.square(1);
    ```

- 给命名空间函数起别名，避免每次都要带命名空间的前缀
    ```ts
    import circle = Shape.circle
    console.log(circle(2))
    ```