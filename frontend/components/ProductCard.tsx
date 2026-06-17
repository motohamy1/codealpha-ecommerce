import { useState } from "react";import { addToCart } from "../lib/api";interface ProductCardProps {  id: string;  title: string;  image: string;  price: number;  category: string;}export default function ProductCard({  id,  title,  image,  price,  category }: ProductCardProps) {  const [adding, setAdding] = useState(false);  const handleAddToCart = async () => {    setAdding(true);    try {
        // For demo, we hardcode a userId and quantity
        const userId = "666666666666666666666666"; // replace with actual user id from auth
        await addToCart(userId, id, 1, price);
        alert("Added to cart");
      } catch (error) {
        console.error(error);
        alert("Failed to add to cart");
      } finally {
        setAdding(false);
      }
    };  return (    <div className="border rounded-lg p-4 flex flex-col h-full">      <img src={image} alt={title} className="h-48 w-full object-cover mb-4 rounded" />      <h3 className="text-xl font-bold mb-2">{title}</h3>      <p className="text-gray-600 mb-2">{category}</p>      <p className="text-lg font-semibold mb-4">${price}</p>      <button        onClick={handleAddToCart}        disabled={adding}        className="w-bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );}
