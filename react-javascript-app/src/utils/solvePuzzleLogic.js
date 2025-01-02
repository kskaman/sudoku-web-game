export const difficultyLevels = {
  easy: 35,
  medium: 45,
  hard: 55,
};

export function generatePuzzle(emptyCellsCount) {
  const solution = generateFullBoard();
  const puzzle = removeNumbers(solution, emptyCellsCount);
  return { puzzle, solution };
}

function generateFullBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));
  fillBoard(board);
  return board;
}

function fillBoard(board) {
  fillBoardHelper(board, 0, 0);
}

function fillBoardHelper(board, row, col) {
  if (row === 9) return true;
  if (col === 9) return fillBoardHelper(board, row + 1, 0);
  if (board[row][col] !== 0) return fillBoardHelper(board, row, col + 1);

  const numbers = shuffle([...Array(9).keys()].map((i) => i + 1));

  for (let num of numbers) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (fillBoardHelper(board, row, col + 1)) return true;
      board[row][col] = 0;
    }
  }

  return false;
}

function isValid(board, row, col, num) {
  // Check row and column
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  // Check box
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}

function removeNumbers(board, count) {
  const puzzle = board.map((row) => row.slice());
  const positions = [];
  for (let i = 0; i < 81; i++) positions.push(i);
  shuffle(positions);

  for (let i = 0; i < count; i++) {
    const pos = positions[i];
    const row = Math.floor(pos / 9);
    const col = pos % 9;
    puzzle[row][col] = "";
  }
  return puzzle;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
