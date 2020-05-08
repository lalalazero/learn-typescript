import $ from 'jquery'
import moduleLib from './demo-12/module-lib'
// import umdLib from './demo-12/umd-lib' // umd 类库通过全局引入，这里就不用 import
import esLib from './demo-12/es-module-lib'
import m from 'moment'

$('#app').css('color', 'red')

// 因为是全局类库，所以要在 html 文件中用 <script> 标签引入
globalLib({ x: 1 })
globalLib.doSomething()

moduleLib({ a: 'a' })
moduleLib.doSomething()

esLib({ e: 'e' })
esLib.doSomething()

// umdLib.doSomething() // 没有 import 这里 index.ts 本身是一个 module 也不能在这里用 umdLib 了
declare module 'moment' {
    export function myFunction(): void
}
m.myFunction = () => {
    console.log('moment. myFunction')
}

declare global {
    namespace globalLib {
        function doAnything(): void
    }
}

globalLib.doAnything = () => { console.log('globalLib do anything') }
globalLib.doAnything()
