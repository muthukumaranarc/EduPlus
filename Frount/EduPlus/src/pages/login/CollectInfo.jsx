import "./CollectInfo.css";
import { useEffect, useState } from "react";
import FirstField from "./FirstField";
import SecondField from "./SecondField";
import axios from "axios";

export default function CollectInfo({whoCalled}) {
    const baseURL = import.meta.env.VITE_API_URL;
    const [field, setField] = useState((whoCalled === 'google') ? 2 : 1);
    const [username, setUsername] = useState("");   
    const [password, setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [mobile, setMobile] = useState();
    const [email, setEmail] = useState("");
    const [linkedIn, setLinkedIn] = useState("");

    const isPasswordStrong =
        password.length >= 8 && /[0-9]/.test(password);


    let [isUsernameValid, setIsUsernameValid] = useState(false);

    useEffect(() => {
        if (!username) return;
        const timer = setTimeout(() => {
            axios.post(
                `${baseURL}/user/is-user-exist`,
                username,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    },
                }
            )
                .then(res => {
                    setIsUsernameValid((username.length >= 8) ? !res.data : false);
                })
                .catch(() => {
                    setIsUsernameValid(false);
                });
        }, 500);
        return () => clearTimeout(timer);
    }, [baseURL, username]);


    const createUser = async () => {
        try {
            const res = await axios.post(
                `${baseURL}/user/create`,
                {
                    username: username,
                    password: password,
                    firstName: firstname,
                    lastName: lastname,
                    dob: dob,
                    gender: gender,
                    mobileNumber: mobile,
                    mailId: email,
                    linkedIn: linkedIn,
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
                            setDob={setDob}
                            setGender={setGender}
                            setMobile={setMobile}
                            setEmail={setEmail}
                            setLinkedIn={setLinkedIn}
                            dob={dob}
                            gender={gender}
                            mobile={mobile}
                            email={email}
                            linkedIn={linkedIn}
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
                                Previous
                            </button>
                            :
                            null
                    }
                    <button
                        className="button next"
                        onClick={() => {
                            (field === 1) ?
                                setField(2) :
                                createUser();
                        }}
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



