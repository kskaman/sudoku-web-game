import PropTypes from "prop-types";

import boardStyles from "../styles/Board.module.css";

import { useRef } from "react";

const SudokuBoard = ({
  boardData,
  onCellChange,
  readOnly,
  isPuzzle = false,
}) => {
  const inputRefs = useRef(
    Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null))
  );

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
        // Let default Tab behavior proceed
        return;
      default:
        return;
    }

    // Prevent the default cursor movement within the input
    e.preventDefault();

    // If it's a puzzle, skip over cells that are solver-filled
    if (isPuzzle) {
      // Determine the direction based on the key pressed
      let dRow = 0;
      let dCol = 0;

      switch (e.key) {
        case "ArrowUp":
          dRow = -1;
          break;
        case "ArrowDown":
          dRow = 1;
          break;
        case "ArrowLeft":
          dCol = -1;
          break;
        case "ArrowRight":
          dCol = 1;
          break;
        default:
          break;
      }

      // Keep advancing in that direction while the cell is solver-filled
      while (
        nextRow >= 0 &&
        nextRow < 9 &&
        nextCol >= 0 &&
        nextCol < 9 &&
        boardData[nextRow][nextCol].isSolverFilled
      ) {
        nextRow += dRow;
        nextCol += dCol;
      }

      if (nextRow > 8 || nextRow < 0 || nextCol < 0 || nextCol > 8) {
        nextRow = row;
        nextCol = col;
      }
    }

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
          if ((!isPuzzle && isUserInput) || (isPuzzle && isSolverFilled))
            cellClass += " " + boardStyles.prefilled;
          if ((!isPuzzle && isSolverFilled) || (isPuzzle && isUserInput))
            cellClass += " " + boardStyles.correct;
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
  isPuzzle: PropTypes.bool,
};

export default SudokuBoard;
