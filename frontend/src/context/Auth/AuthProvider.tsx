import { FC, PropsWithChildren, useState } from "react";
import { AuthContext } from "./AuthContext"; // Adjust the import path as necessary

const USERNAME_KEY = "userName";
const TOKEN_KEY = "token";
const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, SetUsername] = useState<string | null>(localStorage.getItem(USERNAME_KEY));
    const [token, SetToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));



    const login = (username: string, token: string) => {
        SetUsername(username);
        SetToken(token);
        localStorage.setItem(USERNAME_KEY, username);
        localStorage.setItem(TOKEN_KEY, token);
    };

    const logout = () => {  
        SetUsername(null);
        SetToken(null);
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem(TOKEN_KEY);
    };
     const isAuthenticated =!!token

    return (
        <AuthContext.Provider value={{ username, token, login, isAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;