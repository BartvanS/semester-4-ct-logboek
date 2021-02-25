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
http.listen(appPort, () => {
  console.log(`Example app listening at http://localhost:${appPort}`)
})

//sockets
io.on('connection', socket => {
  console.log('socket connected')
  socket.on('frontcam', msg => {
    let data = { ...msg }
    let angles = handleCalculations(data)
    console.log(angles)
  })
  socket.on('disconnect', reason => {
    console.log('socket disconnected')
  })
})
function handleCalculations (data) {
  let left = data.left
  let right = data.right
  left.convergenceElbow = { x: left.shoulder.x, y: left.elbow.y }
  right.convergenceElbow = { x: right.shoulder.x, y: right.elbow.y }
  let sides = calculateSides(data)
  let angles = calculateDegreesObj(sides)
  return angles
}

function calculateSides (data) {
  // arms in t pose angle = 0
  //both directions up and down are both positive between 0 and 90 because the abs funciton
  //Math.abs() if it needs to be always a positive number
  let left = data.left
  let ShCoLeft = Math.abs(left.convergenceElbow.y - left.shoulder.y); // Shoulder convergenceElbow
  let CoElLeft = Math.abs(left.convergenceElbow.x - left.elbow.x); // convergenceElbow Elbow
  let right = data.right;
  let SoCoRight = Math.abs(right.convergenceElbow.y - right.shoulder.y);
  let CoElRight = Math.abs(right.elbow.x - right.convergenceElbow.x);
  let sides = {
    left: {
      ShCo: ShCoLeft,
      CoEl: CoElLeft
    },
    right: {
      ShCo: SoCoRight,
      CoEl: CoElRight
    }
  }
  return sides
}
function calculateDegreesObj (data) {
  let left = data.left
  let right = data.right
  let angles = {
    left: {
      shoulderX: calculateDegrees(left.ShCo, left.CoEl)
      //shoulderX is for the frontal 2d side movement. z is for depth that might be added later on
      //   shoulderZ:,
      //   elbow: calculateDegrees(left.elbow.x, left.elbow.y)
    },
    right: {
      shoulderX: calculateDegrees(right.ShCo, right.CoEl)
      //   elbow: calculateDegrees(right.elbow.x, right.elbow.y)
    }
  }
  return angles
}
function calculateDegrees (opposite, adjacent) {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI
}
