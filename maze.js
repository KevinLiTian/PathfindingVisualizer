import { TOTAL_ROW, TOTAL_COL } from './app.js';

lakdjfa;lskdjfaldkj;
/* Maze Generator */
class Maze {
    constructor() {
        this.width = TOTAL_COL;
        this.height = TOTAL_ROW;
        this.cells = [];

        // True stands for a wall, false stands for path
        // First set every cell to a wall
        for (let i = 0; i < TOTAL_ROW; i++) {
            this.cells.push([]);
            for (let j = 0; j < TOTAL_COL; j++) {
                this.cells[i].push(true);
            }
        }
    }

    // Set a cell as path
    set_path(row, col) {
        this.cells[row][col] = false;
    }

    // Check if a cell is wall, return true if it is
    is_wall(row, col) {
        if (row >= 0 && row < TOTAL_ROW && col >= 0 && col < TOTAL_COL) {
            return this.cells[row][col];
        }

        // If coordinate out of bound
        return false;
    }

    // row, col is the point to start
    create_maze(row, col) {

        // Set starting cell to a path, avoid repetition
        this.set_path(row, col);

        // Define all directions to try
        let all_directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        randomShuffle(all_directions);

        // Try all directions
        while (all_directions.length > 0) {

            // Get the direction to try
            let direction = all_directions.pop();

            // Calculate the coordinate of the node to try
            // Moving 2 cells in each direction
            let new_row = row + direction[0] * 2;
            let new_col = col + direction[1] * 2;

            // If it's a wall (not visited yet), visit it
            if (this.is_wall(new_row, new_col)) {

                // A new path is found, now set the linking cell to a path
                let link_row = row + direction[0];
                let link_col = col + direction[1];
                this.set_path(link_row, link_col);

                // Recursion on the new cell
                this.create_maze(new_row, new_col);
            }
        }
    }
}


/* Randomly Shuffle an array */
function randomShuffle(array) {
    array.sort(() => 0.5 - Math.random());
}


export { Maze };