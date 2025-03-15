import { Box, Container, Typography } from "@mui/material";
import { useAuth } from "../context/Auth/AuthContext";
import { useEffect } from "react";

const MyOrderPage = () => {
    const { getOrdersForUser, myOrders } = useAuth();

    useEffect(() => {
        
            getOrdersForUser();
 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    

    
    
    
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
          {myOrders.map(({_id, address, orderItems}) =>(
            <Box>
                <Typography>Id:{_id}</Typography>
                <Typography>Address: {address}</Typography>
                <Typography>Items: {orderItems.length}</Typography>
                
            </Box>

          ))}

        </Container>
    )
};

export default MyOrderPage;