import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  return NextResponse.redirect(new URL("/dashboard/success", req.url), 303);
}
