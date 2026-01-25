import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";

class SerializerInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        console.log("I'm running before the handler ", context);

        return handler.handle().pipe(
            map((data: any) => {
                // Run something before the response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        ) 
    }
}

export function Serialize(dto: any) {
    return UseInterceptors(new SerializerInterceptor(dto))
}