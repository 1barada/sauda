import { ApiResponse } from "@/types/base";
import { HttpStatus } from "@/types/httpStatusEnum";
import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFunction<RequestType extends NextRequest, ResponseType = any> = (req: RequestType, next: () => void) => Promise<ApiResponse<ResponseType | null> | void>;

export function handler<RequestType extends NextRequest, ResponseType = any>(
  ...middlewares: MiddlewareFunction<RequestType, ResponseType>[]
) {
  return async (req: RequestType): Promise<NextResponse<ApiResponse<ResponseType | null>>> => {
    try {
      let result: ApiResponse<ResponseType | null> | void = undefined;

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
        return NextResponse.json<ApiResponse<ResponseType | null>>(result, { status: result.status });
      } 
      
      throw new Error('handler or middleware must return a NextResponse!');
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'Unhandled server error:', error);
      return NextResponse.json<ApiResponse<null>>({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        error: {
          message: 'internal server error'
        }
      }, { status: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }
}