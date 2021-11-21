/*
  Warnings:

  - Added the required column `name` to the `TeamManager` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TeamManager" ADD COLUMN     "name" TEXT NOT NULL;
