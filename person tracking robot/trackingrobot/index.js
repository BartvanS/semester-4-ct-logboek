const express = require('express')
const app = express()
const appPort = 3000
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const calc = require('./modules/calculations.js')
const Serial = require("./modules/serial") 
const mySerial = new Serial("/dev/ttyS8")
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/posenet.html'))
})
http.listen(appPort, () => {
  console.log(`Example app listening at http://localhost:${appPort}`)
})

//sockets
io.on('connection', socket => {
  console.log('socket connected')
  socket.on('frontcam', msg => {
    let data = { ...msg }
    let angles = calc.handleCalculations(data)
    console.log(angles)
	mySerial.writeToPort("HIGH\n")
	setTimeout(function(){
		mySerial.writeToPort("LOW\n");
	}, 500);
  })
  socket.on('disconnect', reason => {
    console.log('socket disconnected')
  })
})
