import mongoose from 'mongoose';
import { Cart } from '../models/cartModel.ts';
import Router from 'express';

const cartRouter = Router();

cartRouter.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const cart = await Cart.findOne({ userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
})

cartRouter.post('/:userId/add', async (req, res) => {
    const { userId } = req.params;
    const { productId, unitPrice, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });      
        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }
        const getProductId = (product: any) => {
            if (typeof product === 'string') return product;
            if (product instanceof mongoose.Types.ObjectId) return product.toString();
            return product?._id?.toString?.() ?? product?.toString?.();
        };

        const existingItemIndex = cart.items.findIndex(item => getProductId(item.product) === productId);
        const existingItem = cart.items[existingItemIndex];
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, unitPrice, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error });
    }
})


export default cartRouter;