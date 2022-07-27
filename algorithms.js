// Import useful global variables from 'app.js'
import { SRC, DEST, neighbors, walls, waters } from './app.js';

// Returns a Promise that resolves after "ms" Milliseconds (delay)
const timer = ms => new Promise(res => setTimeout(res, ms));

/* Node Class for Unweighted Search Algorithms (DFS, BFS) */
class Node {
    constructor(state, parent) {
        this.state = state;
        this.parent = parent;
    }
}

/* Node Class for Weighted Search Algorithms */
class WeightedNode {
    constructor(state, parent, cost) {
        this.state = state;
        this.parent = parent;
        this.cost = cost;
    }
}


/* ----------------------------- Algorithms ------------------------------ */

/* Depth First Search */
async function dfs() {

    // Store all nodes to be traversed in a stack data structure
    let stackFrontier = [];

    // First push in source node neighbors
    neighbors[SRC].forEach(idx => {
        if (!exists(walls, idx)) {
            stackFrontier.push(new Node(idx, null));
        }
    })

    // Store all searched nodes to prevent infinite search
    let searched = [];
    searched.push(SRC);

    // Traverse until no node can be found
    while (stackFrontier.length != 0) {

        // Search the next node
        let curNode = stackFrontier.pop();

        if (!exists(searched, curNode.state)) {
            searched.push(curNode.state);

            // Check if current node is the destination
            if (JSON.stringify(curNode.state) === JSON.stringify(DEST)) {
                return backTrack(curNode);
            }

            // Animate the current node
            animateSearch(curNode.state);

            // Push all the neighbors of current node if they are not walls and they haven't been searched
            neighbors[curNode.state].forEach(idx => {
                if ((!exists(searched, idx)) && !exists(walls, idx)) {
                    stackFrontier.push(new Node(idx, curNode));
                }
            })

            // Delay
            await timer(10);
        }
    }

    // No valid path
    return null;
}


/* Breadth First Search */
async function bfs() {

    // Store all nodes to be traversed in a queue data structure
    let queueFrontier = [];

    // First push in source node neighbors
    neighbors[SRC].forEach(idx => {
        if (!exists(walls, idx)) {
            queueFrontier.push(new Node(idx, null));
        }
    })

    // Store all searched nodes to prevent infinite search
    let searched = [];
    searched.push(SRC);

    // Traverse until no node can be found
    while (queueFrontier.length != 0) {

        // Search the next node
        let curNode = queueFrontier.shift();

        if (!exists(searched, curNode.state)) {
            searched.push(curNode.state);

            // Check if current node is the destination
            if (JSON.stringify(curNode.state) === JSON.stringify(DEST)) {
                return backTrack(curNode);
            }

            // Animate the current node
            animateSearch(curNode.state);

            // Push all the neighbors of current node if they are not walls and they haven't been searched
            neighbors[curNode.state].forEach(idx => {
                if ((!exists(searched, idx)) && !exists(walls, idx)) {
                    queueFrontier.push(new Node(idx, curNode));
                }
            })

            // Delay
            await timer(10);
        }
    }

    // No valid path
    return null;
}


/* Greedy Best-First Search */
function greedy() {

}


/* Dijkstra's Algorithm */
function dijkstra() {

}


/* A* Algorithm */
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
        box.classList.remove('stretch');
        box.classList.add('search-stretch');
        box.dataset.animation = 'search-stretch';
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


export { dfs, bfs, greedy, dijkstra, astar, timer };