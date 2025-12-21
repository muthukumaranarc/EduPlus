import "./Settings.css";

import profile from '../../../assets/profile.png';
import arrow from '../../../assets/arrow.png';
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";


function Settings() {
    const baseURL = import.meta.env.VITE_API_URL;
    let { setNavState } = useOutletContext();
    let { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        setNavState("setting");
    }, [setNavState]);

    let theme = 'Light theme';
    let Language = 'English';
    let Notification = 'ON';


    const api = axios.create({
        baseURL: `${baseURL}/user`,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });


    const updateUsername = async (usernameToChange, password) => {
        return api.post("/update-username", {
            usernameToChange,
            password,
        });
    };

    const updatePassword = async (currentPassword, newPassword) => {
        return api.post("/update-password", {
            currentPassword,
            newPassword,
        });
    };

    const updateFirstname = async (password, firstname) => {
        return api.post("/update-firstname", {
            password,
            firstname,
        });
    };

    const updateLastname = async (password, lastname) => {
        return api.post("/update-lastname", {
            password,
            lastname,
        });
    };

    const updateMobileNumber = async (password, mobilenumber) => {
        return api.post("/update-mobile-number", {
            password,
            mobilenumber,
        });
    };

    const updateMailId = async (password, mailid) => {
        return api.post("/update-mail-id", {
            password,
            mailid,
        });
    };

    const updateDOB = async (password, dob) => {
        return api.post("/update-dob", {
            password,
            dob, // "2004-07-12"
        });
    };

    const updateGender = async (password, gender) => {
        return api.post("/update-gender", {
            password,
            gender, // "Male" | "Female" | "Other"
        });
    };

    const updateLinkedIn = async (password, linkedin) => {
        return api.post("/update-linkedin", {
            password,
            linkedin,
        });
    };

    const logoutUser = async () => {
        return api.get("/logout");
    };

    const deleteUser = async () => {
        return api.delete("/delete");
    };

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/account-login");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser();
            navigate("/account-login");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <>
            <h3>Settings</h3>
            <div className="settings">
                <div className="main-prof">
                    <img src={profile} alt="profile" />
                </div>
                <p>Welcome,
                    {
                        ' ' + user.firstName + ' ' + ((user.lastName != null) ? user.lastName : '')
                    }
                </p>
                <div className="account-set">
                    <h4>Account Settings</h4>
                    <p>Customize your account detatils</p>
                    <div>
                        <div>
                            <div>
                                <p>Profile picture</p>
                                <p>A profile picture helps personalize your account</p>
                            </div>
                            <div><img src={profile} alt="profile" /></div>
                        </div>
                        <div>
                            <p>User ID</p>
                            <p>{user.username}</p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Password</p>
                            <p>* * * * * *</p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>First Name</p>
                            <p>
                                {
                                    (user.firstName != null) ? user.firstName : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Last Name</p>
                            <p>
                                {
                                    (user.lastName != null) ? user.lastName : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Birthday</p>
                            <p>
                                {
                                    (user.dob != null) ? user.dob : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Gender</p>
                            <p>
                                {
                                    (user.gender != null) ? user.gender : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Mobile</p>
                            <p>
                                {
                                    (user.mobileNumber != null) ? user.mobileNumber : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>Email</p>
                            <p>
                                {
                                    (user.mailId != null) ? user.mailId : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                        <div>
                            <p>LinkedIn</p>
                            <p>
                                {
                                    (user.linkedIn != null) ? user.linkedIn : 'Not set'
                                }
                            </p>
                            <img src={arrow} />
                        </div>
                    </div>
                </div>
                <div className="app-set">
                    <h4>App Settings</h4>
                    <p>Customize this application</p>
                    <div>
                        <div>
                            <p>Theme</p>
                            <p>{theme}</p>
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
                    <button className="log-out" onClick={() => { handleLogout() }}>Log out account</button>
                    <button className="delete-acc" onClick={() => { handleDelete() }}>Delete account</button>
                </div>
            </div>
        </>
    );
}

export default Settings;