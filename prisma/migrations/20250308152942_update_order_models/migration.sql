/*
  Warnings:

  - Added the required column `category` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countInStock` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productImage` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productSlug` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expectedDeliveryDate` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemsPrice` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingPrice` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'REFUNDED';

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "countInStock" INTEGER NOT NULL,
ADD COLUMN     "productImage" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "productSlug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "expectedDeliveryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isDelivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "itemsPrice" INTEGER NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentMethod" TEXT NOT NULL,
ADD COLUMN     "paymentResult" JSONB,
ADD COLUMN     "shippingPrice" INTEGER NOT NULL,
ADD COLUMN     "taxPrice" INTEGER,
ADD COLUMN     "totalPrice" INTEGER NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_isPaid_idx" ON "orders"("isPaid");

-- CreateIndex
CREATE INDEX "orders_isDelivered_idx" ON "orders"("isDelivered");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
