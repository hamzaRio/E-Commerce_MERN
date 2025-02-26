import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth/AuthContext";
import { BASE_URL } from "../constants/baseUrl";
import { Container, Typography } from "@mui/material";

const CartPage = () => {
    const {token } = useAuth();
    const [cart,SetCart] = useState();
    const [error,SetError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;
        const fetchCart = async () => {
        const response  = await fetch(`${BASE_URL}/cart`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok)
            {
                SetError("Failed to fetch cart!");
            }
            const data = await response.json();
            SetCart(data);
        };
        fetchCart();

        
    },[token]);

    console.log(cart);
    
    return ( <Container sx={{marginTop: "2rem"}}>
        <Typography variant="h4"> My Cart</Typography>
    </Container>
        
    )
}

export default CartPage;