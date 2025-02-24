import { FC, PropsWithChildren, useState } from "react";
import { AuthContext } from "./AuthContext"; // Adjust the import path as necessary


const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [username, SetUsername] = useState<string | null>(localStorage.getItem("username"));
    const [token, SetToken] = useState<string | null>(localStorage.getItem("token"));



    const login = (username: string, token: string) => {
        SetUsername(username);
        SetToken(token);
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
    };

    return (
        <AuthContext.Provider value={{ username, token, login, }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;