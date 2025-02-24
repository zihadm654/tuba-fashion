// File: /d:/works/tuba fasion/utils/calculateDiscount.ts
export function calculateDiscountedPrice(
  price: number,
  discountPercentage?: number,
  discountStart?: Date,
  discountEnd?: Date,
): number {
  // Check if discount details are provided and currently applicable
  if (
    discountPercentage
    // discountStart &&
    // discountEnd &&
    // new Date() >= discountStart &&
    // new Date() <= discountEnd
  ) {
    return price * (1 - discountPercentage / 100);
  }
  return price;
}
