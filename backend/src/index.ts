import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import { seedIntialProducts } from './services/productService';
import productRoute from './routes/productRoute';
import cartRoute from './routes/cartRoute';
import dotenv from "dotenv";
import * as cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors.default());

const port = 3001;

mongoose.connect(process.env.DATABASE_URL||'').then(() => {
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
app.use("/cart", cartRoute);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

