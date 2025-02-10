import express from 'express';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';

const app = express();

app.use(express.json());

const port = 3001;

mongoose.connect("mongodb://localhost:27017/ecommerce").then(() => {
    console.log('Connected to MongoDB');
    }
).catch((error) => {
    console.log('Error connecting to MongoDB', error);
}
);


app.use('/user', userRoute);

app.listen(port, () => {
    console.log(`Server is running on port http//localhost:${port}`);
});