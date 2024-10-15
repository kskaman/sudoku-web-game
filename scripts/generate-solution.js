/* ../scripts/generate-solution.js */

// Selecting all inputs inside the Sudoku board
const board = document.getElementById('board')
const submitButton = document.getElementById('submit-button')
const modal  = document.getElementById('tryAgain-modal')
const modalMessage = document.getElementById('modal-message')
const tryAgainButton = document.getElementById('tryAgain-button')

// Define colors for cells
const emptyBackground = 'white'
const emptyBoxText = 'black'

const prefilledBackground = '#ccc'
const prefilledBoxText = 'white'

const incorrectBackground = '#f8d7da'
const incorrectBoxText = '#721c24'

const correctBackground = '#719e7b'
const correctBoxText = '#155724'

generateBoard()
generateWrapperBoard()

const cells = document.querySelectorAll('.sudoku-cell')

addEventListeners()

let boardData = []

// Generate the Sudoku board
function generateBoard() {
    const boardContainer = document.createElement('div')
    boardContainer.className = 'board-container'
    for (let i = 0; i < 81; i++) {
        const input = document.createElement('input')
        input.type = 'text'
        input.maxLength = 1
        input.id = `cell-${i}`
        input.className = 'sudoku-cell'        
        boardContainer.appendChild(input)
    }
    board.insertBefore(boardContainer, submitButton)
}

// Generate the wrapper board with subgrid lines
function generateWrapperBoard() {
    const wrapperBoard = document.createElement('div')
    wrapperBoard.className = 'wrapper-board'
    for (let i = 0; i < 9; i++) {
        const subgrid = document.createElement('div')
        subgrid.className = 'subgrid'
        wrapperBoard.appendChild(subgrid)
    }
    // Insert the wrapper board into the board div before the board container
    board.insertBefore(wrapperBoard, board.firstChild)
}



// Add event listeners
function addEventListeners() {
    cells.forEach((cell, index) => {
        cell.addEventListener('keydown', (event) => handleKeyDown(event, index))
        cell.addEventListener('focus', () => moveCaretToEnd(cell))
    })

    submitButton.addEventListener('click', handleSubmit)
    tryAgainButton.addEventListener('click', () => {
        submitButton.textContent = 'Submit'
        hideModal()
    })
}

// Input handling
function handleKeyDown(event, index) {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

    // Handle arrow key navigation and Backspace/Delete
    if (allowedKeys.includes(event.key)) {
        handleArrowKeys(event, index)

        if (event.key === 'Delete' || event.key === 'Backspace') {
            setTimeout(() => {
                if (event.target.value === '') {
                    event.target.style.backgroundColor = emptyBackground
                    event.target.style.color = emptyBoxText
                }
            }, 0)
        }
        return
    }

    // Allow only numbers between 1 and 9
    if (event.key >= '1' && event.key <= '9') {
        setTimeout(() => {
            event.target.style.backgroundColor = prefilledBackground
            event.target.style.color = prefilledBoxText
        }, 0)
    } else {
        event.preventDefault()  // Prevent invalid input
        window.alert("Please enter a number between 1 and 9")
    }
}   

// Function to move caret (cursor) to the end of the input
function moveCaretToEnd(cell) {
    const value = cell.value
    // Set the caret to the end of the input
    cell.setSelectionRange(value.length, value.length)
}

// Arrow key navigation function that also sets the caret position at the end of the input
function handleArrowKeys(event, index) {
    // Handle the arrow key logic
    let newIndex

    switch (event.key) {
        case 'ArrowLeft':
            if (index % 9 === 0) {
                newIndex = index + 8
            } else {
                newIndex = index - 1
            }
            break
        case 'ArrowRight':
            if (index % 9 === 8) {
                newIndex = index - 8
            } else {
                newIndex = index + 1
            }
            break
        case 'ArrowUp':
            if (index >= 0 && index <= 8) {
                newIndex = index + 72
            } else {
                newIndex = index - 9
            }
            break
        case 'ArrowDown':
            if (index >= 72 && index <= 80) {
                newIndex = index - 72
            } else {
                newIndex = index + 9
            }
            break
        default:
            return
    }

    // Focus the new cell if it exists
    const newCell = cells?.[newIndex]

    if (newCell) {
        // Prevent default arrow key behavior
        event.preventDefault()
        newCell.focus()
        // Move caret to the end of the input if the new cell has a value
        setTimeout(() => moveCaretToEnd(newCell), 0)
    }
}

// Handle Submit button logic
function handleSubmit() {
    const label = submitButton.textContent.trim()
    if (label.toLowerCase() === 'submit') {
        resetCellStyles() // Reset cell styles before checking for conflicts
        getBoardData() // Update the global boardData
        const conflicts = findConflicts()

        if (conflicts.length > 0) {
            // Highlight the conflicting cells
            conflicts.forEach((index) => {
                const cell = cells[index]
                cell.style.backgroundColor = incorrectBackground
                cell.style.color = incorrectBoxText
            })
            showModal('You have duplicate numbers in the same row, column, or subgrid. Please correct them before submitting.')
            return
        }

        startSolvingSudoku()
        submitButton.textContent = 'Reset'
    } 
    if (label.toLowerCase() === 'reset') {
        resetBoard()
        submitButton.textContent = 'Submit'
    }
}

function resetBoard() {
    cells.forEach((cell) => {
        cell.value = ''
        cell.style.backgroundColor = emptyBackground
        cell.style.color = emptyBoxText
    })
    boardData = [] // Reset the global boardData
}


// Function to reset cell styles to their predefined styles
function resetCellStyles() {
    cells.forEach((cell) => {
        if (cell.value === '' || cell.value === '0') {
            cell.style.backgroundColor = emptyBackground
            cell.style.color = emptyBoxText
        } else {
            cell.style.backgroundColor = prefilledBackground
            cell.style.color = prefilledBoxText
        }
    })
}


// Function to retrieve the current state of the board
function getBoardData() {
    boardData = [] // Reset the global boardData array
    for (let row = 0; row < 9; row++) {
        const rowData = []
        for (let col = 0; col < 9; col++) {
            const index = row * 9 + col
            const cell = cells[index]
            const value = parseInt(cell.value)
            rowData.push(isNaN(value) ? 0 : value)
        }
        boardData.push(rowData)
    }
}

// Function to find conflicts in the board
function findConflicts() {
    const conflicts = new Set()

    // Check rows
    for (let row = 0; row < 9; row++) {
        const nums = {}
        for (let col = 0; col < 9; col++) {
            const val = boardData[row][col]
            if (val !== 0) {
                if (nums[val] !== undefined) {
                    // Add indices of conflicting cells
                    conflicts.add(row * 9 + col)
                    conflicts.add(row * 9 + nums[val])
                } else {
                    nums[val] = col
                }
            }
        }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
        const nums = {}
        for (let row = 0; row < 9; row++) {
            const val = boardData[row][col]
            if (val !== 0) {
                if (nums[val] !== undefined) {
                    // Add indices of conflicting cells
                    conflicts.add(row * 9 + col)
                    conflicts.add(nums[val] * 9 + col)
                } else {
                    nums[val] = row
                }
            }
        }
    }

    // Check subgrids
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            const nums = {}
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const currRow = boxRow * 3 + row
                    const currCol = boxCol * 3 + col
                    const val = boardData[currRow][currCol]
                    if (val !== 0) {
                        if (nums[val] !== undefined) {
                            // Add indices of conflicting cells
                            conflicts.add(currRow * 9 + currCol)
                            conflicts.add(nums[val].row * 9 + nums[val].col)
                        } else {
                            nums[val] = { row: currRow, col: currCol }
                        }
                    }
                }
            }
        }
    }

    return Array.from(conflicts)
}

/* Script part for solving sudoku */
function startSolvingSudoku() {
    if (solveSudoku()) {
        updateBoard()
    } else {
        showModal("The puzzle is unsolvable. Please try some other puzzle.")
    }
}

// Function to check if a number can be placed in a cell
function isValid(row, col, num) {
    // Check row
    for (let x = 0; x < 9; x++) {
        if (boardData[row][x] === num) {
            return false
        }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
        if (boardData[x][col] === num) {
            return false
        }
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3
    const startCol = Math.floor(col / 3) * 3
    for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
            if (boardData[i][j] === num) {
                return false
            }
        }
    }

    return true
}

// Backtracking function to solve the Sudoku
function solveSudoku() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (boardData[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(row, col, num)) {
                        boardData[row][col] = num

                        if (solveSudoku()) {
                            return true
                        } else {
                            boardData[row][col] = 0
                        }
                    }
                }
                return false
            }
        }
    }
    return true
}

// Function to update the board with the solution
function updateBoard() {
    for (let row = 0; row < 9; row++) {
        for (let col =0; col < 9; col++) {
            const index = row * 9 + col
            const cell = cells[index]

            if (cell.value === '' || cell.value === '0') {
                cell.value = boardData[row][col]
                cell.style.backgroundColor = correctBackground
                cell.style.color = correctBoxText
            }
        }
    }
}

// Function to show the modal
function showModal(message) {
    modalMessage.textContent = message
    modal.style.visibility = 'visible'
    modal.style.opacity = '1'
}

// Function to hide the modal
function hideModal() {
    modal.style.opacity = '0'
    setTimeout(() => {
        modal.style.visibility = 'hidden'
        modalMessage.textContent = ''
    }, 300)
}
