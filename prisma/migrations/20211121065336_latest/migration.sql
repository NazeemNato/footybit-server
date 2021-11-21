/*
  Warnings:

  - Added the required column `updatedAt` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "TeamManager" (
    "id" TEXT NOT NULL,
    "teamId" TEXT,
    "country" TEXT NOT NULL,
    "formation" TEXT NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamManager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamManager" ADD CONSTRAINT "TeamManager_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
