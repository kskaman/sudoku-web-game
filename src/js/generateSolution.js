/** src/js/generateSolution.js **/

// Define colors for cells
const COLORS = {
    emptyBackground: 'white',
    emptyText: 'black',
    prefilledBackground: '#ccc',
    prefilledText: 'white',
    incorrectBackground: '#f8d7da',
    incorrectText: '#721c24',
    correctBackground: '#719e7b',
    correctText: '#155724'
  };
  
  // Global variables
  let boardData = [];
  const BOARD_SIZE = 9;
  let cells = [];
  
  document.addEventListener('DOMContentLoaded', () => {
    generateBoard();
    addEventListeners();
  });
  
  function generateBoard() {
    const boardContainer = document.createElement('div');
    boardContainer.className = 'board-container';
  
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.id = `cell-${i}`;
      input.className = 'sudoku-cell';
      boardContainer.appendChild(input);
    }
  
    const board = document.getElementById('board');
    board.insertBefore(boardContainer, document.getElementById('submit-button'));
  
    cells = document.querySelectorAll('.sudoku-cell');
  }
  
  function addEventListeners() {
    cells.forEach((cell) => {
      cell.addEventListener('keydown', handleKeyDown);
      cell.addEventListener('focus', () => moveCaretToEnd(cell));
    });
  
    document.getElementById('submit-button').addEventListener('click', handleSubmit);
    document.getElementById('tryAgain-button').addEventListener('click', hideModal);
  }
  
  function handleKeyDown(event) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const cell = event.target;
    const index = parseInt(cell.id.split('-')[1]);
  
    if (allowedKeys.includes(event.key)) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        handleArrowKeys(event, index);
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setTimeout(() => {
          if (cell.value === '') {
            cell.style.backgroundColor = COLORS.emptyBackground;
            cell.style.color = COLORS.emptyText;
          }
        }, 0);
      }
      return;
    }
  
    if (event.key >= '1' && event.key <= '9') {
      setTimeout(() => {
        cell.style.backgroundColor = COLORS.prefilledBackground;
        cell.style.color = COLORS.prefilledText;
      }, 0);
    } else {
      event.preventDefault();
      alert("Please enter a number between 1 and 9");
    }
  }
  
  function handleArrowKeys(event, index) {
    let newIndex = index;
    const totalCells = BOARD_SIZE * BOARD_SIZE;
  
    switch (event.key) {
      case 'ArrowLeft':
        newIndex = (index % BOARD_SIZE === 0) ? index + BOARD_SIZE - 1 : index - 1;
        break;
      case 'ArrowRight':
        newIndex = (index % BOARD_SIZE === BOARD_SIZE - 1) ? index - BOARD_SIZE + 1 : index + 1;
        break;
      case 'ArrowUp':
        newIndex = (index < BOARD_SIZE) ? index + BOARD_SIZE * (BOARD_SIZE - 1) : index - BOARD_SIZE;
        break;
      case 'ArrowDown':
        newIndex = (index >= BOARD_SIZE * (BOARD_SIZE - 1)) ? index % BOARD_SIZE : index + BOARD_SIZE;
        break;
    }
    if (newIndex !== index) {
      event.preventDefault();
      cells[newIndex].focus();
      moveCaretToEnd(cells[newIndex]);
    }
  }
  
  function moveCaretToEnd(cell) {
    const value = cell.value;
    cell.setSelectionRange(value.length, value.length);
  }
  
  function handleSubmit() {
    const submitButton = document.getElementById('submit-button');
    const label = submitButton.textContent.trim();
  
    if (label.toLowerCase() === 'submit') {
      resetCellStyles();
      getBoardData();
  
      const conflicts = findConflicts();
      if (conflicts.length > 0) {
        highlightConflicts(conflicts);
        showModal('You have duplicate numbers in the same row, column, or subgrid. Please correct them before submitting.');
        return;
      }
  
      if (solveSudoku()) {
        updateBoard();
        submitButton.textContent = 'Reset';
      } else {
        showModal('The puzzle is unsolvable. Please try another puzzle.');
      }
    } else if (label.toLowerCase() === 'reset') {
      resetBoard();
      submitButton.textContent = 'Submit';
    }
  }
  
  function resetCellStyles() {
    cells.forEach((cell) => {
      if (cell.value === '' || cell.value === '0') {
        cell.style.backgroundColor = COLORS.emptyBackground;
        cell.style.color = COLORS.emptyText;
      } else {
        cell.style.backgroundColor = COLORS.prefilledBackground;
        cell.style.color = COLORS.prefilledText;
      }
    });
  }
  
  function getBoardData() {
    boardData = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const rowData = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        const index = row * BOARD_SIZE + col;
        const cellValue = parseInt(cells[index].value);
        rowData.push(isNaN(cellValue) ? 0 : cellValue);
      }
      boardData.push(rowData);
    }
  }
  
  function findConflicts() {
    const conflicts = new Set();
  
    // Check rows, columns, and subgrids
    for (let i = 0; i < BOARD_SIZE; i++) {
      const rowNums = {};
      const colNums = {};
      const boxNums = {};
  
      for (let j = 0; j < BOARD_SIZE; j++) {
        // Check row
        const rowVal = boardData[i][j];
        if (rowVal !== 0) {
          if (rowNums[rowVal]) {
            conflicts.add(i * BOARD_SIZE + j);
            conflicts.add(i * BOARD_SIZE + rowNums[rowVal] - 1);
          } else {
            rowNums[rowVal] = j + 1;
          }
        }
  
        // Check column
        const colVal = boardData[j][i];
        if (colVal !== 0) {
          if (colNums[colVal]) {
            conflicts.add(j * BOARD_SIZE + i);
            conflicts.add((colNums[colVal] - 1) * BOARD_SIZE + i);
          } else {
            colNums[colVal] = j + 1;
          }
        }
  
        // Check subgrid
        const rowIndex = 3 * Math.floor(i / 3) + Math.floor(j / 3);
        const colIndex = 3 * (i % 3) + (j % 3);
        const boxVal = boardData[rowIndex][colIndex];
        if (boxVal !== 0) {
          const key = `${rowIndex}-${colIndex}`;
          if (boxNums[boxVal]) {
            conflicts.add(rowIndex * BOARD_SIZE + colIndex);
            conflicts.add(boxNums[boxVal]);
          } else {
            boxNums[boxVal] = rowIndex * BOARD_SIZE + colIndex;
          }
        }
      }
    }
  
    return Array.from(conflicts);
  }
  
  function highlightConflicts(conflicts) {
    conflicts.forEach((index) => {
      const cell = cells[index];
      cell.style.backgroundColor = COLORS.incorrectBackground;
      cell.style.color = COLORS.incorrectText;
    });
  }
  
  function solveSudoku() {
    return solveHelper(0, 0);
  }
  
  function solveHelper(row, col) {
    if (row === BOARD_SIZE) return true;
    if (col === BOARD_SIZE) return solveHelper(row + 1, 0);
    if (boardData[row][col] !== 0) return solveHelper(row, col + 1);
  
    for (let num = 1; num <= BOARD_SIZE; num++) {
      if (isValid(row, col, num)) {
        boardData[row][col] = num;
        if (solveHelper(row, col + 1)) return true;
        boardData[row][col] = 0;
      }
    }
  
    return false;
  }
  
  function isValid(row, col, num) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      if (boardData[row][x] === num || boardData[x][col] === num) return false;
    }
  
    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (boardData[i][j] === num) return false;
      }
    }
  
    return true;
  }
  
  function updateBoard() {
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const row = Math.floor(i / BOARD_SIZE);
      const col = i % BOARD_SIZE;
      const cell = cells[i];
  
      if (cell.value === '' || cell.value === '0') {
        cell.value = boardData[row][col];
        cell.style.backgroundColor = COLORS.correctBackground;
        cell.style.color = COLORS.correctText;
      }
    }
  }
  
  function resetBoard() {
    cells.forEach((cell) => {
      cell.value = '';
      cell.style.backgroundColor = COLORS.emptyBackground;
      cell.style.color = COLORS.emptyText;
    });
    boardData = [];
  }
  
  function showModal(message) {
    const modal = document.getElementById('tryAgain-modal');
    document.getElementById('modal-message').textContent = message;
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
  }
  
  function hideModal() {
    const modal = document.getElementById('tryAgain-modal');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.visibility = 'hidden';
      document.getElementById('modal-message').textContent = '';
    }, 300);
  }
  