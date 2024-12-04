import Sidebar from "./Sidebar";

import "../styles/puzzle-page.css";

const GenerateSolution = () => {
  const instructions = [
    "Fill in the Sudoku board with your puzzle.",
    "Click the Submit button to generate the solution.",
    "Make sure to fill in all necessary cells for accurate results.",
  ];

  return (
    <div className="puzzle-page-container">
      <Sidebar instructions={instructions}></Sidebar>
      <div className="board"></div>
    </div>
  );
};

export default GenerateSolution;
