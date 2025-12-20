import "./CollectInfo.css";
import { useState } from "react";
import FirstField from "./FirstField";
import SecondField from "./SecondField";

export default function CollectInfo() {
    const [field, setField] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [mobile, setMobile] = useState();
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");

    const isUsernameValid = username.length >= 4;
    const isPasswordStrong = password.length >= 8;

    return (
        <>
            <div className="card">
                <div className={`card-bar`}></div>

                <h2>Just a few steps to get started</h2>

                {
                    (field === 1) ?
                        <FirstField
                            setFirstname={setFirstname}
                            setLastname={setLastname}
                            setUsername={setUsername}
                            setPassword={setPassword}
                            username={username}
                            password={password}
                            firstname={firstname}
                            lastname={lastname}
                            isUsernameValid={isUsernameValid}
                            isPasswordStrong={isPasswordStrong}
                        />
                        :
                        <SecondField
                            dob={dob}
                            setDob={setDob}
                            gender={gender}
                            setGender={setGender}
                            mobile={mobile}
                            setMobile={setMobile}
                            email={email}
                            setEmail={setEmail}
                            linkedIn={linkedIn}
                            setLinkedIn={setLinkedIn}
                        />

                }

                <div
                    className="footer"
                    style={{ justifyContent: `${field === 2 ? 'space-between' : 'flex-end'}` }}
                >
                    {
                        (field == 2) ?
                            <button
                                className="button previous"
                                onClick={() => { setField(1) }}
                            >
                                previous
                            </button>
                            :
                            null
                    }
                    <button
                        className="button next"
                        onClick={() => { setField(2) }}
                    >
                        {
                            (field === 1) ? 'Next' : 'Get start'
                        }
                    </button>
                </div>
            </div>
        </>
    );
}



