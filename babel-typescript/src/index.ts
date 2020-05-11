class A {
    a: number = 1
}

const { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 }
const n = { x, y, ...z}

// n = 1