"use client";

import React, { useState } from "react";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/store/useCart";
import { toast } from "react-hot-toast";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category?: string;
    wattage?: number;
  };
}

const ProductActions = ({ product }: ProductActionsProps) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: quantity,
      category: product.category,
      wattage: product.wattage,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex items-center border-2 border-gray-100 rounded-xl overflow-hidden h-14">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 hover:bg-gray-50 transition-colors h-full font-bold"
          >
            -
          </button>
          <span className="w-12 text-center font-black text-lg">{quantity}</span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 hover:bg-gray-50 transition-colors h-full font-bold"
          >
            +
          </button>
        </div>
        <Button 
          size="lg" 
          className="flex-grow gap-3 py-5 text-xl"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-6 h-6" />
          Add to Cart
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="px-5">
            <Heart className="w-6 h-6" />
          </Button>
          <Button variant="outline" size="lg" className="px-5">
            <Share2 className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Sticky Mobile Bar Content is handled here too by returning a separate part if needed, 
          but for simplicity I'll just keep the main actions here and update the page to use them */}
      
      {/* Mobile Buy Now Button (Teleported or repeated) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Price</span>
          <span className="text-lg font-black text-brand-primary">Rs. {product.price.toLocaleString()}</span>
        </div>
        <Button 
          className="flex-grow py-4 rounded-2xl shadow-xl shadow-brand-primary/20"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>
    </>
  );
};

export default ProductActions;
