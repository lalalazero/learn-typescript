// 利用函数和声明空间的合并，为函数添加属性

declare function globalLib(options: globalLib.Options): void;

declare namespace globalLib {
    const version: string;
    function doSomething(): void;
    // interface 放在命名空间中，避免对全局变量的污染
    interface Options {
        [key: string]: any
    }
}