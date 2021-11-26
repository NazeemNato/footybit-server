import { Router } from "express";
import { getUserRewards, cliamReward } from "../controllers/reward_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.get("/rewards", authMiddleware, getUserRewards);
route.patch("/rewards/:id", authMiddleware, cliamReward);

export default route;
