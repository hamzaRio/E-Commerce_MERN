import { useState, useEffect } from "react";
import { Box, Button, ButtonGroup, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
    const { cartItems, totalAmount, updateItemToCart, deleteItemInCart, clearCart } = useCart();
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            setErrorMessage("Quantity cannot be less than 1!"); // Show error message
            return;
        }
        setErrorMessage(""); // Clear error when valid
        updateItemToCart(productId, quantity);
    };

    const handleRemoveItem = (productId: string) => {
        console.log("Attempting to remove item with ID:", productId); // Debugging
        deleteItemInCart(productId);
    };

    const handleCheckout = () => {
        navigate("/checkout") // Debugging
    };

    useEffect(() => {
        console.log("Cart Items in CartPage:", cartItems);
    }, [cartItems]);

    const renderCartItems = () => (
        <Box display="flex" flexDirection="column" gap={4}>
        {cartItems.length === 0 ? (
            <Typography variant="h6">Your cart is empty.</Typography>
        ) : (
            cartItems.map((item) => (
                <Box
                    key={item.productId} // ✅ Ensure unique key
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    p={2}
                    flexDirection="row"
                    sx={{
                        border: "1px solid #ccc",
                        borderRadius: 5,
                        padding: 2,
                        gap: 2,
                        borderBottom: "1px solid #ccc"
                    }}
                >
                    <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                        <img 
                            src={item.image || "https://via.placeholder.com/100"} 
                            alt={item.title} 
                            style={{ width: 100, height: 100 }} 
                        />
                        <Box>
                            <Typography variant="h6">{item.title}</Typography>
                            <Typography variant="h6">{item.quantity} x {item.unitPrice} MAD</Typography>
                            <Button onClick={() => handleRemoveItem(item.productId)}>Remove Item</Button>
                        </Box>
                    </Box>
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button onClick={() => handleQuantity(item.productId, item.quantity - 1)}>-</Button>
                        <Button onClick={() => handleQuantity(item.productId, item.quantity + 1)}>+</Button>
                    </ButtonGroup>
                </Box>
            ))
        )}
        <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total: {totalAmount.toFixed(2)} MAD</Typography>
            <Button variant="contained" color="primary" onClick={handleCheckout}>Checkout</Button>
        </Box>
        <Button onClick={clearCart} variant="contained" color="secondary">Clear Cart</Button>
    </Box>
    )

    return (
        <Container fixed sx={{ mt: 2 }}>
            <Typography variant="h4">My Cart</Typography>
            {errorMessage && <Typography sx={{ color: "red", fontWeight: "bold", mt: 1 }}>{errorMessage}</Typography>}
            {cartItems.length?
              renderCartItems()
                    :( 
             <Typography variant="h6">Your cart is empty. Please start shopping</Typography>
             )}
        </Container>
    );
};

export default CartPage;
