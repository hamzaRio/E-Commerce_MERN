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
        console.log("Received update request body:", req.body); // ✅ Debug request body
        console.log("User ID:", req?.user?._id); // ✅ Debug user ID

        const userId = req?.user?._id;
        const { productId, quantity } = req.body;

        const response = await updateItemInCart({ userId, productId, quantity });

        console.log("Update Response:", response); // ✅ Debug update result

        res.status(response.statusCode).send(response.data);
    } catch (err) {
        console.error("Error in update cart route:", err);
        res.status(500).send("Something went wrong!");
    }
});

// ✅ Fixed Delete Item Route
router.delete("/items", validateJWT, async (req: ExtendRequest, res): Promise<void> => {
    try {
        console.log("Received delete request body:", req.body);

        const userId = req?.user?._id;
        const { productId } = req.body;

        if (!productId) {
            res.status(400).json({ error: "Product ID is required!" });
            return;
        }

        const response = await deleteItemIncart({ userId, productId });

        console.log("Delete Response:", response);

        if (!response || typeof response !== "object" || !("statusCode" in response)) {
            throw new Error("Invalid response structure from deleteItemIncart");
        }

        res.status(response.statusCode).json(response.data);
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: "Internal server error" });
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
