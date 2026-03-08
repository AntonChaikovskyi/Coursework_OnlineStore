"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
    id: number;
    name: string;
    slug: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image_url: string | string[];
    specs?: Record<string, string>;
};

function Price({ value }: { value: number }) {
    return (
        <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ${value.toFixed(2)}
        </div>
    );
}

export default function ProductPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState<"description" | "specs" | "reviews">(
        "description"
    );
    const [message, setMessage] = useState<string | null>(null);


    useEffect(() => {
        if (!slug) return;

        async function fetchProduct() {
            try {
                const res = await fetch(
                    `http://localhost:1337/api/products?filters[slug][$eq]=${slug}`
                );
                const json = await res.json();

                if (json.data && json.data.length > 0) {
                    const p = json.data[0];
                    setProduct({
                        id: p.id,
                        name: p.name,
                        slug: p.slug,
                        brand: p.brand,
                        category: p.category,
                        price: p.price,
                        stock: p.stock,
                        description: p.description,
                        image_url: p.image_url,
                        specs: p.specs,
                    });
                } else {
                    setError("Product not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch product");
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [slug]);

    async function handleAddToCart() {
        if (!product) return;
        setLoading(true);
        setMessage(null);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product: product.id, quantity: qty }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error");

            setMessage("✅ Товар додано в кошик!");
        } catch (err) {
            setMessage("❌ Помилка при додаванні в кошик.");
        } finally {
            setLoading(false);
        }
    }

    if (loading)
        return <div className="p-10 text-center text-lg">Loading...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
    if (!product) return null;

    return (
        <div className="min-h-screen py-12 px-6 md:px-12 lg:px-24 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <nav className="text-sm mb-6">
                    <ol className="flex items-center gap-2">
                        <li className="hover:text-gray-700 cursor-pointer">Store</li>
                        <li>/</li>
                        <li className="font-medium">{product.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: IMAGE */}
                    <div className="lg:col-span-7">
                        <div className="rounded-2xl shadow-md overflow-hidden bg-white">
                            <div className="relative flex justify-center items-center h-[420px] md:h-[520px] w-full">
                                <img
                                    src={
                                        Array.isArray(product.image_url)
                                            ? product.image_url[0]
                                            : product.image_url
                                    }
                                    alt={product.name}
                                    style={{ objectFit: "contain" }}
                                    className="max-h-[500px]"
                                />
                            </div>
                        </div>

                        {/* Highlights */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="rounded-xl p-4 shadow bg-white flex items-start gap-3">
                                <div className="p-2">💡</div>
                                <div>
                                    <div className="font-semibold">Trusted Brand</div>
                                    <div className="text-sm text-gray-600">
                                        Official Apex reseller
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl p-4 shadow bg-white flex items-start gap-3">
                                <div className="p-2">🚚</div>
                                <div>
                                    <div className="font-semibold">Fast shipping</div>
                                    <div className="text-sm text-gray-600">
                                        Ships within 24 hours
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-xl p-4 shadow bg-white flex items-start gap-3">
                                <div className="p-2">🛡️</div>
                                <div>
                                    <div className="font-semibold">Warranty</div>
                                    <div className="text-sm text-gray-600">
                                        3 years manufacturer warranty
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: INFO */}
                    <aside className="lg:col-span-5">
                        <div className="sticky top-24 bg-white rounded-2xl p-6 shadow-md">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
                                        {product.name}
                                    </h1>
                                    <div className="mt-1 text-sm">
                                        by <span className="font-medium">{product.brand}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium">
                                        {product.stock
                                            ? `In stock (${product.stock})`
                                            : "Out of stock"}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                <Price value={product.price} />
                                <div className="text-sm text-gray-500">incl. VAT</div>
                            </div>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex items-center rounded-lg border p-1">
                                    <button
                                        onClick={() => setQty((q) => Math.max(1, q - 1))}
                                        className="px-3 py-1 text-lg leading-none"
                                    >
                                        -
                                    </button>
                                    <div className="px-4 font-medium">{qty}</div>
                                    <button
                                        onClick={() =>
                                            setQty((q) => Math.min(product.stock || 99, q + 1))
                                        }
                                        className="px-3 py-1 text-lg leading-none"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.stock}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold shadow-md transition-transform active:scale-95 ${
                                        product.stock
                                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {loading ? "Збереження..." : "Додати в кошик"}                                </button>
                            </div>

                            {message && <p className="mt-4 text-center text-gray-700">{message}</p>}


                            <div className="mt-4 text-sm text-gray-600">
                                <strong>Free returns</strong> within 30 days ·{" "}
                                <strong>Secure payment</strong>
                            </div>

                            <div className="mt-6 border-t pt-4 text-sm text-gray-700">
                                <div className="flex items-start gap-3">
                                    <div className="w-12">
                                        <div className="text-xs text-gray-500">SKU</div>
                                        <div className="font-medium">{product.slug}</div>
                                    </div>

                                    <div className="w-1/2">
                                        <div className="text-xs text-gray-500">Category</div>
                                        <div className="font-medium">{product.category}</div>
                                    </div>

                                    <div className="w-1/2 text-right">
                                        <div className="text-xs text-gray-500">Shipping</div>
                                        <div className="font-medium">Worldwide</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="mt-6 rounded-2xl p-6 shadow-md bg-white">
                            <div className="flex gap-3">
                                <button
                                    className={`px-4 py-2 rounded-md ${
                                        tab === "description"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setTab("description")}
                                >
                                    Description
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md ${
                                        tab === "specs"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setTab("specs")}
                                >
                                    Specs
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-md ${
                                        tab === "reviews"
                                            ? "bg-indigo-600 text-white"
                                            : "bg-gray-100"
                                    }`}
                                    onClick={() => setTab("reviews")}
                                >
                                    Reviews (0)
                                </button>
                            </div>

                            <div className="mt-6 text-gray-700">
                                {tab === "description" && (
                                    <div className="prose max-w-none">
                                        <p>{product.description}</p>
                                        <ul>
                                            <li>Perfect for 4K gaming and rendering</li>
                                            <li>Optimized drivers and low-noise cooler</li>
                                            <li>Requires 2x 8-pin PCIe power connectors</li>
                                        </ul>
                                    </div>
                                )}

                                {tab === "specs" && product.specs && (
                                    <div>
                                        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {Object.entries(product.specs).map(([k, v]) => (
                                                <div
                                                    key={k}
                                                    className="p-3 border rounded-lg bg-gray-50"
                                                >
                                                    <dt className="text-xs text-gray-500">{k}</dt>
                                                    <dd className="font-medium mt-1">{v}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                )}

                                {tab === "reviews" && (
                                    <div className="text-sm text-gray-600">
                                        No reviews yet. Be the first to review this product.
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
