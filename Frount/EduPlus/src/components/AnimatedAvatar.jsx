import React from 'react';
import './AnimatedAvatar.css';
import DefaultDogAvatar from '../assets/dog_avatar.png';
import DefaultCatAvatar from '../assets/cat_avatar.png';

/**
 * AnimatedAvatar component
 * Shows profile picture if present.
 * If not, shows a static Dog for MALE and Cat for FEMALE.
 * Falls back to initials for others.
 */
function AnimatedAvatar({ src, gender, name, size = 56, className = "" }) {
    const initials = (name || "?")[0].toUpperCase();
    
    // Choose which image to show
    let displaySrc = src;

    if (!displaySrc) {
        if (gender === "MALE") {
            displaySrc = DefaultDogAvatar;
        } else if (gender === "FEMALE") {
            displaySrc = DefaultCatAvatar;
        }
    }

    if (displaySrc) {
        return (
            <div 
                className={`animated-avatar-container ${className}`}
                style={{ width: size, height: size }}
            >
                <img
                    src={displaySrc}
                    alt={name}
                    className="animated-avatar-img"
                />
            </div>
        );
    }

    return (
        <div 
            className={`animated-avatar-placeholder ${className}`} 
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials}
        </div>
    );
}

export default AnimatedAvatar;
