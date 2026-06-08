import mongoose, {Schema, Document} from "mongoose";
import type { IProduct } from "./productModel.ts";

export interface ICartItem {
    product: mongoose.Types.ObjectId | string | IProduct;
    unitPrice: number;
    quantity: number;
}

export interface ICart extends Document {
    userId: string;
    items: ICartItem[];
    totalPrice: number;
    status: "active" | "completed" | "cancelled";
}

const CartItemSchema = new Schema<ICartItem>({
    product: {type: Schema.Types.ObjectId, ref: "Product", required: true},
    unitPrice: {type: Number, required: true},
    quantity: {type: Number, required: true, min: 1}
})

const CartSchema = new Schema<ICart>({
    userId: {type: String, required: true},
    items: [CartItemSchema],
    totalPrice: {type: Number, required: true, default: 0},
    status: {type: String, enum: ["active", "completed", "cancelled"], default: "active"}
})

export const Cart = mongoose.model<ICart>('Cart', CartSchema);