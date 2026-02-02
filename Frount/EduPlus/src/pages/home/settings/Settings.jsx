import "./Settings.css";

import profile from '../../../assets/profile.png';
import arrow from '../../../assets/arrow.png';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import ConfirmAlert from "../../../components/ConfirmAlert";
import UpdateModal from "../../../components/UpdateModal";

function Settings() {
    const baseURL = import.meta.env.VITE_API_URL;

    let Language = 'English';
    let Notification = 'ON';

    const { setNavState } = useOutletContext();
    const { user, setUser, loading } = useContext(UserContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmType, setConfirmType] = useState(null);

    const [showUpdate, setShowUpdate] = useState(false);
    const [updateType, setUpdateType] = useState(null);

    useEffect(() => {
        setNavState("setting");
    }, [setNavState]);

    const api = axios.create({
        baseURL: `${baseURL}/user`,
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
    });

    const updateUsername = (password, username) => {
        alert("Changing your username will sign you out of this session for security purposes. Are you sure you want to continue?")
        api.post("/update-username",
            { password, usernameToChange: username }
        );
        handleLogout();
    }

    const updatePassword = (currentPassword, newPassword) =>
        api.post("/update-password",
            { currentPassword, newPassword }
        );

    const updateFirstname = (password, firstname) => {
        api.post("/update-firstname",
            { password, firstname }
        );
        console.log('updated')
    }

    const updateLastname = (password, lastname) =>
        api.post("/update-lastname",
            { password, lastname }
        );

    const updateMobileNumber = (password, mobilenumber) =>
        api.post("/update-mobile-number",
            { password, mobilenumber }
        );

    const updateMailId = (password, mailid) =>
        api.post("/update-mail-id",
            { password, mailid }
        );

    const updateDOB = (password, dob) =>
        api.post("/update-dob",
            { password, dob }
        );

    const updateGender = (password, gender) =>
        api.post("/update-gender",
            { password, gender }
        );

    const updateLinkedIn = (password, linkedin) =>
        api.post("/update-linkedin",
            { password, linkedin }
        );

    const logoutUser = () => api.get("/logout");
    const deleteUser = () => api.delete("/delete");

    const handleLogout = async () => {
        await logoutUser();
        navigate("/account-login");
    };

    const handleDelete = async () => {
        await deleteUser();
        navigate("/account-login");
    };

    const openUpdateModal = (config) => {
        setUpdateType(config);
        setShowUpdate(true);
    };

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

    if (loading || !user) {
        return (
            <div className="friend-page">
                <p style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading friends...
                </p>
            </div>
        );
    }


    return (
        <>
            <h3 style={{ position: "absolute", top: "5px", left: "20px", textAlign: "left" }}>Settings</h3>

            <div className="settings">
                <div className="main-prof">
                    <img src={profile} alt="profile" />
                </div>

                <p>
                    Welcome, {user.firstName} {user.lastName ?? ""}
                </p>

                <div className="account-set">
                    <h4>Account Settings</h4>
                    <p>Customize your account details</p>
                    <button
                        onClick={fetchUser}
                        className="reload-setting">
                        <img src="/src/assets/reload.png" alt="reload" />
                    </button>

                    <div>
                        <div>
                            <div>
                                <p>Profile picture</p>
                                <p>A profile picture helps personalize your account</p>
                            </div>
                            <div>
                                <img src={profile} alt="profile" />
                            </div>
                        </div>

                        <div onClick={() =>
                            (user != null && user.username && !user.username.includes("@")) ?
                                openUpdateModal({
                                    title: "Update Username",
                                    firstInput: { placeholder: "Password", type: "password" },
                                    secondInput: { placeholder: "New username", type: "text" },
                                    onUpdate: (a, b) => { updateUsername(a, b); setShowUpdate(false); },
                                    onCancel: () => setShowUpdate(false)
                                }) :
                                alert("Updating the ID is not allowed for users logged in with Google.")
                        }>
                            <p>User ID</p>
                            <p>{user.username}</p>
                            <img src={arrow} />
                        </div>

                        {
                            (user != null && user.username && !user.username.includes("@")) ?
                                <>
                                    <div onClick={() => openUpdateModal({
                                        title: "Update Password",
                                        firstInput: { placeholder: "Current password", type: "password" },
                                        secondInput: { placeholder: "New password", type: "password" },
                                        onUpdate: (a, b) => { updatePassword(a, b); setShowUpdate(false); },
                                        onCancel: () => setShowUpdate(false)
                                    })}>
                                        <p>Password</p>
                                        <p>* * * * * *</p>
                                        <img src={arrow} />
                                    </div>
                                </> :
                                null
                        }

                        <div onClick={() => openUpdateModal({
                            title: "Update First Name",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "New first name", type: "text" },
                            onUpdate: (a, b) => { updateFirstname(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>First Name</p>
                            <p>{user.firstName ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update Last Name",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "New last name", type: "text" },
                            onUpdate: (a, b) => { updateLastname(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>Last Name</p>
                            <p>{user.lastName ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update Date of Birth",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "Date of Birth", type: "date" },
                            onUpdate: (a, b) => { updateDOB(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>Birthday</p>
                            <p>{user.dob ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update Gender",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "Gender", type: "text" },
                            onUpdate: (a, b) => { updateGender(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false),
                            type: "select"
                        })}>
                            <p>Gender</p>
                            <p>{user.gender ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update Mobile Number",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "Mobile number", type: "tel" },
                            onUpdate: (a, b) => { updateMobileNumber(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>Mobile</p>
                            <p>{user.mobileNumber ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update Email",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "Email ID", type: "email" },
                            onUpdate: (a, b) => { updateMailId(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>Email</p>
                            <p>{user.mailId ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                        <div onClick={() => openUpdateModal({
                            title: "Update LinkedIn",
                            firstInput: { placeholder: "Password", type: "password" },
                            secondInput: { placeholder: "LinkedIn URL", type: "text" },
                            onUpdate: (a, b) => { updateLinkedIn(a, b); setShowUpdate(false); },
                            onCancel: () => setShowUpdate(false)
                        })}>
                            <p>LinkedIn</p>
                            <p>{user.linkedIn ?? "Not set"}</p>
                            <img src={arrow} />
                        </div>

                    </div>
                </div>

                <div className="app-set">
                    <h4>App Settings</h4>
                    <p>Customize this application</p>
                    <div>
                        <div onClick={toggleTheme}>
                            <p>Theme</p>
                            <p>{theme.charAt(0).toUpperCase() + theme.slice(1)} mode</p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Language</p>
                            <p>{Language}</p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Notification</p>
                            <p>{Notification}</p>
                            <img src={arrow} />
                        </div>
                    </div>
                </div>

                <div className="acc">
                    <button className="log-out" onClick={() => { setConfirmType("login"); setShowConfirm(true) }}>Log out account</button>
                    <button className="delete-acc" onClick={() => { setConfirmType("delete"); setShowConfirm(true) }}>Delete account</button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmAlert
                    message={confirmType === "delete"
                        ? "Are you sure you want to delete your account?"
                        : "Are you sure you want to log out?"}
                    onConfirm={() => {
                        setShowConfirm(false);
                        confirmType === "delete" ? handleDelete() : handleLogout();
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {showUpdate && updateType && (
                <UpdateModal {...updateType} />
            )}
        </>
    );
}

export default Settings;
