import "./Trophies.css";
import { useEffect, useState, useContext, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

function Trophies() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();
    const { user, loading, friendUsernames = [] } = useContext(UserContext);

    const [userTrophies, setUserTrophies] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [leaderboard, setLeaderboard] = useState([]);
    const [activeTab, setActiveTab] = useState("trophies"); // "trophies" | "leaderboard"
    const [newlyEarned, setNewlyEarned] = useState([]);
    const [weekCountdown, setWeekCountdown] = useState(""); // live D:H:M:S string
    const countdownRef = useRef(null);

    useEffect(() => {
        setNavState("trophies");
    }, [setNavState]);

    useEffect(() => {
        if (user) {
            fetchTrophies();
        }
    }, [user]);

    // Live countdown to next Monday 00:00 based on weekStartDate from the backend
    useEffect(() => {
        if (!userTrophies?.weekStartDate) return;

        const tick = () => {
            // weekStartDate is "yyyy-MM-dd" (ISO Monday).  Next reset = +7 days.
            const [y, m, d] = userTrophies.weekStartDate.split("-").map(Number);
            const weekStart = new Date(y, m - 1, d);           // local midnight Monday
            const nextReset = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
            const diff = nextReset - Date.now();

            if (diff <= 0) {
                setWeekCountdown("Resetting now…");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setWeekCountdown(
                `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
            );
        };

        tick();
        countdownRef.current = setInterval(tick, 1000);
        return () => clearInterval(countdownRef.current);
    }, [userTrophies?.weekStartDate]);

    useEffect(() => {
        if (user && friendUsernames.length >= 0) {
            fetchLeaderboard();
        }
    }, [user, friendUsernames]);

    const fetchTrophies = async () => {
        try {
            const res = await axios.get(`${baseURL}/trophy/get-user-trophies`, {
                withCredentials: true,
            });
            const prev = userTrophies;
            const next = res.data;

            // Detect newly earned trophies since last fetch
            if (prev && prev.trophies && next.trophies) {
                const justEarned = next.trophies.filter(t => {
                    const old = prev.trophies.find(o => o.id === t.id);
                    return t.earned && old && !old.earned;
                });
                if (justEarned.length > 0) setNewlyEarned(justEarned);
            }

            setUserTrophies(next);
        } catch (err) {
            console.error("Error fetching trophies:", err);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            // Fetch current user trophy data
            const myTrophyRes = await axios.get(`${baseURL}/trophy/get-user-trophies`, {
                withCredentials: true,
            });

            const entries = [
                {
                    username: user.username,
                    displayName: (user.firstName || "") + " " + (user.lastName || ""),
                    profilePicture: user.profilePicture,
                    totalEarned: myTrophyRes.data.totalEarned ?? 0,
                    isMe: true,
                }
            ];

            // Fetch each friend's trophy data
            for (const username of friendUsernames) {
                try {
                    const res = await axios.post(
                        `${baseURL}/trophy/get-user-trophies-by-username`,
                        username,
                        { withCredentials: true, headers: { "Content-Type": "text/plain" } }
                    );
                    const userRes = await axios.post(
                        `${baseURL}/user/get-user-username`,
                        username,
                        { withCredentials: true, headers: { "Content-Type": "text/plain" } }
                    );
                    entries.push({
                        username,
                        displayName: (userRes.data.firstName || "") + " " + (userRes.data.lastName || ""),
                        profilePicture: userRes.data.profilePicture,
                        totalEarned: res.data.totalEarned ?? 0,
                        isMe: false,
                    });
                } catch (e) {
                    // Skip friends that can't be fetched
                }
            }

            // Sort descending by totalEarned
            entries.sort((a, b) => b.totalEarned - a.totalEarned);

            // Assign ranks (ties get same rank)
            let rank = 1;
            for (let i = 0; i < entries.length; i++) {
                if (i > 0 && entries[i].totalEarned < entries[i - 1].totalEarned) {
                    rank = i + 1;
                }
                entries[i].rank = rank;
            }

            setLeaderboard(entries);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        }
    };

    if (loading || !user || !userTrophies) {
        return (
            <div className="trophies-page">
                <div className="trophy-loading">
                    <div className="trophy-spinner">🏆</div>
                    <p>Loading trophies...</p>
                </div>
            </div>
        );
    }

    const categories = [
        { id: "all", name: "All Trophies", icon: "🏆" },
        { id: "test", name: "Tests", icon: "📝" },
        { id: "score", name: "High Scores", icon: "⭐" },
        { id: "consistency", name: "Streaks", icon: "🔥" },
        { id: "contribution", name: "Uploads", icon: "📚" },
        { id: "milestone", name: "Milestones", icon: "🎯" },
    ];

    const filteredTrophies =
        selectedCategory === "all"
            ? userTrophies.trophies
            : userTrophies.trophies.filter((t) => t.category === selectedCategory);

    const earnedCount = userTrophies.trophies.filter((t) => t.earned).length;
    const totalCount = userTrophies.trophies.length;
    const completionPercentage =
        totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;

    const myRank = leaderboard.find(e => e.isMe)?.rank ?? "—";

    // Was the trophy week reset in the last 24 hours?
    const justReset = (() => {
        if (!userTrophies?.weekStartDate) return false;
        const [y, m, d] = userTrophies.weekStartDate.split("-").map(Number);
        const resetAt = new Date(y, m - 1, d);
        return (Date.now() - resetAt.getTime()) < 24 * 60 * 60 * 1000;
    })();

    return (
        <div className="trophies-page">
            {/* Newly earned toast */}
            {newlyEarned.length > 0 && (
                <div className="new-trophy-toast">
                    {newlyEarned.map((t, i) => (
                        <div key={i} className="toast-item">
                            <span>{t.icon}</span>
                            <div>
                                <strong>Trophy Unlocked!</strong>
                                <p>{t.name}</p>
                            </div>
                            <button onClick={() => setNewlyEarned([])} className="toast-close">✕</button>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Weekly Reset Banner ── */}
            <div className="weekly-reset-banner">
                <div className="weekly-reset-left">
                    <span className="weekly-reset-icon">🔄</span>
                    <div className="weekly-reset-text">
                        <strong>Weekly Trophy Reset</strong>
                        <p>Trophies reset every Monday — earn all 50 before the week ends!</p>
                    </div>
                </div>
                <div className="weekly-reset-timer">
                    <span className="weekly-reset-label">Next reset in</span>
                    <span className="weekly-reset-countdown">{weekCountdown || "Calculating…"}</span>
                </div>
            </div>

            {/* ── Just-Reset Notice ── */}
            {justReset && (
                <div className="weekly-just-reset">
                    <span>🎉</span>
                    <p>Trophies were reset at the start of this week — fresh start! Earn them all again.</p>
                    <button className="weekly-just-reset-close" onClick={() => setUserTrophies(u => ({ ...u, weekStartDate: null }))}>✕</button>
                </div>
            )}

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
                <div className="stat-card">
                    <div className="stat-icon">🎖️</div>
                    <div className="stat-info">
                        <h4>#{myRank}</h4>
                        <p>Friend Rank</p>
                    </div>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="trophy-tabs">
                <button
                    className={`trophy-tab ${activeTab === "trophies" ? "active" : ""}`}
                    onClick={() => setActiveTab("trophies")}
                >
                    🏆 My Trophies
                </button>
                <button
                    className={`trophy-tab ${activeTab === "leaderboard" ? "active" : ""}`}
                    onClick={() => setActiveTab("leaderboard")}
                >
                    🏅 Friends Leaderboard
                </button>
            </div>

            {/* ── TROPHIES TAB ── */}
            {activeTab === "trophies" && (
                <>
                    {/* Category Filter */}
                    <div className="category-filter">
                        {categories.map((category) => (
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
                        {filteredTrophies.map((trophy) => (
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
                                                            (trophy.currentProgress /
                                                                trophy.requiredProgress) *
                                                            100,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
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
                            <p>No trophies in this category yet — keep going! 💪</p>
                        </div>
                    )}
                </>
            )}

            {/* ── LEADERBOARD TAB ── */}
            {activeTab === "leaderboard" && (
                <div className="leaderboard">
                    {leaderboard.length === 0 ? (
                        <div className="no-trophies">
                            <p>Add friends to see the leaderboard! 👫</p>
                        </div>
                    ) : (
                        leaderboard.map((entry, idx) => (
                            <div
                                key={entry.username}
                                className={`leaderboard-row ${entry.isMe ? "leaderboard-me" : ""}`}
                            >
                                <div className="lb-rank">
                                    {entry.rank === 1 ? "🥇" :
                                        entry.rank === 2 ? "🥈" :
                                            entry.rank === 3 ? "🥉" :
                                                `#${entry.rank}`}
                                </div>
                                <div className="lb-avatar">
                                    {entry.profilePicture
                                        ? <img src={entry.profilePicture} alt="avatar" />
                                        : <div className="lb-avatar-placeholder">
                                            {(entry.displayName || entry.username)?.[0]?.toUpperCase() ?? "?"}
                                        </div>
                                    }
                                </div>
                                <div className="lb-info">
                                    <span className="lb-name">
                                        {entry.displayName?.trim() || entry.username}
                                        {entry.isMe && <span className="lb-you-badge"> (You)</span>}
                                    </span>
                                    <span className="lb-username">@{entry.username}</span>
                                </div>
                                <div className="lb-trophies">
                                    <span className="lb-trophy-count">{entry.totalEarned}</span>
                                    <span className="lb-trophy-label">trophies</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Trophies;
