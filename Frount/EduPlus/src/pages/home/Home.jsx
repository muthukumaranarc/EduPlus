import "./Home.css";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import { UserContext } from "../../context/UserContext";
import axios from "axios";

import eduplus_logo from "../../assets/eduplus_logo.png";
import eduplus_name from "../../assets/eduplus_name.png";
import menu_icon    from "../../assets/menu.jpg";

import dashboard_icon   from "../../assets/dashboard.png";
import test_icon        from "../../assets/test.png";
import ai_chat_icon     from "../../assets/ai_chat.png";
import friends_icon     from "../../assets/friends.png";
import settings_icon    from "../../assets/settings.png";
import trophy_icon      from "../../assets/trophy.png";
import action_icon      from "../../assets/action.png";
import aiSearch_icon    from "../../assets/aiSearch.png";
import generate_icon    from "../../assets/generate.png";
import upload_icon      from "../../assets/upload.png";
import reload_icon      from "../../assets/reload.png";

import dashboard_icon_g from "../../assets/dashboard_g.png";
import test_icon_g      from "../../assets/test_g.png";
import ai_chat_icon_g   from "../../assets/ai_chat_g.png";
import friends_icon_g   from "../../assets/friends_g.png";
import settings_icon_g  from "../../assets/settings_g.png";
import trophy_icon_g    from "../../assets/trophy_dark.png";
import action_icon_g    from "../../assets/action_g.png";
/* aiSearch, generate, upload, reload — single image, gray handled via CSS opacity */

/* ── Nav sections ── */
const NAV_GENERAL = [
    { id: "dashboard", label: "Dashboard",        icon: dashboard_icon, iconG: dashboard_icon_g, path: "/home/dashboard" },
];

const NAV_TOOLS = [
    { id: "plan",      label: "Study Plan",        icon: action_icon,   iconG: action_icon_g,    path: "/home/plan" },
    { id: "test",      label: "Smart Test Builder", icon: test_icon,     iconG: test_icon_g,      path: "/home/test" },
];

const NAV_AI = [
    { id: "ai",        label: "AI Chat",           icon: ai_chat_icon,  iconG: ai_chat_icon_g,   path: "/home/ai" },
    { id: "analytics", label: "AI Analytics",      icon: aiSearch_icon, iconG: aiSearch_icon,    path: "/home/analytics" },
    { id: "revision",  label: "AI Revision",       icon: generate_icon, iconG: generate_icon,    path: "/home/revision" },
];

const NAV_LEARN = [
    { id: "syllabus",  label: "Syllabus",          icon: upload_icon,   iconG: upload_icon,      path: "/home/syllabus" },
    { id: "friend",    label: "Friends",           icon: friends_icon,  iconG: friends_icon_g,   path: "/home/friend" },
];

/* IDs that were previously under the action umbrella */
const ACTION_IDS = new Set(["plan", "test", "communication", "fitness"]);

function Home() {
    const navigate  = useNavigate();
    const parms     = useParams();
    const { user }  = useContext(UserContext);
    const baseURL   = import.meta.env.VITE_API_URL;

    const [navState,     setNavState]     = useState(parms.nav);
    const [isNavActive,  setIsNavActive]  = useState(false);
    const [deviceWidth,  setDeviceWidth]  = useState(window.innerWidth);
    const [chatHistory,  setChatHistory]  = useState([]);
    const [isDarkMode,   setIsDarkMode]   = useState(false);
    const [trophyCount,  setTrophyCount]  = useState({ earned: 0, total: 0 });

    /* resize listener */
    useEffect(() => {
        const onResize = () => setDeviceWidth(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* route sync */
    useEffect(() => {
        if (parms.nav === undefined) navigate("/home/dashboard");
        if (parms.nav) setNavState(parms.nav);
    }, [navigate, parms.nav]);

    /* reset scroll */
    useEffect(() => {
        const outlet = document.querySelector(".outlet");
        if (outlet) outlet.scrollTop = 0;
    }, [navState]);

    /* dark-mode observer */
    useEffect(() => {
        const check = () => setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
        check();
        const obs = new MutationObserver(check);
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => obs.disconnect();
    }, []);

    /* trophy count */
    useEffect(() => {
        const fetchTrophies = async () => {
            try {
                const res    = await axios.get(`${baseURL}/trophy/get-user-trophies`, { withCredentials: true });
                const earned = res.data.trophies.filter(t => t.earned).length;
                const total  = res.data.trophies.length;
                setTrophyCount({ earned, total });
            } catch { /* ignore */ }
        };
        fetchTrophies();
    }, []);

    const go = (path) => { navigate(path); setIsNavActive(false); };

    const NavItem = ({ id, label, icon, path }) => {
        const active = navState === id;
        return (
            <div className={`nav-item ${active ? "active" : ""}`} onClick={() => go(path)}>
                <img src={icon} alt={label} />
                <p>{label}</p>
            </div>
        );
    };

    return (
        <div className="home-page">
            <ScrollToTop />

            {/* ── Sidebar ── */}
            <div className={`nav ${isNavActive ? "active-nav" : ""}`}>

                {/* Logo */}
                <div className="logo-box">
                    <img src={eduplus_logo} alt="EduPlus logo" className="logo" />
                    <img src={eduplus_name} alt="EduPlus"      className="name" />
                </div>

                {/* Scrollable nav body */}
                <div className="nav-body">

                    <div className="nav-section-label">General</div>
                    {NAV_GENERAL.map(item => <NavItem key={item.id} {...item} />)}

                    <div className="nav-divider" />

                    <div className="nav-section-label">Study Tools</div>
                    {NAV_TOOLS.map(item => <NavItem key={item.id} {...item} />)}

                    <div className="nav-divider" />

                    <div className="nav-section-label">AI Tools</div>
                    {NAV_AI.map(item => <NavItem key={item.id} {...item} />)}

                    <div className="nav-divider" />

                    <div className="nav-section-label">Learn</div>
                    {NAV_LEARN.map(item => <NavItem key={item.id} {...item} />)}

                </div>

                {/* Bottom: Trophies + Settings */}
                <div className="nav-bottom">
                    <div className={`nav-trophy-badge ${navState === "trophies" ? "active" : ""}`}
                         onClick={() => go("/home/trophies")}>
                        <img src={trophy_icon} alt="trophies" />
                        <span className="trophy-label">Trophies</span>
                        <span className="trophy-count">{trophyCount.earned}/{trophyCount.total}</span>
                    </div>

                    <div className={`nav-item ${navState === "setting" ? "active" : ""}`}
                         onClick={() => go("/home/setting")}>
                        <img src={navState === "setting" ? settings_icon : settings_icon_g} alt="settings" />
                        <p>Settings</p>
                    </div>
                </div>
            </div>

            {/* ── Content area ── */}
            <div>
                {/* Mobile header */}
                <div className="head-mobile">
                    <div>
                        <div className="mobile-menu" onClick={() => setIsNavActive(true)}>
                            <img src={menu_icon} alt="menu" />
                        </div>
                        <div className="mobile-logo" onClick={() => navigate("/home/dashboard")}>
                            <img src={eduplus_logo} alt="EduPlus logo" />
                            <img src={eduplus_name} alt="EduPlus" />
                        </div>
                    </div>
                    <div className="page-name">
                        <h2>{navState && navState[0].toUpperCase() + navState.slice(1)}</h2>
                        {renderImage(navState)}
                    </div>
                </div>

                {/* Outlet */}
                <div className="outlet"
                     onClick={() => isNavActive ? setIsNavActive(false) : null}>
                    <Outlet context={{ setNavState, deviceWidth, chatHistory, setChatHistory }} />
                    <div className="dark" style={{ display: isNavActive ? "block" : "none" }} />
                </div>
            </div>
        </div>
    );
}

function renderImage(navState) {
    switch (navState) {
        case "dashboard":  return <img src={dashboard_icon}  alt="dashboard" />;
        case "plan":       return <img src={action_icon}     alt="plan"      />;
        case "test":       return <img src={test_icon}       alt="test"      />;
        case "ai":         return <img src={ai_chat_icon}    alt="ai chat"   />;
        case "friend":     return <img src={friends_icon}    alt="friends"   />;
        case "trophies":   return <img src={trophy_icon}     alt="trophies"  />;
        case "setting":    return <img src={settings_icon}   alt="settings"  />;
        case "syllabus":   return <img src={upload_icon}     alt="syllabus"  />;
        case "analytics":  return <img src={aiSearch_icon}   alt="analytics" />;
        case "revision":   return <img src={generate_icon}   alt="revision"  />;
        default: return null;
    }
}

export default Home;
