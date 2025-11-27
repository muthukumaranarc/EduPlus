import { createContext, useState } from "react";

/* eslint-disable react-refresh/only-export-components */
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState("");

    return (
        <UserContext.Provider value={{ username, setUsername }}>
            { children }
        </UserContext.Provider>
    );
};