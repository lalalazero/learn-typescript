interface A {
    x: number,
    y: number,
    // y: string // 不被允许,
    foo(bar: number): number // 排列顺序 5
    foo(bar: 'a'): number  // 2
}

interface A {
    y: number,
    foo(bar: string): string, // 3
    foo(bar: number[]): number[] // 4
    foo(bar: 'b'): number // 1
}

let a1: A = {
    x: 1,
    y: 2,
    z: 3, // 在 merge-2.ts 中定义,
    foo(bar: any) { return bar }
}