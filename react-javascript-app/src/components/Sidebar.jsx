import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import buttonStyles from "../styles/Button.module.css";
import puzzleStyles from "../styles/Puzzle.module.css";

const Sidebar = ({ instructions }) => {
  return (
    <aside className={puzzleStyles.sidebar}>
      <Link
        to="/"
        className={`${buttonStyles.buttonLink} ${puzzleStyles.buttonLink}`}
      >
        Home
      </Link>
      <h2>Instructions</h2>
      <ol>
        {instructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
    </aside>
  );
};

Sidebar.propTypes = {
  instructions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sidebar;
