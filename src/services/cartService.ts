import { get } from "mongoose";
import cartModels, { ICart, ICartItem } from "../models/cartModels";
import productModels from "../models/productModels";
import { IOrderItem, orderModels } from "../models/orderModels";

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


interface ClearCart{
        userId: string
}

export const clearCart = async ({userId}:ClearCart) =>{
    const  cart = await getActiveCartForUser({userId})


    cart.items = []
    cart.totalAmount = 0

    const updatedCart = await cart.save()

    return {data: updatedCart, statusCode:200 }
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

     let total = calculateCartTotalItem({cartItems:otherCartItems})

     existsIncart.quantity = quantity;

     total += existsIncart.unitPrice * existsIncart.quantity;

     cart.totalAmount = total;

     const updatedCart = await cart.save()

        return {data: updatedCart, statusCode: 200};
}   // logic to update item in cart

interface DeleteItemIncart{
    productId: any;
    userId: string;
}

export const deleteItemIncart   = async ({userId, productId}: DeleteItemIncart) =>{
    const cart  = await getActiveCartForUser({userId})
    const existsIncart = cart.items.find(
        (p) => p.product.toString() === productId
    );
    if(!existsIncart)
    {
        return {data: "Item does not exist in cart ", statusCode: 400}
    }
    const  otherCartItems = cart.items.filter((p)=> p.product.toString() !== productId);

   const total = calculateCartTotalItem({cartItems:otherCartItems})

    cart.items = otherCartItems;
    cart.totalAmount = total;

    const updatedCart = await cart.save()

       return {data: updatedCart, statusCode: 200};
}

const calculateCartTotalItem = ({
    cartItems,
    }: {
        cartItems:ICartItem[];
    }) =>{
    const total  = cartItems.reduce((sum,product)=>{
        sum += product.quantity * product.unitPrice;
        return sum;
    },0);

    return total;
}

interface Checkout{
    userId: string;
    address: string; 
}

export const checkout = async ({userId, address}: Checkout) => {

    if(!address){
        return {data: "Please provide address", statusCode: 400};  // check if address is provided or not. If not, return an error message. 400 stands for Bad Request. 404 stands for Not Found. 200 stands for Ok.
    }
    // logic to checkout cart
    const cart = await getActiveCartForUser({userId});

    const orderItems: IOrderItem[] = []

    for (const item of cart.items)
    {
        const product = await productModels.findById(item.product);
        if(!product){
            return {data: "Product not found", statusCode: 404};
        }

        const orderItem: IOrderItem =
        {
            productTitle: product.title,
            productImageUrl: product.image,
            quantity: item.quantity,
            unitePrice: item.unitPrice
        }
        orderItems.push(orderItem);
    }
    const order = await orderModels.create({
        orderItems,
        userId,
        address,
        total: cart.totalAmount,
    })
    await order.save();

    //update  the cart status to be completed

    cart.status = "completed";
    await cart.save();
    return {data: order, statusCode: 201};
} 