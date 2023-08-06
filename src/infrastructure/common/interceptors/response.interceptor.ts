import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ResponseFormat<T> {
  @ApiProperty()
  isArray: boolean;
  // @ApiProperty()
  // path: string;
  // @ApiProperty()
  // duration: string;
  // @ApiProperty()
  // method: string;

  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    //const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();

    // Check if the request path starts with "api/v1"
    const isV1ApiRoute = request.path.startsWith('api/v1');

    if (!isV1ApiRoute) {
      // If the request path does not start with "api/v1", return the response data as-is
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => ({
        data,
        isArray: Array.isArray(data),
        // path: request.path,
        // duration: `${Date.now() - now}ms`,
        // method: request.method,
      })),
    );
  }
}
