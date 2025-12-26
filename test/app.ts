import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger';
import authRoutes from '../routes/auth.routes';
import orderRoutes from '../routes/orders.routes';
import { authMiddleware } from '../middlewares/auth.middleware';

const app = express();

app.use(express.json({
  limit: '10mb',
  strict: false,
  type: 'application/json'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '10mb'
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Order Management API Documentation',
}));

app.use('/auth', authRoutes);
app.use('/orders', authMiddleware, orderRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.type === 'entity.parse.failed' || err.status === 400) {
    console.error('Body parser error:', err.message);
    console.error('Request headers:', req.headers);
    return res.status(400).json({
      message: 'Invalid request body',
      error: err.message
    });
  }
  next(err);
});

export default app;
