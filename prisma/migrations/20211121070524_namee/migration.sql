/*
  Warnings:

  - Added the required column `skill` to the `TeamManager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamManager" ADD COLUMN     "skill" INTEGER NOT NULL;
