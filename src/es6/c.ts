import { a, b, c } from './a' // 批量导入
import { P } from './a' // 导入接口
import { f as F } from './a' // 导入起别名
import * as All from './a' // 导入所有成员，绑定在 All 上
import myFunction from './a' // 导入默认

console.log(a, b, c)

console.log(All) // All 上有一个 default 属性

let p: P = {
    x: 1,
    y: 1
}
