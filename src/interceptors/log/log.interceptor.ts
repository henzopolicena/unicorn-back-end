import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(`${context.switchToHttp().getRequest().method} ${context.switchToHttp().getRequest().url}`);
    return next.handle();
  }
}
