import { Product } from "@prisma/client";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  quantity: number;
  id: string;
  title: string;
  price: number;
  discountPercentage: number | null;
  discountStart: Date | null;
  discountEnd: Date | null;
  image: string;
  color: string[];
  size: string[];
  cartItemId: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, color: string, size: string) => void;
  removeFromCart: (id: string) => void;
  updateQty: (type: "increment" | "decrement", id: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product, color, size) => {
        try {
          const cartItemId = `${product.id}-${color}-${size}`;
          const items = [...get().items];
          const existingItemIndex = items.findIndex(
            (item) => item.cartItemId === cartItemId,
          );

          if (existingItemIndex >= 0) {
            // Update existing item
            items[existingItemIndex].quantity += 1;
            set({ items });
            toast.success("Item quantity updated");
          } else {
            // Add new item
            const newItem: CartItem = {
              quantity: 1,
              id: product.id,
              cartItemId,
              title: product.title,
              price: product.price,
              discountPercentage: product.discountPercentage || null,
              discountStart: product.discountStart || null,
              discountEnd: product.discountEnd || null,
              image: product.images[0],
              size: [size],
              color: [color],
            };

            set({ items: [...items, newItem] });
            toast.success("Product added to cart");
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add product to cart");
        }
      },

      removeFromCart: (id) => {
        try {
          // Fix: Use direct state update instead of filter
          const currentItems = get().items;
          const itemToRemove = currentItems.find(
            (item) => item.cartItemId === id || item.id === id,
          );

          if (!itemToRemove) {
            console.warn("Item not found for removal:", id);
            return;
          }

          const updatedItems = currentItems.filter(
            (item) => item.cartItemId !== id && item.id !== id,
          );

          set({ items: updatedItems });
          toast.success("Item removed from cart");
        } catch (error) {
          console.error("Error removing from cart:", error);
          toast.error("Failed to remove item from cart");
        }
      },

      updateQty: (type, id) => {
        try {
          // Fix: Create a deep copy of the items array
          const currentItems = JSON.parse(JSON.stringify(get().items));

          // Try to find by cartItemId first, then by id
          const itemIndex = currentItems.findIndex(
            (item: any) => item.cartItemId === id || item.id === id,
          );

          if (itemIndex === -1) {
            console.warn("Item not found for quantity update:", id);
            return;
          }

          if (type === "decrement" && currentItems[itemIndex].quantity <= 1) {
            // Remove item if quantity would be less than 1
            get().removeFromCart(id);
            return;
          }

          // Update quantity with a new object to ensure state change
          currentItems[itemIndex] = {
            ...currentItems[itemIndex],
            quantity:
              type === "increment"
                ? currentItems[itemIndex].quantity + 1
                : currentItems[itemIndex].quantity - 1,
          };

          // Force a complete state update
          set({ items: [...currentItems] });
        } catch (error) {
          console.error("Error updating quantity:", error);
          toast.error("Failed to update item quantity");
        }
      },

      clearCart: () => {
        try {
          set({ items: [] });
          toast.success("Cart cleared");
        } catch (error) {
          console.error("Error clearing cart:", error);
          toast.error("Failed to clear cart");
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          // Calculate price considering discounts
          let itemPrice = item.price;
          if (item.discountPercentage) {
            const now = new Date();
            const discountStart = item.discountStart
              ? new Date(item.discountStart)
              : null;
            const discountEnd = item.discountEnd
              ? new Date(item.discountEnd)
              : null;

            const isDiscountActive =
              (!discountStart || now >= discountStart) &&
              (!discountEnd || now <= discountEnd);

            if (isDiscountActive) {
              itemPrice = itemPrice * (1 - item.discountPercentage / 100);
            }
          }
          return total + itemPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      version: 2, // Increment version to reset potentially corrupted state
      storage: createJSONStorage(() => {
        // Only use localStorage in browser environment
        if (typeof window !== "undefined") {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Only persist the items array
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export default useCartStore;
