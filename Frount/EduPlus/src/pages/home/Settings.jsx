import "./Settings.css";

import profile from '../../assets/profile.png';
import arrow from '../../assets/arrow.png';

function Settings() {

    let fullName = 'Muthu Kumaran'
    let dob = 'July 12 2008';
    let gender = 'Male';
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
            <p>Welcome, {fullName}</p>
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
                        <p>Name</p>
                        <p>{fullName}</p>
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
                        <p>theme</p>
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