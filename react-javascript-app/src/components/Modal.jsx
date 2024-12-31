import PropTypes from "prop-types";

import modalStyles from "../styles/Modal.module.css";
import buttonStyles from "../styles/Button.module.css";

function Modal({ message, buttons, onClose }) {
  return (
    <div
      className={modalStyles.modal}
      style={{ visibility: "visible", opacity: 1 }}
    >
      <div className={modalStyles.modalContent}>
        <h2>{message}</h2>
        <div className={modalStyles.modalFooter}>
          {buttons.map((button, index) =>
            button.href ? (
              <a
                key={index}
                className={buttonStyles.buttonLink}
                href={button.href}
                onClick={onClose}
              >
                {button.text}
              </a>
            ) : (
              <button
                key={index}
                className={buttonStyles.buttonLink}
                onClick={() => {
                  button.onClick();
                  if (onClose) onClose();
                }}
              >
                {button.text}
              </button>
            )
          )}
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
};

export default Modal;
