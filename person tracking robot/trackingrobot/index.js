const express = require('express')
const app = express()
const appPort = 3000
const path = require('path')
const calc = require('./modules/calculations.js')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const Serial = require('./modules/serial')
const mySerial = new Serial('com3')
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/posenet.html'))
})
http.listen(appPort, () => {
  console.log(`local server: http://localhost:${appPort}`)
})
//sockets

io.on('connection', socket => {
  socket.on('frontcam', msg => {
    let data = { ...msg }
    let angles = calc.handleCalculations(data)
    let message = calc.generateProtocolMessages(angles);
    console.log(message);
    mySerial.writeToPort(message)
  })
  socket.on('disconnect', reason => {})
})
