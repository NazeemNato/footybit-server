import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import { getPublicKey } from "../utils/get_publicKey";
import * as DigitalBitsSdk from "xdb-digitalbits-sdk";

const prisma = new PrismaClient();

export const getUserRewards = async (req: Request, res: Response) => {
  try {
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
    const rewards = await prisma.gameReward.findMany({
      where: {
        teamId: user.id,
      },
    });
    return res.status(200).send(rewards);
  } catch (e) {
    res.status(500).json({
      message: "Error while getting user reward",
    });
  }
};

export const cliamReward = async (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey(req);
    const server = new DigitalBitsSdk.Server(process.env.API_URL!);
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
    const reward = await prisma.gameReward.findFirst({
      where: {
        id: req.params.id,
      },
    });
    if (!reward) {
      return res.status(404).json({
        message: "Reward not found",
      });
    }
    if (reward.cliamed) {
      return res.status(400).json({
        message: "Reward already claimed",
      });
    }
    if (reward.teamId !== user.id) {
      return res.status(400).json({
        message: "Reward not claimed by user",
      });
    }
    const sourceKeys = DigitalBitsSdk.Keypair.fromSecret(process.env.PRIVATE_KEY!);
    const desinationKey =  publicKey;
    let transaction;

    server
      .loadAccount(desinationKey)
      .catch(async (err) => {
        throw new Error(err);
      })
      .then(async () => {
        return server.loadAccount(sourceKeys.publicKey());
      })
      .then(async (sourceAccount) => {
        transaction = new DigitalBitsSdk.TransactionBuilder(sourceAccount, {
          fee: DigitalBitsSdk.BASE_FEE,
          networkPassphrase: DigitalBitsSdk.Networks.TESTNET,
        })
          .addOperation(
            DigitalBitsSdk.Operation.payment({
              destination: desinationKey,
              asset: DigitalBitsSdk.Asset.native(),
              amount: `${reward.value}`,
            })
          )
          .setTimeout(180)
          .build();
        transaction.sign(sourceKeys);
        return server.submitTransaction(transaction);
      })
      .then(async (transactionResult) => {
        console.log(transactionResult);
        // update reward
        await prisma.gameReward.update({
          where: {
            id: req.params.id,
          },
          data: {
            cliamed: true,
            transactionId: transactionResult.hash,
          },
        });
      })
      .catch(console.log);
    
    return res.status(200).json({
      message: "Reward claimed",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error while claiming reward",
    });
  }
}