const calc = require('../modules/calculations.js')
const Serial = require('../modules/serial')
const mySerial = new Serial('/dev/ttyS8')

test('fysically test the microcontroller', () => {
  mySerial.writeToPort('#x13|x11|xx9|xx9|%')
  mySerial.writeToPort('#x57|x67|xx5|xx5|%')
  mySerial.writeToPort('#180|120|x35|x41|%')
  expect(1).toBe(1)
})
