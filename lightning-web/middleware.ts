import { NextResponse, NextRequest } from "next/server";
import { getToken } from 'next-auth/jwt';
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// 보호할 경로를 지정
const onlyAdminRoutes = ["/admin", "/api/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 보호된 경로가 아닌 경우 요청을 통과시킴
  if (!onlyAdminRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: authOptions.secret });

  if (!token || token.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Access denied: Admin permissions required." },
      { status: 403 }
    );
  }

  // 조건을 충족하면 요청을 통과시킴
  return NextResponse.next();
}

// 경로별로 미들웨어 활성화
export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"], // '/admin'과 '/api/admin' 하위 경로 포함
};