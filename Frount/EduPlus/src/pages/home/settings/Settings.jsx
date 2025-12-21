import "./Settings.css";

import profile from '../../../assets/profile.png';
import arrow from '../../../assets/arrow.png';
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";

function Settings() {
    let { setNavState } = useOutletContext();
    let { user } = useContext(UserContext);

    useEffect(() => {
        setNavState("setting");
        console.log(user);
    }, [setNavState, user]);

    let theme = 'Light theme';
    let Language = 'English';
    let Notification = 'ON';


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
                    <button className="log-out">Log out account</button>
                    <button className="delete-acc">Delete account</button>
                </div>
            </div>
        </>
    );
}

export default Settings;