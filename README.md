# Sudoku Hub

Welcome to Sudoku Hub, a web application where you can generate Sudoku solutions and solve Sudoku puzzles of varying difficulty levels.

## Project Structure
```
project-root/  
│  
├── index.html  
├── README.md  
│  
└── src/  
    ├── css/  
    │   ├── board.css    
    │   ├── buttons.css  
    │   ├── index.css  
    │   ├── modal.css  
    │   └── puzzle-page.css  
    │  
    ├── js/  
    │   ├── generateSolution.js  
    │   └── solvePuzzle.js  
    │  
    └── pages/  
        ├── generate-solution.html  
        └── solve-puzzle.html  
```

## Features

- **Generate Sudoku Solution**: Input your own Sudoku puzzle and generate its solution.
- **Solve Sudoku Puzzle**: Choose a difficulty level and solve a randomly generated puzzle.
- **Congratulatory Modal**: Receive a congratulatory message upon successfully completing a puzzle.
- **Arrow Key Navigation**: Use arrow keys to navigate through the puzzle, skipping prefilled cells.
- **Responsive Design**: The application is responsive and works well on various screen sizes.

## Instructions

### Generating a Sudoku Solution

1. Navigate to the "Generate a Sudoku Solution" page.
2. Fill in the Sudoku board with your puzzle.
3. Click the **Submit** button to generate the solution.
4. If there are conflicts in your input, you will be prompted to correct them.

### Solving a Sudoku Puzzle

1. Navigate to the "Solve a Sudoku Puzzle" page.
2. Select a difficulty level.
3. Fill in the empty cells with the correct numbers.
4. Correct entries will turn green; incorrect entries will turn red.
5. Upon completing the puzzle correctly, a congratulatory modal will appear.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)

## Setup

1. Clone the repository.
2. Open `index.html` in your web browser.

## License

This project is licensed under the MIT License.