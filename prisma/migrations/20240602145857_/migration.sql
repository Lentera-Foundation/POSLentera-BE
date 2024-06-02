/*
  Warnings:

  - You are about to drop the column `capital_price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "capital_price",
ADD COLUMN     "equity" INTEGER;
