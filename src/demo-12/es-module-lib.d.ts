declare function esModuleLib(options: Options): void

declare namespace esModuleLib {
    const version: string
    function doSomething(): void
}

interface Options {
    [key: string]: any
}
export = esModuleLib