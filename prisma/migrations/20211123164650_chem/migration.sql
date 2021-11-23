/*
  Warnings:

  - You are about to drop the column `teamId` on the `Item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_teamId_fkey";

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "teamId";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "chemistry" INTEGER NOT NULL DEFAULT 10;
