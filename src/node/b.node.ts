// exports = module.exports
// 导出多个对象
exports.c = 3
exports.d = 4
module.exports = {}
// exports = {}
// commonjs 顶级导出和次级导出不可共存，所以不能写 exports.default = {}
// module.exports = {} 会覆盖 exports.c 和 exports.d
// exports = {} 不会覆盖，太神奇了