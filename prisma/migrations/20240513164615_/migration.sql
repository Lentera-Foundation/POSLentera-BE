/*
  Warnings:

  - You are about to drop the column `price` on the `OrderDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderDetail" DROP COLUMN "price";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "desc" DROP NOT NULL;
