import { ApiResponse, HttpException } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import { NextResponse } from "next/server";

export type MiddlewareFunction<RequestType, ResponseType = any> = (req: RequestType, next: () => void) => Promise<{ data: ResponseType, status: HttpStatus } | void>;

export function handler<RequestType, ResponseType>(...middlewares: MiddlewareFunction<RequestType, ResponseType>[]) {
  return async (req: RequestType): Promise<NextResponse<ApiResponse<any>>> => {
    try {
      let result: { data: ResponseType, status: HttpStatus } | void = undefined;

      for (let i = 0; i < middlewares.length; i++) {
        let nextTriggered: boolean = false;
        
        function next() {
          nextTriggered = true;
        }
        
        result = await middlewares[i](req, next);

        if (!nextTriggered) {
          break;
        }
      }

      if (result) {
        return NextResponse.json<ApiResponse<ResponseType>>({
          data: result.data,
          error: null
        }, { status: result.status });
      } 
      
      throw new Error('Handler or middleware must return a NextResponse!');
    } catch (error) {
      if (error instanceof HttpException) {
        return NextResponse.json<ApiResponse<null>>({
          data: null,
          error: {
            message: error.message
          }
        }, { status: error.status }); 
      } else {
        console.error('\x1b[31m%s\x1b[0m', 'Unhandled server error:', error);
        return NextResponse.json<ApiResponse<null>>({
          data: null,
          error: {
            message: 'Internal server error'
          }
        }, { status: 500 });
      }
    }
  }
}