import "./Login.css";

import logo from "../assets/EduPlus_logo.png";
import name from "../assets/EduPlus_name.png";
import google from "../assets/Google.png";
import phone from "../assets/Call.png";

import axios from "axios";
function Login() {

    const baseURL = import.meta.env.VITE_API_URL;

    const handleGoogleLogin = (e) => {
        e.preventDefault();
        window.location.href = `${baseURL}/oauth2/authorization/google`;
    };


    const handleContinueLogin = (e) => {
        e.preventDefault();

        axios.post(
            "http://localhost:8080/user/login",
            {
                username: "paper",
                password: "paper123",
            },
            {
                withCredentials: true, // 🔥 REQUIRED for cookies
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then((res) => {
                console.log("Response:", res.data);
            })
            .catch((err) => {
                console.error("Error:", err);
            });
    };


    return (
        <>
            <div className="logo-sec">
                <img src={logo} alt="Eduplus logo" className="logo" />
                <img src={name} alt="Eduplus name" className="name" />
            </div>

            <div className="auth-sec">
                <h2>Login in or Sign up</h2>
                <p>Connect with us to improve your self</p>
                <input type="text" placeholder="Email address" />
                <br />
                <button className="continue" onClick={handleContinueLogin}>Continue</button>
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

export default Login

