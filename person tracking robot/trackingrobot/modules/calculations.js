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
      shoulderX: calculateDegreesFormatted(left.ShCo, left.CoEl) + 90,
      //shoulderX is for the frontal 2d side movement. z is for depth that might be added later on
      //   shoulderZ:,
      elbow: calculateDegreesFormatted(left.ShCw, left.CwWr) + 90
    },
    right: {
      shoulderX: calculateDegreesFormatted(right.ShCo, right.CoEl) + 90,
      elbow: calculateDegreesFormatted(right.ShCw, right.CwWr) + 90
    }
  }
  return angles
}
function calculateDegreesFormatted (opposite, adjacent) {
  return formatDegree(calculateDegrees(opposite, adjacent))
}
function calculateDegrees (opposite, adjacent) {
  return Math.round((Math.atan(opposite / adjacent) * 180) / Math.PI)
}

function formatDegree (degree) {
  let format = ""
  if (degree < 100) {
    format = "x" + degree
  }
  if (degree < 10) {
    format = "xx" + degree
  } else {
    format = degree
  }
  console.log(format);
  return format
}

module.exports = {
  handleCalculations: data => handleCalculations(data),
  formatDegree: degree => formatDegree(degree)
}
