import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import '../styles/board.css';

function SudokuBoard({ initialData, onCellChange, readOnly }) {
  const [boardData, setBoardData] = useState(
    initialData || Array.from({ length: 9 }, () => Array(9).fill(''))
  );

  useEffect(() => {
    setBoardData(
      initialData || Array.from({ length: 9 }, () => Array(9).fill(''))
    );
  }, [initialData]);

  const handleChange = (row, col, value) => {
    if (value === '' || /^[1-9]$/.test(value)) {
      const updatedBoard = boardData.map((r, rowIndex) =>
        r.map((cell, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return value;
          }
          return cell;
        })
      );
      setBoardData(updatedBoard);
      if (onCellChange) {
        onCellChange(updatedBoard);
      }
    }
  };

  return (
    <div className="board-container">
      {boardData.map((row, rowIndex) =>
        row.map((cellValue, colIndex) => {
          const index = rowIndex * 9 + colIndex;
          const isPrefilled = cellValue !== '' && cellValue !== 0;
          return (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={cellValue}
              readOnly={readOnly || isPrefilled}
              className={`sudoku-cell ${
                isPrefilled ? 'prefilled' : ''
              }`}
              onChange={(e) =>
                handleChange(rowIndex, colIndex, e.target.value)
              }
            />
          );
        })
      )}
    </div>
  );
}

SudokuBoard.propTypes = {
    initialData: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        )
    ).isRequired,
    onCellChange: PropTypes.func,
    readOnly: PropTypes.bool,
}

export default SudokuBoard;
