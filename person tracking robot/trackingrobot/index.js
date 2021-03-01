const express = require('express')
const app = express()
const appPort = 3000
const path = require('path')
const calc = require('./modules/calculations.js')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Serial = require('./modules/serial')
const mySerial = new Serial('/dev/ttyS8')
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/posenet.html'))
})
http.listen(appPort, () => {
  console.log(`Example app listening at http://localhost:${appPort}`)
})
//sockets
io.on('connection', socket => {
  socket.on('frontcam', msg => {
    let data = { ...msg }
    let angles = calc.handleCalculations(data)

    mySerial.writeToPort(calc.generateProtocolMessages(angles))
    // mySerial.writeToPort("#ls:"+angles.left.shoulderX)
  })
  socket.on('disconnect', reason => {})
})
