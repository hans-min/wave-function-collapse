const moduleImages = [];
const modules = [];
let grid = [];

//The number of slots is DIM * DIM
const DIM = 20;

//add the images to the moduleImages array
function preload() {
  // moduleImages[0] = loadImage("assets/pipes/blank.png");
  // moduleImages[1] = loadImage("assets/pipes/up.png");
  const path = "circuit";
  for (let i = 0; i < 13; i++) {
    moduleImages[i] = loadImage(`assets/${path}/${i}.png`);
  }
}


function setup() {
  createCanvas(400, 400);  //width, height
  createModules();
  createEmptyGrid();
}

//create modules based on the images, with all of their rotations
function createModules() {
  //Loaded and created the modules (pipes)
  // modules[0] = new Module(moduleImages[0], [0,0,0,0]);
  // modules[1] = new Module(moduleImages[1], [1,1,0,1]);
  // modules[2] = modules[1].rotate(1);
  // modules[3] = modules[1].rotate(2);
  // modules[4] = modules[1].rotate(3);

  //Loaded and created the modules (circuits)
  modules[0] = new Module(moduleImages[0], ["AAA", "AAA", "AAA", "AAA"]);
  modules[1] = new Module(moduleImages[1], ["BBB", "BBB", "BBB", "BBB"]);
  modules[2] = new Module(moduleImages[2], ["BBB", "BCB", "BBB", "BBB"]);
  modules[3] = new Module(moduleImages[3], ["BBB", "BDB", "BBB", "BDB"]);
  modules[4] = new Module(moduleImages[4], ["ABB", "BCB", "BBA", "AAA"]);
  modules[5] = new Module(moduleImages[5], ["ABB", "BBB", "BBB", "BBA"]);
  modules[6] = new Module(moduleImages[6], ["BBB", "BCB", "BBB", "BCB"]);
  modules[7] = new Module(moduleImages[7], ["BDB", "BCB", "BDB", "BCB"]);
  modules[8] = new Module(moduleImages[8], ["BDB", "BBB", "BCB", "BBB"]);
  modules[9] = new Module(moduleImages[9], ["BCB", "BCB", "BBB", "BCB"]);
  modules[10] = new Module(moduleImages[10], ["BCB", "BCB", "BCB", "BCB"]);
  modules[11] = new Module(moduleImages[11], ["BCB", "BCB", "BBB", "BBB"]);
  modules[12] = new Module(moduleImages[12], ["BBB", "BCB", "BBB", "BCB"]);

  for (let i = 2; i < 13; i++) {
    for (let j = 1; j < 4; j++) {
      modules.push(modules[i].rotate(j));
    }
  }

  //Generate the adjacency rules base on the edges 
  for (let i = 0; i < modules.length; i++) {
    modules[i].analyze(modules);
  }
}

function createEmptyGrid() {
  //Create the possibleModules array for each slot 
  //(contains all possible modules)
  let allPossibleModules = [];
  for (let i = 0; i < modules.length; i++) {
    allPossibleModules = allPossibleModules.concat(i);
  }
  //Create slot for each spot in the grid
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Slot(allPossibleModules, i);
  }
}

function collapseASlot(gridCopy) {
  //Sort the slots from most to least constrained
  gridCopy.sort((a, b) => {
    return a.possibleModules.length - b.possibleModules.length;
  });

  //Get the most constrained slots
  const lowest = gridCopy[0].possibleModules.length;
  gridCopy = gridCopy.filter(slot => {
    return slot.possibleModules.length === lowest;
  });

  //Pick a random slot and a random module from the slot's possibleModules
  const slot = random(gridCopy);
  const pick = random(slot.possibleModules);

  //If there are no more possible modules, create a new grid
  if (pick === undefined) {
    createEmptyGrid();
    return;
  }
  console.log("slot index:" + slot.index);
  console.log("slot possibleModules:" + slot.possibleModules);
  console.log("picked:" + pick);
  //change the slot.possibleModules here actually changes 
  //the grid array(check out the test.js)
  slot.possibleModules = [pick];
  slot.collapsed = true;
}

//get the intersection of two arrays, then update the possibleModules
function checkValid(possibleModules, validModules) {
  //possibleModules = possibleModules.filter(value => validModules.includes(value));
  for (let i = possibleModules.length - 1; i >= 0; i--) {
    if (!validModules.includes(possibleModules[i])) {
      possibleModules.splice(i, 1);
    }
  }
}

function makeNextGrid() {
  let nextGrid = [];
  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      let index = i * DIM + j;
      //if the slot is collapsed, copy it to the next grid
      //else propagate the effects to affected slots
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];


      } else {
        //we look at each of the possible modules around the slot
        // and deduce the corresponding valid modules for the slot
        let possibleModules = grid[index].possibleModules.slice();

        // check UP if not in the first row
        if (i > 0) {
          let up = grid[index - DIM];
          let validModules = [];

          //we look at each of the possible modules for the slot above
          for (let module of up.possibleModules) {
            //and look up all corresponding valid modules for the slot below 
            let valid = modules[module].down;
            validModules = validModules.concat(valid);
          }
          checkValid(possibleModules, validModules);
        }

        // check right if not in the last column
        if (j < DIM - 1) {
          let validModules = [];
          let right = grid[index + 1];
          for (let module of right.possibleModules) {
            let valid = modules[module].left;
            validModules = validModules.concat(valid);
          }
          checkValid(possibleModules, validModules);
        }

        // check down if not in the last row
        if (i < DIM - 1) {
          let validModules = [];
          let down = grid[index + DIM];
          for (let module of down.possibleModules) {
            let valid = modules[module].up;
            validModules = validModules.concat(valid);
          }
          checkValid(possibleModules, validModules);
        }

        // check left if not in the first column
        if (j > 0) {
          let validModules = [];
          let left = grid[index - 1];
          for (let module of left.possibleModules) {
            let valid = modules[module].right;
            validModules = validModules.concat(valid);
          }
          checkValid(possibleModules, validModules);
        }

        //console.log("final possibleModules:" + possibleModules);

        nextGrid[index] = new Slot(possibleModules, index);
      }
    }
  }

  grid = nextGrid;
  grid.forEach(slot => {
    if (slot.possibleModules.length === 1 && slot.collapsed === false) {
      slot.collapsed = true;
      console.log("slot auto collapsed index:" + slot.index);
      makeNextGrid();
    }
  });
}

function draw() {
  background(0);
  const w = width / DIM;
  const h = height / DIM;

  //Draw the grid with collapsed slots (if any) and empty rectangles
  for (let i = 0; i < DIM; i++) {
    for (let j = 0; j < DIM; j++) {
      let slot = grid[i * DIM + j];
      if (slot.collapsed) {
        image(modules[slot.possibleModules[0]].img, j * w, i * h, w, h);
      } else {
        stroke(255);
        fill(0, 0, 0);
        rect(j * w, i * h, w, h);
      }
    }
  }

  //Copy the grid, remove collapsed slots
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter(slot => {
    return !slot.collapsed;
  });
  if (gridCopy.length === 0) {
    return;
  }

  collapseASlot(gridCopy);
  makeNextGrid();

  //noLoop();
}

function mousePressed() {
  createEmptyGrid();
}