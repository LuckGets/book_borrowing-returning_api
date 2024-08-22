import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface DtoClass {
  new (...args: any[]): {};
}

export function Serialize<T extends DtoClass>(dtoClass: T) {
  return UseInterceptors(new SerializeInterceptor(dtoClass));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dtoClass: DtoClass) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((context: any) => {
        return plainToInstance(this.dtoClass, context, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
