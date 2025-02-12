import cartModels from "../models/cartModels";
import productModels from "../models/productModels";

interface   CreateCartForUser{
    userId: string ;
    
}

const createCartForUser = async ({userId}: CreateCartForUser) => {
    // logic to create a cart for a user
    const cart =  await cartModels.create({userId, totalAmount: 0});
    await cart.save();
    return cart;
}

interface GetActiveCartForUser{
    userId: string;
}

export const getActiveCartForUser = async ({userId}: GetActiveCartForUser) => { 
    // logic to get active cart for a user
    let cart = await cartModels.findOne({userId, status: "active"});
    
    if(!cart){
        cart = await createCartForUser({userId});
    } 
    return cart;
}
interface AddItemToCart{
    productId: string;
    userId: any;
    quantity: number;
}

export const addItemToCart = async ({userId, productId, quantity}: AddItemToCart) => {
    // logic to add item to cart
    const cart = await getActiveCartForUser({userId});
    const existsIncart = cart.items.find((p)=> p.product.toString() === productId);

    if(existsIncart){
        return {data: "Item already exists in cart", statusCode: 400};
    }

const product = await productModels.findById(productId);

if(!product){
    return {data: "Product not found", statusCode: 404}; 
}

if (product.stock < quantity){
    return {data: "Insufficient stock", statusCode: 400};
}


cart.items.push({product: product, unitPrice: product.price, quantity});

cart.totalAmount += product.price * quantity;

const updatedCart = await cart.save();

return {data: updatedCart, statusCode: 201 };

}