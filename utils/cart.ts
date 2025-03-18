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
  color: string;
  size: string;
}

interface CartSate {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQty: (type: "increment" | "decrement", id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartSate>()(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product) => {
        const existingProduct = get().items.find(
          (item) => item.id === product.id,
        );
        set({
          items: existingProduct
            ? get().items
            : [
                ...get().items,
                {
                  quantity: 1,
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  discountPercentage: product.discountPercentage || null,
                  image: product.images[0],
                  size: product.size[0],
                  color: product.color[0],
                },
              ],
        });
        if (existingProduct) {
          toast.error("Product Already exists");
        } else {
          toast.success("Product Added successfully");
        }
      },
      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
        toast.success("Item removed");
      },
      updateQty: (type, id) => {
        const item = get().items.find((item) => item.id === id);
        if (!item) {
          return;
        }
        if (item.quantity === 1 && type === "decrement") {
          get().removeFromCart(id);
        } else {
          item.quantity =
            type === "decrement" ? item.quantity - 1 : item.quantity + 1;
          set({
            items: [...get().items],
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
    },
  ),
);

export default useCartStore;
