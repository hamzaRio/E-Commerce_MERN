"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const productService_1 = require("./services/productService");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3001;
mongoose_1.default.connect("mongodb://localhost:27017/ecommerce").then(() => {
    console.log('Connected to MongoDB');
    (0, productService_1.seedIntialProducts)();
}).catch((error) => {
    console.log('Error connecting to MongoDB', error);
});
// Seed the products to the database
(0, productService_1.seedIntialProducts)();
app.use('/user', userRoute_1.default);
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
