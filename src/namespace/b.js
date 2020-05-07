/// <reference path="a.ts" />
var Shape;
(function (Shape) {
    function circle(x) {
        return Math.PI * Math.pow(x, 2);
    }
    Shape.circle = circle;
})(Shape || (Shape = {}));
console.log(Shape.circle(1));
console.log(Shape.square(1));
var circle = Shape.circle;
console.log(circle(2));
