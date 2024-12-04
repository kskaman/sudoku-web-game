import Sidebar from "./Sidebar";

const SolvePuzzle = () => {
  const instructions = [
    "Some boxes are pre-filled. Fill in the empty boxes with the correct numbers.",
    "If you enter the right number, the background and the number will turn green.",
    "If the entered number is wrong, the background and the number will turn red.",
  ];

  return (
    <div className="puzzle-page-container">
      <Sidebar instructions={instructions}></Sidebar>
      <main></main>
    </div>
  );
};

export default SolvePuzzle;
