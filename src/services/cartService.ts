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


interface UpdateItemIncart{
    productId: any;
    userId: string;
    quantity: number;
}

export const updateItemIncart = async ({userId, productId, quantity}: UpdateItemIncart) => {
    // logic to update item in cart
    const cart = await getActiveCartForUser({userId});
    const existsIncart = cart.items.find((p)=> p.product.toString() === productId);

    if(!existsIncart){
        return {data: "Item does not exist in cart", statusCode: 400};
    }   

    const product = await productModels.findById(productId);

    if(!product){
        return {data: "Product not found", statusCode: 404};    
    } 

    if(product.stock < quantity){
        return {data: "Product not found", statusCode: 404};
    }

     const  otherCartItems = cart.items.filter((p)=> p.product.toString() !== productId);

     let total = otherCartItems.reduce((sum,product)=>{
        sum += product.unitPrice * product.quantity;
        return sum;
     }, 0)

     existsIncart.quantity = quantity;

     total += existsIncart.unitPrice * existsIncart.quantity;

     cart.totalAmount = total;

     const updatedCart = await cart.save()

        return {data: updatedCart, statusCode: 200};
}   // logic to update item in cart
