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
            <button className="button-link">Generate a Sudoku Solution</button>
            <button className="button-link">Solve a Sudoku Puzzle</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
