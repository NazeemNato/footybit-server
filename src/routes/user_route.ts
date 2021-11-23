import { Router } from "express";
import {
  create_account,
  login,
  account_info,
} from "../controllers/user_controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const route = Router();

route.post("/user", create_account);
route.post("/user/login", login);
route.get("/user/info", authMiddleware, account_info);
export default route;
