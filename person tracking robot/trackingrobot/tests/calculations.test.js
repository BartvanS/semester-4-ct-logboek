const calc = require('../modules/calculations')

test('tests if the protocol generator generates the desired result', () => {
  let angles = {
    left: {
      SX: calc.formatDegree(80),
      EX: calc.formatDegree(40)
    },
    right: {
      SX: calc.formatDegree(30),
      EX: calc.formatDegree(10)
    }
  }
  let data = calc.generateProtocolMessages(angles)
  expect(data).toBe('#x80|x40|x30|x10|%')
  //   expect(data.left).toBe("#lx80|x40|%")
  //   expect(data.right).toBe("#rx30|x10|%")
})

test('tests if the protocol generator returns failed with missing data', () => {
  let angles
  let data = calc.generateProtocolMessages(angles)
  expect(data).toBe(-1)
})
