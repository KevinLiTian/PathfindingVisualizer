/* JavaScript for Pathfinding Visualizer */

const TOTAL_ROW = 20;
const TOTAL_COL = 50;
const SRC = [9, 5];
const DEST = [9, 44];
var ALGORITHM = '';
var walls = [];

const fnMap = {
    'DFS': dfs,
    'BFS': bfs,
    'Greedy': greedy,
    'Dijkstra\'s': dijkstra,
    'A*': astar
};

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms));

/* Search Algo Node */
class Node {
    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
    }
}

/* ----------------------------- Interactions -------------------------- */

document.addEventListener('DOMContentLoaded', function () {

    // Create Grid with boxes
    tableCreate();

    // Add click event listener to all boxes for animation
    document.querySelectorAll('.box-container').forEach((box_container) => {
        const box = box_container.children[0];
        if (box) {
            // Play Animation
            box_container.addEventListener('click', () => {
                box.style.animationPlayState = 'running';
                updateWalls(box_container.id);
            });

            // Set Animation
            box.addEventListener('animationend', () => setBoxAnimationState(box));
        }
    });

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
function updateWalls(id) {
    // id = 'row_col'
    const idx = id.split(/[_]/);
    walls.push([idx[0], idx[1]]);
}


/* Select the algorithm to run */
function selectAlgorithm() {
    if (ALGORITHM === '') {
        document.querySelector('#message').innerHTML = 'Please Select an Algorithm First';
    }
    else {
        document.querySelector('#message').innerHTML = `Visualizing ${ALGORITHM} Algorithm`;
    }
}


/* Clear everything */
function clear() {
    // Clear boxes
    document.querySelectorAll('.box-container').forEach(box_container => {
        const box = box_container.children[0];
        if (box && box.dataset.animation === 'shrink') {
            box.style.animationPlayState = 'running';
        }
    });

    // Clear wall data
    walls = [];

    // Clear Message
    document.querySelector('#message').innerHTML = 'Click on Grid to Add Wall';
}


/* Stop Animation and Set Animation Accordingly */
function setBoxAnimationState(box) {

    box.style.animationPlayState = 'paused';

    // Toggle between Stretch & Shrink
    if (box.dataset.animation === 'stretch') {
        box.classList.remove('stretch');
        box.classList.add('shrink');
        box.dataset.animation = 'shrink';
    } else {
        box.classList.remove('shrink');
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


/* -------------------------- Algorithms ----------------------------- */

async function dfs() {

    // Store all nodes to be traversed
    let stackFrontier = [];
    stackFrontier.push(new Node(SRC, null));

    // Store all searched nodes to prevent infinite search
    let searched = [];

    // Traverse until no node can be found
    while (stackFrontier.length != 0) {

        // Search the next node
        let curNode = stackFrontier.pop();
        searched.push(curNode.state);

        // Check if current node is the destination
        if (JSON.stringify(curNode.state) === JSON.stringify(DEST)) {
            return backTrack(curNode);
        }

        animateSearch(curNode.state);

        // Push all the neighbors of current node
        findNeighbors(curNode.state, 'dfs').forEach(idx => {
            if (!exists(searched, idx)) {
                stackFrontier.push(new Node(idx, curNode));
            }
        })
        await timer(50);
    }

    return null;
}


function bfs() {

}


function greedy() {

}


function dijkstra() {

}


function astar() {

}


/* --------------------------- Utils ---------------------------- */

/* Backtrack from Destination to Source */
function backTrack(destNode) {
    let path = [];
    let curNode = destNode;
    while (curNode.parent !== null) {
        curNode = curNode.parent;
        path.push(curNode.state);
    }

    return path.reverse();
}


/* Get neighbors of a cell (BFS, DFS) */
function findNeighbors(idx, algo_name) {
    const row = idx[0];
    const col = idx[1];
    let neighbors = [];

    if ((row - 1 >= 0) && !exists(walls, [`${row - 1}`, 'col'])) {
        if (algo_name === 'dfs') {
            neighbors.unshift([row - 1, col]);
        } else {
            neighbors.push([row - 1, col]);
        }
    }

    if ((col + 1 < TOTAL_COL) && !exists(walls, ['row', `${col + 1}`])) {
        if (algo_name === 'dfs') neighbors.unshift([row, col + 1]);
        else neighbors.push([row, col + 1]);
    }

    if ((row + 1 < TOTAL_ROW) && !exists(walls, [`${row + 1}`, 'col'])) {
        if (algo_name === 'dfs') neighbors.unshift([row + 1, col]);
        else neighbors.push([row + 1, col]);
    }

    if ((col - 1 >= 0) && !exists(walls, ['row', `${col - 1}`])) {
        if (algo_name === 'dfs') neighbors.unshift([row, col - 1]);
        else neighbors.push([row, col - 1]);
    }

    return neighbors;
}

/* Animate the search */
function animateSearch(idx) {
    const id = `${idx[0]}_${idx[1]}`;
    const box = document.getElementById(id).children[0];
    if (box) {
        box.style.animationPlayState = 'running';
    }
}


/* True if arr2 is inside arr1 (arr1 has index in arr1) */
function exists(arr1, arr2) {
    const arr1_str = JSON.stringify(arr1);
    const arr2_str = JSON.stringify(arr2);

    if (arr1_str.indexOf(arr2_str) != -1) {
        return true;
    }
    return false;
}
