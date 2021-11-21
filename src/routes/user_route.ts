import { Router } from "express";
import { create_account, login } from "../controllers/user_controller";

const route = Router();


route.post("/user", create_account)
route.post("/user/login", login)
export default route;