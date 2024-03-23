import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  console.log(req.headers)

  const file = formData.get('file') as File;

  console.log(file.name);

  return NextResponse.json({});
}