"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addWishList,
  deleteWishList,
  getUserWishlists,
} from "@/actions/wishlist";
// Remove the cart import since we're using wishlist actions
// import { addCart } from "@/actions/cart";
import { calculateDiscountedPrice } from "@/utils/calculateDiscount";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import BlurImage from "@/components/shared/blur-image";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function WishlistPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const result = await getUserWishlists();
      if (result.success) {
        setWishlistItems(result?.data.wishlist);
      }
    } catch (error) {
      toast.error("Failed to load wishlist");
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      setIsLoading(true);
      const result = await deleteWishList(productId);
      if (result.success) {
        setWishlistItems([]);
        toast.success("Item removed from wishlist");
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveToCart = async (product: any) => {
    try {
      setIsLoading(true);
      // First check if product is already in wishlist
      const result = await addWishList(product.id);
      if (result.success) {
        // Remove from wishlist after successful addition
        await deleteWishList(product.id);
        // Reload wishlist
        await loadWishlist();
        toast.success("Item moved to cart");
      } else {
        toast.error(result.error || "Failed to move item to cart");
      }
    } catch (error) {
      toast.error("Failed to move item to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <MaxWidthWrapper>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">My Wishlist</h2>
              <p className="text-muted-foreground">
                {wishlistItems.length} items in your wishlist
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
            {wishlistItems.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-lg">Your wishlist is empty</p>
              </div>
            ) : (
              wishlistItems.map((item: any) => {
                const discountedPrice = calculateDiscountedPrice(
                  item.price,
                  item.discount,
                  item.discountStart,
                  item.discountEnd,
                );
                return (
                  <Card key={item.id} className="mb-4">
                    <CardContent className="flex items-center gap-4 p-4">
                      <BlurImage
                        src={item.images[0]}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex flex-1 items-center justify-between">
                        <div className="space-y-1">
                          <Link
                            href={`/products/${item.id}`}
                            className="font-medium hover:underline"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              ${discountedPrice}
                            </span>
                            {item.discount > 0 && (
                              <span className="text-muted-foreground text-sm line-through">
                                ${item.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleMoveToCart(item)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                          >
                            Move to Cart
                          </Button>
                          <Button
                            onClick={() => handleRemoveFromWishlist(item.id)}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            disabled={isLoading}
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
          </ScrollArea>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}
