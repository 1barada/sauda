import { ServerError } from "@/types/base";
import { NextResponse } from "next/server";

export default function internalServerError(error: unknown) {
  console.error(error);
  return NextResponse.json<ServerError>({success: false, error: 'Internal Server Error'}, {status: 500});
}