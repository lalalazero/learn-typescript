let c1 = require('./a.node')
let c2 = require('./b.node')
let c3 = require('../es6/a')
import c4 from '../es6/d' // 等同于 import c4 from '../es6/d'

console.log(c1)
console.log(c2)
c3.default()
c4()