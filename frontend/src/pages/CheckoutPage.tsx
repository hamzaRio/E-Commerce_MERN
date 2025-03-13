import { useEffect, useRef } from "react";
import { Box, Button, Container, Typography, Paper, TextField } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";

const CheckoutPage = () => {
  const { cartItems, totalAmount } = useCart();
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("Cart Items in CheckoutPage:", cartItems);
  }, [cartItems]);

  const renderCartItems = () => (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 5, width: "100%", mt: 2 }}>
      {cartItems.length === 0 ? (
        <Typography variant="h6">Your cart is empty.</Typography>
      ) : (
        cartItems.map((item) => (
          <Box
            key={item.productId}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <img
                src={item.image || "https://via.placeholder.com/100"}
                alt={item.title}
                style={{ width: 60, height: 60 }}
              />
              <Typography variant="h6">{item.title}</Typography>
            </Box>

            <Typography variant="h6">
              {item.quantity} x {item.unitPrice} MAD
            </Typography>
          </Box>
        ))
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Total Amount: {totalAmount.toFixed(2)} MAD
        </Typography>
        <Button variant="contained" color="primary">
          Pay Now
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Container fixed sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}>
      <Typography variant="h4">Checkout</Typography>
      <TextField inputRef={addressRef} name="address" label="Delivery Address" variant="outlined" fullWidth  />
      {renderCartItems()} 
    </Container>
  );
};

export default CheckoutPage;
