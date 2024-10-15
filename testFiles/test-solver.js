// Predefined test puzzles
const puzzles = {
    solvable: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ],
    unsolvable: [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [5, 0, 0, 0, 8, 0, 0, 7, 9]  // Invalid puzzle with duplicate 5
    ]
};

// Function to display the grid in a readable format
function printGrid(grid) {
    return grid.map(row => row.join(" ")).join("\n");
}

// Test the solveSudoku function with a given puzzle
function testSudokuSolver(puzzle, isSolvable) {
    const originalGrid = printGrid(puzzle);
    document.getElementById('original-grid').innerText = `Original Grid:\n${originalGrid}`;

    if (solveSudoku(puzzle)) {
        const solvedGrid = printGrid(puzzle);
        document.getElementById('solved-grid').innerText = `Solved Grid:\n${solvedGrid}`;
    } else {
        document.getElementById('solved-grid').innerText = "No solution found for this Sudoku.";
    }
}

// Call the test with a solvable puzzle
testSudokuSolver([...puzzles.solvable].map(row => [...row]), true);

// Optionally, uncomment the next line to test the unsolvable puzzle
testSudokuSolver([...puzzles.unsolvable].map(row => [...row]), false);

// -------------------- Sudoku Solver Implementation --------------------

function solveSudoku(grid) {
    function isValid(row, col, num) {
        // Check row
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num) return false;
        }

        // Check column
        for (let y = 0; y < 9; y++) {
            if (grid[y][col] === num) return false;
        }

        // Check 3x3 sub-grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }

        return true;
    }

    function findEmptyLocation() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) return { row, col };
            }
        }
        return null;
    }

    function solve() {
        const emptyLocation = findEmptyLocation();
        if (!emptyLocation) return true;

        const { row, col } = emptyLocation;

        for (let num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
                grid[row][col] = num;

                if (solve()) return true;

                grid[row][col] = 0; // Backtrack
            }
        }

        return false;
    }

    return solve();
}
