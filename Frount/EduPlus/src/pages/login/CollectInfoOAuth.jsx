import { useState, useContext } from 'react';
import './CollectInfoOAuth.css';
import { UserContext } from '../../context/UserContext';
import axios from 'axios';

function CollectInfoOAuth() {
    const baseURL = import.meta.env.VITE_API_URL;
    let { user } = useContext(UserContext);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [mobile, setMobile] = useState();
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [profilePreview, setProfilePreview] = useState("");

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convert to Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicture(reader.result);
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleMobileChange = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, "");
        if (value.length <= 10) {
            setMobile(value);
        }
    };

    const createUser = async () => {
        try {
            const res = await axios.post(
                `${baseURL}/user/update-oauth`,
                {
                    username: user.username,
                    firstName: firstname,
                    lastName: lastname,
                    dob: dob,
                    gender: gender,
                    mobileNumber: mobile,
                    mailId: email,
                    linkedIn: linkedIn,
                    profilePicture: profilePicture,
                    trophy: 10
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("User created:", res.data);
            window.location.replace("/home")
        } catch (err) {
            console.error("User creation failed:", err);
        }
    };

    return (
        <>
            <div className="card">
                <div className={`card-bar`}></div>

                <h2>Just a few steps to get started</h2>

                <div className="name-rowOAuth">
                    <div className="field">
                        <label>First name</label>
                        <input
                            type="text"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </div>

                    <div className="field">
                        <label>Last name</label>
                        <input
                            type="text"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="field">
                        <label>Profile Picture (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                        />
                        {profilePreview && (
                            <img
                                src={profilePreview}
                                alt="Profile Preview"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    marginTop: "10px"
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="field dob">
                        <label>Date of birth</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                        />
                    </div>

                    <div className="field gender">
                        <label>Gender</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="field mobile">
                        <label>Mobile number</label>
                        <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={mobile}
                            onChange={handleMobileChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="field email">
                        <label>Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="field linkedin">
                        <label>LinkedIn</label>
                        <input
                            type="text"
                            value={linkedIn}
                            onChange={(e) => setLinkedIn(e.target.value)}
                        />
                    </div>
                </div>

                <div
                    className="footer"
                    style={{ justifyContent: 'flex-end' }}
                >
                    <button
                        className="button next"
                        onClick={() => { createUser() }}
                    >
                        Get start
                    </button>
                </div>
            </div>
        </>
    );
}

export default CollectInfoOAuth;