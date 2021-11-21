import { Request } from "express";

export const getPublicKey = (req: Request) => {
  const user = req.headers.publicKey as any;
  return user["id"] as string;
};
