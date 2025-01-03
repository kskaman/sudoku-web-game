import { Link } from "react-router-dom";

import homeStyles from "../styles/Home.module.css";
import buttonStyles from "../styles/Button.module.css";

import { BackgroundBoard } from "./BackgroundBoard";

const Home = () => {
  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.backgroundBlur} aria-hidden="true">
        <BackgroundBoard />
      </div>
      <header className={homeStyles.headerContainer}>
        <h1>Welcome to Sudoku Hub</h1>
      </header>
      <main className={homeStyles.mainContainer}>
        <section className={homeStyles.optionsContainer}>
          <h1 className={homeStyles.optionsHeading}>Choose an Option Below</h1>
          <div className={homeStyles.options}>
            <Link
              to="/generate-solution"
              className={`${buttonStyles.buttonLink} ${homeStyles.Links}`}
            >
              Generate a Sudoku Solution
            </Link>

            <Link
              to="/solve-puzzle"
              className={`${buttonStyles.buttonLink} ${homeStyles.Links}`}
            >
              Solve a Sudoku Puzzle
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
