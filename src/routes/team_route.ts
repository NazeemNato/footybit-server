import { Router } from "express";
import {
  boostPlayerSkill,
  create_team,
  get_team,
  get_teams,
} from "../controllers/team_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.post("/team/create", authMiddleware, create_team);
route.get("/team/all", get_teams);
route.get("/team/my", authMiddleware, get_team);
route.patch("/team/:id/:skill", authMiddleware, boostPlayerSkill);
export default route;
