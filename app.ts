import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './src/config/swagger';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Documentação da API',
  })
);

app.use((err: any, req: Request, res: Response, _: NextFunction) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Corpo JSON inválido',
    });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    message: 'Erro do Servidor Interno',
  });
});

export default app;
