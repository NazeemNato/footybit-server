import { Router } from "express";
import { createGameRoom, startGame, hit, getRoom, getRoomReward } from "../controllers/game_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.post("/game/create", authMiddleware, createGameRoom);
route.post("/game/:room/start", authMiddleware, startGame);
route.post("/game/:room/hit", authMiddleware, hit);
route.get("/game/:room", getRoom)
route.get("/game/:room/reward", getRoomReward)
export default route;
