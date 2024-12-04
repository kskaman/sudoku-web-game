import { Link } from "react-router-dom";

import "../styles/home.css";
import "../styles/buttons.css";

import { BackgroundBoard } from "./BackgroundBoard";

function Home() {
  return (
    <div className="container">
      <div className="background-blur" aria-hidden="true">
        <BackgroundBoard />
      </div>
      <header className="header-container">
        <h1>Welcome to Sudoku Hub</h1>
      </header>
      <main className="main-container">
        <section className="options-container">
          <h1 className="option-heading">Choose an Option Below : </h1>
          <div className="options">
            <Link to="/generate-solution" className="button-link">
              Generate a Sudoku Solution
            </Link>

            <Link to="/solve-puzzle" className="button-link">
              Solve a Sudoku Puzzle
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
