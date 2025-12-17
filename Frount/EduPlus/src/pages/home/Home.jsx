import "./Home.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import Trophy from "../../components/Trophy";
import ScrollToTop from "./ScrollToTop";

function Home() {
    let [deviceWidth, setDeviceWidth] = useState(window.innerWidth);
    const navigate = useNavigate();
    const parms = useParams();
    let [navState, setNavState] = useState(parms.nav);
    let [isNavActive, setIsNavActive] = useState(false);

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

    let trophy = 100;

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
                    (deviceWidth >= 786) ? <Trophy trophy={trophy} /> : null
                }

                <div className={`nav ${isNavActive ? "active-nav" : ""}`} >
                    {
                        (deviceWidth > 768) ?
                            <div className="logo-box" >
                                <img src="/src/assets/EduPlus_logo.png" alt="Eduplus logo" className="logo" />
                                <img src="/src/assets/EduPlus_name.png" alt="Eduplus name" className="name" />
                            </div> :
                            <Trophy trophy={trophy} />
                    }

                    <div
                        onClick={() => { navigate("/home/dashboard"); setIsNavActive(false) }}
                        className={`${navState === "dashboard" ? "active" : ""} dashboard`}
                    >
                        {
                            navState === "dashboard" ?
                                <img src="/src/assets/dashboard.png" alt="dashboard" /> :
                                <img src="/src/assets/dashboard_g.png" alt="dashboard" />
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
                                <img src="/src/assets/action.png" alt="action" /> :
                                <img src="/src/assets/action_g.png" alt="action" />
                        }
                        <p>Actions</p>
                    </div>

                    <div
                        onClick={() => { navigate("/home/ai"); setIsNavActive(false) }}
                        className={`${navState === "ai" ? "active" : ""} ai`}
                    >
                        {
                            navState === "ai" ?
                                <img src="/src/assets/ai_chat.png" alt="ai chat" /> :
                                <img src="/src/assets/ai_chat_g.png" alt="ai chat" />
                        }
                        <p>AI Chat</p>
                    </div>

                    <div
                        onClick={() => { navigate("/home/test"); setIsNavActive(false) }}
                        className={`${navState === "test" ? "active" : ""} test`}
                    >
                        {
                            navState === "test" ?
                                <img src="/src/assets/test.png" alt="test" /> :
                                <img src="/src/assets/test_g.png" alt="test" />
                        }
                        <p>Tests</p>
                    </div>

                    <div
                        onClick={() => { navigate("/home/friend"); setIsNavActive(false) }}
                        className={`${navState === "friend" ? "active" : ""} friend`}
                    >
                        {
                            navState === "friend" ?
                                <img src="/src/assets/friends.png" alt="friends" /> :
                                <img src="/src/assets/friends_g.png" alt="friends" />
                        }
                        <p>Friends</p>
                    </div>

                    <div
                        onClick={() => { navigate("/home/setting"); setIsNavActive(false) }}
                        className={`${navState === "setting" ? "active" : ""} setting`}
                    >
                        {
                            navState === "setting" ?
                                <img src="/src/assets/settings.png" alt="settings" /> :
                                <img src="/src/assets/settings_g.png" alt="settings" />
                        }
                        <p>Settings</p>
                    </div>

                </div>
            </div>

            <div>
                <div className="head-mobile">
                    <div>
                        <div className="mobile-menu" onClick={() => { setIsNavActive(true) }}>
                            <img src="/src/assets/menu.jpg" alt="menu" />
                        </div>
                        <div className="mobile-logo">
                            <img src="/src/assets/eduplus_logo.png" alt="Eduplus logo" className="logo" />
                            <img src="/src/assets/eduplus_name.png" alt="Eduplus name" />
                        </div>
                    </div>
                    <div className="page-name">
                        <h2>{navState && navState[0].toUpperCase() + navState.slice(1)}</h2>
                        <img src="/src/assets/dashboard.png" alt="dashboard" />
                    </div>
                </div>
                <div className="outlet" onClick={() => { (isNavActive == true) ? setIsNavActive(false) : null }}>
                    <Outlet context={{ setNavState, deviceWidth }} />
                    <div className={`dark`} style={{ display: ` ${isNavActive ? 'block' : 'none'}` }}></div>
                </div>
            </div>
        </div>
    )
}

export default Home;
