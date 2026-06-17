import express from "express";
import { Router } from "express";
import { getAllProducts } from "../services/productService.ts";
import { createProduct } from "../services/productService.ts";

const productRouter = Router();

productRouter.get('/', async (req, res) => {
    const products = await getAllProducts();
    res.send(products);
});

productRouter.post('/', async (req, res) => {
    try {
            const {title, image, price, stock, category, description} = req.body;
            const newProduct = await createProduct({
                title, 
                image, 
                price, 
                stock, 
                category, 
                description});
            res.status(201).send(newProduct);

    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }

})

export default productRouter;