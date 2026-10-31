import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { api } from '../../api/api';
import { toast } from 'react-toastify';
import type { ProductProps, ProductVariant } from '../../components/ProductCard';
import { Button } from '../../components/Button';
import { GiShoppingBag } from "react-icons/gi";
import { useCart } from '../../store/useCart';
import { MdCheck } from 'react-icons/md';

const ProductDetails = () => {
  const { slug } = useParams();
  const productId = slug?.split("-")[0];
  const [product, setProduct] = useState<ProductProps>();
  const [activeVariant, setActiveVariant] = useState<ProductVariant>();

  const [quantity, setQuantity] = useState<number>(1);
  const [localQty, setLocalQty] = useState<string>("1");
  const { cart, addToCart } = useCart();

  useEffect(() => {
    setLocalQty(quantity.toString());
  }, [quantity]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res  = await api.get("/products/get-product.php", {
          params: { productId: productId }
        });
        const fetchedProduct: ProductProps = res.data.data;
        setProduct(fetchedProduct);

        if(fetchedProduct.variants.length > 0) {
          setActiveVariant(fetchedProduct.variants[0])
        }
      } catch (error) {
        console.log(`Err: ${error}`);
        toast.error("Failed to fetch product.")
      }
    }

    getProduct();
  }, [productId]);

  const addQuantity = () => {
    setQuantity((prev) => prev + 1);
  }

  const minusQuantity = () => {
    if(quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  }

  const currentVariantId = product && activeVariant ? `${product.id}-${activeVariant.id}` : "";
  const existCartItem = cart.find((item) => item.cartItemId === currentVariantId);
  const existingQty = existCartItem ? existCartItem?.quantity : 0;

  const handleAddToCart = async () => {
    if(!product || !activeVariant) return;

    if (existingQty >= 100) {
      toast.warning("You've reached the maximum limit of 100 for this item");
      return;
    }

    const addableQty = 100 - existingQty;

    if(quantity > addableQty) {
      const result = await addToCart(product, activeVariant, addableQty);
      if(result.success) {
        toast.warning(`Added ${addableQty} to bag. Reached maximum limit of 100 for this item.`);
        setQuantity(1);
      }
      return;
    }

    const result = await addToCart(product, activeVariant, quantity);

    if(!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    setQuantity(1);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQty(val); 

    const parsed = parseInt(val, 10)
    if(!isNaN(parsed) &&  parsed >= 1 && parsed <= 100) {
      setQuantity(parsed)
    }
  }

  const handleBlur = () => {
    const parsed = parseInt(localQty);

    if(isNaN(parsed) || parsed < 1) {
      setLocalQty("1");
      setQuantity(1);
    } else if(parsed > 100) {
      setLocalQty("100");
      setQuantity(100);
      toast.warn("You've reached the maximum limit of 100 for this item");
    } else {
      setLocalQty(parsed.toString());
      setQuantity(parsed);
    }
  }

  if (!product) return (
    <div className="pt-16 pb-20 container-xl min-h-[80vh]">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
        <div className="mx-auto bg-gray-200 rounded-md w-140 aspect-square"></div>
        <div className="flex flex-col gap-4 py-8">
          <div className="w-3/4 h-10 bg-gray-200 rounded"></div>
          <div className="w-1/2 h-6 bg-gray-200 rounded"></div>
          <div className="w-1/4 h-8 bg-gray-200 rounded"></div>
          <div className="w-full h-24 mt-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-20 container-xl">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* image */}
        <div className="flex items-center max-h-120 justify-center p-0 mx-auto md:p-6 bg-surface w-full max-w-[320px] md:max-w-none md:w-full aspect-square">
          {activeVariant && (
            <img
              src={activeVariant.image_path}
              alt={`${product.name} ${activeVariant.color_name}`}
              className="object-contain w-full h-full mix-blend-multiply"
            />
          )}
        </div>

        {/* product details */}
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-2xl font-bold md:text-3xl">{product.name}</h1>
          <p className="text-gray-600">{product.brand} · {product.sub_category}</p>
          <p className="text-2xl font-semibold">₱{product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          {/* color selection */}
          <div className="mt-4">
            <p className="mb-2 text-sm font-bold">
              Shade: <span className="font-normal">{activeVariant?.color_name}</span>
            </p>
            <div className="flex gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setActiveVariant(variant)}
                  style={{ backgroundColor: variant.hex_code }}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    activeVariant?.id === variant.id ? 'border-black scale-110' : 'border-gray-200'
                  }`}
                  title={variant.color_name}
                />
              ))}
            </div>
          </div>

          {existingQty > 0 ? (
            <p className="text-xs text-primary/70 mt-2 flex gap-0.5 items-center">
              <MdCheck size={14} /> <span>{existingQty} already in your bag</span>
            </p>
          ) : (
            <div className="mt-2"></div>
          )}

          <div className="flex gap-4 mt-2">
            <div className="flex border border-gray-400 rounded">
              <button 
                disabled={quantity === 1}
                onClick={() => minusQuantity()}
                className="w-10 p-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-100 disabled:bg-gray-200"
              >
                -
              </button>
              <input
                className="w-12 p-2 text-center text-gray-900 cursor-pointer bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                type="text" 
                name="quantity" 
                id="quantity" 
                value={localQty}
                maxLength={3}
                onChange={(e) => handleInputChange(e)}
                onBlur={() => handleBlur()}
              />
              <button 
                disabled={quantity >= 100}
                onClick={() => addQuantity()}
                className="w-10 p-2 text-gray-600 transition-colors cursor-pointer hover:bg-gray-100 disabled:bg-gray-200"
              >
                +
              </button>
            </div>
            
            <Button
              variant="primary"
              className="flex items-center w-full gap-1.5 text-white"
              onClick={() => handleAddToCart()}
            >
              <GiShoppingBag size={16} />
              <span>Add to Bag</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails;
