import { createContext, useContext } from "react";

interface AuthContextType {
   username: string | null;
   token: string | null;
   login: (username: string, token: string) => void;
   logout: () => void;
   isAuthenticated:  boolean;
   getOrdersForUser: () => void;
   myOrders: any[];
}





export const AuthContext = createContext<AuthContextType>({
   username: null,
    token: null, 
    login: () => {}, 
    logout: ()=>{},
    myOrders:[],
    isAuthenticated: false,
    getOrdersForUser: () =>{}
});




export const useAuth = () => useContext(AuthContext);
    
