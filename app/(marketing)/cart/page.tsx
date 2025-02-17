"use client";

import useCartStore from "@/utilities/cart";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BlurImage from "@/components/shared/blur-image";

//cart page for ecommerce
const page = () => {
  const { items, removeFromCart, updateQty } = useCartStore((state) => state);
  console.log(items);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;
  return (
    <div className="container mx-auto flex w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-3xl">Cart Summary</h1>
      <hr className="w-full border-1 border-gray-500" />
      <div className="flex w-full items-start justify-between gap-8 max-md:flex-col">
        <div className="flex-1">
          <h2 className="text-2xl">Selected Items</h2>
          <hr />
          <div className="flex flex-col gap-3 py-2">
            {items.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center justify-between gap-4">
                  <BlurImage
                    src={item.image}
                    alt={item.title}
                    height={100}
                    width={100}
                  />
                  <div className="flex flex-col gap-2">
                    <h3>{item.title}</h3>
                    <div>
                      <Button
                        onClick={() => updateQty("decrement", item.id)}
                        variant={"outline"}
                      >
                        -
                      </Button>
                      <span>Qty:{item.quantity}</span>
                      <Button
                        onClick={() => updateQty("increment", item.id)}
                        variant={"outline"}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="">
                  <p>${item.price.toFixed(2)}</p>
                  <Button onClick={() => removeFromCart(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex-1 gap-3">
          <h2 className="text-2xl font-semibold">Estimated Bill</h2>
          <hr />
          <div className="flex items-center justify-between">
            <p>Number of items</p>
            <span>{items.reduce((sum, i) => sum + i.quantity, 0)}</span>
          </div>
          <div className="flex items-center justify-between">
            <p>Subtotal</p>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex items-center justify-between">
            <b>Total</b>
            <b>${total.toFixed(2)}</b>
          </div>
          <hr />
          <Button className="my-3 w-full p-4">Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
