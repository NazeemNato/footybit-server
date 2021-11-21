import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { generateManager } from "../utils/generate_manager";
import { generatePlayers } from "../utils/generate_player";
import { getPublicKey } from "../utils/get_publicKey";

const prisma = new PrismaClient();

export const create_team = async (req: Request, res: Response) => {
  try {
    const  publicKey = getPublicKey(req);

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
      }
    });
    const playerCount = await prisma.teamPlayer.count({
      where: {
        teamId: team.id,
      }
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
    const  publicKey = getPublicKey(req);

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
    teams.map((team) => team.privateKey = "");
    return res.send(teams);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}