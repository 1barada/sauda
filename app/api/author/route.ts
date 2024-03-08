import internalServerError from "@/utils/serverError";
import { NextRequest } from "next/server";

export function POST(req: NextRequest) {
  try {
    
  } catch (error) {
    return internalServerError(error);
  }
}