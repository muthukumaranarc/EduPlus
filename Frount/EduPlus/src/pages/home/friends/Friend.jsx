import "./Friend.css";
import profile from "../../../assets/profile.png";
import { useState, useEffect, useContext, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

/* ── rank medal helper ── */
const rankDisplay = (rank) => {
    if (rank === 1) return { label: "🥇", cls: "rank-gold" };
    if (rank === 2) return { label: "🥈", cls: "rank-silver" };
    if (rank === 3) return { label: "🥉", cls: "rank-bronze" };
    return { label: `#${rank}`, cls: "rank-normal" };
};

/* ── avatar placeholder ── */
function Avatar({ src, name, size = 56 }) {
    const initials = (name || "?")[0].toUpperCase();
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className="fp-avatar-img"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div className="fp-avatar-placeholder" style={{ width: size, height: size }}>
            {initials}
        </div>
    );
}

/* ================================================================
   MAIN COMPONENT
================================================================ */
function Friend() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();
    const { user, loading, friendUsernames = [], setFriendUsernames } = useContext(UserContext);

    const [friendsWithRank, setFriendsWithRank] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [friendInput, setFriendInput] = useState("");
    const [addError, setAddError] = useState("");
    const [addLoading, setAddLoading] = useState(false);
    const [currentUserRank, setCurrentUserRank] = useState(1);
    const [fetchingFriends, setFetchingFriends] = useState(false);

    useEffect(() => { setNavState("friend"); }, [setNavState]);

    /* ---------------- FETCH FRIENDS + RANK ---------------- */
    useEffect(() => {
        if (!user) return;

        if (!friendUsernames.length) {
            setFriendsWithRank([]);
            setCurrentUserRank(1);
            return;
        }

        const fetchFriends = async () => {
            setFetchingFriends(true);
            try {
                const responses = await Promise.all(
                    friendUsernames.map(username =>
                        axios.post(
                            `${baseURL}/user/get-user-username`,
                            username,
                            { withCredentials: true, headers: { "Content-Type": "text/plain" } }
                        )
                    )
                );
                const fetchedFriends = responses.map(r => r.data);
                const combined = [
                    { ...user, isCurrentUser: true },
                    ...fetchedFriends.map(f => ({ ...f, isCurrentUser: false }))
                ];
                const ranked = calculateRanks([...combined].sort((a, b) => b.trophy - a.trophy));
                setCurrentUserRank(ranked.find(u => u.isCurrentUser)?.rank ?? 1);
                setFriendsWithRank(ranked.filter(u => !u.isCurrentUser));
            } catch (err) {
                console.error("Error fetching friends", err);
            } finally {
                setFetchingFriends(false);
            }
        };

        fetchFriends();
    }, [friendUsernames, baseURL, user]);

    /* ---------------- ADD FRIEND ---------------- */
    const addFriend = async () => {
        const username = friendInput.trim();
        if (!username) return;
        setAddLoading(true);
        setAddError("");
        try {
            await axios.post(
                `${baseURL}/friends/add/${username}`,
                {},
                { withCredentials: true }
            );
            setFriendUsernames(prev =>
                prev.includes(username) ? prev : [...prev, username]
            );
            setFriendInput("");
            setIsAddModalOpen(false);
        } catch (err) {
            setAddError("User not found or already a friend.");
            console.error("Add friend failed", err);
        } finally {
            setAddLoading(false);
        }
    };

    const openFriendProfile = useCallback((friend) => {
        setSelectedFriend(friend);
    }, []);

    /* ---------------- REMOVE FRIEND ---------------- */
    const removeFriend = async (username) => {
        try {
            await axios.delete(`${baseURL}/friends/remove/${username}`, {
                withCredentials: true,
            });
            setFriendUsernames(prev => prev.filter(u => u !== username));
            setSelectedFriend(null);
        } catch (err) {
            console.error("Remove friend failed", err);
        }
    };

    /* ---------------- LOADING ---------------- */
    if (loading || !user) {
        return (
            <div className="fp-page">
                <div className="fp-loading">
                    <div className="fp-spinner" />
                    <p>Loading friends…</p>
                </div>
            </div>
        );
    }

    const myRank = rankDisplay(currentUserRank);

    return (
        <div className="fp-page">

            {/* ── ADD FRIEND MODAL ── */}
            {isAddModalOpen && (
                <div className="fp-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
                    <div className="fp-modal" onClick={e => e.stopPropagation()}>
                        <h3>Add a Friend</h3>
                        <p className="fp-modal-sub">Enter their exact username to connect</p>
                        <input
                            className="fp-modal-input"
                            type="text"
                            placeholder="username"
                            value={friendInput}
                            onChange={e => { setFriendInput(e.target.value); setAddError(""); }}
                            onKeyDown={e => e.key === "Enter" && addFriend()}
                            autoFocus
                        />
                        {addError && <p className="fp-modal-error">{addError}</p>}
                        <div className="fp-modal-actions">
                            <button
                                className="fp-btn-primary"
                                onClick={addFriend}
                                disabled={addLoading}
                            >
                                {addLoading ? "Adding…" : "Add Friend"}
                            </button>
                            <button
                                className="fp-btn-ghost"
                                onClick={() => { setIsAddModalOpen(false); setAddError(""); }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── FRIEND PROFILE DRAWER ── */}
            {selectedFriend && (
                <FriendDrawer
                    friend={selectedFriend}
                    onClose={() => setSelectedFriend(null)}
                    onRemove={removeFriend}
                />
            )}

            {/* ── MY PROFILE BANNER ── */}
            <div className="fp-hero">
                <div className="fp-hero-avatar">
                    <Avatar src={user.profilePicture} name={user.username} size={100} />
                </div>
                <div className="fp-hero-info">
                    <div className="fp-hero-name-row">
                        <h2 className="fp-hero-name">
                            {(user.firstName || "") + " " + (user.lastName || "") || user.username}
                        </h2>
                        <span className={`fp-rank-badge ${myRank.cls}`}>{myRank.label}</span>
                    </div>
                    <p className="fp-hero-username">@{user.username}</p>
                    <div className="fp-hero-stats">
                        <div className="fp-stat">
                            <span className="fp-stat-value">🏆 {user.trophy ?? 0}</span>
                            <span className="fp-stat-label">Trophies</span>
                        </div>
                        <div className="fp-stat-divider" />
                        <div className="fp-stat">
                            <span className="fp-stat-value">👥 {user.friends ?? 0}</span>
                            <span className="fp-stat-label">Friends</span>
                        </div>
                        <div className="fp-stat-divider" />
                        <div className="fp-stat">
                            <span className="fp-stat-value">{myRank.label}</span>
                            <span className="fp-stat-label">Your Rank</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── FRIENDS LIST HEADER ── */}
            <div className="fp-section-header">
                <h3>Your Friends <span className="fp-friend-count">{friendsWithRank.length}</span></h3>
                <button className="fp-add-btn" onClick={() => setIsAddModalOpen(true)}>
                    <span>＋</span> Add Friend
                </button>
            </div>

            {/* ── FRIEND CARDS ── */}
            {fetchingFriends ? (
                <div className="fp-list-loading">
                    {[1, 2, 3].map(i => <div key={i} className="fp-skeleton" />)}
                </div>
            ) : friendsWithRank.length === 0 ? (
                <div className="fp-empty">
                    <div className="fp-empty-icon">👋</div>
                    <h4>No friends yet</h4>
                    <p>Add friends to compare progress and compete on the leaderboard!</p>
                    <button className="fp-btn-primary" onClick={() => setIsAddModalOpen(true)}>
                        Add your first friend
                    </button>
                </div>
            ) : (
                <div className="fp-friend-list">
                    {friendsWithRank.map((friend) => {
                        const rd = rankDisplay(friend.rank);
                        return (
                            <div
                                key={friend.username}
                                className="fp-friend-card"
                                onClick={() => openFriendProfile(friend)}
                            >
                                <div className="fp-card-left">
                                    <span className={`fp-card-rank ${rd.cls}`}>{rd.label}</span>
                                    <div className="fp-card-avatar">
                                        <Avatar src={friend.profilePicture} name={friend.username} size={64} />
                                    </div>
                                </div>
                                <div className="fp-card-info">
                                    <p className="fp-card-name">
                                        {(friend.firstName + " " + friend.lastName).trim() || friend.username}
                                    </p>
                                    <p className="fp-card-username">@{friend.username}</p>
                                </div>
                                <div className="fp-card-stats">
                                    <div className="fp-card-stat">
                                        <span className="fp-card-stat-val">{friend.trophy ?? 0}</span>
                                        <span className="fp-card-stat-lbl">🏆</span>
                                    </div>
                                    <div className="fp-card-stat">
                                        <span className="fp-card-stat-val">{friend.friends ?? 0}</span>
                                        <span className="fp-card-stat-lbl">👥</span>
                                    </div>
                                </div>
                                <span className="fp-card-arrow">›</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ================================================================
   FRIEND PROFILE DRAWER (slide-in panel)
================================================================ */
function FriendDrawer({ friend, onClose, onRemove }) {
    const [confirmRemove, setConfirmRemove] = useState(false);

    const fullName = (friend.firstName + " " + friend.lastName).trim() || friend.username;

    return (
        <div className="fp-drawer-overlay" onClick={onClose}>
            <div className="fp-drawer" onClick={e => e.stopPropagation()}>
                <button className="fp-drawer-close" onClick={onClose}>✕</button>

                {/* Header */}
                <div className="fp-drawer-header">
                    <div className="fp-drawer-avatar">
                        <Avatar src={friend.profilePicture} name={friend.username} size={110} />
                    </div>
                    <h2 className="fp-drawer-name">{fullName}</h2>
                    <p className="fp-drawer-username">@{friend.username}</p>
                    <span className={`fp-rank-badge ${rankDisplay(friend.rank).cls}`}>
                        {rankDisplay(friend.rank).label} Rank
                    </span>
                </div>

                {/* Stats strip */}
                <div className="fp-drawer-stats">
                    <div className="fp-drawer-stat">
                        <span className="fp-drawer-stat-val">🏆 {friend.trophy ?? 0}</span>
                        <span className="fp-drawer-stat-lbl">Trophies</span>
                    </div>
                    <div className="fp-stat-divider" />
                    <div className="fp-drawer-stat">
                        <span className="fp-drawer-stat-val">👥 {friend.friends ?? 0}</span>
                        <span className="fp-drawer-stat-lbl">Friends</span>
                    </div>
                </div>

                {/* Info rows */}
                <div className="fp-drawer-details">
                    {[
                        { label: "📧 Email", value: friend.mailId || "—" },
                        { label: "🎂 Birthday", value: friend.dob || "—" },
                        { label: "💼 LinkedIn", value: friend.linkedIn || "—" },
                    ].map(row => (
                        <div key={row.label} className="fp-drawer-row">
                            <span className="fp-drawer-row-label">{row.label}</span>
                            <span className="fp-drawer-row-value">{row.value}</span>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="fp-drawer-actions">
                    {confirmRemove ? (
                        <>
                            <p className="fp-remove-confirm-text">Remove <b>{friend.username}</b> from friends?</p>
                            <button
                                className="fp-btn-danger"
                                onClick={() => onRemove(friend.username)}
                            >
                                Yes, Remove
                            </button>
                            <button
                                className="fp-btn-ghost"
                                onClick={() => setConfirmRemove(false)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="fp-btn-danger-outline"
                            onClick={() => setConfirmRemove(true)}
                        >
                            Remove Friend
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── RANK CALCULATOR ── */
const calculateRanks = (list) => {
    let rank = 1;
    let prevTrophy = null;
    return list.map((item, index) => {
        if (prevTrophy !== null && item.trophy < prevTrophy) rank = index + 1;
        prevTrophy = item.trophy;
        return { ...item, rank };
    });
};

export default Friend;
