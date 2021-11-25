import { Router } from "express";
import { createGameRoom, startGame, hit } from "../controllers/game_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.post("/game/create", authMiddleware, createGameRoom);
route.post("/game/:room/start", authMiddleware, startGame);
route.post("/game/:room/hit", authMiddleware, hit);
export default route;
