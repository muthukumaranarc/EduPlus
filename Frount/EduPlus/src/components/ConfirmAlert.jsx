import './ConfirmAlert.css';

function ConfirmAlert({ message, onConfirm, onCancel}) {

  const handleConfirm = () => {
    onConfirm();
    console.log("Confirmed ✅");
  };

  const handleCancel = () => {
    onCancel();
    console.log("Cancelled ❌");
  };

  return (
    <>
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
        </div>
    </>
  );
}

export default ConfirmAlert;
