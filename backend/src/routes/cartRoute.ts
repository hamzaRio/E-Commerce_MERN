import express from "express";
import { 
    addItemToCart, 
    checkout, 
    clearCart, 
    deleteItemIncart, 
    getActiveCartForUser, 
    updateItemInCart 
} from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";
import ExtendRequest from '../types/extendedRequest';

const router = express.Router();

// Get active cart for a user
router.get("/", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req.user._id;
        const cart = await getActiveCartForUser({ userId });    
        res.status(200).send(cart);
    } catch (err) {
        res.status(500).send({ error: "Something went wrong!" });
    }
});

// Clear the cart
router.delete("/", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const response = await clearCart({ userId });
        res.status(response.statusCode).send(response.data);
    } catch (err) {
        res.status(500).send({ error: "Failed to clear the cart!" });
    }
});

// Add item to cart
router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body;
        const response = await addItemToCart({ userId, productId, quantity });
        res.status(response.statusCode).send(response.data);
    } catch (err) {
        res.status(500).send({ error: "Failed to add item to cart!" });
        console.log(err);
    }
});

// Update item in cart
router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const { productId, quantity } = req.body;
        const response = await updateItemInCart({ userId, productId, quantity });
        res.status(response.statusCode).send(response.data);
    } catch (err) {
        res.status(500).send({ error: "Failed to update item in cart!" });
    }
});

// Delete item from cart
router.delete("/items/:productId", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user?._id;
        const { productId } = req.params;
        const response = await deleteItemIncart({ userId, productId });
        res.status(response.statusCode).send(response.data);
    } catch (err) {
        res.status(500).send({ error: "Failed to delete item from cart!" });
    }
});

// Checkout
router.post("/checkout", validateJWT, async (req: ExtendRequest, res) => {
    try {
        const userId = req?.user._id;
        const { address } = req.body;
        const response = await checkout({ userId, address });
        res.status(response.statusCode).send(response.data);
    } catch (err) {
        res.status(500).send({ error: "Checkout failed!" });
    }
});

export default router;