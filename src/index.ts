import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import { seedIntialProducts } from './services/productService';
import productRoute from './routes/productRoute';

const app = express();

app.use(express.json());

const port = 3001;

mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {
    console.log('Connected to MongoDB');
    seedIntialProducts();  
    }
).catch((error) => {
    console.log('Error connecting to MongoDB', error);
}
);

// Seed the products to the database

seedIntialProducts();   

app.use('/user', userRoute);
app.use('/product', productRoute);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

