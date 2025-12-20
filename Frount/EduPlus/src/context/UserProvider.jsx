import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export function UserProvider({ children }) {
    const baseURL = import.meta.env.VITE_API_URL;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${baseURL}/user/get-user`, {
            withCredentials: true,
        })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error("Failed to fetch user:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

//         username: 'muthukumaranarc00',
//         firstName: 'Muthu',
//         lastName: 'Kumaran',
//         dob: 'July 12 2008',
//         gender: 'Male',
//         mobile: "+91 1234567890",
//         email: 'muthukumaranarc00@gmail.com',
//         linkedIn: 'muthukumaranarc'