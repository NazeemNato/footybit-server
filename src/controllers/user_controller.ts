import { Request, Response } from "express";
import * as DigitalBitsSdk from "xdb-digitalbits-sdk";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import { PrismaClient } from ".prisma/client";
import { encryptKey } from "../utils/hash";
import { getPublicKey } from "../utils/get_publicKey";

const server = new DigitalBitsSdk.Server(process.env.API_URL!);
const prisma = new PrismaClient();

const signToken = (id: string, privateKey: string) => {
  const key = encryptKey(privateKey);
  return jwt.sign({ id, key }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

export const create_account = async (req: Request, res: Response) => {
  try {
    const { teamName } = req.body;
    if (!teamName) {
      return res.status(400).json({
        message: "Team name is required",
      });
    }
    const pair = DigitalBitsSdk.Keypair.random();
    const privateKey = pair.secret();
    const publicKey = pair.publicKey();
    // fund account
    await axios.get(
      `https://friendbot.testnet.digitalbits.io?addr=${encodeURIComponent(
        publicKey
      )}`
    );
    // add account to centerized db

    const encryptedPrivateKey = await bcrypt.hash(privateKey, 12);

    await prisma.team.create({
      data: {
        name: teamName,
        publicKey,
        privateKey: encryptedPrivateKey,
      },
    });
    const accessToken = signToken(publicKey, privateKey);

    return res.send({
      privateKey,
      publicKey,
      accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { publicKey, privateKey } = req.body;
    if (!publicKey || !privateKey) {
      return res.status(400).json({
        message: "Public key and private key are required",
      });
    }
    const findTeam = await prisma.team.findFirst({
      where: {
        publicKey,
      },
    });

    if (!findTeam) {
      return res.status(400).json({
        message: "Team not found",
      });
    }

    const isValid = await bcrypt.compare(privateKey, findTeam.privateKey);
    if (!isValid) {
      return res.status(400).json({
        message: "Invalid private key",
      });
    }
    const accessToken = signToken(publicKey, privateKey);
    return res.send({
      accessToken,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const account_info = async (req: Request, res: Response) => {
  try {
    const id = getPublicKey(req);
    const account = await server.loadAccount(id);
    let accountBalance = 0.0;
    account.balances.forEach((balance) => {
      if (balance.asset_type === "native") {
        accountBalance = Number(balance.balance);
      }
    });
    return res.send({
      publicKey: id,
      accountBalance,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
