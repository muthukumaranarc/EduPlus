import './trophy.css';
import { useState, useEffect } from 'react';
import trophyImgLight from "../assets/trophy.png";
import trophyImgDark from "../assets/trophy_dark.png";

function Trophy({trophy}) {
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    return (
        <div className="trop">
                <img src={isDarkMode ? trophyImgDark : trophyImgLight} alt="trophy" />
                <p>Trophies: {trophy}</p>
        </div>
    );
}

export default Trophy;