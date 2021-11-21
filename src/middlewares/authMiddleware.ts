import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split("Bearer ")[1];
    if (token) {
      const user = jwt.verify(token, process.env.JWT_SECRET!);
      if (user) {
        req.headers.publicKey = user as string;
        next();
      } else {
        res.status(401).send("Unauthorized");
      }
    } else {
      res.status(401).send("Unauthorized");
    }
  } else {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
