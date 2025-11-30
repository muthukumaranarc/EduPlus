import "./Home.css";

import logo from "../../assets/EduPlus_logo.png";
import name from "../../assets/EduPlus_name.png";
import trophyImg from "../../assets/trophy.png";

import dashboard from "../../assets/dashboard.png";
import actions from "../../assets/action.png";
import ai from "../../assets/ai_chat.png";
import tests from "../../assets/test.png";
import friends from "../../assets/friends.png";
import settings from "../../assets/settings.png";

import dashboard_g from "../../assets/dashboard_g.png";
import actions_g from "../../assets/action_g.png";
import ai_g from "../../assets/ai_chat_g.png";
import tests_g from "../../assets/test_g.png";
import friends_g from "../../assets/friends_g.png";
import settings_g from "../../assets/settings_g.png";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    let trophy = 100;
    
    const parms = useParams();
    let [navState, setNavState] = useState(parms.nav);

    useEffect(() => {
        if(parms.nav == undefined) {
            navigate("/home/dashboard")
        }
        if(parms.nav) {
            setNavState(parms.nav)
        }
    }, [navigate, parms.nav])

    return (
        <div className="home">
        <div className="trop">
                <img src={trophyImg} alt="trophy" />
                <p>Trophies: {trophy}</p>
        </div>
        <div className="Dashboard">
            <div className="nav">
                <div className="logo-box">
                    <img src={logo}  alt="Eduplus logo" className="logo"/>
                    <img src={name} alt="Eduplus name" className="name"/>
                </div>

                <div onClick={() => {navigate("/home/dashboard")}} className={`${navState === "dashboard" ? "active" : ""} dashboard`}>
                    {
                        (navState == "dashboard") ? <img src={dashboard} alt="dashboard" /> : <img src={dashboard_g} alt="dashboard" />
                    }
                    <p>Dashboard</p>
                </div>

                <div onClick={() => {navigate("/home/action")}} className={`${navState === "action" ? "active" : ""} action`} >
                    {
                        (navState == "action") ? <img src={actions} alt="action" /> : <img src={actions_g} alt="action" />
                    }
                    <p>Actions</p>
                </div>

                <div onClick={() => {navigate("/home/ai")}} className={`${navState === "ai" ? "active" : ""} ai`}>
                    {
                        (navState == "ai") ? <img src={ai} alt="ai chat" /> : <img src={ai_g} alt="ai chat" />
                    }
                    <p>AI Chat</p>
                </div>

                <div onClick={() => {navigate("/home/test")}} className={`${navState === "test" ? "active" : ""} test`}>
                    {
                        (navState == "test") ? <img src={tests} alt="test" /> : <img src={tests_g} alt="test" />
                    }
                    <p>Tests</p>
                </div>

                <div onClick={() => {navigate("/home/friend")}} className={`${navState === "friend" ? "active" : ""} friend`}>
                    {
                        (navState == "friend") ? <img src={friends} alt="friend" /> : <img src={friends_g} alt="friend" />
                    }
                    <p>Friends</p>
                </div>

                <div onClick={() => {navigate("/home/setting")}} className={`${navState === "setting" ? "active" : ""} setting`}>
                    {
                        (navState == "setting") ? <img src={settings} alt="setting" /> : <img src={settings_g} alt="setting" />
                    }
                    <p>Settings</p>
                </div>
            </div>
        </div>
        <div className="outlet">
            <Outlet/>
        </div>
        </div>
    )
}

export default Home;