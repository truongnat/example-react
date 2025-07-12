import { Request, Response, RequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '@infrastructure/config/swagger.config';

export class SwaggerMiddleware {
  static serve: RequestHandler[] = swaggerUi.serve;

  static setup: RequestHandler = swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 5px; }
    `,
    customSiteTitle: 'Example Server API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  });

  static redirectToDocs = (_req: Request, res: Response): void => {
    res.redirect('/api-docs');
  };

  static serveSpec = (_req: Request, res: Response): void => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  };

  static healthCheck = (_req: Request, res: Response): void => {
    res.json({
      success: true,
      data: {
        swagger: 'available',
        endpoints: {
          docs: '/api-docs',
          spec: '/api-docs/swagger.json',
          health: '/api-docs/health',
        },
      },
      message: 'Swagger documentation is available',
    });
  };
}
