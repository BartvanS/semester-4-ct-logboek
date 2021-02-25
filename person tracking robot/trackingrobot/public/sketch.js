// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video
let poseNet
let poses = []

function setup () {
  //socket setup:
  var socket = io()

  //ml5 setup
  createCanvas(640, 480)
  video = createCapture(VIDEO)
  video.size(width, height)

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(
    video,
    {
      detectionType: 'single',
      minConfidence: 0.9,
      scoreThreshold: 0.9,
    },
    modelReady
  )
  //   poseNet.
  // This sets up an event that fills the global variable "poses"
  //// with an array every time new poses are detected
  var count = 0
  poseNet.on('pose', function (results) {
    //as i dont know how to slow this down i temperarly use this count hack
    if (count >= 50) {
      let poseList = results[0].pose
      console.log(results)
      //updates the poses field for the canvas drawing
      poses = results
      //todo: kijken hoe het nou zit met die coordinaten, begint het van linksboven of zit het anders? convergence klopt hierdoor niet en daardoor de afstanden ook niet
      let coordinates = {
        left: {
          shoulder: {
            x: poseList.leftShoulder.x,
            y: poseList.leftShoulder.y
          },
          elbow: {
            x: poseList.leftElbow.x,
            y: poseList.leftElbow.y
          }
        },
        right: {
          shoulder: {
            x: poseList.rightShoulder.x,
            y: poseList.rightShoulder.y
          },
          elbow: {
            x: poseList.rightElbow.x,
            y: poseList.rightElbow.y
          }
        }
      }
      socket.emit('frontcam', coordinates)
      count = 0
    } else {
      count++
    }
  })

  // Hide the video element, and just show the canvas
  video.hide()
}

function modelReady () {
  select('#status').html('Model Loaded')
}

function draw () {
  image(video, 0, 0, width, height)
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints()
  drawSkeleton()
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints () {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i += 1) {
    // For each pose detected, loop through all the keypoints
    const pose = poses[i].pose
    for (let j = 0; j < pose.keypoints.length; j += 1) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      const keypoint = pose.keypoints[j]
      // Only draw an ellipse is the pose probability is bigger than 0.2
      //   if (keypoint.score > 0.9) {
      // console.log(keypoint.position.x);
      fill(255, 0, 0)
      noStroke()
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10)
      //   }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton () {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i += 1) {
    const skeleton = poses[i].skeleton
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j += 1) {
      const partA = skeleton[j][0]
      const partB = skeleton[j][1]
      stroke(255, 0, 0)
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      )
    }
  }
}
