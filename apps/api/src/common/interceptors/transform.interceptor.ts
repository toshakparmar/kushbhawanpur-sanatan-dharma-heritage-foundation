import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseEnvelope<T> {
  data: T;
  meta?: any;
}

function serializeBigInts(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') {
    const num = Number(obj);
    return Number.isSafeInteger(num) ? num : obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts);
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const copy: any = {};
    for (const key of Object.keys(obj)) {
      copy[key] = serializeBigInts(obj[key]);
    }
    return copy;
  }
  return obj;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseEnvelope<T>> {
    return next.handle().pipe(
      map((res) => {
        const serialized = serializeBigInts(res);
        // If response already contains data & meta (e.g. paginated list), preserve structure
        if (serialized && typeof serialized === 'object' && 'data' in serialized && 'meta' in serialized) {
          return serialized;
        }
        return { data: serialized };
      }),
    );
  }
}
