import "./Settings.css";

import profile from '../../../assets/profile.png';
import arrow from '../../../assets/arrow.png';
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

function Settings() {

    let { setNavState } = useOutletContext();

    useEffect(() => {
        setNavState("setting");
    }, [setNavState]);

    let username = 'muthukumaranarc00'
    let firstName = 'Muthu'
    let lastName = 'Kumaran'
    let dob = 'July 12 2008';
    let gender = 'Male';
    let mobile = "+91 1234567890"
    let email = 'muthukumaranarc00@gmail.com';
    let linkedIn = 'muthukumaranarc';

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
            <p>Welcome, {firstName + ' ' + lastName}</p>
            <div className="account-set">
                <h4>Account Settings</h4>
                <p>Customize your account detatils</p>
                <div>
                    <div>
                        <p>Profile picture</p>
                        <p>A profile picture helps personalize your account</p>
                        <div><img src={profile} alt="profile" /></div>
                    </div>
                    <div>
                        <p>User ID</p>
                        <p>{username}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Password</p>
                        <p>* * * * * * * *</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>First Name</p>
                        <p>{firstName}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Lset Name</p>
                        <p>{lastName}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Birthday</p>
                        <p>{dob}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Gender</p>
                        <p>{gender}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Mobile</p>
                        <p>{mobile}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>Email</p>
                        <p>{email}</p>
                        <img src={arrow} />
                    </div>
                    <div>
                        <p>LinkedIn</p>
                        <p>{linkedIn}</p>
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