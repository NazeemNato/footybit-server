import { Request, Response } from "express";
import { PrismaClient } from ".prisma/client";
import { generateBotPlayers } from "../utils/generate_player";
import { generateManager } from "../utils/generate_manager";
import { getPublicKey } from "../utils/get_publicKey";
import { redis } from "../config/redis";
import { generateScore, sortPlayersByPosition } from "../utils/generate_score";
const prisma = new PrismaClient();

export const createGameRoom = async (req: Request, res: Response) => {
  try {
    // get public
    const publicKey = getPublicKey(req);

    const user = await prisma.team.findFirst({
      where: {
        publicKey,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // create bot
    const bot = await prisma.botTeam.create({
      data: {
        name: "Bot",
      },
    });
    // create bot players
    const players = generateBotPlayers(bot.id);
    await prisma.botPlayer.createMany({
      data: players,
    });
    // create manager
    const { managerName, formation, birthYear, country, skill } =
      generateManager(7);
    await prisma.botManager.create({
      data: {
        name: managerName,
        formation,
        birthYear,
        country,
        skill,
        botId: bot.id,
      },
    });
    // create game
    const game = await prisma.game.create({
      data: {
        botTeamId: bot.id,
        teamId: user.id,
      },
    });
    return res.status(201).json({
      message: "Game created",
      game,
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while creating the game room",
    });
  }
};

export const startGame = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const publicKey = getPublicKey(req);

    const user = await prisma.team.findFirst({
      where: {
        publicKey,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const game = await prisma.game.findFirst({
      where: {
        id: room,
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    if (game.teamId !== user.id) {
      return res.status(403).json({
        message: "You are not allowed to vist the room",
      });
    }

    await prisma.gameStats.create({
      data: {
        gameId: game.id,
      },
    });

    await redis.set(game.id, "ok", "EX", 300);

    return res.status(200).json({
      message: "Game started",
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while starting the game",
    });
  }
};

export const hit = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;
    const publicKey = getPublicKey(req);
    const isGameStarted = await redis.get(room);
    const { style, min } = req.body;

    const user = await prisma.team.findFirst({
      where: {
        publicKey,
      },
      include: {
        players: true,
        manager: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const game = await prisma.game.findFirst({
      where: {
        id: room,
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    if (game.teamId !== user.id) {
      return res.status(403).json({
        message: "You are not allowed to vist the room",
      });
    }

    const gameStats = await prisma.gameStats.findFirst({
      where: {
        gameId: game.id,
      },
    });

    if (!gameStats) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    if (gameStats.hit >= 3) {
      if (!game.finished) {
        await prisma.game.update({
          where: {
            id: room,
          },
          data: {
            finished: true,
            score: `${gameStats.teamScore}:${gameStats.botScore}`,
            winner: gameStats.teamScore > gameStats.botScore ? "you" : "bot",
          },
        });
        await prisma.team.update({
          where: {
            id: user.id,
          },
          data: {
            chemistry: user.chemistry + 1,
          },
        });
        if (gameStats.teamScore > gameStats.botScore) {
          const reward = 200;
          const rewardExist = await prisma.gameReward.findFirst({
            where: {
              gameId: game.id,
            },
          });
          if (!rewardExist) {
            await prisma.gameReward.create({
              data: {
                gameId: game.id,
                teamId: user.id,
                name: `${reward} XDB!`,
                type: "XDB",
                value: reward,
              },
            });
          }
        } else if (gameStats.teamScore === gameStats.botScore) {
          const reward = 150;
          const rewardExist = await prisma.gameReward.findFirst({
            where: {
              gameId: game.id,
            },
          });
          if (!rewardExist) {
            await prisma.gameReward.create({
              data: {
                gameId: game.id,
                teamId: user.id,
                name: `${reward} XDB!`,
                type: "XDB",
                value: reward,
              },
            });
          }
        }
        await redis.del(room);
        return res.status(200).json({
          finished: true,
          message: "Game finished",
          stats: gameStats,
        });
      } else {
        return res.status(200).json({
          finished: true,
          message: "Game finished",
          stats: gameStats,
        });
      }
    }

    if (!isGameStarted) {
      if (gameStats.hit >= 0) {
        await prisma.game.update({
          where: {
            id: room,
          },
          data: {
            score: "3-0",
            finished: true,
            winner: "BOT",
            GameStats: {
              update: {
                botScore: 3,
                teamScore: 0,
                hit: 3,
              },
            },
          },
        });

        return res.status(200).json({
          message: "Game finished! Bot win",
        });
      }

      return res.status(403).json({
        message: "Game not started / finished",
      });
    }

    const bot = await prisma.botTeam.findFirst({
      where: {
        id: game.botTeamId,
      },
      include: {
        BotPlayer: true,
        BotManager: true,
      },
    });

    if (!bot) {
      return res.status(404).json({
        message: "Bot not found",
      });
    }

    const goals = await generateScore({
      botPlayer: bot.BotPlayer,
      teamPlayer: user.players,
      playerChemistry: user.chemistry,
      botChecmistry: bot.chemistry,
      style: style,
      min: min,
      bot: gameStats.botScore,
      team: gameStats.teamScore,
    });

    await prisma.game.update({
      where: {
        id: room,
      },
      data: {
        GameStats: {
          update: {
            hit: gameStats.hit + 1,
            botScore: gameStats.botScore + goals.botScore,
            teamScore: gameStats.teamScore + goals.teamScore,
          },
        },
      },
    });

    return res.status(200).json({
      finished: false,
      message: "Hit",
      stats: gameStats,
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while hitting",
    });
  }
};

export const getRoom = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;

    const game = await prisma.game.findFirst({
      where: {
        id: room,
      },
      include: {
        botTeam: {
          include: {
            BotPlayer: true,
            BotManager: true,
          },
        },
        team: {
          include: {
            players: true,
            manager: true,
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    return res.status(200).json({
      score: game.score,
      finished: game.finished,
      winner: game.winner,
      teamPlayer: sortPlayersByPosition(game.team.players),
      botPlayer: sortPlayersByPosition(game.botTeam.BotPlayer),
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while getting the game",
    });
  }
};

export const getRoomReward = async (req: Request, res: Response) => {
  try {
    const { room } = req.params;

    const game = await prisma.game.findFirst({
      where: {
        id: room,
      },
      include: {
        team: {
          include: {
            players: true,
          },
        },
      },
    });

    if (!game) {
      return res.status(404).json({
        message: "Game not found",
      });
    }

    const reward = await prisma.gameReward.findFirst({
      where: {
        gameId: game.id,
      },
    });

    return res.status(200).json({
      reward,
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while getting the game",
    });
  }
};

export const cancelGame = (req: Request, res: Response) => {
  try {
    const { room } = req.params;

    const game = prisma.game.findFirst({
      where: {
        id: room,
        finished: false,
      },
    });

    if (!game) {
      return res.json({
        message: "Already finished",
      });
    }

    prisma.game.update({
      where: {
        id: room,
      },
      data: {
        score: "3-0",
        finished: true,
        winner: "BOT",
        GameStats: {
          update: {
            botScore: 3,
            teamScore: 0,
            hit: 3,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Game cancelled",
    });
  } catch (e) {
    return res.status(500).json({
      message: "An error occured while canceling the game",
    });
  }
};
