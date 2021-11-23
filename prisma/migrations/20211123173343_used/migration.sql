/*
  Warnings:

  - You are about to drop the column `quantity` on the `ItemOwned` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ItemOwned" DROP COLUMN "quantity",
ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
