'use strict';

function point2D(x, y) {
  return {x, y};
}

function vector2D(i, j) {
  const newObject = {i, j};
  const modulo = function() {
    return Math.sqrt(this.i * this.i + this.j * this.j);
  };
  
  Object.defineProperty(newObject, 'modulo', {
    configurable: false,
    get: modulo
  });
  
  return newObject;
}

function segmentToVector(start, end) {
  return vector2D(end.x - start.x, end.y - start.y);
}

function degreesToRad(angle) {
  return angle * Math.PI / 180;
}

function radToDegrees(angle) {
  return angle * 180 / Math.PI;
}

function angleBetween2DVectors(a, b) {
  return Math.acos(
    (a.i * b.i + a.j * b.j) / (a.modulo * b.modulo)
  ); // rads
}

function getRequestAnimationFrameFunction() {
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame  ||
          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);      
          }; 
}

function distanceBetween2DPoints(start, end) {
	return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}
  
function segmentSlope(start, end) {
  return (end.y - start.y) / (end.x - start.x);
}

function determinant2(input) {
  return input[0][0] * input[1][1] - input[0][1] * input[1][0];
}

function determinant3(input) {
  /*
    0,0 0,1 0,2
    1,0 1,1 1,2
    2,0 2,1 2,2
  */
  
  return (
    input[0][0] * input[1][1] * input[2][2] +
    input[0][1] * input[1][2] * input[2][0] +
    input[1][0] * input[2][1] * input[0][2] - 
    input[2][0] * input[1][1] * input[0][2] - 
    input[0][0] * input[2][1] * input[1][2] - 
    input[2][2] * input[1][0] * input[0][1]
  );
}

function testForColiniarity(A, B, C) {
  const result = determinant3([
    [A.x, A.y, 1],
    [B.x, B.y, 1],
    [C.x, C.y, 1],
  ]);
  
  if (result !== 0)
    console.log(`Determinant not 0: ${result}`, A, B);
  
  return Math.abs(result) < 1e-10;
}


function testForPointInSegment(point, segment) {
  if (distanceBetween2DPoints(point, segment.start) + distanceBetween2DPoints(point, segment.end) === distanceBetween2DPoints(segment.start, segment.end)) {
    return true;
  }
  
  return false;
}

export {
  point2D, distanceBetween2DPoints,
  getRequestAnimationFrameFunction, 
  vector2D, angleBetween2DVectors, segmentToVector,
  degreesToRad, radToDegrees,
  segmentSlope, testForColiniarity, testForPointInSegment
};