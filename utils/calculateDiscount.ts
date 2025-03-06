// File: /d:/works/tuba fasion/utils/calculateDiscount.ts
export function calculateDiscountedPrice(
  price: number,
  discountPercentage?: number,
  discountStart?: Date,
  discountEnd?: Date,
): number {
  // Check if discount percentage exists
  if (!discountPercentage) return price;
  
  const now = new Date();
  
  // If dates are provided, check if current date is within discount period
  if (discountStart && discountEnd) {
    if (now >= discountStart && now <= discountEnd) {
      return price * (1 - discountPercentage / 100);
    }
    return price;
  }
  
  // If no dates provided but discount percentage exists, apply discount
  return price * (1 - discountPercentage / 100);
}

export function isDiscountActive(
  discountPercentage?: number,
  discountStart?: Date,
  discountEnd?: Date,
): boolean {
  if (!discountPercentage) return false;
  
  const now = new Date();
  
  if (discountStart && discountEnd) {
    return now >= discountStart && now <= discountEnd;
  }
  
  return true;
}

export function getRemainingDiscountDays(discountEnd?: Date): number {
  if (!discountEnd) return 0;
  
  const now = new Date();
  if (now > discountEnd) return 0;
  
  const diffTime = Math.abs(discountEnd.getTime() - now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
