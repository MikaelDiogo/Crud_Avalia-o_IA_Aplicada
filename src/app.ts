import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { AppError } from './errors/AppError';
import { openApiDocument } from './docs/openapi.document';
import { createRoutes, type ProductControllersBundle } from './routes/routes';

export function createApp(
  controllers: ProductControllersBundle,
): express.Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api', createRoutes(controllers));

  app.get('/openapi.json', (_req, res) => {
    res.json(openApiDocument);
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiDocument, {
      customSiteTitle: 'Restaurante Online — API',
      customCss: '.swagger-ui .topbar { display: none }',
    }),
  );

  app.use(
    (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    },
  );

  return app;
}
