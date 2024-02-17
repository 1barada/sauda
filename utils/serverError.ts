import { NextResponse } from "next/server";

export default function serverError(error: unknown) {
  console.error(error);
  return NextResponse.json({success: false, error: 'Internal Server Error'}, {status: 500});
}