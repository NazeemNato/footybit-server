-- CreateTable
CREATE TABLE "BotTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT E'Bot FC',
    "chemistry" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotManager" (
    "id" TEXT NOT NULL,
    "botId" TEXT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "formation" TEXT NOT NULL,
    "skill" INTEGER NOT NULL DEFAULT 6,
    "birthYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotPlayer" (
    "id" TEXT NOT NULL,
    "botId" TEXT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "skill" INTEGER NOT NULL,
    "birthYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "botTeamId" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "score" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BotManager" ADD CONSTRAINT "BotManager_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BotTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotPlayer" ADD CONSTRAINT "BotPlayer_botId_fkey" FOREIGN KEY ("botId") REFERENCES "BotTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_botTeamId_fkey" FOREIGN KEY ("botTeamId") REFERENCES "BotTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
