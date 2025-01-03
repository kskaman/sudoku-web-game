import PropTypes from "prop-types";

import { Link } from "react-router-dom";

import modalStyles from "../styles/Modal.module.css";
import buttonStyles from "../styles/Button.module.css";

function Modal({ message, buttons, onClose, links }) {
  return (
    <div
      className={modalStyles.modal}
      style={{ visibility: "visible", opacity: 1 }}
    >
      <div className={modalStyles.modalContent}>
        <h2>{message}</h2>
        <div className={modalStyles.modalFooter}>
          {buttons &&
            buttons.map((button, index) => {
              if (button.text === "Resume Current Puzzle") {
                return (
                  <div
                    key={index}
                    className={modalStyles.resumeButtonContainer}
                  >
                    <button
                      className={`${buttonStyles.buttonLink} ${modalStyles.buttons}`}
                      onClick={() => {
                        button.onClick();
                        if (onClose) onClose();
                      }}
                    >
                      {button.text}
                    </button>
                  </div>
                );
              } else {
                return (
                  <button
                    key={index}
                    className={`${buttonStyles.buttonLink} ${modalStyles.buttons}`}
                    onClick={() => {
                      button.onClick();
                      if (onClose) onClose();
                    }}
                  >
                    {button.text}
                  </button>
                );
              }
            })}

          {links &&
            links.map((link) => (
              <Link
                key={link.text}
                to={link.to}
                className={`${buttonStyles.buttonLink} ${modalStyles.Links}`}
              >
                {link.text}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  message: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      href: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    })
  ),
};

export default Modal;
