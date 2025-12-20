import "./Login.css";

import logo from "../../assets/EduPlus_logo.png";
import nameImg from "../../assets/EduPlus_name.png";
import google from "../../assets/Google.png";
import phone from "../../assets/Call.png";

import axios, { Axios } from "axios";
import { useEffect, useState } from "react";

function Login() {
    const baseURL = import.meta.env.VITE_API_URL;
    // const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isUserExist, setIsUserExist] = useState(null);
    const [wrongPass, setWrongPass] = useState(false);

    useEffect(() => {
        if (!username || username.trim().length < 3) {
            setIsUserExist(null);
            return;
        }

        const delay = setTimeout(() => {
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
                    setIsUserExist(res.data);
                })
                .catch(() => {
                    setIsUserExist(null);
                });
        }, 500);

        return () => clearTimeout(delay);

    }, [baseURL, username]);

    const loginUser = async () => {
        try {
            const res = await axios.post(
                `${baseURL}/user/login`,
                {
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setWrongPass(false);
            console.log("Login success:", res.data);
            window.location.replace("/home")
        } catch (err) {
            console.error("Login failed:", err);
            setWrongPass(true);
        }
    };


    const createUser = async () => {
        try {
            const res = await axios.post(
                `${baseURL}/user/create`,
                {
                    username: username,
                    password: password,
                    // add other User fields if required
                    // email: "",
                    // role: "USER"
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            setWrongPass(false);
            console.log("User created:", res.data);
            window.location.replace("/home")
        } catch (err) {
            console.error("User creation failed:", err);
            setWrongPass(true);
        }
    };


    const handleContinue = (e) => {
        e.preventDefault();

        if (isUserExist === true) {
            loginUser();
        } else if (isUserExist === false) {
            createUser();
        }
    };

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = `${baseURL}/oauth2/authorization/google`;
    };

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
                    onChange={(e) => {setUsername(e.target.value); setWrongPass(false)}}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value); setWrongPass(false)}}
                />

                {
                    (wrongPass == true) ? <h4>Wrong password or username!</h4> : null
                }

                <button className="continue" onClick={handleContinue}>
                    Continue
                </button>

                <p>OR</p>

                <button className="google-but" onClick={handleGoogleLogin}>
                    <img src={google} alt="Google" />
                    <p>Connect with Google</p>
                </button>

                <br />

                <button className="phone-but">
                    <img src={phone} alt="phone" />
                    <p>Connect with Phone</p>
                </button>
            </div>
        </>
    );
}

export default Login;
