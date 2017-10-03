/*
  Make code: (∩°-°)⊃━ ☆ﾟ.*･｡ﾟ
*/

'use strict';

import {default as DirectedGraph} from './DirectedGraph.js';
import {default as Multigraph} from './Multigraph.js';
import {default as LinkedList} from './LinkedList.js';
import {randomInt, testForPointInSegment, point2D} from './Utils.js';

class RoadSystem extends Multigraph {
  constructor(points) {
    super();
    this.points = points;
    this.reversedList = {};
  }
  
  createReversed() {
    this.vertices.forEach(vertex => {
      this.reversedList[vertex] = new Map();
    });
  }
  
  addReveredEdge(firstVertex, secondVertex, weight) {
    this.reversedList[firstVertex].set(secondVertex, weight);
  }
  
  getRandomEdge(vertexId) {
    return this.vertexEdges(vertexId).getKeytPosition(randomInt(0, this.vertexEdgesNumber(vertexId)));
  }
  
  debug() {
    for (let vertex = 0; vertex < this.points.length; vertex++) {
      console.log(`Current point: ${vertex}`);
      console.log('Coming to this point: ', this.reversedList[vertex]);
      console.log('Leaving this point: ', this.vertexEdges(vertex));
    }
  }

  addLane() {
    /*
      Solution: make the directed graph a directed multigraph
      in order to support multiple lanes between two points.
      This way traffic on different lanes can be controlled in
      different manners:
        1.) Control the shortest path between two points
            by directly knowing how many cars are on each
            each between those two points
        2.) Being able to add different traffic directions
            between two points. Up/down maybe.
            
      How to implement this solution:
      Getting road info: A -> B or B -> A, A(x, y) and B(x, y)
      TODO:
        - Modify the DirectedGraph class to support directed multigraph
        (between each two vertices can exist more than one directed edge)
        A -> B (1), A -> B (2), A -> B (3), ...
        - Mofidy the Road class to support lanes and drawing points.
        We will still use the start/end points to determine the lanes' edges
        but the drawing points will be totally different.
        Interior angle of the shape -> uppper road
        Exterior angle of the shape -> down road going in the opposite direction
        - Modify the RoadSystem and add addLane/addLanes method
      For each lane:
        (A, B) or (B, A) for (start, end) road coordinates
        After getting the road info do the following
        - for roads going up adjust the drawing point a little bit harder
        (viceversa for the down roads)
        - get the number of lanes for each direction of the road
        (A -> B and B -> A)
        - for each lane in each direction add the lanes (look up the drawing 
        in the notebook)
        Iterate through vertices
        - for edges entering the vertex modify the lane ending points
        - for edges leaving the vertex modify the lane starting points
          Note: starting/ending points are the drawing points for each lane
        After you got the basic lanes(A->B || B->A) call the addLanes method
        in the RoadSystem to add the lanes(edges) to the graph.
    */
  }
  
  drawRoads() {
    for (let road = 0; road < this.points.length; road++) {
      const roadLanes = this.vertexEdges(road);
      
      for (const [_, lanes] of roadLanes) {
        if (lanes.size === 0) {
          continue;
        }

        const generator = lanes.generate();
        let currentLane = generator.next();
        
        while (currentLane.done === false) {
          currentLane.value.data.draw();
          currentLane = generator.next();
        } 
      }
    }
  }

  updateCars() {
    for (let road = 0; road < this.points.length; road++) {
      const roadLanes = this.vertexEdges(road);
      
      for (const [neighborVertex, lanes] of roadLanes) {
        if (lanes.size === 0) {
          continue;
        }

        const generator = lanes.generate();
        let currentLane = generator.next();
        
        while (currentLane.done === false) {
          const lane = currentLane.value.data;
          const {start, end} = lane;
          
          lane.adaptSpeed();
          for (const car of lane.cars) {
            car.draw(lane.slope, lane.lanesInfo);
  
            if (!testForPointInSegment(car.position, {start, end})) {
              lane.deleteCar(car);
              if (this.vertexEdgesNumber(neighborVertex) > 0) {
                const nextVertex = this.getRandomEdge(neighborVertex);
                const nextRoad = this.getEdge(neighborVertex, nextVertex);
                const nextLane = nextRoad.head.data;
                
                car.position = nextLane.start;
                nextLane.addCar(car);
              }
            }
          }

          currentLane = generator.next();
        } 
      }
    }
  }
}

export default RoadSystem;