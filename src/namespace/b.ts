/// <reference path="a.ts" />

namespace Shape {
    export function circle(x: number) {
        return Math.PI * x ** 2
    }
}

console.log(Shape.circle(1))
console.log(Shape.square(1))

import circle = Shape.circle
console.log(circle(2))