import app from "./app";
import { connectDatabase } from "./src/config/database";
import routes from "./src/routes";

const port = 8080;

const bootstrap = async () => {
  await connectDatabase();

  app.use("/api", routes);

  app.listen(port, () => {
    console.log(`🚀 Server rodando na porta ${port}`);
    console.log(`📚 Documentação da API disponível em: http://localhost:${port}/api-docs`);
  });
};

bootstrap();
