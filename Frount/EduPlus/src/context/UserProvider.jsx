import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export function UserProvider({ children }) {
    const baseURL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/user/get-user`, {
                withCredentials: true,
            });
            setUser(res.data);
        } catch (err) {
            if (err.response?.status === 401) {
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [baseURL]);


    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}