import { Request, Response, NextFunction } from 'express';

export class LoggerMiddleware {
  static log = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    const { method, url, ip } = req;
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip}`);
    
    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function(this: Response, ...args: any[]) {
      const duration = Date.now() - start;
      const { statusCode } = res;

      console.log(`[${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms`);

      // @ts-ignore
      return originalEnd.apply(this, args);
    };

    next();
  };

  static requestId = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = crypto.randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  };
}
