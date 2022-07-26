/* JavaScript for Pathfinding Visualizer */

import { dfs, bfs, greedy, dijkstra, astar, timer } from './algorithms.js';

const TOTAL_ROW = 20;
const TOTAL_COL = 50;
const SRC = [9, 5];
const DEST = [9, 44];
var ALGORITHM = '';
var neighbors = {};
var walls = [];

const fnMap = {
    "DFS": dfs,
    "BFS": bfs,
    "greedy": greedy,
    "Dijkstra's": dijkstra,
    "A*": astar
};

document.addEventListener('DOMContentLoaded', function () {

    // Create Grid with boxes
    tableCreate();

    // Add click event listener to all boxes for animation
    document.querySelectorAll('.box-container').forEach((box_container) => {
        const box = box_container.children[0];
        if (box) {
            // Play Animation
            box_container.addEventListener('click', () => {
                updateWalls(box_container);
                box.style.animationPlayState = 'running';
            });

            // Set Animation
            box.addEventListener('animationend', () => setBoxAnimationState(box));
        }
    });

    // Pre-process data
    preprocess();

    // Event Listeners for Visualize Button
    document.querySelector('#visualize').addEventListener('click', selectAlgorithm);

    // Event Listeners for Clear Button
    document.querySelector('#clear').addEventListener('click', clear);

    // Event Listeners for four Algorithm Buttons
    document.querySelectorAll('.dropdown-item').forEach(algo => {
        algo.addEventListener('click', () => {
            ALGORITHM = algo.dataset.algo;
            document.querySelector('#message').innerHTML = `${ALGORITHM} Algorithm`
        });
    });
});


/* Update which cells are walls */
function updateWalls(box_container) {
    // id = 'row_col'
    const idx = box_container.id.split(/[_]/);
    const row = parseInt(idx[0]);
    const col = parseInt(idx[1]);
    const box = box_container.children[0];

    // Add wall
    if (box.dataset.animation === 'stretch') {
        walls.push([row, col]);

    } else if (box.dataset.animation === 'shrink') { // Remove wall
        const index = JSON.stringify(walls).indexOf(JSON.stringify([row, col]));
        console.log(index);
        if (index != -1) { // only splice array when item is found
            walls.splice(index - 1, 1); // 2nd parameter means remove one item only
        }
    }
}


/* Select the algorithm to run */
async function selectAlgorithm() {
    if (ALGORITHM === '') {
        document.querySelector('#message').innerHTML = 'Please Select an Algorithm First';
    }
    else {
        document.querySelector('#message').innerHTML = `Visualizing ${ALGORITHM} Algorithm`;
        document.querySelector('#visualize').disabled = true;
        document.querySelector('#clear').disabled = true;
        document.querySelector('#algo-btn').disabled = true;
        const path = await fnMap[ALGORITHM]();

        if (path) {
            document.querySelector('#message').innerHTML = 'Path Found!';
            await drawPath(path);

        } else document.querySelector('#message').innerHTML = 'Path Not Found!';

        await timer(1000);
        document.querySelector('#clear').disabled = false;
    }
}


async function drawPath(path) {
    for (let i = 0; i < path.length; i++) {
        const idx = path[i];
        const id = `${idx[0]}_${idx[1]}`;
        const box = document.getElementById(id).children[0];
        if (box) {
            box.classList.remove('search-shrink');
            box.classList.add('path-stretch');
            box.dataset.animation = 'path-stretch';
            box.style.animationPlayState = 'running';
        }

        await timer(10);
    }
}


/* Clear everything */
function clear() {

    // Clear boxes
    document.querySelectorAll('.box-container').forEach(box_container => {
        const box = box_container.children[0];
        if (box && (box.dataset.animation === 'shrink' || box.dataset.animation === 'search-shrink' || box.dataset.animation === 'path-shrink')) {
            box.style.animationPlayState = 'running';
        }
    });

    // Clear wall data
    walls = [];

    // Clear Algorithm
    ALGORITHM = '';

    // Enable buttons
    document.querySelector('#visualize').disabled = false;
    document.querySelector('#algo-btn').disabled = false;

    // Clear Message
    document.querySelector('#message').innerHTML = 'Click on Grid to Add Wall';
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


/* Stop Animation and Set Animation Accordingly */
function setBoxAnimationState(box) {

    box.style.animationPlayState = 'paused';

    // Toggle between Stretch & Shrink
    if (box.dataset.animation === 'stretch') {
        box.classList.remove('stretch');
        box.classList.add('shrink');
        box.dataset.animation = 'shrink';

    } else if (box.dataset.animation === 'shrink') {
        box.classList.remove('shrink');
        box.classList.add('stretch');
        box.dataset.animation = 'stretch';

    } else if (box.dataset.animation === 'search-stretch') {
        box.classList.remove('search-stretch');
        box.classList.add('search-shrink');
        box.dataset.animation = 'search-shrink';

    } else if (box.dataset.animation === 'search-shrink') {
        box.classList.remove('search-shrink');
        box.classList.add('stretch');
        box.dataset.animation = 'stretch';

    } else if (box.dataset.animation === 'path-stretch') {
        box.classList.remove('path-stretch');
        box.classList.add('path-shrink');
        box.dataset.animation = 'path-shrink';

    } else if (box.dataset.animation === 'path-shrink') {
        box.classList.remove('path-shrink');
        box.classList.add('stretch');
        box.dataset.animation = 'stretch';
    }
}


/* Create Grid */
function tableCreate() {
    const grid = document.querySelector('#grid');
    const tbl = document.createElement('table');
    tbl.style.borderCollapse = 'collapse';
    tbl.style.width = '100%';

    for (let i = 0; i < TOTAL_ROW; i++) {
        const tr = tbl.insertRow();
        for (let j = 0; j < TOTAL_COL; j++) {
            const td = tr.insertCell();
            td.classList.add('box-container');

            // Source
            if (i === 9 && j === 5) {
                td.style.backgroundColor = '#FFE2C8';
            }

            // Destination
            else if (i === 9 && j === 44) {
                td.style.backgroundColor = '#FFC7D7';
            }

            // Box
            else {
                const box = document.createElement('div');
                box.classList.add('box', 'stretch');
                box.dataset.animation = 'stretch';

                td.append(box);
            }

            td.setAttribute('id', `${i}_${j}`);
        }
    }
    grid.append(tbl);
}

export { SRC, DEST, neighbors, walls };