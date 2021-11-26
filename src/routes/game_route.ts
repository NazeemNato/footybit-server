import { Router } from "express";
import { createGameRoom, startGame, hit, getRoom } from "../controllers/game_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.post("/game/create", authMiddleware, createGameRoom);
route.post("/game/:room/start", authMiddleware, startGame);
route.post("/game/:room/hit", authMiddleware, hit);
route.get("/game/:room", getRoom)
export default route;
