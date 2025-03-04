import { Types } from "mongoose";
import { ICart, ICartItem, cartModels } from "../models/cartModels";
import productModels from "../models/productModels";
import { IOrderItem, orderModels } from "../models/orderModels";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModels.create({ userId, totalAmount: 0, items: [] });
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
  populateProduct?: boolean;
}

export const getActiveCartForUser = async ({
  userId,
  populateProduct,
}: GetActiveCartForUser) => {
  let cart = await cartModels.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return populateProduct ? await cart.populate("items.product") : cart;
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

export const addItemToCart = async ({
  productId,
  quantity,
  userId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (existsInCart) {
    return { data: "Item already exists in cart!", statusCode: 400 };
  }

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

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  const product = await productModels.findById(productId);

  if (!product) {
    return { data: "Product not found!", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low stock for item", statusCode: 400 };
  }

  if (existsInCart.quantity !== quantity) {
    existsInCart.quantity = Number(quantity) || 0;
  }

  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });
  await cart.save();

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

  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }

  cart.items = cart.items.filter((p) => p.product.toString() !== productId);
  cart.totalAmount = calculateCartTotalItems({ cartItems: cart.items });
  await cart.save();

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
    const product = await productModels.findById(item.product);

    if (!product) {
      return { data: "Product not found", statusCode: 400 };
    }

    orderItems.push({
      productTitle: product.title,
      productImageUrl: product.image,
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
