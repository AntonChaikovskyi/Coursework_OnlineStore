import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { product, quantity } = body;

        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("jwt");
        const userCookie = cookieStore.get("user_id");

        const token = tokenCookie?.value;
        const user_id = userCookie?.value || "guest";
        console.log(token)
        console.log(tokenCookie)
        if (!product || !quantity) {
            return NextResponse.json(
                { error: "no product/quantity" },
                { status: 400 }
            );
        }

        const payload = {
            data: {
                ured_id: {
                    connect: [user_id],
                },
                product: {
                    connect: [product],
                },
                quantity,
            },
        };



        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        const data = await res.json();
        return NextResponse.json({ success: true, data });
    } catch (err: any) {
        console.error("❌ Error:", err);
        return NextResponse.json(
            { error: "Strapi Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("jwt");
        const token = tokenCookie?.value;

        if (!token) {
            return NextResponse.json(
                { error: "User unauthorized" },
                { status: 401 }
            );
        }

        // 1️⃣ Отримуємо cart items
        const res = await fetch("http://localhost:1337/api/cart-items", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            return NextResponse.json(
                { error: err?.error?.message || `Strapi error ${res.status}` },
                { status: res.status }
            );
        }
        const cartData = await res.json();


        console.log('resresresres');
        console.log('resresresres');
        console.log(cartData);
        console.log('resresresres');
        console.log('resresresres');

        const detailedCartItems = await Promise.all(
            cartData.data.map(async (item) => {
                try {
                    console.log(`http://localhost:1337/api/products/${item.documentId}`)
                    const productRes = await fetch(
                        `http://localhost:1337/api/products/${item.documentId}`,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!productRes.ok) throw new Error("Product not found");

                    const productData = await productRes.json();
                    const product = productData.data?.[0]?.attributes || null;

                    return {
                        ...item,
                        product,
                    };
                } catch (err) {
                    console.error("Error fetching product:", err);
                    return { ...item, product: null };
                }
            })
        );

        // 3️⃣ Повертаємо результат
        return NextResponse.json(
            { data: detailedCartItems, meta: cartData.meta },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error cart-items:", error);
        return NextResponse.json(
            { error: "Error while getting cart" },
            { status: 500 }
        );
    }
}