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
  //convergence is the point where the shoulder y axis comes across the x axis of the other joints(elbow, wrist)
  left.convergenceElbow = { x: left.shoulder.x, y: left.elbow.y }
  left.convergenceWrist = { x: left.shoulder.x, y: left.wrist.y }
  let right = data.right
  right.convergenceElbow = { x: right.shoulder.x, y: right.elbow.y }
  right.convergenceWrist = { x: right.shoulder.x, y: right.wrist.y }

  let sides = calculateSides(data)
  let angles = calculateDegreesObj(sides)
  return angles
}

//fixme: wrist not working very well.... probably bad data going in. also 
function calculateSides (data) {
  // arms in t pose angle = 0
  //both directions up and down are both positive between 0 and 90 because the abs funciton
  let left = data.left
  //left shoulder to elbow lengths
  let ShCoLeft = Math.abs(left.convergenceElbow.y - left.shoulder.y) // Shoulder to convergenceElbow in height
  let CoElLeft = Math.abs(left.convergenceElbow.x - left.elbow.x) // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwLeft = Math.abs(left.convergenceWrist.y - left.shoulder.y) // shoulder to convergenceWrist in height
  let CwWrLeft = Math.abs(left.convergenceWrist.x - left.wrist.x) // convergenceWrist to wrist

  let right = data.right
  //left shoulder to elbow lengths
  let SoCoRight = Math.abs(right.convergenceElbow.y - right.shoulder.y) // Shoulder to convergenceElbow in height
  let CoElRight = Math.abs(right.elbow.x - right.convergenceElbow.x) // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwRight = Math.abs(right.convergenceWrist.y - right.shoulder.y) // shoulder to convergenceWrist in height
  let CwWrRight = Math.abs(right.wrist.x - right.convergenceWrist.x) // convergenceWrist to wrist
let sides = {
    left: {
      ShCo: ShCoLeft,
      CoEl: CoElLeft,
      ShCw: ShCwLeft,
      CwWr: CwWrLeft
    },
    right: {
      ShCo: SoCoRight,
      CoEl: CoElRight,
      ShCw: ShCwRight,
      CwWr: CwWrRight
    }
  }
  return sides
}
function calculateDegreesObj (data) {
  let left = data.left
  let right = data.right
  let angles = {
    left: {
      shoulderX: calculateDegrees(left.ShCo, left.CoEl),
      //shoulderX is for the frontal 2d side movement. z is for depth that might be added later on
      //   shoulderZ:,
      elbow: calculateDegrees(left.ShCw, left.CwWr)
    },
    right: {
      shoulderX: calculateDegrees(right.ShCo, right.CoEl),
      elbow: calculateDegrees(right.ShCw, right.CwWr)
    }
  }
  return angles
}
function calculateDegrees (opposite, adjacent) {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI
}
