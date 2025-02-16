import express from 'express';
import { getAllProducts } from '../services/productService';

const router = express.Router();    
router.get('/', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});


export default router;