import PropTypes from "prop-types";

import boardStyles from "../styles/Board.module.css";

import { useRef } from "react";

const SudokuBoard = ({ boardData, onCellChange, readOnly }) => {
  const inputRefs = useRef(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

  // Move focus when arrow keys are pressed
  const handleKeyDown = (e, row, col) => {
    let nextRow = row;
    let nextCol = col;

    switch (e.key) {
      case "ArrowUp":
        nextRow = Math.max(0, row - 1);
        break;
      case "ArrowDown":
        nextRow = Math.min(8, row + 1);
        break;
      case "ArrowLeft":
        nextCol = Math.max(0, col - 1);
        break;
      case "ArrowRight":
        nextCol = Math.min(8, col + 1);
        break;
      case "Tab":
        break;
      default:
        return;
    }

    // Prevent the default cursor movement within the input
    e.preventDefault();

    // Focus the target cell
    const targetInput = inputRefs.current[nextRow][nextCol];
    if (targetInput) {
      targetInput.focus();
    }
  };

  return (
    <div className={boardStyles.boardContainer}>
      {boardData.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const { value, isUserInput, isSolverFilled, isValid } = cell;

          // Build a dynamic class name based on cell properties
          let cellClass = boardStyles.sudokuCell;
          if (isUserInput) cellClass += " " + boardStyles.prefilled;
          if (isSolverFilled) cellClass += " " + boardStyles.correct;
          if (!isValid) cellClass += " " + boardStyles.incorrect;

          return (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              ref={(el) => {
                inputRefs.current[rowIndex][colIndex] = el;
              }}
              maxLength={1}
              value={value}
              readOnly={readOnly || isSolverFilled}
              className={cellClass}
              onChange={(e) => {
                if (onCellChange) {
                  onCellChange(rowIndex, colIndex, e.target.value);
                }
              }}
              onKeyDown={(event) => handleKeyDown(event, rowIndex, colIndex)}
            />
          );
        })
      )}
    </div>
  );
};

SudokuBoard.propTypes = {
  // 9x9 array of objects: { value, isUserInput, isSolverFilled, isValid }
  boardData: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        isUserInput: PropTypes.bool,
        isSolverFilled: PropTypes.bool,
        isValid: PropTypes.bool,
      })
    )
  ).isRequired,
  onCellChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default SudokuBoard;
