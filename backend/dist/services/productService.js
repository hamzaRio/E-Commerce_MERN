"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedIntialProducts = exports.getAllProducts = void 0;
const productModels_1 = __importDefault(require("../models/productModels"));
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    // Code to get all products
    return yield productModels_1.default.find();
});
exports.getAllProducts = getAllProducts;
const seedIntialProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    // Code to seed initial products
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
    const existingProducts = yield (0, exports.getAllProducts)();
    if (existingProducts.length === 0) {
        yield productModels_1.default.insertMany(products);
        console.log('Products seeded successfully.');
    }
    else {
        console.log('Products already exist. No need to seed.');
    }
});
exports.seedIntialProducts = seedIntialProducts;
