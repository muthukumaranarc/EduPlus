import "./Friend.css";
import profile from '../../../assets/profile.png';
import Trophy from "../../../components/Trophy";
import addFriendImg from "../../../assets/add-friend.png";
import { useState, useEffect, useContext, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import axios from "axios";

function Friend() {
    const baseURL = import.meta.env.VITE_API_URL;
    const { setNavState } = useOutletContext();
    const { user, loading, friendUsernames = [], setFriendUsernames } = useContext(UserContext);

    const [screenWidth, setScreenWidth] = useState(() => window.innerWidth);
    const [isFriendViewOpen, setIsFriendViewOpen] = useState(false);
    const [friendsWithRank, setFriendsWithRank] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
    const [friendUsernameInput, setFriendUsernameInput] = useState("");
    const [currentUserRank, setCurrentUserRank] = useState(1);

    /* ---------------- SCREEN RESIZE ---------------- */
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---------------- INIT ---------------- */
    useEffect(() => {
        setNavState("friend");
        // eslint-disable-next-line
    }, []);

    /* ---------------- FETCH FRIEND DETAILS + RANK ---------------- */
    useEffect(() => {
        if (!user || !friendUsernames.length) {
            setFriendsWithRank([]);
            setCurrentUserRank(1);
            return;
        }

        const fetchFriendsWithRank = async () => {
            try {
                const requests = friendUsernames.map(username =>
                    axios.post(
                        `${baseURL}/user/get-user-username`,
                        username,
                        {
                            withCredentials: true,
                            headers: { "Content-Type": "text/plain" }
                        }
                    )
                );

                const responses = await Promise.all(requests);
                const fetchedFriends = responses.map(r => r.data);

                const combinedUsers = [
                    { ...user, isCurrentUser: true },
                    ...fetchedFriends.map(f => ({ ...f, isCurrentUser: false }))
                ];

                const rankedUsers = calculateRanks(
                    [...combinedUsers].sort((a, b) => b.trophy - a.trophy)
                );

                const currentUser = rankedUsers.find(u => u.isCurrentUser);
                const rankedFriends = rankedUsers.filter(u => !u.isCurrentUser);

                setCurrentUserRank(currentUser?.rank ?? 1);
                setFriendsWithRank(rankedFriends);
            } catch (err) {
                console.error("Error fetching friends", err);
            }
        };

        fetchFriendsWithRank();
    }, [friendUsernames, baseURL, user]);

    /* ---------------- OPEN FRIEND PROFILE ---------------- */
    const openFriendProfile = useCallback((friend) => {
        setSelectedFriend(friend);
        setIsFriendViewOpen(true);
    }, []);

    /* ---------------- ADD FRIEND ---------------- */
    const addFriend = async () => {
        if (!friendUsernameInput.trim()) return;

        try {
            await axios.post(
                `${baseURL}/friends/add/${friendUsernameInput}`,
                {},
                { withCredentials: true }
            );

            setFriendUsernames(prev =>
                prev.includes(friendUsernameInput)
                    ? prev
                    : [...prev, friendUsernameInput]
            );

            setFriendUsernameInput("");
            setIsAddFriendModalOpen(false);
        } catch (err) {
            console.error("Add friend failed", err);
        }
    };

    if (loading || !user) {
        return (
            <div className="friend-page">
                <p style={{ textAlign: "center", marginTop: "50px" }}>
                    Loading friends...
                </p>
            </div>
        );
    }

    return (
        <div className="friend-page">
            {isFriendViewOpen &&
                viewFriend(
                    selectedFriend,
                    setIsFriendViewOpen,
                    baseURL,
                    setFriendUsernames
                )
            }

            {isAddFriendModalOpen && (
                <div className="overlay">
                    <div className="alert-box">
                        <p>Enter you friend Username</p>
                        <input
                            type="text"
                            placeholder="username"
                            style={{ width: "90%" }}
                            value={friendUsernameInput}
                            onChange={(e) => setFriendUsernameInput(e.target.value)}
                        />
                        <div className="actions">
                            <button className="confirm" onClick={addFriend}>Add</button>
                            <button
                                className="cancel"
                                onClick={() => setIsAddFriendModalOpen(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="add-friend"
                onClick={() => setIsAddFriendModalOpen(true)}
            >
                <img src={addFriendImg} alt="addFriend" />
            </button>

            <h3 style={{ position: "absolute", top: "5px", left: "20px" }}>
                Friends
            </h3>

            {/* Desktop */}
            {screenWidth > 768 && (
                <div className="my-profile">
                    <div><img src={profile} alt="profile" /></div>
                    <div>
                        <p>
                            <b className="my-name">{user.username}</b>
                            {'#' + currentUserRank}
                        </p>
                        <center><p>Trophies <br /> {user.trophy}</p></center>
                        <center><p>Friends <br /> {user.friends}</p></center>
                    </div>
                </div>
            )}

            {/* Mobile */}
            {screenWidth < 768 && (
                <div className="my-profile">
                    <div><img src={profile} alt="profile" /></div>
                    <div>
                        <p>
                            {'#' + currentUserRank}
                            <b className="my-name">{user.username}</b>
                        </p>
                        <div className="my-det" style={{ display: "flex" }}>
                            <span>Trophies:&nbsp;{user.trophy}</span>
                            <p>Friends:&nbsp;{user.friends}</p>
                        </div>
                    </div>
                </div>
            )}

            <p className="your-friend">Your friends</p>

            {/* Desktop */}
            {screenWidth > 768 && (

                <div style={{ marginBottom: "30px" }}>
                    {friendsWithRank.map((friend) => (
                        <div
                            key={friend.username}
                            className="friend-profile"
                            onClick={() => openFriendProfile(friend)}
                        >
                            <div><img src={profile} alt="profile" /></div>
                            <div>
                                <p className="friend-name">
                                    <b>{friend.firstName + " " + friend.lastName}</b>
                                    {'#' + friend.rank}
                                </p>
                                <center className="friend-data">
                                    <p>Friends <br /> {friend.friends ?? 0}</p>
                                </center>
                                <center className="friend-data">
                                    <p>Trophies <br /> {friend.trophy}</p>
                                </center>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Mobile */}
            {screenWidth < 768 && (
                <div style={{ marginBottom: "30px" }}>
                    {friendsWithRank.map((friend) => (
                        <div className="friend-profile"
                            onClick={() => openFriendProfile(friend)}
                        >
                            <div><img src={profile} alt="profile" /></div>
                            <div>
                                <p>
                                    {'#' + friend.rank}
                                    <b className="my-name">{friend.username}</b>
                                </p>
                                <div className="my-det" style={{ display: "flex" }}>
                                    <span>Trophies:&nbsp;{friend.trophy}</span>
                                    <p>Friends:&nbsp;{friend.friends}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---------------- VIEW FRIEND ---------------- */
function viewFriend(friend, setIsFriendViewOpen, baseURL, setFriendUsernames) {
    if (!friend) return null;

    const removeFriend = async (username) => {
        try {
            await axios.delete(
                `${baseURL}/friends/remove/${username}`,
                { withCredentials: true }
            );
            setFriendUsernames(prev => prev.filter(u => u !== username));
            setIsFriendViewOpen(false);
        } catch (err) {
            console.error("Remove friend failed", err);
        }
    };


    return (
        <div className="view-friend">
            <div>
                <div>
                    <div><img src={profile} /></div>
                    <p>{friend.firstName + " " + friend.lastName}</p>
                    <Trophy trophy={friend.trophy} />
                </div>
                <div>
                    <div>
                        <p>Email: </p>
                        <p>LinkedIn: </p>
                        <p>Birth day: </p>
                    </div>
                    <div>
                        <p>{friend.mailId}</p>
                        <p>{friend.linkedIn}</p>
                        <p>{friend.dob}</p>
                    </div>
                </div>
                <button
                    onClick={() => removeFriend(friend.username)}
                    style={{ backgroundColor: "rgba(255, 50, 50, 1)", color: "white" }}
                >
                    Remove
                </button>
                <button onClick={() => setIsFriendViewOpen(false)}>Close</button>
            </div>
        </div>
    );
}

/* ---------------- RANK CALCULATOR ---------------- */
const calculateRanks = (list) => {
    let rank = 1;
    let previousTrophy = null;

    return list.map((item, index) => {
        if (previousTrophy !== null && item.trophy < previousTrophy) {
            rank = index + 1;
        }
        previousTrophy = item.trophy;
        return { ...item, rank };
    });
};

export default Friend;
