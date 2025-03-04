import { Product } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  quantity: number;
  id: string;
  title: string;
  price: number;
  discountPercentage: number | null;
  image: string;
  color: string[];
  size: string[];
  cartItemId: string; // Add unique identifier for cart items
}

interface CartSate {
  items: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQty: (type: "increment" | "decrement", cartItemId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartSate>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, selectedColor, selectedSize) => {
        const existingProduct = get().items.find(
          (item) =>
            item.id === product.id &&
            item.color[0] === selectedColor &&
            item.size[0] === selectedSize
        );

        if (existingProduct) {
          toast.error("This variation already exists in cart");
          return;
        }

        const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;
        
        set({
          items: [
            ...get().items,
            {
              quantity: 1,
              id: product.id,
              cartItemId,
              title: product.title,
              price: product.price,
              discountPercentage: product.discountPercentage || null,
              image: product.images[0],
              size: [selectedSize],
              color: [selectedColor],
            },
          ],
        });
        toast.success("Product Added successfully");
      },
      removeFromCart: (cartItemId) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
        toast.success("Item removed");
      },
      updateQty: (type, cartItemId) => {
        const item = get().items.find((item) => item.cartItemId === cartItemId);
        if (!item) return;

        if (item.quantity === 1 && type === "decrement") {
          get().removeFromCart(cartItemId);
        } else {
          set({
            items: get().items.map((item) =>
              item.cartItemId === cartItemId
                ? {
                    ...item,
                    quantity:
                      type === "decrement" ? item.quantity - 1 : item.quantity + 1,
                  }
                : item
            ),
          });
        }
      },
      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

export default useCartStore;
