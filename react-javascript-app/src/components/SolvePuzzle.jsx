import Sidebar from "./Sidebar";

import puzzleStyles from "../styles/Puzzle.module.css";

const SolvePuzzle = () => {
  const instructions = [
    "Some boxes are pre-filled. Fill in the empty boxes with the correct numbers.",
    "If you enter the right number, the background and the number will turn green.",
    "If the entered number is wrong, the background and the number will turn red.",
  ];

  return (
    <div className={puzzleStyles.container}>
      <Sidebar instructions={instructions}></Sidebar>
      <div className={puzzleStyles.board}></div>
    </div>
  );
};

export default SolvePuzzle;
