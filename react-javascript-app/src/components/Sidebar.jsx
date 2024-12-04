import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Sidebar = ({ instructions }) => {
  return (
    <aside className="sidebar">
      <Link to="/" className="button-link">
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
