import { useState } from "react";

import Sidebar from "./Sidebar";
import SudokuBoard from "./SudokuBoard";
import Modal from "./Modal";

import puzzleStyles from "../styles/Puzzle.module.css";
import buttonStyles from "../styles/Button.module.css";

import { solveSudoku } from "../utils/generateSolutionLogic";

const createEmptyBoard = () => {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({
      value: "",
      isUserInput: false,
      isSolverFilled: false,
      isValid: true,
    }))
  );
};

const GenerateSolution = () => {
  const instructions = [
    "Fill in the Sudoku board with your puzzle.",
    "Click the Submit button to generate the solution.",
    "Make sure to fill in all necessary cells for accurate results.",
  ];

  const [boardData, setBoardData] = useState(() => createEmptyBoard());
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState("");
  const [isSolved, setIsSolved] = useState(false);

  const handleCellChange = (row, col, newValue) => {
    // Allow digits 1-9 or empty string
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setBoardData((prevBoard) => {
        const updated = prevBoard.map((r, rIdx) =>
          r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return {
                ...cell,
                value: newValue,
                isUserInput: newValue !== "",
                isSolverFilled: false,
                isValid: true,
              };
            }
            return cell;
          })
        );
        return updated;
      });
    }
  };

  const handleSubmit = () => {
    const numericBoard = boardData.map((row) =>
      row.map((cell) => (cell.value === "" ? 0 : parseInt(cell.value, 10)))
    );

    if (hasConflicts(numericBoard)) {
      setModalMessage(
        "You have duplicate numbers in the same row, column or 3 x 3 sub grid. Please correct them before submitting"
      );
      setShowModal(true);
      return;
    }

    const result = solveSudoku(numericBoard);
    if (result.isSolvable) {
      const solvedBoard = boardData.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const wasEmpty = cell.value === "";
          const solvedValue = result.solution[rIdx][cIdx];
          return {
            ...cell,
            value: solvedValue.toString(),
            isUserInput: !wasEmpty && cell.isUserInput,
            isSolverFilled: wasEmpty,
            isValid: true,
          };
        })
      );
      setBoardData(solvedBoard);
      setIsSolved(true);
    } else {
      setModalMessage("The puzzle is unsolvable. Please try another puzzle.");
      setShowModal(true);
    }
  };

  const hasConflicts = (board) => {
    // Implement conflict checking logic
    for (let i = 0; i < 9; i++) {
      const rowSet = new Set();
      const colSet = new Set();
      const boxSet = new Set();

      for (let j = 0; j < 9; j++) {
        const rowVal = board[i][j];
        const colVal = board[j][i];
        const boxVal =
          board[3 * Math.floor(i / 3) + Math.floor(j / 3)][
            3 * (i % 3) + (j % 3)
          ];

        if (rowVal !== 0) {
          if (rowSet.has(rowVal)) return true;
          rowSet.add(rowVal);
        }
        if (colVal !== 0) {
          if (colSet.has(colVal)) return true;
          colSet.add(colVal);
        }
        if (boxVal !== 0) {
          if (boxSet.has(boxVal)) return true;
          boxSet.add(boxVal);
        }
      }
    }
    return false;
  };

  const handleReset = () => {
    setBoardData(() => createEmptyBoard());
    setIsSolved(false);
  };

  return (
    <div className={puzzleStyles.container}>
      <Sidebar instructions={instructions}></Sidebar>
      <div className={puzzleStyles.board}>
        <SudokuBoard
          boardData={boardData}
          onCellChange={handleCellChange}
          readOnly={isSolved}
        />
        <button
          className={`${buttonStyles.buttonLink} ${puzzleStyles.buttonLink}`}
          onClick={isSolved ? handleReset : handleSubmit}
        >
          {isSolved ? "Reset" : "Submit"}
        </button>
      </div>
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => setShowModal(false)}
          buttons={[{ text: "Try Again", onClick: () => setShowModal(false) }]}
        />
      )}
    </div>
  );
};

export default GenerateSolution;
