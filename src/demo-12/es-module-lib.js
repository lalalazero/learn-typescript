const esModuleLib = options => console.log(options)

const doSomething = () => console.log('es-module-lib do something')

esModuleLib.doSomething = doSomething
esModuleLib.version = '1.0'

export default esModuleLib

