import "./Trophies.css";
import { useEffect, useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

function Trophies() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();
    const { user, loading } = useContext(UserContext);
    const [userTrophies, setUserTrophies] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");

    useEffect(() => {
        setNavState("trophies");
    }, [setNavState]);

    useEffect(() => {
        if (user) {
            fetchTrophies();
        }
    }, [user]);

    const fetchTrophies = async () => {
        try {
            const res = await axios.get(`${baseURL}/trophy/get-user-trophies`, {
                withCredentials: true,
            });
            setUserTrophies(res.data);
        } catch (err) {
            console.error("Error fetching trophies:", err);
        }
    };

    if (loading || !user || !userTrophies) {
        return (
            <div className="trophies-page">
                <p style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading trophies...
                </p>
            </div>
        );
    }

    const categories = [
        { id: "all", name: "All Trophies", icon: "🏆" },
        { id: "test", name: "Test Completion", icon: "📝" },
        { id: "score", name: "High Scores", icon: "⭐" },
        { id: "consistency", name: "Consistency", icon: "🔥" },
        { id: "contribution", name: "Contributions", icon: "📚" },
        { id: "milestone", name: "Milestones", icon: "🎯" },
    ];

    const filteredTrophies = selectedCategory === "all"
        ? userTrophies.trophies
        : userTrophies.trophies.filter(t => t.category === selectedCategory);

    const earnedCount = userTrophies.trophies.filter(t => t.earned).length;
    const totalCount = userTrophies.trophies.length;
    const completionPercentage = Math.round((earnedCount / totalCount) * 100);

    return (
        <div className="trophies-page">
            {/* Stats Overview */}
            <div className="trophy-stats">
                <div className="stat-card">
                    <div className="stat-icon">🏆</div>
                    <div className="stat-info">
                        <h4>{earnedCount} / {totalCount}</h4>
                        <p>Trophies Earned</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-info">
                        <h4>{completionPercentage}%</h4>
                        <p>Completion</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-info">
                        <h4>{userTrophies.testsCompleted}</h4>
                        <p>Tests Completed</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-info">
                        <h4>{userTrophies.currentStreak}</h4>
                        <p>Day Streak</p>
                    </div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                    </button>
                ))}
            </div>

            {/* Trophy Grid */}
            <div className="trophy-grid">
                {filteredTrophies.map(trophy => (
                    <div
                        key={trophy.id}
                        className={`trophy-card ${trophy.earned ? "earned" : "locked"}`}
                    >
                        <div className="trophy-icon-container">
                            <div className="trophy-icon">{trophy.icon}</div>
                            {trophy.earned && (
                                <div className="earned-badge">✓</div>
                            )}
                        </div>
                        <div className="trophy-details">
                            <h3>{trophy.name}</h3>
                            <p className="trophy-description">{trophy.description}</p>

                            {trophy.earned ? (
                                <div className="trophy-earned-info">
                                    <span className="earned-label">Earned</span>
                                    <span className="earned-date">
                                        {new Date(trophy.earnedDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ) : (
                                <div className="trophy-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${Math.min(
                                                    (trophy.currentProgress / trophy.requiredProgress) * 100,
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>
                                    <div className="progress-text">
                                        {trophy.currentProgress} / {trophy.requiredProgress}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredTrophies.length === 0 && (
                <div className="no-trophies">
                    <p>No trophies in this category yet!</p>
                </div>
            )}
        </div>
    );
}

export default Trophies;
