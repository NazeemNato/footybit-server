import { Request, Response } from "express";
import { PrismaClient } from ".prisma/client";
import * as DigitalBitsSdk from "xdb-digitalbits-sdk";
import { getPrivateKey, getPublicKey } from "../utils/get_publicKey";

const prisma = new PrismaClient();

const productType = ["chemistry", "skill"];

export const addProduct = async (req: Request, res: Response) => {
  try {
    const { type, value, price, name } = req.body;

    if (!type || !value || !price || !name) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    // check if type is valid
    if (!productType.includes(type)) {
      return res.status(400).json({
        message: "Invalid product type",
      });
    }

    await prisma.item.create({
      data: {
        type,
        value,
        price,
        name,
      },
    });

    return res.status(200).json({
      message: "Product added successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.item.findMany();
    return res.status(200).send(products);
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const buyProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const privateKey = getPrivateKey(req);
    const publicKey = getPublicKey(req);
    const server = new DigitalBitsSdk.Server(process.env.API_URL!);
    const sourceKeys = DigitalBitsSdk.Keypair.fromSecret(privateKey);
    const desinationKey = process.env.PUBLIC_KEY!;
    let transaction;

    const product = await prisma.item.findFirst({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(400).json({
        message: "Product not found",
      });
    }

    if (product.quantity === 0) {
      return res.status(400).json({
        message: "Product is out of stock",
      });
    }

    const user = await prisma.team.findFirst({
        where: {
            publicKey
        }
    })

    if(!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

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
              amount: `${product.price}`,
            })
          )
          .setTimeout(180)
          .build();
        transaction.sign(sourceKeys);
        return server.submitTransaction(transaction);
      })
      .then(async (transactionResult) => {
        // update product quantity
        await prisma.item.update({
          where: {
            id,
          },
          data: {
            quantity: product.quantity! - 1,
          },
        });
        // add product to user account
        await prisma.itemOwned.create({
            data: {
                itemId: product.id,
                userId: user.id,
                transactionId: transactionResult.hash,
            }
        });
      })
      .catch((err) => {
        console.log(err);
      });

    return res.status(200).json({
      message: "Product bought successfully",
    });
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const userProducts = async (req: Request, res: Response) => {
  try {
    const publicKey = getPublicKey(req);
    const user = await prisma.team.findFirst({
        where: {
          publicKey
        }
    })
    if(!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }
    const products = await prisma.itemOwned.findMany({
      where: {
        userId: user.id,
      },
      include: {
        item: true,
      }
    });

    return res.status(200).send(products);
  } catch (e) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}