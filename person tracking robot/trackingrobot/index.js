const express = require('express')
const app = express()
const appPort = 3000
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

// const SerialPort = require('serialport');
// const port = new SerialPort('/dev/ttyS8');

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/posenet.html'))
})

//sockets
io.on('connection', socket => {
	console.log("socket connected");
  socket.on('frontcam', msg => {
    console.log(msg)
    // io.emit('chat message', msg)
  })
  socket.on("disconnect", (reason) => {
    console.log("socket disconnected")
  });
})

// app.listen(appPort, () => {
//   console.log(`Example app listening at http://localhost:${appPort}`)
// })
http.listen(appPort, () => {
	console.log(`Example app listening at http://localhost:${appPort}`)
  });
