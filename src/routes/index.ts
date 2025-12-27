import { Router } from "express";
import authRoutes from "./auth.routes";
import orderRoutes from "./orders.routes";
import { authMiddleware } from "../middlewares/auth.middleware";

const routes = Router();

routes.get("/", (_, res) => {
  res.json({ message: "API rodando" });
});

routes.use("/auth", authRoutes);
routes.use("/orders", authMiddleware, orderRoutes);

export default routes;
