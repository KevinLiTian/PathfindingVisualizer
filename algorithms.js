/* Algorithms */

import { SRC, DEST, neighbors, walls } from './app.js';

// Returns a Promise that resolves after "ms" Milliseconds
const timer = ms => new Promise(res => setTimeout(res, ms));

class Node {
    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
    }
}

async function dfs() {

    // Store all nodes to be traversed
    let stackFrontier = [];
    stackFrontier.push(new Node(SRC, null));

    // Store all searched nodes to prevent infinite search
    let searched = [];
    searched.push(SRC);

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
        neighbors[curNode.state].forEach(idx => {
            if ((!exists(searched, idx)) && !exists(walls, idx)) {
                stackFrontier.push(new Node(idx, curNode));
            }
        })
        await timer(10);
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


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export { dfs, bfs, greedy, dijkstra, astar };