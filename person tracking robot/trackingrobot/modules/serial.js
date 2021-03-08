const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
// Open errors will be emitted as an error event
module.exports = class Serial {
  constructor (portPath) {
    this.portPath = portPath
    this.port = new SerialPort(this.portPath, error => {
      if (error) {
        return console.log('Error: ', error.message)
      }
    })
    this.port.on('error', function (err) {
      console.log('Error: ', err.message)
    })

    this.port.on('readable', function () {
      console.log('Data:', port.read())
    })

    // Switches the port into "flowing mode"
    this.port.on('data', function (data) {
      console.log('Data:', data)
    })

    // Pipe the data into another stream (like a parser or standard out)
    const lineStream = this.port.pipe(new Readline())
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
