import cartModels, { ICart, ICartItem } from "../models/cartModels";
import productModels from "../models/productModels";
import { IOrderItem, orderModels } from "../models/orderModels";

interface CreateCartForUser {
    userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
    try {
        const cart = await cartModels.create({ userId, totalAmount: 0 });
        await cart.save();
        return cart;
    } catch (error) {
        console.error("Error creating cart:", error);
        throw new Error("Failed to create cart");
    }
};

interface GetActiveCartForUser {
    userId: string;
}

export const getActiveCartForUser = async ({ userId }: GetActiveCartForUser) => {
    try {
        let cart = await cartModels.findOne({ userId, status: "active" });

        if (!cart) {
            cart = await createCartForUser({ userId });
        }
        return cart;
    } catch (error) {
        console.error("Error getting active cart:", error);
        throw new Error("Failed to get active cart");
    }
};

interface ClearCart {
    userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
    try {
        const cart = await getActiveCartForUser({ userId });

        cart.items = [];
        cart.totalAmount = 0;

        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 200 };
    } catch (error) {
        console.error("Error clearing cart:", error);
        return { data: "Failed to clear cart", statusCode: 500 };
    }
};

interface AddItemToCart {
    productId: string;
    userId: string;
    quantity: number;
}

export const addItemToCart = async ({ userId, productId, quantity }: AddItemToCart) => {
    try {
        const cart = await getActiveCartForUser({ userId });
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (existsInCart) {
            return { data: "Item already exists in cart", statusCode: 400 };
        }

        const product = await productModels.findById(productId);

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }

        if (product.stock < quantity) {
            return { data: "Insufficient stock", statusCode: 400 };
        }

        cart.items.push({ product: product, unitPrice: product.price, quantity });
        cart.totalAmount += product.price * quantity;

        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 201 };
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return { data: "Failed to add item to cart", statusCode: 500 };
    }
};

interface UpdateItemInCart {
    productId: string;
    userId: string;
    quantity: number;
}

export const updateItemInCart = async ({ userId, productId, quantity }: UpdateItemInCart) => {
    try {
        const cart = await getActiveCartForUser({ userId });
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (!existsInCart) {
            return { data: "Item does not exist in cart", statusCode: 400 };
        }

        const product = await productModels.findById(productId);

        if (!product) {
            return { data: "Product not found", statusCode: 404 };
        }

        if (product.stock < quantity) {
            return { data: "Insufficient stock", statusCode: 400 };
        }

        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
        let total = calculateCartTotalItem({ cartItems: otherCartItems });

        existsInCart.quantity = quantity;
        total += existsInCart.unitPrice * existsInCart.quantity;

        cart.totalAmount = total;

        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 200 };
    } catch (error) {
        console.error("Error updating item in cart:", error);
        return { data: "Failed to update item in cart", statusCode: 500 };
    }
};

interface DeleteItemInCart {
    productId: string;
    userId: string;
}

export const deleteItemInCart = async ({ userId, productId }: DeleteItemInCart) => {
    try {
        const cart = await getActiveCartForUser({ userId });
        const existsInCart = cart.items.find((p) => p.product.toString() === productId);

        if (!existsInCart) {
            return { data: "Item does not exist in cart", statusCode: 400 };
        }

        const otherCartItems = cart.items.filter((p) => p.product.toString() !== productId);
        const total = calculateCartTotalItem({ cartItems: otherCartItems });

        cart.items = otherCartItems;
        cart.totalAmount = total;

        const updatedCart = await cart.save();
        return { data: updatedCart, statusCode: 200 };
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        return { data: "Failed to delete item from cart", statusCode: 500 };
    }
};

const calculateCartTotalItem = ({ cartItems }: { cartItems: ICartItem[] }) => {
    return cartItems.reduce((sum, product) => sum + product.quantity * product.unitPrice, 0);
};

interface Checkout {
    userId: string;
    address: string;
}

export const checkout = async ({ userId, address }: Checkout) => {
    try {
        if (!address) {
            return { data: "Please provide an address", statusCode: 400 };
        }

        const cart = await getActiveCartForUser({ userId });

        const orderItems: IOrderItem[] = [];
        for (const item of cart.items) {
            const product = await productModels.findById(item.product);
            if (!product) {
                return { data: "Product not found", statusCode: 404 };
            }

            orderItems.push({
                productTitle: product.title,
                productImageUrl: product.image,
                quantity: item.quantity,
                unitePrice: item.unitPrice
            });
        }

        const order = await orderModels.create({
            orderItems,
            userId,
            address,
            total: cart.totalAmount,
        });

        await order.save();

        cart.status = "completed";
        await cart.save();

        return { data: order, statusCode: 201 };
    } catch (error) {
        console.error("Error during checkout:", error);
        return { data: "Failed to process checkout", statusCode: 500 };
    }
};
