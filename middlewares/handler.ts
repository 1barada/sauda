import { ApiResponse } from "@/types/base";
import internalServerError from "@/utils/internalServerError";
import { NextResponse } from "next/server";

export type MiddlewareFunction<RequestType> = (req: RequestType, next: () => void) => Promise<NextResponse<ApiResponse<any>> | void>;

export function handler<RequestType>(...middlewares: MiddlewareFunction<RequestType>[]) {
  return async (req: RequestType): Promise<NextResponse<ApiResponse<any>>> => {
    try {
      let result: NextResponse<ApiResponse<any>> | void = undefined;

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
        return result;
      } 
      
      throw new Error('Handler or middleware must return a NextResponse!');
    } catch (error) {
      return internalServerError(error);
    }
  }
}