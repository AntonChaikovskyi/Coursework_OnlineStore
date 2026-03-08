import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;

    const authPages = ["/login", "/register"];

    if (token && authPages.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}
