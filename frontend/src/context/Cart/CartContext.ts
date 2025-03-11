import { createContext, useContext } from "react";
import { CartItem } from "../../types/CartItem";

interface CartContextType {
    cartItems: CartItem[];  // ✅ Fix property name
    totalAmount: number;
    addItemToCart: (productId: string) => void;  // ✅ Fix function name
    updateItemToCart: (productId: string, quantity: number) => void;
}

export const CartContext = createContext<CartContextType>({
    cartItems: [], // ✅ Match provider state
    totalAmount: 0,
    addItemToCart: () => {}    ,
    updateItemToCart: () => {}
});

export const useCart = () => useContext(CartContext);