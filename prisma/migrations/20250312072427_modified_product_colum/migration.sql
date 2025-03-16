/*
  Warnings:

  - You are about to drop the column `discountPercentage` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "discountPercentage",
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL DEFAULT 0;
