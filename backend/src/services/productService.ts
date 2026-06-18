import { productModel } from "../models/productModel.ts";
import { deleteImageFile } from "./imageService.ts";

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

export const updateProduct = async (id: string, updates: Partial<CreateProductInput>) => {
    const product = await productModel.findById(id);
    if (!product) {
        throw new Error("Product not found");
    }

    // If the image is being changed and the old one was local, clean it up
    if (updates.image && updates.image !== product.image) {
        await deleteImageFile(product.image);
    }

    Object.assign(product, updates);
    await product.save();
    return product;
}

export const deleteProduct = async (id: string) => {
    const product = await productModel.findById(id);
    if (!product) {
        throw new Error("Product not found");
    }

    // Clean up its local image file
    await deleteImageFile(product.image);

    return await productModel.findByIdAndDelete(id);
}