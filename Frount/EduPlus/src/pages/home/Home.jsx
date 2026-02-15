import "./Home.css";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import Trophy from "../../components/Trophy";
import ScrollToTop from "./ScrollToTop";
import { UserContext } from '../../context/UserContext';

import eduplus_logo from '../../assets/eduplus_logo.png';
import eduplus_name from '../../assets/eduplus_name.png';

import dashboard_icon from '../../assets/dashboard.png';
import action_icon from '../../assets/action.png';
import ai_chat_icon from '../../assets/ai_chat.png';
import friends_icon from '../../assets/friends.png';
import settings_icon from '../../assets/settings.png';
import menu_icon from '../../assets/menu.jpg';
import trophy_icon from '../../assets/trophy.png';

import dashboard_icon_g from '../../assets/dashboard_g.png';
import action_icon_g from '../../assets/action_g.png';
import ai_chat_icon_g from '../../assets/ai_chat_g.png';
import friends_icon_g from '../../assets/friends_g.png';
import settings_icon_g from '../../assets/settings_g.png';
import trophy_icon_g from '../../assets/trophy_dark.png';

function Home() {
    let [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const parms = useParams();
    let [navState, setNavState] = useState(parms.nav);
    let [isNavActive, setIsNavActive] = useState(false);
    let { user } = useContext(UserContext);
    let [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setDeviceWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (parms.nav === undefined) {
            navigate("/home/dashboard");
        }
        if (parms.nav) {
            setNavState(parms.nav);
        }
    }, [navigate, parms.nav]);

    useEffect(() => {
        const outlet = document.querySelector(".outlet");
        if (outlet) {
            outlet.scrollTop = 0;
        }
    }, [navState]);


    return (
        <div className="home-page">
            <ScrollToTop />
            <div className="home">
                {
                    (deviceWidth >= 786) ? <Trophy /> : null
                }

                <div className={`nav ${isNavActive ? "active-nav" : ""}`} >
                    <div>
                        {
                            (deviceWidth > 768) ?
                                <div className="logo-box" >
                                    <img src={eduplus_logo} alt="Eduplus logo" className="logo" />
                                    <img src={eduplus_name} alt="Eduplus name" className="name" />
                                </div> :
                                <Trophy />
                        }

                        <div
                            onClick={() => { navigate("/home/dashboard"); setIsNavActive(false) }}
                            className={`${navState === "dashboard" ? "active" : ""} dashboard`}
                        >
                            {
                                navState === "dashboard" ?
                                    <img src={dashboard_icon} alt="dashboard" /> :
                                    <img src={dashboard_icon_g} alt="dashboard" />
                            }
                            <p>Dashboard</p>
                        </div>

                        <div
                            onClick={() => { navigate("/home/action"); setIsNavActive(false) }}
                            className={`${(navState === "action" ||
                                navState === "plan" ||
                                navState === "communication" ||
                                navState === "progress" ||
                                navState === "fitness")
                                ? "active" : ""} action`}
                        >
                            {
                                (navState === "action" ||
                                    navState === "plan" ||
                                    navState === "communication" ||
                                    navState === "progress" ||
                                    navState === "fitness") ?
                                    <img src={action_icon} alt="action" /> :
                                    <img src={action_icon_g} alt="action" />
                            }
                            <p>Actions</p>
                        </div>

                        <div
                            onClick={() => { navigate("/home/ai"); setIsNavActive(false) }}
                            className={`${navState === "ai" ? "active" : ""} ai`}
                        >
                            {
                                navState === "ai" ?
                                    <img src={ai_chat_icon} alt="ai chat" /> :
                                    <img src={ai_chat_icon_g} alt="ai chat" />
                            }
                            <p>AI Chat</p>
                        </div>

                        <div
                            onClick={() => { navigate("/home/friend"); setIsNavActive(false) }}
                            className={`${navState === "friend" ? "active" : ""} friend`}
                        >
                            {
                                navState === "friend" ?
                                    <img src={friends_icon} alt="friends" /> :
                                    <img src={friends_icon_g} alt="friends" />
                            }
                            <p>Friends</p>
                        </div>

                        <div
                            onClick={() => { navigate("/home/trophies"); setIsNavActive(false) }}
                            className={`${navState === "trophies" ? "active" : ""} trophies`}
                        >
                            {
                                navState === "trophies" ?
                                    <img src={trophy_icon} alt="trophies" /> :
                                    <img src={trophy_icon_g} alt="trophies" />
                            }
                            <p>Trophies</p>
                        </div>

                        <div
                            onClick={() => { navigate("/home/setting"); setIsNavActive(false) }}
                            className={`${navState === "setting" ? "active" : ""} setting`}
                        >
                            {
                                navState === "setting" ?
                                    <img src={settings_icon} alt="settings" /> :
                                    <img src={settings_icon_g} alt="settings" />
                            }
                            <p>Settings</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="head-mobile">
                    <div>
                        <div className="mobile-menu" onClick={() => { setIsNavActive(true) }}>
                            <img src={menu_icon} alt="menu" />
                        </div>
                        <div className="mobile-logo" onClick={() => { navigate("/home/dashboard") }}>
                            <img src={eduplus_logo} alt="Eduplus logo" className="logo" />
                            <img src={eduplus_name} alt="Eduplus name" />
                        </div>
                    </div>
                    <div className="page-name">
                        <h2>{navState && navState[0].toUpperCase() + navState.slice(1)}</h2>
                        {
                            renderImage(navState)
                        }
                    </div>
                </div>
                <div className="outlet" onClick={() => { (isNavActive == true) ? setIsNavActive(false) : null }}>
                    <Outlet context={{ setNavState, deviceWidth, chatHistory, setChatHistory }} />
                    <div className={`dark`} style={{ display: ` ${isNavActive ? 'block' : 'none'}` }}></div>
                </div>
            </div>
        </div>
    )
}


function renderImage(navState) {
    switch (navState) {
        case "dashboard":
            return <img src={dashboard_icon} alt="dashboard" />;

        case "action":
            return <img src={action_icon} alt="action" />;

        case "ai":
            return <img src={ai_chat_icon} alt="ai chat" />;

        case "friend":
            return <img src={friends_icon} alt="friends" />;

        case "trophies":
            return <img src={trophy_icon} alt="trophies" />;

        case "setting":
            return <img src={settings_icon} alt="settings" />;

        default:
            null
    }
}

export default Home;
