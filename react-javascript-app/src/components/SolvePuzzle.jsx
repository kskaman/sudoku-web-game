import Sidebar from "./Sidebar";
import Modal from "./Modal";
import SudokuBoard from "./SudokuBoard";

import { generatePuzzle, difficultyLevels } from "../utils/solvePuzzleLogic.js";

import puzzleStyles from "../styles/Puzzle.module.css";
import buttonStyles from "../styles/Button.module.css";

import { useState, useRef } from "react";

const createBoardFromPuzzle = (puzzleArray) => {
  return puzzleArray.map((row) =>
    row.map((val) => ({
      value: val === "" ? "" : val.toString(),
      isUserInput: false,
      isSolverFilled: val !== "",
      isValid: true,
    }))
  );
};

const isBoardComplete = (boardData, solution) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const userVal = boardData[r][c].value;
      const solVal = solution[r][c];
      if (userVal === "" || parseInt(userVal, 10) !== solVal) {
        return false;
      }
    }
  }
  return true;
};

const SolvePuzzle = () => {
  const instructions = [
    "Some boxes are pre-filled. Fill in the empty boxes with the correct numbers.",
    "If you enter the right number, the background and the number will turn green.",
    "If the entered number is wrong, the background and the number will turn red.",
  ];

  const [boardData, setBoardData] = useState([]);
  let solvedPuzzleRef = useRef([]);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(true);
  const [difficulty, setDifficulty] = useState(null);

  const handleDifficultySelect = (level) => {
    const { puzzle, solution } = generatePuzzle(difficultyLevels[level]);
    setBoardData(createBoardFromPuzzle(puzzle));
    solvedPuzzleRef.current = solution;
    setShowDifficultyModal(false);
    setDifficulty(level);
  };

  const solvedPuzzle = solvedPuzzleRef.current;

  const handleCellChange = (row, col, newValue) => {
    // Only allow digits 1-9 or empty
    if (newValue === "" || /^[1-9]$/.test(newValue)) {
      setBoardData((prevBoard) => {
        const updatedBoard = prevBoard.map((r, rIdx) => {
          // console.log("solved puzzle : ", solvedPuzzle);
          // console.log("row : ", row);
          // console.log("col", col);

          return r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              const newCell = {
                ...cell,
                value: newValue,
                isUserInput: newValue !== "",
                isSolverFilled: false,
                isValid:
                  newValue === "" ||
                  Number(newValue) === solvedPuzzle[row][col],
              };
              return newCell;
            }

            return cell;
          });
        });

        if (isBoardComplete(updatedBoard, solvedPuzzle)) {
          setShowCongratsModal(true);
        }

        return updatedBoard;
      });
    }
  };

  const handleReset = () => {
    setBoardData((prevBoard) =>
      prevBoard.map((row) =>
        row.map((cell) => {
          if (cell.isUserInput) {
            return {
              ...cell,
              value: "",
              isUserInput: false,
              isSolverFilled: false,
              isValid: true,
            };
          }

          return { ...cell, isValid: true };
        })
      )
    );
    setShowCongratsModal(false);
  };

  return (
    <div className={puzzleStyles.container}>
      <Sidebar instructions={instructions}></Sidebar>
      <div className={puzzleStyles.board}>
        <div className={puzzleStyles.buttonRow}>
          <button
            className={`${buttonStyles.buttonLink} ${puzzleStyles.buttonLink}`}
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className={`${buttonStyles.buttonLink} ${puzzleStyles.buttonLink}`}
            onClick={() => setShowDifficultyModal(true)}
          >
            Change Difficulty
          </button>
        </div>

        {/* Render SudokuBoard if we have a puzzle */}
        {boardData.length > 0 && (
          <SudokuBoard
            boardData={boardData}
            onCellChange={handleCellChange}
            readOnly={false}
            isPuzzle={true}
          />
        )}
      </div>

      {showDifficultyModal && (
        <Modal
          message="Select Difficulty Level"
          onClose={() => setShowDifficultyModal(false)}
          buttons={[
            { text: "Easy", onClick: () => handleDifficultySelect("easy") },
            { text: "Medium", onClick: () => handleDifficultySelect("medium") },
            { text: "Hard", onClick: () => handleDifficultySelect("hard") },
            ...(difficulty
              ? [
                  {
                    text: "Resume Current Puzzle",
                    onClick: () => setShowDifficultyModal(false),
                  },
                ]
              : []),
          ]}
        />
      )}

      {showCongratsModal && (
        <Modal
          message="Congratulations! You have successfully completed the Sudoku puzzle!"
          onClose={() => setShowCongratsModal(false)}
          buttons={[
            {
              text: "Play Again",
              onClick: () => {
                setShowCongratsModal(false);
                setShowDifficultyModal(true);
              },
            },
          ]}
          links={[
            {
              text: "Home",
              to: "/",
            },
          ]}
        />
      )}
    </div>
  );
};

export default SolvePuzzle;
