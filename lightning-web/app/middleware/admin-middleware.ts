import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/auth-options";

// 보호할 경로를 지정
const onlyAdminRoutes = ["/admin", "/api/admin"];

export async function adminMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 보호된 경로가 아닌 경우 요청을 통과시킴
  if (!onlyAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: authOptions.secret });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json(
      { message: `Access denied: Admin permissions required. your role is ${token?.role}` },
      { status: 403 }
    );
  }

  // 조건을 충족하면 요청을 통과시킴
  return NextResponse.next();
}