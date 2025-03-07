import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import { useEffect } from "react";

const CartPage = () => {
    const { cartItems, totalAmount } = useCart();

    // Debug: Log cart items to check if the image field exists
    useEffect(() => {
        console.log("Cart Items in CartPage:", cartItems);
    }, [cartItems]);

    return (
        <Container fixed sx={{ mt: 2 }}>
            <Typography variant="h4">My Cart</Typography>
            <Box  display="flex" flexDirection="column" gap={4}>
            {cartItems.length === 0 ? (
                <Typography variant="h6">Your cart is empty.</Typography>
            ) : (
                
                cartItems.map((item, index) => (
                    
                    <Box
                        key={index} // ✅ Added a unique key for each item
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={2}
                        flexDirection="row"
                        sx={{ border: "1px solid #ccc",
                             borderRadius: 5 ,
                            padding: 2,
                            gap: 2,
                            borderBottom: "1px solid #ccc"}}
                    >
                        <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                        {/* ✅ Ensure image exists, otherwise show a placeholder */}
                        <img 
                            src={item.image || "https://via.placeholder.com/100"} 
                            alt={item.title} 
                            style={{ width: 100, height: 100 }} 
                        />
                        <Box>
                        <Typography variant="h6">{item.title}</Typography>
                        <Typography variant="h6">{item.quantity} x {item.unitPrice} MAD</Typography>
                        
                        <Button onClick={() => {}}>Remove Item</Button>
                        </Box>
                        </Box>
                        <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button>+</Button>
                        <Button>-</Button>
                    </ButtonGroup>
                    </Box>
                ))
                
            )}
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Total: {totalAmount.toFixed(2)} MAD</Typography>
                <Button variant="contained" color="primary">Checkout</Button>
                </Box>
            </Box>
        </Container>
    );
};

export default CartPage;
