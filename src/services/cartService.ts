import cartModels from "../models/cartModels";

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

