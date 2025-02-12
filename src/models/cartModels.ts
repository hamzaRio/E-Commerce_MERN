import mongoose, {Schema,ObjectId, Document} from "mongoose";
import { IProduct } from "./productModels";


const CartStatusEnum = ["active", "completed"] as const;

export interface ICartItem {
    product: IProduct;
    quantity: number;
    unitPrice: number;
}

export interface ICart extends Document{
    userId: string | ObjectId;
    items: ICartItem[];
    totalAmount: number;
    status: "active" | "completed";
}

const cartItemSchema = new Schema<ICartItem>({
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, required: true, default: 1},
    unitPrice: {type: Number, required: true},
});


const cartSchema = new Schema<ICart>({
    userId: {type: Schema.Types.ObjectId, required: true, ref: 'User'}, 
    items: [cartItemSchema],
    totalAmount: {type: Number, required: true, default: 0},
    status: {type: String, required: true, default: "active"},
});

export default mongoose.model<ICart>('Cart', cartSchema);