import { ApiResponse } from "@/types/base";
import { NextResponse } from "next/server";

export default function internalServerError(error: unknown) {
  console.error(error);
  return NextResponse.json<ApiResponse<null>>({
    data: null,
    error: {
      message: 'internal server error'
    }
  }, { status: 500 });
}