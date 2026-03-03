import './ConfirmAlert.css';
import { createPortal } from 'react-dom';

function ConfirmAlert({ message, onConfirm, onCancel }) {

  const handleConfirm = () => {
    onConfirm();
    console.log("Confirmed ✅");
  };

  const handleCancel = () => {
    onCancel();
    console.log("Cancelled ❌");
  };

  return createPortal(
    <div className="overlay">
      <div className="alert-box">
        <p>{message}</p>

        <div className="actions">
          <button className="confirm" onClick={handleConfirm}>
            Confirm
          </button>

          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmAlert;
