import {productModel} from "../models/productModel.ts";

export const getAllProducts = async () => {
    return await productModel.find();
}


type CreateProductInput = {
    title: string;
    image: string;
    price: number;
    stock: number;
    category: string;
    description: string;
}

export const createProduct = async ({title, image, price, stock, category, description}: CreateProductInput) => {
    const newProduct = new productModel({
        title,
        image,
        price,
        stock,
        category,
        description,
    });
    await newProduct.save();
    return newProduct;
}