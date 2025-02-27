"use client";

import { calculateDiscountedPrice } from "@/utils/calculateDiscount";
import useCartStore from "@/utils/cart";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlurImage from "@/components/shared/blur-image";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const page = () => {
  const { items, removeFromCart, updateQty } = useCartStore((state) => state);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const discountedSubtotal = items.reduce((total, item) => {
    const discountedPrice = calculateDiscountedPrice(
      item.price,
      item.discountPercentage ?? undefined,
      // item.discountStart ? new Date(item.discountStart) : undefined,
      // item.discountEnd ? new Date(item.discountEnd) : undefined,
    );
    return total + discountedPrice * item.quantity;
  }, 0);

  const discountAmount = subtotal - discountedSubtotal;
  const discountPercentage = ((discountAmount / subtotal) * 100).toFixed(1);
  const tax = discountedSubtotal * 0.1;
  const total = discountedSubtotal + tax;

  return (
    <section className="py-8">
      <MaxWidthWrapper>
        <h1 className="mb-8 text-center text-4xl font-bold">Shopping Cart</h1>
        <div className="flex w-full flex-col gap-8 lg:flex-row">
          <div className="flex-1 rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold">Cart Items</h2>
            {items.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-lg">Your cart is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {items.map((item: any) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item.price,
                    item.discountPercentage ?? undefined,
                    item.discountStart
                      ? new Date(item.discountStart)
                      : undefined,
                    item.discountEnd ? new Date(item.discountEnd) : undefined,
                  );
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 py-6 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
                          <BlurImage
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-2xl font-medium">{item.title}</h3>
                          {item.discountPercentage ? (
                            <div className="flex gap-2">
                              <p className="text-sm text-gray-500 line-through">
                                ${item.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-green-600">
                                ${discountedPrice.toFixed(2)}
                                <span className="ml-1 text-xs">
                                  (-{item.discountPercentage}%)
                                </span>
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm">${item.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center rounded-lg border border-gray-200">
                          <Button
                            onClick={() => updateQty("decrement", item.id)}
                            variant="ghost"
                            className="h-8 w-8 rounded-l-lg px-2 hover:bg-gray-100"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="flex h-8 w-12 items-center justify-center border-x border-gray-200 text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() => updateQty("increment", item.id)}
                            variant="ghost"
                            className="h-8 w-8 rounded-r-lg px-2 hover:bg-gray-100"
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="destructive"
                          size="sm"
                          className="h-8"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="w-full lg:w-96">
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-semibold">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-base">
                  <p>
                    Subtotal ({items.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                    items)
                  </p>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-base text-green-600">
                    <p>Discount ({discountPercentage}%)</p>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base">
                  <p>Tax (10%)</p>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <p>Total</p>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
