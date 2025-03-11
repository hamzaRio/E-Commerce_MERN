import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { BASE_URL } from "../constants/baseUrl";
import { Box } from "@mui/material";

const HomePage = () => {  
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/product`);
                const data = await response.json();
                setProducts(data);
            } catch {
                setError(true);
            }
        };
        fetchData();     
    }, []);

    if (error) {
        return <Box>Error loading products.</Box>;
    }

    return (
        <Container sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {products.map((p, index) => (
                    <Grid key={p._id || index} item xs={12} sm={6} md={4}>
                        <ProductCard {...p} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;
