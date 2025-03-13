import { CheckCircleOutline } from "@mui/icons-material";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const handleHome = () => {
        navigate('/');
    };
    return (
        <Container
        fixed
        sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
        }}
        >
            <CheckCircleOutline sx={{ fontSize: '100px', color: 'green' }} />
            <Typography variant="h4">Order Successful!</Typography>
            <Typography >Thank you for your order. Your order details will be sent to the provided email address.</Typography>
            <Button onClick={handleHome} variant="contained" color="primary">
                Go to Home
            </Button>
            

        </Container>
    )
};

export default OrderSuccessPage;