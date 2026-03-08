import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/local/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: body.username,
            email: body.email,
            password: body.password,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json(
            { error: data.error?.message || "Registration failed" },
            { status: 400 }
        );
    }

    const response = NextResponse.json({ user: data.user });
    response.cookies.set("jwt", data.jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    return response;
}
