import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    image: string;
    price: number;
    stock: number;
    category: string;
    description: string;
}

const productSchema = new Schema<IProduct>({
    title: {type: String, required: true},
    image: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
    description: {type: String},
})

export const productModel = mongoose.model<IProduct>('Product', productSchema);
