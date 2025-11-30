import "./NotFound.css";
import oops from "../assets/oops.png";
import { useNavigate } from "react-router-dom";

import logo from "../assets/EduPlus_logo.png";
import name from "../assets/EduPlus_name.png";

export function NotFound() {

    const navigate = useNavigate();
    
    return (
        <>
        <div className="logo-sec">
            <img src={logo}  alt="Eduplus logo" className="logo"/>
            <img src={name} alt="Eduplus name" className="name"/>
        </div>
        <div className="not-found">
            <img src={oops} alt="oops" />
            <h1>404 - PAGE NOT FOUND</h1>
            <p>the page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
            <button onClick={() => {navigate("/home")}}>GO TO HOMEPAGE</button>
        </div>
        </>
    );
}