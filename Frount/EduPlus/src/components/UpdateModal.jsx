import "./UpdateModal.css";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

function UpdateModal({ title, firstInput, secondInput, onUpdate, onCancel }) {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");

  const { user } = useContext(UserContext);

  return (
    <div className="overlay">
      <div className="update-box">
        <h1>{title}</h1>
        {
          (!user.username.includes("@")) ?
            <input
              type={firstInput.type}
              placeholder={firstInput.placeholder}
              value={first}
              onChange={(e) => setFirst(e.target.value)}
            /> :
            null

        }

        <input
          type={secondInput.type}
          placeholder={secondInput.placeholder}
          value={second}
          onChange={(e) => setSecond(e.target.value)}
        />

        <div className="actions">
          <button className="confirm" onClick={() => onUpdate(first, second)}>
            Update
          </button>

          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateModal;
