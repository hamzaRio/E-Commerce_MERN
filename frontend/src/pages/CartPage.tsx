import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
    const {token } = useAuth();
    const {cartItems,totalAmount} = useCart();
    const [error,SetError] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!token) return;
    //     const fetchCart = async () => {
    //     const response  = await fetch(`${BASE_URL}/cart`,
    //         {
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    //         if (!response.ok)
    //         {
    //             SetError("Failed to fetch cart!");
    //         }
    //         const data = await response.json();
    //         SetCart(data);
    //     };
    //     fetchCart();

        
    // },[token]);

    
    return ( <Container sx={{marginTop: "2rem"}}>
        <Typography variant="h4"> My Cart</Typography>
        {cartItems.map((item) => (
            <Box>{item.title}</Box>

            ))}
    </Container>
        
    )
}

export default CartPage;