import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./Button";
import { toast } from "react-toastify";
import { GiShoppingBag } from "react-icons/gi";
import { useCart } from "../store/useCart";

export type ProductVariant = {
  id: number;
  product_id: number;
  color_name: string;
  hex_code: string;
  image_path: string;
};

export type ProductProps = {
  id: number;
  name: string;
  brand: string;
  category: string;
  sub_category: string;
  description: string;
  price: number;
  variants: ProductVariant[];
};

const ProductCard = ({ product }: { product: ProductProps }) => {
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(product.variants[0]);
  const urlSlug = `/product/${product.id}-${product.name.toLowerCase().replace(/\s+/g, '-')}`;

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const result = addToCart(product, activeVariant, 1);

    if(!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
  }
  
  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <Link to={urlSlug} className="w-full bg-surface shrink-0 max-h-74 aspect-5/4">
        <img 
          src={activeVariant.image_path} 
          alt={`${product.name} in ${activeVariant.color_name}`} 
          className="object-contain w-full h-full p-4 duration-300 ease-in-out mix-blend-multiply hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-between flex-1 px-4 pt-2 pb-4 bg-surface">
        <Link
          to={urlSlug}
          className="font-serif text-lg font-semibold leading-tight line-clamp-2"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-sm text-primary/70">{product.sub_category}</p>

        <div className="flex gap-2 overflow-x-auto overflow-y-hidden flex-nowrap scrollbar-none scroll-width-none p-2 [-ms-webkit-style: none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => setActiveVariant(variant)}
              className={`w-6 h-6 border-2 rounded-full focus:outline-none transition-all duration-200 cursor-pointer shrink-0 
                ${activeVariant.id === variant.id ? 'border-primary scale-105' : 'border-gray-200 hover:scale-103'}
              `}
              style={{backgroundColor: variant.hex_code}}
              title={`${variant.color_name}`}
            />
          ))}
        </div>

        <p className="text-sm text-primary/70">
          Color: {activeVariant.color_name}
        </p>

        <Button 
          onClick={() => handleAddToCart()}
          className="items-center w-full gap-1 mt-6 "
        >
          <GiShoppingBag size={16} />
          <span>Add to Bag</span>
        </Button>
      </div>
    </div>
  )
}

export default ProductCard;