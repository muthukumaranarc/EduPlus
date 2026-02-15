import './trophy.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import trophyImgLight from "../assets/trophy.png";
import trophyImgDark from "../assets/trophy_dark.png";

function Trophy() {
    const baseURL = import.meta.env.VITE_API_URL;
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [trophyCount, setTrophyCount] = useState({ earned: 0, total: 0 });

    useEffect(() => {
        // Check initial theme
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute('data-theme');
            setIsDarkMode(theme === 'dark');
        };

        checkTheme();

        // Create observer to watch for theme changes
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetchTrophyCount();
    }, []);

    const fetchTrophyCount = async () => {
        try {
            const res = await axios.get(`${baseURL}/trophy/get-user-trophies`, {
                withCredentials: true,
            });
            const earned = res.data.trophies.filter(t => t.earned).length;
            const total = res.data.trophies.length;
            setTrophyCount({ earned, total });
        } catch (err) {
            console.error("Error fetching trophy count:", err);
        }
    };

    return (
        <div className="trop">
            <img src={isDarkMode ? trophyImgDark : trophyImgLight} alt="trophy" />
            <p>Trophies: {trophyCount.earned}/{trophyCount.total}</p>
        </div>
    );
}

export default Trophy;