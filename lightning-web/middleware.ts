import { NextResponse, NextRequest } from "next/server";
import { adminMiddleware } from "@/app/middleware/admin-middleware";

export async function middleware(request: NextRequest) {
  const adminMiddlewareRes = await adminMiddleware(request);
  if (!adminMiddlewareRes.ok) { return adminMiddlewareRes; }

  return NextResponse.next();
}
