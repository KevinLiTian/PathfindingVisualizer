/* JavaScript for Pathfinding Visualizer */

// Import all algorithms from 'algorithms.js'
import { dfs, bfs, greedy, dijkstra, astar, timer } from "./algorithms.js";

// Import Maze Generator from 'maze.js'
import { Maze } from "./maze.js";

// Total number of rows and columns of grid
const TOTAL_ROW = 20;
const TOTAL_COL = 50;

// Start point and end point of the path
const SRC = [9, 9];
const DEST = [9, 40];

// Animation Name
let ALGORITHM = "";

// Speed
let SPEED = "Fast";

// Store all pre-computed neighbors for each cell
let neighbors = {};

// Store all walls
let walls = [];

// Store all waters
let waters = [];

/* Map Algorithms names to their functions for convenient call */
const fnMap = {
  "DFS": dfs,
  "BFS": bfs,
  "Greedy": greedy,
  "Dijkstra's": dijkstra,
  "A*": astar,
};

/* Main Event Listeners */
document.addEventListener("DOMContentLoaded", function () {
  // Create Grid with boxes
  tableCreate();

  // Add click event listener to all boxes for animation
  document.querySelectorAll(".box-container").forEach((box_container) => {
    const box = box_container.children[0];
    if (box) {
      // Play Animation
      box_container.addEventListener("click", () => {
        box.style.animationPlayState = "running";
      });

      // Set Animation
      box.addEventListener("animationend", () => setBoxAnimationState(box));
    }
  });

  // Event Listeners for Visualize Button
  document
    .querySelector("#visualize")
    .addEventListener("click", selectAlgorithm);

  // Event Listeners for Clear Button
  document.querySelector("#clear").addEventListener("click", clear);

  // Event Listener for Maze Button
  document.querySelector("#maze").addEventListener("click", generateMaze);

  // Event Listeners for speed dropdown
  document.querySelectorAll(".speed-sel").forEach((speed) => {
    speed.addEventListener("click", () => {
      SPEED = speed.dataset.speed;
      let idx = document
        .querySelector("#message")
        .textContent.indexOf("Speed: ");
      if (idx !== -1) {
        document.querySelector("#message").textContent =
          document.querySelector("#message").textContent.slice(0, idx) +
          `Speed: ${SPEED}`;
      } else {
        document.querySelector("#message").textContent += ` | Speed: ${SPEED}`;
      }
    });
  });

  // Event Listeners for Algorithm dropdown
  document.querySelectorAll(".algo-sel").forEach((algo) => {
    algo.addEventListener("click", () => {
      ALGORITHM = algo.dataset.algo;
      document.querySelector("#message").innerHTML = `${ALGORITHM} Algorithm`;

      // Remove all water if ALGORITHM is BFS or DFS
      if (ALGORITHM === "BFS" || ALGORITHM === "DFS") {
        const water = document.querySelectorAll(".water-shrink");
        if (water.length > 0) {
          water.forEach((box) => {
            box.style.animationPlayState = "running";
          });
          document.querySelector(
            "#message"
          ).innerHTML = `${ALGORITHM} Algorithm | Not Weighted`;
        }
      }
    });
  });

  // Event listener for water cell animation if w key is pressed
  document.addEventListener("keydown", function (event) {
    if (event.code === "KeyW") {
      if (ALGORITHM === "")
        document.querySelector("#message").innerHTML =
          "Please Select an Algorithm First";
      else if (ALGORITHM !== "DFS" && ALGORITHM !== "BFS") {
        window.onmousedown = (evt) => {
          const target = evt.target;
          if (target.classList.contains("box-container")) {
            const box = target.children[0];
            box.className = "box";
            box.classList.add("water-stretch");
            box.dataset.animation = "water-stretch";
            box.style.animationPlayState = "running";
            document.querySelector(
              "#message"
            ).innerHTML = `${ALGORITHM} Algorithm | Water Costs 10x More`;
          }
        };
      } else
        document.querySelector(
          "#message"
        ).innerHTML = `${ALGORITHM} does not Support Weighted Path`;
    }
  });

  // Remove onmousedown event function when w key is lifted
  document.addEventListener("keyup", function (event) {
    if (event.code === "KeyW") {
      window.onmousedown = () => {};
    }
  });

  // Pre-process data
  preprocess();
});

/* Generate Maze */
async function generateMaze() {
  // Create Maze
  const maze = new Maze();
  maze.create_maze(SRC[0], SRC[1]);

  // Disable Buttons
  document.querySelector("#visualize").disabled = true;
  document.querySelector("#clear").disabled = true;
  document.querySelector("#algo-btn").disabled = true;
  document.querySelector("#maze").disabled = true;

  // Clear boxes
  document.querySelectorAll(".box-container").forEach((box_container) => {
    const box = box_container.children[0];
    if (box && box.dataset.animation.includes("shrink")) {
      box.style.animationPlayState = "running";
    }
  });

  // Draw Maze (Some fun using Random)
  if (Math.random() >= 0.5) {
    for (let i = 0; i < TOTAL_ROW; i++) {
      for (let j = 0; j < TOTAL_COL; j++) {
        // True stands for a wall && Not the destination
        if (
          maze.cells[i][j] &&
          JSON.stringify([i, j]) !== JSON.stringify(DEST)
        ) {
          const id = `${i}_${j}`;
          const box = document.getElementById(id).children[0];
          if (box) {
            box.style.animationPlayState = "running";
          }
        }

        // Delay
        await timer(0);
      }
    }
  } else {
    for (let j = 0; j < TOTAL_COL; j++) {
      for (let i = 0; i < TOTAL_ROW; i++) {
        // True stands for a wall && Not the destination
        if (
          maze.cells[i][j] &&
          JSON.stringify([i, j]) !== JSON.stringify(DEST)
        ) {
          const id = `${i}_${j}`;
          const box = document.getElementById(id).children[0];
          if (box) {
            box.style.animationPlayState = "running";
          }
        }

        // Delay
        await timer(0);
      }
    }
  }

  // Just to enforce the clear button is disabled before all animation finishes
  await timer(1000);

  // Enable all except Maze Button
  document.querySelector("#clear").disabled = false;
  document.querySelector("#visualize").disabled = false;
  document.querySelector("#algo-btn").disabled = false;
}

/* Select the algorithm to run */
async function selectAlgorithm() {
  // Haven't yet select an algorithm
  if (ALGORITHM === "") {
    document.querySelector("#message").innerHTML =
      "Please Select an Algorithm First";
  } else {
    // Call corresponding algorithm using fnMap, then draw path

    document.querySelector(
      "#message"
    ).innerHTML = `Visualizing ${ALGORITHM} Algorithm`;

    // Disable buttons
    document.querySelector("#visualize").disabled = true;
    document.querySelector("#clear").disabled = true;
    document.querySelector("#algo-btn").disabled = true;
    document.querySelector("#maze").disabled = true;

    // Call Algorithm
    const path = await fnMap[ALGORITHM]();

    // There is a valid path
    if (path) {
      document.querySelector("#message").innerHTML = "Path Found!";
      await drawPath(path);

      // No valid Path
    } else document.querySelector("#message").innerHTML = "Path Not Found!";

    // Just to enforce the clear button is disabled before all animation finishes
    await timer(1000);

    // Only Enable Clear Button
    document.querySelector("#clear").disabled = false;
  }
}

/* Draw resulting path */
async function drawPath(path) {
  // For every cell on the path
  for (let i = 0; i < path.length; i++) {
    const idx = path[i];
    const id = `${idx[0]}_${idx[1]}`;
    const box = document.getElementById(id).children[0];

    // Make sure there is a box to animate
    if (box) {
      box.className = "box";
      box.classList.add("path-stretch");
      box.dataset.animation = "path-stretch";
      box.style.animationPlayState = "running";
    }

    // Add delay between each box animation
    await timer(10);
  }
}

/* Clear everything */
function clear() {
  // Clear boxes
  document.querySelectorAll(".box-container").forEach((box_container) => {
    const box = box_container.children[0];
    if (box && box.dataset.animation.includes("shrink")) {
      box.style.animationPlayState = "running";
    }
  });

  // Clear Algorithm
  ALGORITHM = "";

  // Enable buttons
  document.querySelector("#visualize").disabled = false;
  document.querySelector("#algo-btn").disabled = false;
  document.querySelector("#maze").disabled = false;

  // Clear Message
  document.querySelector("#message").innerHTML =
    "Click on Grid to Add Wall | Click with W Key Pressed to Add Water";
}

/* Stop Animation and Set Animation Accordingly, this function is called when the animation ended */
function setBoxAnimationState(box) {
  box.style.animationPlayState = "paused";

  // If the stretch animation ended, toggle to shrink animation
  if (box.dataset.animation === "stretch") {
    box.classList.remove("stretch");
    box.classList.add("shrink");
    box.dataset.animation = "shrink";

    // If shrink animation ended, toggle to stretch animation
  } else if (box.dataset.animation === "shrink") {
    box.classList.remove("shrink");
    box.classList.add("stretch");
    box.dataset.animation = "stretch";

    // If search stretch animation ended, toggle to search shrink
  } else if (box.dataset.animation === "search-stretch") {
    box.classList.remove("search-stretch");
    box.classList.add("search-shrink");
    box.dataset.animation = "search-shrink";

    // If search shrink animation ended, toggle to stretch
  } else if (box.dataset.animation === "search-shrink") {
    box.classList.remove("search-shrink");
    box.classList.add("stretch");
    box.dataset.animation = "stretch";

    // If path stretch animation ended, toggle to path shrink
  } else if (box.dataset.animation === "path-stretch") {
    box.classList.remove("path-stretch");
    box.classList.add("path-shrink");
    box.dataset.animation = "path-shrink";

    // If path shrink animation ended, toggle to stretch
  } else if (box.dataset.animation === "path-shrink") {
    box.classList.remove("path-shrink");
    box.classList.add("stretch");
    box.dataset.animation = "stretch";

    // If water stretch animation ended, toggle to water shrink
  } else if (box.dataset.animation === "water-stretch") {
    box.classList.remove("water-stretch");
    box.classList.add("water-shrink");
    box.dataset.animation = "water-shrink";

    // If water shrink animation ended, toggle to stretch
  } else if (box.dataset.animation === "water-shrink") {
    box.classList.remove("water-shrink");
    box.classList.add("stretch");
    box.dataset.animation = "stretch";
  }

  updateWallWater();
}

/* Update which cells are walls */
function updateWallWater() {
  walls = [];
  waters = [];
  document.querySelectorAll(".box-container").forEach((box_container) => {
    const idx = box_container.id.split("_");
    const row = parseInt(idx[0]);
    const col = parseInt(idx[1]);

    const box = box_container.children[0];
    if (box) {
      if (box.dataset.animation === "shrink") {
        walls.push([row, col]);
      } else if (box.dataset.animation === "water-shrink") {
        waters.push([row, col]);
      }
    }
  });
}

/* Pre-Process Neighbors Data
For each cell with index (i, j):
neighbors[[i, j]]: [[i - 1,j], [i + 1,j], ...]]
*/
function preprocess() {
  for (let i = 0; i < TOTAL_ROW; i++) {
    for (let j = 0; j < TOTAL_COL; j++) {
      // Initialize an array for each cell
      neighbors[[i, j]] = [];

      // If not the first col, append cell with (col - 1)
      if (j > 0) {
        neighbors[[i, j]].push([i, j - 1]);
      }

      // If not the last row, append cell with (row + 1)
      if (i < TOTAL_ROW - 1) {
        neighbors[[i, j]].push([i + 1, j]);
      }

      // If not the last col, append col with (col + 1)
      if (j < TOTAL_COL - 1) {
        neighbors[[i, j]].push([i, j + 1]);
      }

      // If not the first row, append cell with (row - 1)
      if (i > 0) {
        neighbors[[i, j]].push([i - 1, j]);
      }
    }
  }
}

/* Create Grid */
function tableCreate() {
  const grid = document.querySelector("#grid");
  const tbl = document.createElement("table");
  tbl.style.borderCollapse = "collapse";
  tbl.style.width = "100%";

  for (let i = 0; i < TOTAL_ROW; i++) {
    const tr = tbl.insertRow();
    for (let j = 0; j < TOTAL_COL; j++) {
      const td = tr.insertCell();
      td.classList.add("box-container");

      // Source
      if (i === SRC[0] && j === SRC[1]) {
        td.style.backgroundColor = "#FFE2C8";
        td.style.transform = "scale(1.1)";
      }

      // Destination
      else if (i === DEST[0] && j === DEST[1]) {
        td.style.backgroundColor = "#FFC7D7";
        td.style.transform = "scale(1.1)";
      }

      // Box if not src nor destination
      else {
        const box = document.createElement("div");
        box.classList.add("box", "stretch");
        box.dataset.animation = "stretch";

        td.append(box);
      }

      // Give each cell an id for later animation reference
      td.setAttribute("id", `${i}_${j}`);
    }
  }

  // Add grid to DOM
  grid.append(tbl);
}

// Export
export { SRC, DEST, neighbors, walls, waters, TOTAL_ROW, TOTAL_COL, SPEED };
