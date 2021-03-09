//abbreviations are based on the view from the front of a person
//up down is noted as for plans i tend to include side view of a person so forward backwards
let abbreviations = {
  SX: "shoulderX", //shoulder up down
  EX: "elbowX", //elbow up down
};
function handleCalculations(data) {
  let left = data.left;
  //convergence is the point where the shoulder y axis comes across the x axis of the other joints(elbow, wrist)
  left.convergenceElbow = { x: left.shoulder.x, y: left.elbow.y };
  left.convergenceWrist = { x: left.elbow.x, y: left.wrist.y };
  let right = data.right;
  right.convergenceElbow = { x: right.shoulder.x, y: right.elbow.y };
  right.convergenceWrist = { x: right.elbow.x, y: right.wrist.y };
  let sides = calculateSides(data);
  //z is the direction the arm is turned. for now that is up or down. in future it may be forward positions
  let shoulderZData = {
    left: "xx0",
    right: "xx0",
  };
  if (left.wrist.y < left.shoulder.y) {
    shoulderZData.left = "x90";
  }
  if (right.wrist.y < right.shoulder.y) {
    shoulderZData.right = "x90";
  }
  let angles = calculateDegreesObj(sides, shoulderZData);
  return angles;
}

function calculateSides(data) {
  // arms in down 0 deg up 180 deg

  let left = data.left;
  //left shoulder to elbow lengths
  let ShCoLeft = left.convergenceElbow.y - left.shoulder.y; // Shoulder to convergenceElbow in height
  let CoElLeft = left.convergenceElbow.x - left.elbow.x; // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwLeft = left.convergenceWrist.y - left.shoulder.y; // shoulder to convergenceWrist in height
  let CwWrLeft = left.convergenceWrist.x - left.wrist.x; // convergenceWrist to wrist

  let right = data.right;
  //left shoulder to elbow lengths
  let SoCoRight = right.convergenceElbow.y - right.shoulder.y; // Shoulder to convergenceElbow in height
  let CoElRight = right.elbow.x - right.convergenceElbow.x; // convergenceElbow to Elbow
  //left elbow to wrist lenghts
  let ShCwRight = right.convergenceWrist.y - right.shoulder.y; // shoulder to convergenceWrist in height
  let CwWrRight = right.wrist.x - right.convergenceWrist.x; // convergenceWrist to wrist
  let sides = {
    left: {
      ShCo: ShCoLeft,
      CoEl: CoElLeft,
      ShCw: ShCwLeft,
      CwWr: CwWrLeft,
    },
    right: {
      ShCo: SoCoRight,
      CoEl: CoElRight,
      ShCw: ShCwRight,
      CwWr: CwWrRight,
    },
  };
  return sides;
}
function calculateDegreesObj(sides, shoulderZData) {
  let left = sides.left;
  let right = sides.right;
  let lsx = calculateDegree(left.ShCo, left.CoEl) + 90;
  let rsx = calculateDegree(right.ShCo, right.CoEl) + 90;
  //math.abs to make sure there are no negative degrees
  let angles = {
    left: {
      SX: formatDegree(lsx),
      SZ: shoulderZData.left,
      EX: formatDegree(
        Math.abs(90 - lsx - calculateDegree(left.ShCw, left.CwWr))
      ),
    },
    right: {
      SX: formatDegree(rsx),
      SZ: shoulderZData.right,
      EX: formatDegree(
        Math.abs(90 - (rsx - calculateDegree(right.ShCw, right.CwWr)))
      ),
    },
  };
  return angles;
}
function calculateDegree(opposite, adjacent) {
  return Math.round((Math.atan(opposite / adjacent) * 180) / Math.PI);
}
function formatDegree(degree) {
  if (degree < 0) {
    return 0;
  }
  let format = "";
  if (degree < 10) {
    format = "xx" + degree;
  } else if (degree < 100) {
    format = "x" + degree;
  } else {
    format = degree;
  }
  return format;
}
let startByte = "#";
let endByte = "%";
let delimiter = "|";
function generateProtocolMessages(angles) {
  if (angles == undefined || angles == null) {
    return -1;
  }
  let message = startByte;
  Object.keys(angles).forEach((key) => {
    let joint = angles[key];
    Object.keys(joint).forEach((abbr) => {
      message += joint[abbr] + delimiter;
    });
  });
  message += endByte;
  return message;
}

module.exports = {
  handleCalculations: (data) => handleCalculations(data),
  formatDegree: (degree) => formatDegree(degree),
  generateProtocolMessages: (angles) => generateProtocolMessages(angles),
};
