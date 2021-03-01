//abbreviations are based on the view from the front of a person
//up down is noted as for plans i tend to include side view of a person so forward backwards
let abbreviations = {
  SX: 'shoulderX', //shoulder up down
  EX: 'elbowX' //elbow up down
}
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

function calculateSides (data) {
  // arms in down 0 deg up 180 deg

  let left = data.left
  //left shoulder to elbow lengths
  let ShCoLeft = left.convergenceElbow.y - left.shoulder.y // Shoulder to convergenceElbow in height
  let CoElLeft = left.convergenceElbow.x - left.elbow.x // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwLeft = left.convergenceWrist.y - left.shoulder.y // shoulder to convergenceWrist in height
  let CwWrLeft = left.convergenceWrist.x - left.wrist.x // convergenceWrist to wrist

  let right = data.right
  //left shoulder to elbow lengths
  let SoCoRight = right.convergenceElbow.y - right.shoulder.y // Shoulder to convergenceElbow in height
  let CoElRight = right.elbow.x - right.convergenceElbow.x // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwRight = right.convergenceWrist.y - right.shoulder.y // shoulder to convergenceWrist in height
  let CwWrRight = right.wrist.x - right.convergenceWrist.x // convergenceWrist to wrist
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
      SX: calculateDegreesFormatted(left.ShCo, left.CoEl),
      EX: calculateDegreesFormatted(left.ShCw, left.CwWr)
    },
    right: {
      SX: calculateDegreesFormatted(right.ShCo, right.CoEl),
      EX: calculateDegreesFormatted(right.ShCw, right.CwWr)
    }
  }
  return angles
}
function calculateDegreesFormatted (opposite, adjacent) {
  return formatDegree(calculateDegrees(opposite, adjacent))
}
function calculateDegrees (opposite, adjacent) {
  return Math.round((Math.atan(opposite / adjacent) * 180) / Math.PI) + 90
}

//fixme: iets gaat hier fout bij het formatteren
function formatDegree (degree) {
  if (degree < 0) {
    return 0
  }
  let format = ''
  if (degree < 10) {
    format = 'xx' + degree
  } else if (degree < 100) {
    format = 'x' + degree
  } else {
    format = degree
  }
  return format
}
let startByte = '#'
let endByte = '%'
let delimiter = '|'
function generateProtocolMessages (angles) {
  if (angles == undefined || angles == null) {
    return -1
  }
  let message = startByte
  Object.keys(angles).forEach(key => {
    let joint = angles[key]
    Object.keys(joint).forEach(abbr => {
      message += joint[abbr] + delimiter
    })
  })
  message += endByte
  return message
  //   let msgs = {
  //     left: startByte + 'l',
  //     right: startByte + 'r'
  //   }

  //   //angles containing the objects left and right
  //   Object.keys(angles).forEach(key => {
  //     //loop through the values. Look at the variable abbreviations for more info
  //     let joint = angles[key]
  //     Object.keys(joint).forEach(abbr => {
  //     //   msgs[key] += abbr + ':' + joint[abbr] + delimiter
  //       msgs[key] += joint[abbr] + delimiter
  //     })
  //   })
  //   Object.keys(msgs).forEach(key => {
  //     msgs[key] += endByte
  //   })
  //   return msgs
}

module.exports = {
  handleCalculations: data => handleCalculations(data),
  formatDegree: degree => formatDegree(degree),
  generateProtocolMessages: angles => generateProtocolMessages(angles)
}
