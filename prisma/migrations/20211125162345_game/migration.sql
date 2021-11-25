-- CreateTable
CREATE TABLE "GameStats" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "botScore" INTEGER NOT NULL DEFAULT 0,
    "teamScore" INTEGER NOT NULL DEFAULT 0,
    "hit" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GameStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GameStats_gameId_key" ON "GameStats"("gameId");

-- AddForeignKey
ALTER TABLE "GameStats" ADD CONSTRAINT "GameStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
