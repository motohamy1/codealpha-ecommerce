import {productModel} from "../models/productModel.ts";

export const getAllProducts = async () => {
    return await productModel.find();
}


type CreateProductInput = {
    title: string;
    image: string;
    price: number;
    stock: number;
    description: string;
}

export const createProduct = async ({title, image, price, stock, description}: CreateProductInput) => {
    const newProduct = new productModel({
        title,
        image,
        price,
        stock,
        description,
    });
    await newProduct.save();
    return newProduct;
}