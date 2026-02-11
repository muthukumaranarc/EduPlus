import "./UpdateModal.css";
import { useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";

function UpdateModal({ title, firstInput, secondInput, onUpdate, onCancel, type }) {
  const baseURL = import.meta.env.VITE_API_URL;
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const inputRef = useRef(null);

  const { user, setUser } = useContext(UserContext);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${baseURL}/user/get-user`, {
        withCredentials: true,
      });
      setUser(res.data);
      console.log("User not get: ", res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setUser(null);
      }
    } finally {
      console.log("Fetch completed");
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleConfirm = async () => {
    await onUpdate(first, second);
    await delay(1000);
    alert("Data is updated!");
    fetchUser();
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleConfirm();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="overlay">
      <div className="update-box">
        <h1>{title}</h1>

        {user != null && user.username && !user.username.includes("@") && (
          <input
            ref={inputRef}
            type={firstInput.type}
            placeholder={firstInput.placeholder}
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        )}

        {
          (type === "select") ?
            <select
              value={second}
              onChange={(e) => setSecond(e.target.value)}
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select> :
            secondInput.type === "file" ?
              <input
                type="file"
                accept={secondInput.accept || "image/*"}
                onChange={(e) => {
                  const file = e.target.files[0];
                  setSecond(file);
                }}
              /> :
              <input
                ref={secondInput.type == 'text' ? inputRef : null}
                type={secondInput.type}
                placeholder={secondInput.placeholder}
                value={second}
                onChange={(e) => setSecond(e.target.value)}
                onKeyDown={handleKeyDown}
              />
        }



        <div className="actions">
          <button className="confirm" onClick={handleConfirm}>
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
