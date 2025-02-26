import { createContext, useContext } from "react";
import { CartItem } from "../../types/CartItem";

interface CartContextType {
    CartItems: CartItem[];
    totalAmount: number;
    addItemtoCart: (ProductId: string) => void;

}





export const CartContext = createContext<CartContextType>({
    CartItems: [],
    totalAmount: 0,
    addItemtoCart: () => {}    
});




export const useCart = () => useContext(CartContext);
    
