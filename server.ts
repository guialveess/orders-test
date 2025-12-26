import app from "./app";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/auth.routes";
import orderRoutes from "./routes/orders.routes";
import { authMiddleware } from "./middlewares/auth.middleware";

const port = 8080;

const bootstrap = async () => {
  await connectDatabase();

  app.use("/auth", authRoutes);
  app.use("/orders", authMiddleware, orderRoutes);

  app.listen(port, () => {
    console.log(`🚀 Server rodando na porta ${port}`);
    console.log(`📚 Documentação da API disponível em: http://localhost:${port}/api-docs`);
  });
};

bootstrap();
