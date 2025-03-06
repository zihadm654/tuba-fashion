"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculateDiscountedPrice,
  getRemainingDiscountDays,
  isDiscountActive,
} from "@/utils/calculateDiscount";
import useCartStore, { CartItem } from "@/utils/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AddtoCart from "@/components/forms/add-cart";
import BlurImage from "@/components/shared/blur-image";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const shippingFormSchema = z.object({
  city: z.string().min(2, { message: "City is required" }),
  phone: z.coerce
    .number()
    .min(10, { message: "Please enter a valid phone number" }),
  postcode: z.coerce
    .number()
    .min(1, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter a complete address" }),
});

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const { items, removeFromCart, updateQty, clearCart } = useCartStore(
    (state) => state,
  );

  const subtotal = items?.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const discountedSubtotal = items?.reduce((total, item) => {
    // Calculate discount information
    const discountActive = isDiscountActive(
      item?.discountPercentage ?? undefined,
      item?.discountStart ? new Date(item.discountStart) : undefined,
      item?.discountEnd ? new Date(item.discountEnd) : undefined,
    );
    const discountedPrice = calculateDiscountedPrice(
      item?.price ?? 0,
      item?.discountPercentage ?? undefined,
      item?.discountStart ? new Date(item.discountStart) : undefined,
      item?.discountEnd ? new Date(item.discountEnd) : undefined,
    );
    // Calculate remaining days
    const remainingDays = getRemainingDiscountDays(
      item?.discountEnd ? new Date(item.discountEnd) : undefined,
    );
    return total + discountedPrice * item.quantity;
  }, 0);

  const discountAmount = subtotal - discountedSubtotal;
  const discountPercentage = ((discountAmount / subtotal) * 100).toFixed(1);
  // const tax = discountedSubtotal * 0.1;
  const total = discountedSubtotal;

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      address: "",
      city: "",
      phone: 0,
      postcode: 0,
    },
  });

  const [method, setMethod] = useState([
    {
      name: "VISA",
      type: "visa",
      logo: "https://sandbox.sslcommerz.com/gwprocess/v4/image/gw/visa.png",
      gw: "visacard",
      r_flag: "1",
      redirectGatewayURL:
        "https://sandbox.sslcommerz.com/gwprocess/v4/bankgw/indexhtmlOTP.php?mamount=1000.00&ssl_id=2310191520231MLVg8ZTsa9Ld4k&Q=REDIRECT&SESSIONKEY=9CE83C4562A96645C7652AF10D220C37&tran_type=success&cardname=visavard",
    },
  ]);
  const handleCloseDialog = () => setShowPaymentDialog(false);

  const handlePaymentOption = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingDetails: form.getValues(),
        }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }
      setIsLoading(false);
      setMethod(data["data"]["desc"]);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Payment fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const PayNow = (PayURL: string) => {
    window.location.replace(PayURL);
  };
  return (
    <div className="py-8">
      <MaxWidthWrapper>
        <div className="grid gap-4 md:grid-cols-12">
          <div className="space-y-6 md:col-span-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Shopping Cart</h2>
                <p className="text-muted-foreground">
                  You have {items.length} items in your cart
                </p>
              </div>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  Continue Shopping
                  <Icons.arrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Separator />
            <ScrollArea className="max-h-[600px] pr-4">
              {items.length === 0 ? (
                <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-lg">Your cart is empty</p>
                </div>
              ) : (
                items.map((item: CartItem) => {
                  const discountedPrice = calculateDiscountedPrice(
                    item?.price ?? 0,
                    item?.discountPercentage ?? undefined,
                    item?.discountStart
                      ? new Date(item.discountStart)
                      : undefined,
                    item?.discountEnd ? new Date(item.discountEnd) : undefined,
                  );
                  return (
                    <Card
                      key={item.id}
                      className="mb-4 transition-shadow hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                              <BlurImage
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              {item.discountPercentage ? (
                                <div className="flex gap-2">
                                  <p className="text-muted-foreground text-sm line-through">
                                    ৳{item.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-green-600">
                                    ৳{discountedPrice.toFixed(2)}
                                    <span className="ml-1 text-xs">
                                      (-{item.discountPercentage}%)
                                    </span>
                                  </p>
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-sm">
                                  ৳{item.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
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
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Icons.trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
              <Button
                onClick={() => clearCart()}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive w-full"
              >
                Clear Cart
                <Icons.trash className="h-4 w-4" />
              </Button>
            </ScrollArea>
          </div>

          <div className="md:col-span-5">
            <Card className="px-4">
              <CardHeader className="p-3">
                <CardTitle className="mb-2 text-center text-2xl font-semibold">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <AddtoCart form={form} />
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">
                      Subtotal ({items?.reduce((sum, i) => sum + i.quantity, 0)}{" "}
                      items)
                    </p>
                    <p className="font-medium">৳{subtotal.toFixed(2)}</p>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <p>Discount ({discountPercentage}%)</p>
                      <span>-৳{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {/* <div className="flex justify-between">
                    <p className="text-muted-foreground">Tax (10%)</p>
                    <p className="font-medium">৳{tax.toFixed(2)}</p>
                  </div> */}
                  <Separator />
                  <div className="flex justify-between">
                    <p className="font-medium">Total (Incl. taxes)</p>
                    <p className="font-medium">৳{total.toFixed(2)}</p>
                  </div>
                  <Button
                    className="mt-6 w-full"
                    size="lg"
                    onClick={handlePaymentOption}
                    disabled={isLoading || items.length === 0}
                  >
                    {isLoading ? (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Dialog open={showPaymentDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-5xl max-md:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-7 gap-4 p-4 max-md:grid-cols-4">
              {method?.map((item, i) => (
                <Card
                  key={i}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => PayNow(item.redirectGatewayURL)}
                >
                  <CardContent className="flex items-center justify-center p-4">
                    <img
                      className="h-auto w-full object-contain"
                      src={item.logo}
                      alt={item.name}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
