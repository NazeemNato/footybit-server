import { Request } from "express";
import { decryptKey } from "./hash";

export const getPublicKey = (req: Request) => {
  const user = req.headers.publicKey as any;
  return user["id"] as string;
};

export const getPrivateKey = (req: Request) => {
  const user = req.headers.publicKey as any;
  const key = decryptKey(user["key"] as string);
  return key;
}