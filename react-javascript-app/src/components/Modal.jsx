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
            buttons.map((button, index) =>
              button.href ? (
                <a
                  key={index}
                  className={`${buttonStyles.buttonLink} ${modalStyles.buttonLink}`}
                  href={button.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onClose) onClose();
                  }}
                >
                  {button.text}
                </a>
              ) : (
                <button
                  key={index}
                  className={`${buttonStyles.buttonLink} ${modalStyles.buttonLink}`}
                  onClick={() => {
                    button.onClick();
                    if (onClose) onClose();
                  }}
                >
                  {button.text}
                </button>
              )
            )}
          {links &&
            links.map((link) => (
              <Link
                key={link.text}
                to={link.to}
                className={`${buttonStyles.buttonLink} ${modalStyles.buttonLink}`}
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
