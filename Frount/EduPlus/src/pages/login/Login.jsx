import "./Login.css";

import logo from "../../assets/EduPlus_logo.png";
import nameImg from "../../assets/EduPlus_name.png";
import google from "../../assets/Google.png";
// import phone from "../../assets/Call.png";

import axios, { Axios } from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Login() {
    const baseURL = import.meta.env.VITE_API_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [wrongPass, setWrongPass] = useState(false);
    const inputRef = useRef(null);

    const loginUser = async () => {
        try {
            await axios.post(
                `${baseURL}/user/login`,
                {
                    username,
                    password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setWrongPass(false);
            window.location.replace("/home");
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setWrongPass(true);
        }
    };

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = `${baseURL}/oauth2/authorization/google`;
    };

    const handleKeyDownUsername = async (e) => {
        if (e.key === "Enter") {
            await inputRef.current?.focus();
        }
    };

    const handleKeyDownPassword = async (e) => {
        if (e.key === "Enter") {
            await loginUser();
        }
    };

    useEffect(() => {
        
    }, []);

    return (
        <>
            <div className="logo-sec">
                <img src={logo} alt="EduPlus logo" className="logo" />
                <img src={nameImg} alt="EduPlus name" className="name" />
            </div>

            <div className="auth-sec">
                <h2>Login or Sign up</h2>
                <p>Connect with us to improve yourself</p>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onKeyDown={handleKeyDownUsername}
                    onChange={(e) => { setUsername(e.target.value); setWrongPass(false) }}
                    />

                <input
                    ref={inputRef}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onKeyDown={handleKeyDownPassword}
                    onChange={(e) => { setPassword(e.target.value); setWrongPass(false) }}
                />

                {
                    (wrongPass == true) ? <h4>Wrong password or username!</h4> : null
                }

                <button className="continue" onClick={loginUser}>
                    Continue
                </button>

                <p>OR</p>

                <button className="google-but" onClick={handleGoogleLogin}>
                    <img src={google} alt="Google" />
                    <p>Connect with Google</p>
                </button>

                <br />

                {/* <button className="phone-but">
                    <img src={phone} alt="phone" />
                    <p>Connect with Phone</p>
                </button> */}
                <Link to='/create-new-account' className="create-new-account">Create a new account</Link>
            </div>
        </>
    );
}

export default Login;
