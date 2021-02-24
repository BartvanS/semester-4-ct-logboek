const express = require('express')
const app = express()
const appPort = 3000
const path = require('path')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyS8', error => {
  if (error) {
    return console.log('Error: ', error.message)
  }
})

let msg = 'kaas\n'
port.write(msg, function (err) {
  if (err) {
    return console.log('Error on write: ', err.message)
  }
  console.log('written message: ' + msg)
})
// Open errors will be emitted as an error event
port.on('error', function (err) {
  console.log('Error: ', err.message)
})

app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/posenet.html'))
})

//sockets
io.on('connection', socket => {
  console.log('socket connected')
  socket.on('frontcam', msg => {
    let data = { ...msg }
   let degrees = calculateDegrees(data)

    console.log(degrees)
  })
  socket.on('disconnect', reason => {
    console.log('socket disconnected')
  })
})

http.listen(appPort, () => {
  console.log(`Example app listening at http://localhost:${appPort}`)
})

function calculateDegrees (data) {
  let coordinates = calculateConvergence(data)
  let distances = calculateDistances(coordinates)
  //todo: degrees....
  return distances;
}
function calculateConvergence (data) {
  let left = data.left
  let right = data.right
  //calculate convergence point
  left.convergence = { x: left.shoulder.x, y: left.elbow.y }
  right.convergence = { x: right.shoulder.x, y: right.elbow.y }
  return data;
}
function calculateDistances (coordinates) {
	//fixme:.... im so tired
  let left = coordinates.left
  let scLeft = left.convergence.y - left.shoulder.y
  let ceLeft = left.convergence.x - left.elbow.x
  let seLeft = Math.sqrt(
    left.shoulder.x * left.shoulder.x + left.elbow.x * left.elbow.x
  )
//todo: right
//   let right = coordinates.right
//   let scRight = right.convergence.y - right.shoulder.y


  let distances = {
    left: {
      sc: scLeft,
	  ce: ceLeft,
	  se: seLeft,
    },
    right: {}
  }
  return distances;
}
