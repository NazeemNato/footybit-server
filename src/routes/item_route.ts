import { Router } from "express";
import {
  addProduct,
  buyProduct,
  getProducts,
  userProducts,
} from "../controllers/shop_controller";
import { authMiddleware } from "../middlewares/authMiddleware";
const route = Router();

route.post("/item", addProduct);
route.get("/item", getProducts);
route.post("/item/buy/:id", authMiddleware, buyProduct);
route.get("/item/user", authMiddleware, userProducts);
export default route;
