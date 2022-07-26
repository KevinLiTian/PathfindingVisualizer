/* JavaScript for Pathfinding Visualizer */

const TOTAL_ROW = 20;
const TOTAL_COL = 50;
var ALGORITHM = '';
var neighbors = {};

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
            document.querySelector('#message').innerHTML = `${ALGORITHM}`
        });
    });
});


/* Select the algorithm to run */
function selectAlgorithm() {
    if (ALGORITHM === '') {
        document.querySelector('#message').innerHTML = 'Please Select an Algorithm First';
    }
    else {
        document.querySelector('#message').innerHTML = `Visualizing ${ALGORITHM}`;
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

            // If not the first row, append cell with (row - 1) 
            if (i > 0) {
                neighbors[[i, j]].push([i - 1, j]);
            }

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
