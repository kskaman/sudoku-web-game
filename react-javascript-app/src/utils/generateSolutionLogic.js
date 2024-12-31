export function solveSudoku(board) {
  const isSolvable = solveHelper(board, 0, 0);
  return { isSolvable, solution: board };
}

function solveHelper(board, row, col) {
  if (row === 9) return true;
  if (col === 9) return solveHelper(board, row + 1, 0);
  if (board[row][col] !== 0) return solveHelper(board, row, col + 1);

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num;
      if (solveHelper(board, row, col + 1)) return true;
      board[row][col] = 0;
    }
  }
  return false;
}

function isValid(board, row, col, num) {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;
  }
  const startRow = 3 * Math.floor(row / 3);
  const startCol = 3 * Math.floor(col / 3);
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }
  return true;
}
