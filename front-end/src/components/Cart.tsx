import { IoMdClose } from "react-icons/io"
import { useCart, type CartItem } from "../store/useCart";
import { Button } from "./Button";
import { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { LuLock } from "react-icons/lu";
import { getImageUrl } from "../utils/getImageUrl";

interface CartItemProps extends CartItem {
  setIsCartOpen: (isCartOpen: boolean) => void;
}

const CartItem = ({
  setIsCartOpen,
  cartItemId,
  product,
  selectedVariant,
  quantity,
}: CartItemProps) => {
  
  const [localQty, setLocalQty] = useState<string>(quantity.toString());
  const { cart, updateQuantity, updateVariant, removeFromCart } = useCart();

  useEffect(() => {
    setLocalQty(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalQty(val); 

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
      updateQuantity(cartItemId, parsed);
    }
  };

  const handleBlur = () => {
    const parsed = parseInt(localQty);
    if (isNaN(parsed) || parsed < 1) {
      setLocalQty("1");
      updateQuantity(cartItemId, 1);
    } else if (parsed > 100) {
      setLocalQty("100");
      updateQuantity(cartItemId, 100);
      toast.warn("You've reached the maximum limit of 100 for this item");
    } else {
      setLocalQty(parsed.toString());
      updateQuantity(cartItemId, parsed);
    }
  };

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newVariantId = Number(e.target.value);
    const newCartItemId = `${product.id}-${newVariantId}`;

    if(selectedVariant.id === newVariantId) return;

    const existingItem = cart.find((i) => i.cartItemId === newCartItemId);

    if(existingItem) {
      toast(
        ({ closeToast }) => (
          <div className="flex flex-col gap-2 p1">
            <p className="text-sm font-medium text-gray-900">
              This variant is already in your bag. Would you like to combine their quantities?
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  updateVariant(cartItemId, newVariantId);
                  closeToast();
                }}
                className="px-2 py-1 text-xs text-white rounded-md cursor-pointer bg-primary hover:opacity-90"
              >
                Yes, Merge
              </button>
              <button
                onClick={() => closeToast()}
                className="px-2 py-1 text-xs text-gray-700 bg-gray-200 rounded-md cursor-pointer hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ), {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false
        }
      );
    } else {
      updateVariant(cartItemId, newVariantId);
    }

  };

  return (
    <div className="flex w-full gap-4">
      <Link
        to={`/product/${cartItemId}-${product.name}`}
        onClick={() => setIsCartOpen(false)}
        className="w-20 h-20 p-1 overflow-hidden bg-gray-100 border shrink-0"
      >
        <img 
          src={getImageUrl(selectedVariant.image_path)} 
          className="object-cover w-full h-full duration-300 ease-in-out hover:scale-110"
          alt={product.name}
        />
      </Link>
      <div className="flex flex-col justify-between flex-1">
        <div>
          <Link 
            to={`/product/${cartItemId}-${product.name}`}
            onClick={() => setIsCartOpen(false)}
            title={product.name} 
            className="text-sm font-medium line-clamp-1"
          >
            {product.name}
          </Link>
          <select 
            name="variant" 
            id="variant"
            value={selectedVariant.id}
            onChange={(e) => handleVariantChange(e)}
            className="p-1 mt-1 text-xs bg-white border rounded cursor-pointer" 
          >
            {product.variants.map((item) => (
              <option key={item.id} value={item.id}>
                {item.color_name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm font-semibold">₱{product.price}</p>

          <div className="flex overflow-hidden border border-gray-300 rounded">
            <button 
              disabled={quantity === 1}
              onClick={() => updateQuantity(cartItemId, quantity - 1)}
              className="py-1 text-gray-600 transition-colors cursor-pointer w-7 hover:bg-gray-100 disabled:bg-gray-200"
            >
              -
            </button>
            <input
              className="w-9 py-1 text-center text-sm text-gray-900 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:outline-none" 
              type="text" 
              name="quantity" 
              id="quantity" 
              value={localQty} 
              maxLength={4}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
            <button 
              onClick={() => updateQuantity(cartItemId, quantity + 1)}
              disabled={quantity >= 100}
              className="py-1 text-gray-600 transition-colors cursor-pointer w-7 hover:bg-gray-100 disabled:bg-gray-200"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <button className="text-xl duration-300 cursor-pointer hover:-rotate-12 hover:text-red-900" onClick={() => removeFromCart(cartItemId)}>
        <MdDeleteOutline />
      </button>
    </div>
  )
}

interface CartProps {
  setIsCartOpen: (isOpen: boolean) => void;
}

const Cart = ({ setIsCartOpen }: CartProps) => {
  const { cart, checkout } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>(
    cart.map((item) => item.cartItemId)
  );

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const checkoutCart = () => {
    if(isAuthenticated && selectedItems.length === 0) {
      toast.info("Select at least one item to proceed.");
      return;
    }

    setIsCartOpen(false);

    if(!isAuthenticated) {
      navigate("/login");
      return;
    } 
    
    checkout(selectedItems);
    toast.success("Order placed successfully!")
  }

  useEffect(() => {
    setSelectedItems(prev => prev.filter(id => cart.some(item => item.cartItemId === id)));
  }, [cart]);

  const subtotal = cart
    .filter(item => selectedItems.includes(item.cartItemId))
    .reduce((total, item) => total + item.product.price * item.quantity, 0);

  const toggleSelection = (cartItemId: string) => {
    setSelectedItems((prev) => (
      prev.includes(cartItemId)
      ? prev.filter(id => id !== cartItemId)
      : [...prev, cartItemId]
    ))
  }

  const handleSelectAll = () => {
    const check = cart.length === selectedItems.length;

    if(check) {
      setSelectedItems(() => [])
    } else {
      setSelectedItems(() => (
        cart.map((item) => item.cartItemId)
      ))
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white shadow-2xl md:w-[400px]">
      
      <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
        <h2 className="text-xl font-medium">Your Bag ({cart.length > 99 ? "99+" : cart.length})</h2>
        <button
          onClick={() => setIsCartOpen(false)}
          className="text-2xl transition-colors cursor-pointer hover:text-gray-500"
        >
          <IoMdClose />
        </button>
      </div>

      <div className="flex-1 min-h-0 p-6 overflow-y-auto overscroll-contain scrollbar-thumb-primary">
        {cart.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-xl text-gray-900">
            <GiShoppingBag className="text-xl" />
            <p>Your bag is looking empty.</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => handleSelectAll()}
              className={`block mb-6 ml-auto text-sm cursor-pointer w-max ${cart.length !== selectedItems.length ? "text-blue-500" : "text-red-900"}`}
            >
              {cart.length === selectedItems.length 
                ? "Deselect All"
                : "Select All"
              }
            </button>

            <div className="flex flex-col gap-6">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.cartItemId)}
                    className="w-3 h-3 cursor-pointer accent-primary shrink-0"
                    onChange={() => toggleSelection(item.cartItemId)}
                  />
                  
                  <CartItem
                    setIsCartOpen={setIsCartOpen}
                    cartItemId={item.cartItemId}
                    product={item.product}
                    selectedVariant={item.selectedVariant}
                    quantity={item.quantity}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between mb-4 text-lg font-medium">
          <span>Subtotal</span>
          <span>₱{subtotal.toLocaleString()}</span>
        </div>

        {isAuthenticated ? (
          <Button 
            onClick={() => checkoutCart()}
            className="flex items-center w-full gap-1 py-4 text-lg bg-primary disabled:cursor-not-allowed"
          >
            {selectedItems.length === 0 ? (
              <>
                <LuLock />
                <span>Select Items to Proceed</span>
              </>
            ) : (
              <span>Proceed to checkout</span>
            )}
            
          </Button>
        ) : (
          <Button 
            onClick={() => checkoutCart()}
            className="flex items-center w-full gap-1 py-4 text-lg bg-primary"
          >
            <LuLock />
            <span>Login to continue</span>
          </Button>
        )}
      </div>
      
    </div>
  );
};

export default Cart
