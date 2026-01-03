import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export function UserProvider({ children }) {
    const baseURL = import.meta.env.VITE_API_URL;

    const [user, setUser] = useState(null);
    const [friendUsernames, setFriendUsernames] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUserAndFriends = async () => {
        setLoading(true);
        try {
            /* 1️⃣ Fetch logged-in user */
            const userRes = await axios.get(
                `${baseURL}/user/get-user`,
                { withCredentials: true }
            );

            setUser(userRes.data);

            /* 2️⃣ Fetch friends of logged-in user */
            const friendsRes = await axios.get(
                `${baseURL}/friends/me`,
                { withCredentials: true }
            );

            setFriendUsernames(friendsRes.data?.friends ?? []);

        } catch (err) {
            if (err.response?.status === 401) {
                setUser(null);
                setFriendUsernames([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAndFriends();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                friendUsernames,
                setFriendUsernames,
                loading,
                fetchUserAndFriends
            }}
        >
            {children}
        </UserContext.Provider>
    );
}
