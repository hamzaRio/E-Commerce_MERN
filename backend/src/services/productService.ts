import productModel from "../models/productModels";

export const getAllProducts = async () => {
    // Code to get all products
    return await productModel.find();
}


export const seedIntialProducts = async () => {
    // Code to seed initial products

    try{

      const products = [
        { title: "Iphone 12", image: "https://tse4.mm.bing.net/th?id=OIP.OkefZiYGXm5zqd_nmhDfIAHaHa&pid=Api", price: 1200, stock: 10 },
        { title: "Macbook Pro", image: "https://tse3.mm.bing.net/th?id=OIP.6pbbCNkIfwwX99p0Al5lIwHaFj&pid=Api", price: 2500, stock: 5 },
        { title: "Ipad Pro", image: "https://tse3.mm.bing.net/th?id=OIP.Cs4QZ_1wlrtYw1CnSTH7zAHaEK&pid=Api", price: 900, stock: 25 },
        { title: "Apple Watch", image: "https://tse4.mm.bing.net/th?id=OIP.hkPDaTlHGV6b31sJCQ9YgwHaHj&pid=Api", price: 400, stock: 15 },
        { title: "Apple Airpods", image: "https://tse3.mm.bing.net/th?id=OIP.s3eNDVhZkRvQ0NLmhGPq9AHaHa&pid=Api", price: 250, stock: 30 },
        { title: "Apple Homepod", image: "https://tse2.mm.bing.net/th?id=OIP.y4QFtCzVf5G3bGEFxJhQhAHaHa&pid=Api", price: 300, stock: 20 },
        { title: "Apple Tv", image: "https://tse4.mm.bing.net/th?id=OIP.xsYZRcrD2Am9aPHfUk76wAHaHa&pid=Api", price: 200, stock: 10 },
        { title: "Apple Magic Mouse", image: "https://tse1.mm.bing.net/th?id=OIP.yOjM6JbN3tIX8e2LiG3gLgHaHa&pid=Api", price: 100, stock: 50 },
        { title: "Apple Magic Keyboard", image: "https://tse2.mm.bing.net/th?id=OIP.TyiDQmZ2iMWpa3kYt_8EWwHaHa&pid=Api", price: 150, stock: 40 },
        { title: "Apple Magic Trackpad", image: "https://tse2.mm.bing.net/th?id=OIP.TyiDQmZ2iMWpa3kYt_8EWwHaHa&pid=Api", price: 120, stock: 35 },
        
    ];
    const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
        await productModel.insertMany(products);
        console.log('Products seeded successfully.');
      } else {
        console.log('Products already exist. No need to seed.');
      }
    } 
    catch(error){
        console.error("can not seed products", error);
    }
   
      
   
}   
