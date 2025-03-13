import { ICart, ICartItem, cartModels } from "../models/cartModels";
import productModels from "../models/productModels";
import { IOrderItem, orderModels } from "../models/orderModels";
import mongoose from "mongoose";

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct = true, // Ensure default is true
}: GetActiveCartForUser) => {
  let cart = await cartModels.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await cartModels.create({ userId, totalAmount: 0, items: [] });
  }

  if (populateProduct) {
    cart = await cart.populate({
      path: "items.product",
      select: "title image price", // ✅ Ensure image is included
    });
  }

  return cart;
};

interface ClearCart {
  userId: string;
}

export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  cart.items = [];
  cart.totalAmount = 0;
 
 await cart.save();

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

interface AddItemToCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const addItemToCart = async ({ productId, quantity, userId }: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  // Find if the product already exists in the cart
  const existsInCart = cart.items.find((p) => p.product.toString() === productId);

  if (existsInCart) {
      // If product exists, update quantity instead of adding duplicate entry
      existsInCart.quantity += quantity;
  } else {
      // If product does not exist, add new entry
      const product = await productModels.findById(productId);
      if (!product) {
          return { data: "Product not found!", statusCode: 400 };
      }
      if (product.stock < quantity) {
          return { data: "Low stock for item", statusCode: 400 };
      }

      cart.items.push({
          product: productId,
          unitPrice: Number(product.price) || 0,
          quantity: Number(quantity) || 0,
      });
  }

  // Update total cart amount
  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });

  await cart.save();

  return {
      data: await getActiveCartForUser({ userId, populateProduct: true }),
      statusCode: 200,
  };
};



interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}
export const updateItemInCart = async ({
  productId,
  quantity,
  userId,
}: UpdateItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  console.log("🔍 Product ID from request:", productId);
  console.log("🛒 Cart items before update:", cart.items);

  // Prevent quantity from dropping below 1
  if (quantity < 1) {
    return { data: "Quantity cannot be less than 1", statusCode: 400 };
  }

  const existsInCart = cart.items.find(
    (p) => (p.product as { _id: mongoose.Types.ObjectId })._id.toString() === new mongoose.Types.ObjectId(productId).toString()
  );

  if (!existsInCart) {
    console.log("⚠️ Item not found in cart!");
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  console.log("✅ Item found in cart, updating...");

  const product = await productModels.findById(productId);

  if (!product) {
    return { data: "Product not found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low stock for item", statusCode: 400 };
  }

  existsInCart.quantity = quantity;
  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });

  await cart.save();

  console.log("✅ Cart successfully updated!");

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};



interface DeleteItemInCart {
  productId: any;
  userId: string;
}

export const deleteItemIncart = async ({
  userId,
  productId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  console.log("🔍 Product ID from request:", productId);
  console.log("🛒 Cart items before deletion:", cart.items);

  const existsInCart = cart.items.find(
    (p) => (p.product as { _id: mongoose.Types.ObjectId })._id.toString() === new mongoose.Types.ObjectId(productId).toString()
  );

  if (!existsInCart) {
    console.log("⚠️ Item not found in cart!");
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  console.log("✅ Item found in cart, deleting...");

  cart.items = cart.items.filter(
    (p) => (p.product as { _id: mongoose.Types.ObjectId })._id.toString() !== new mongoose.Types.ObjectId(productId).toString()
  );

  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });
  await cart.save();

  console.log("✅ Item successfully removed from cart!");

  return {
    data: await getActiveCartForUser({ userId, populateProduct: true }),
    statusCode: 200,
  };
};

const calculateCartTotalItems = ({ cartItems }: { cartItems: ICartItem[] }) => {
  return cartItems.reduce((sum, product) => {
    const unitPrice = Number(product.unitPrice) || 0;
    const quantity = Number(product.quantity) || 0;
    return sum + quantity * unitPrice;
  }, 0);
};

interface Checkout {
  userId: string;
  address: string;
}

export const checkout = async ({ userId, address }: Checkout) => {
  if (!address) {
    return { data: "Please add the address", statusCode: 400 };
  }

  const cart = await getActiveCartForUser({ userId });

  if (cart.items.length === 0) {
    return { data: "Cart is empty, cannot proceed to checkout", statusCode: 400 };
  }

  const orderItems: IOrderItem[] = [];

  for (const item of cart.items) {
    const product = await productModels.findById(item.product).select("title image");

    if (!product) {
      return { data: "Product not found", statusCode: 400 };
    }

    orderItems.push({
      productTitle: product.title,
      productImageUrl: product.image, // ✅ Ensure image is included
      quantity: item.quantity,
      unitePrice: item.unitPrice,
    });
  }

  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });

  const order = await orderModels.create({
    orderItems,
    total: cart.totalAmount,
    address,
    userId,
  });

  cart.status = "completed";
  await cart.save();

  return { data: order, statusCode: 200 };
};