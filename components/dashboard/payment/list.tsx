"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/shared/icons";

const shippingFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  city: z.string().min(2, { message: "City is required" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Please enter a complete address" }),
});

const List = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      name: "",
      city: "",
      phone: "",
      address: "",
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

  const cartItems = [
    {
      id: 1,
      name: "iPhone 11 Pro",
      description: "256GB, Navy Blue",
      image:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img1.webp",
      quantity: 2,
      price: 900,
    },
    {
      id: 2,
      name: "Samsung galaxy Note 10",
      description: "256GB, Navy Blue",
      image:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img2.webp",
      quantity: 2,
      price: 900,
    },
    {
      id: 3,
      name: "Canon EOS M50",
      description: "Onyx Black",
      image:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img3.webp",
      quantity: 1,
      price: 1199,
    },
    {
      id: 4,
      name: "MacBook Pro",
      description: "1TB, Graphite",
      image:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img4.webp",
      quantity: 1,
      price: 1799,
    },
  ];

  const handleCloseDialog = () => setShowPaymentDialog(false);

  const handlePaymentOption = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/payment", { method: "POST" });
      const data = await response.json();
      setMethod(data.data.desc);
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

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 20;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="space-y-6 md:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Shopping Cart</h2>
              <p className="text-muted-foreground">
                You have {cartItems.length} items in your cart
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Icons.arrowRight className="h-4 w-4" />
              Continue Shopping
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-[600px] pr-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="mb-4 transition-shadow hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        className="h-16 w-16 rounded-lg object-cover"
                        alt={item.name}
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">
                          Quantity
                        </p>
                        <p className="font-medium">{item.quantity}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Price</p>
                        <p className="font-medium">${item.price}</p>
                      </div>
                      <Button
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
            ))}
          </ScrollArea>
        </div>

        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Shipping Details</CardTitle>
              </CardHeader>

              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your complete address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Shipping</p>
                  <p className="font-medium">${shipping.toFixed(2)}</p>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <p className="font-medium">Total (Incl. taxes)</p>
                  <p className="font-medium">${total.toFixed(2)}</p>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                onClick={handlePaymentOption}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-5 gap-4 p-4 sm:grid-cols-4">
            {method.map((item, i) => (
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
    </div>
  );
};

export default List;
