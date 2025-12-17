import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import axios from "axios";

export function UserProvider({ children }) {

    const [user, setUser] = useState({
        username: 'muthukumaranarc00',
        firstName: 'Muthu',
        lastName: 'Kumaran',
        dob: 'July 12 2008',
        gender: 'Male',
        mobile: "+91 1234567890",
        email: 'muthukumaranarc00@gmail.com',
        linkedIn: 'muthukumaranarc'
    });

    useEffect(() => {
        axios.get("http://localhost:8080/user/get-user", {
            withCredentials: true,
        })
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [setUser]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}
