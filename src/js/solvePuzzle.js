/** src/js/solvePuzzle.js **/

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
  
  // Global variables and constants
  const BOARD_SIZE = 9;
  const BOX_SIZE = 3;
  let boardData = [];
  let solution = [];
  let cells = [];
  
  const difficultyLevels = {
    easy: 35,
    medium: 45,
    hard: 55
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    generateBoard();
    setupDifficultyButtons();
    setupChangeDifficultyButtons();
    setupResetButton();
    setupChangeDifficultyModal();
    setupPlayAgainButton();
  });
  
  // Generate the Sudoku board UI
  function generateBoard() {
    const boardContainer = document.createElement('div');
    boardContainer.className = 'board-container';
    boardContainer.id = 'board-container';
  
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.id = `cell-${i}`;
      input.className = 'sudoku-cell';
      boardContainer.appendChild(input);
    }
  
    document.getElementById('board').appendChild(boardContainer);
    cells = document.querySelectorAll('.sudoku-cell');
  }
  
  // Set up difficulty selection buttons
  function setupDifficultyButtons() {
    const difficultyModal = document.getElementById('difficulty-modal');
    difficultyModal.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) {
        const difficulty = button.getAttribute('data-difficulty');
        setDifficulty(difficulty);
      }
    });
  }
  
  // Set up change difficulty buttons
  function setupChangeDifficultyButtons() {
    const changeDifficultyModal = document.getElementById('change-difficulty-modal');
    changeDifficultyModal.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (button) {
        const difficulty = button.getAttribute('data-difficulty');
        setDifficulty(difficulty);
        closeModal('change-difficulty-modal');
      }
    });
  }
  
  // Set difficulty level and generate puzzle
  function setDifficulty(difficulty) {
    const removeCells = difficultyLevels[difficulty];
    generatePuzzle(removeCells);
    closeModal('difficulty-modal');
  }
  
  // Generate a new puzzle and render it
  function generatePuzzle(removeCells) {
    generateFullBoard();
    solution = boardData.map(row => row.slice());
    removeNumbers(removeCells);
    renderBoard();
  }
  
  // Generate a fully solved Sudoku board
  function generateFullBoard() {
    boardData = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
    fillBoard();
  }
  
  // Fill the board using backtracking
  function fillBoard() {
    fillBoardHelper(0, 0);
  }
  
  function fillBoardHelper(row, col) {
    if (row === BOARD_SIZE) return true;
    if (col === BOARD_SIZE) return fillBoardHelper(row + 1, 0);
    if (boardData[row][col] !== 0) return fillBoardHelper(row, col + 1);
  
    const numbers = shuffle([...Array(BOARD_SIZE).keys()].map(i => i + 1));
  
    for (let num of numbers) {
      if (isValid(row, col, num)) {
        boardData[row][col] = num;
        if (fillBoardHelper(row, col + 1)) return true;
        boardData[row][col] = 0;
      }
    }
  
    return false;
  }
  
  // Check if placing a number is valid
  function isValid(row, col, num) {
    // Check row
    if (boardData[row].includes(num)) return false;
    // Check column
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (boardData[i][col] === num) return false;
    }
    // Check box
    const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (boardData[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }
  
  // Remove numbers from the board to create the puzzle
  function removeNumbers(count) {
    const positions = [];
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) positions.push(i);
    shuffle(positions);
  
    for (let i = 0; i < count; i++) {
      const pos = positions[i];
      const row = Math.floor(pos / BOARD_SIZE);
      const col = pos % BOARD_SIZE;
      boardData[row][col] = 0;
    }
  }
  
  // Shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Render the board on the UI
  function renderBoard() {
    const boardContainer = document.getElementById('board-container');
    // Clear the board
    boardContainer.innerHTML = '';
  
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      const row = Math.floor(i / BOARD_SIZE);
      const col = i % BOARD_SIZE;
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = 1;
      input.className = 'sudoku-cell';
      input.id = `cell-${i}`;
  
      if (boardData[row][col] !== 0) {
        input.value = boardData[row][col];
        input.readOnly = true;
        input.style.backgroundColor = COLORS.prefilledBackground;
        input.style.color = COLORS.prefilledText;
      } else {
        input.readOnly = false;
        input.style.backgroundColor = COLORS.emptyBackground;
        input.style.color = COLORS.emptyText;
      }
  
      boardContainer.appendChild(input);
    }
  
    cells = document.querySelectorAll('.sudoku-cell');
    addInputListeners();
  }
  
  // Add event listeners to inputs
  function addInputListeners() {
    cells.forEach((cell) => {
      cell.addEventListener('keydown', handleKeyDown);
      cell.addEventListener('focus', () => moveCaretToEnd(cell));
    });
  }
  
  // Handle keydown events
  function handleKeyDown(event) {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'
    ];
  
    const cell = event.target;
    const index = parseInt(cell.id.split('-')[1]);
    const isPrefilled = cell.readOnly;
  
    if (allowedKeys.includes(event.key)) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        handleArrowKeys(event, index);
      }
  
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (!isPrefilled) {
          setTimeout(() => {
            if (cell.value === '') {
              cell.style.backgroundColor = COLORS.emptyBackground;
              cell.style.color = COLORS.emptyText;
            }
          }, 0);
        } else {
          event.preventDefault();
        }
      }
    } else if (event.key >= '1' && event.key <= '9') {
      if (!isPrefilled) {
        setTimeout(() => {
          checkValue(cell, index);
          if (isPuzzleCompleted()) {
            showModal('congratulation-modal');
          }
        }, 0);
      } else {
        event.preventDefault();
      }
    } else {
      event.preventDefault();
      alert("Please enter a number between 1 and 9");
    }
  }
  
  // Handle arrow key navigation, skipping prefilled cells
  function handleArrowKeys(event, index) {
    let newIndex = index;
    const totalCells = BOARD_SIZE * BOARD_SIZE;
  
    switch (event.key) {
      case 'ArrowLeft':
        do {
          newIndex = (newIndex - 1 + totalCells) % totalCells;
        } while (cells[newIndex].readOnly && newIndex !== index);
        break;
      case 'ArrowRight':
        do {
          newIndex = (newIndex + 1) % totalCells;
        } while (cells[newIndex].readOnly && newIndex !== index);
        break;
      case 'ArrowUp':
        do {
          newIndex = (newIndex - BOARD_SIZE + totalCells) % totalCells;
        } while (cells[newIndex].readOnly && newIndex !== index);
        break;
      case 'ArrowDown':
        do {
          newIndex = (newIndex + BOARD_SIZE) % totalCells;
        } while (cells[newIndex].readOnly && newIndex !== index);
        break;
    }
  
    if (newIndex !== index && !cells[newIndex].readOnly) {
      event.preventDefault();
      cells[newIndex].focus();
      moveCaretToEnd(cells[newIndex]);
    }
  }
  
  // Move caret to the end of the input
  function moveCaretToEnd(cell) {
    const value = cell.value;
    cell.setSelectionRange(value.length, value.length);
  }
  
  // Check if the entered value is correct
  function checkValue(cell, index) {
    const row = Math.floor(index / BOARD_SIZE);
    const col = index % BOARD_SIZE;
    const userValue = parseInt(cell.value);
  
    if (userValue === solution[row][col]) {
      cell.style.backgroundColor = COLORS.correctBackground;
      cell.style.color = COLORS.correctText;
    } else {
      cell.style.backgroundColor = COLORS.incorrectBackground;
      cell.style.color = COLORS.incorrectText;
    }
  }
  
  // Check if the puzzle is completed
  function isPuzzleCompleted() {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell.readOnly) {
        const row = Math.floor(i / BOARD_SIZE);
        const col = i % BOARD_SIZE;
        const userValue = parseInt(cell.value);
        if (userValue !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
  
  // Show modal by ID
  function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
  }
  
  // Close modal by ID
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.visibility = 'hidden';
    }, 300);
  }
  
  // Setup reset button
  function setupResetButton() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', () => {
      renderBoard();
    });
  }
  
  // Setup change difficulty button
  function setupChangeDifficultyModal() {
    const changeDifficultyButton = document.getElementById('change-difficulty-button');
    const resumePuzzleButton = document.getElementById('resume-puzzle');
  
    changeDifficultyButton.addEventListener('click', () => {
      showModal('change-difficulty-modal');
    });
  
    resumePuzzleButton.addEventListener('click', () => {
      closeModal('change-difficulty-modal');
    });
  }
  
  // Setup play again button in congratulation modal
  function setupPlayAgainButton() {
    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton.addEventListener('click', () => {
      closeModal('congratulation-modal');
      showModal('difficulty-modal');
    });
  }
  
  // Initial call to show difficulty modal
  showModal('difficulty-modal');
  