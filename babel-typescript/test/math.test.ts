const math = require('../src/math')

test('add: 1+1=2', ()=>{
    expect(math.add(1,1)).toBe(2)
})

test('minus:1-2=-1',()=>{
    expect(math.minus(1,2)).toBe(-1)
})