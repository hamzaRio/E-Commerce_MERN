import mongoose, {Schema,ObjectId,Document} from "mongoose";

export interface IOrderItem {
    productTitle: string;
    productImageUrl: string;
    quantity: number;
    unitePrice: number;
}

export interface IOrder extends Document {
    userId: string | ObjectId;
    orderItems: IOrderItem[];
    total: number;
    address: string;
    // add any other fields as needed       
}

const orderItemSchema = new Schema<IOrderItem>({    
   productTitle: { type: "string", required: true },
   productImageUrl: { type: "string", required: true },
   quantity: { type: "number", required: true },
   unitePrice: { type: "number", required: true },

})
const orderSchema = new Schema<IOrder>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [orderItemSchema],
    total: { type: "number", required: true },
    address: { type: "string", required: true },
    // add any other fields as needed
})


export const orderModels = mongoose.model("Order",orderSchema) 