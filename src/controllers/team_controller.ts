import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateManager } from "../utils/generate_manager";
import { generatePlayers } from "../utils/generate_player";
import { getPublicKey, getPrivateKey } from "../utils/get_publicKey";

const prisma = new PrismaClient();

export const create_team = async (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey(req);

    const team = await prisma.team.findFirst({
      where: { publicKey },
    });
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
    // check wheater manager and players are already created
    const managerCount = await prisma.teamManager.count({
      where: {
        teamId: team.id,
      },
    });
    const playerCount = await prisma.teamPlayer.count({
      where: {
        teamId: team.id,
      },
    });
    if (managerCount > 0 && playerCount > 0) {
      return res.status(400).json({
        message: "Team already created",
      });
    }
    const teamId = team.id;
    const { managerName, formation, country, birthYear, skill } =
      generateManager();
    // create manager
    await prisma.teamManager.create({
      data: {
        teamId,
        name: managerName,
        formation,
        country,
        birthYear,
        skill,
      },
    });
    // create players
    const players = generatePlayers(teamId);
    await prisma.teamPlayer.createMany({
      data: players,
    });

    return res.status(200).json({
      message: "Team created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const get_team = async (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey(req);

    const team = await prisma.team.findFirst({
      where: { publicKey },
      include: {
        manager: true,
        players: true,
      },
    });
    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }
    team.privateKey = "";
    return res.send(team);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const get_teams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        manager: true,
      },
    });
    // remove private key
    // idk why prisma throwin error
    // while using select
    teams.map((team) => (team.privateKey = ""));
    return res.send(teams);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const boostPlayerSkill = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const skill = req.params.skill;
    const publicKey = getPublicKey(req);

    const user = await prisma.team.findFirst({
      where: { publicKey },
    });

    if (!user) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    const manager = await prisma.teamManager.findFirst({
      where: {
        id,
      },
    });

    const player = await prisma.teamPlayer.findFirst({
      where: {
        id,
      },
    });

    const itemSkill = await prisma.itemOwned.findFirst({
      where: {
        id: skill,
      },
      include: {
        item: true,
      },
    });

    if (!itemSkill) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (itemSkill.userId !== user.id) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if(itemSkill.used) {
      return res.status(404).json({
        message: "Item already used",
      });
    }

    if(itemSkill.item.type !== "skill") {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (manager && !player) {
      await prisma.teamManager.update({
        where: {
          id,
        },
        data: {
          skill: manager.skill + itemSkill.item.value,
        },
      });

      await prisma.itemOwned.update({
        where: {
          id: skill,
        },
        data: {
          used: true,
        },
      });

      return res.status(200).json({
        message: "Skill boosted successfully",
      });
    } else if (player && !manager) {
      await prisma.teamPlayer.update({
        where: {
          id,
        },
        data: {
          skill: player.skill + itemSkill.item.value,
        },
      });
      await prisma.itemOwned.update({
        where: {
          id: skill,
        },
        data: {
          used: true,
        },
      });
      return res.status(200).json({
        message: "Skill boosted successfully",
      });
    } else {
      return res.status(400).json({
        message: "Player or manager not found",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
