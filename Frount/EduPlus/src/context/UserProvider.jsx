import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export function UserProvider({ children }) {
    const baseURL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get(`${baseURL}/user/get-user`, {
                withCredentials: true,
            })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setUser(null);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [baseURL]);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}