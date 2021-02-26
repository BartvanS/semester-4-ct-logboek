const SerialPort = require('serialport')
const calc = require('./calculations.js')

// Open errors will be emitted as an error event
module.exports = class Serial {
  constructor (portPath) {
    this.portPath = portPath
    this.port = new SerialPort('/dev/ttyS8', error => {
      if (error) {
        return console.log('Error: ', error.message)
      }
    })
    this.port.on('error', function (err) {
      console.log('Error: ', err.message)
    })
  }

  writeToPort (message) {
    this.port.write(message, function (err) {
      if (err) {
        return console.log('Error on write: ', err.message)
      }
      console.log('written message: ' + message)
    })
  }
}
