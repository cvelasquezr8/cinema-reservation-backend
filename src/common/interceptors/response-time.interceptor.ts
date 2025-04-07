import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const ctx = context.switchToHttp();
    const res = ctx.getResponse();

    return next.handle().pipe(
      tap(() => {
        const duration = `${Date.now() - now}ms`;
        res.setHeader('X-Response-Time', duration);
        res.setHeader('X-Server-Timestamp', new Date().toISOString());
        res.setHeader('X-Version', '1.0.0');
      }),
    );
  }
}
