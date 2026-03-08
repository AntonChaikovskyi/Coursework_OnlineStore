'use client'

import React, { useEffect, useState } from "react";

const HERO_IMAGES = [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=1",
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=2",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&s=3",
];

const CATEGORIES = [
    { id: "cpu", name: "Processors", icon: "🧠" },
    { id: "gpu", name: "Graphics Cards", icon: "🎮" },
    { id: "mb", name: "Motherboards", icon: "🔌" },
    { id: "ram", name: "Memory (RAM)", icon: "⚡" },
    { id: "psu", name: "Power Supplies", icon: "🔋" },
    { id: "cooling", name: "Cooling", icon: "❄️" },
];


export default function HomePage(): JSX.Element {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">

            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <p className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-transparent px-3 py-1 rounded-full text-sm font-medium text-blue-600">New Arrival</p>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Powerful components for your system<br />
                            <span className="text-blue-600">Faster. Cooler. Brighter.</span>
                        </h1>
                        <p className="text-gray-600 max-w-xl">
                            Choose pre-built kits or individual components — top graphics cards, processors, and accessories. Shipping across Ukraine.
                        </p>

                        <div className="flex gap-4">
                            <a className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:shadow-lg">Buy Now</a>
                            <a className="px-6 py-3 border border-gray-200 rounded-lg text-gray-700">Learn More</a>
                        </div>

                        <div className="mt-4 flex gap-4">
                            <div className="flex items-center gap-3">
                                <strong className="text-xl">24</strong>
                                <span className="text-sm text-gray-500">hours support</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <strong className="text-xl">Warranty</strong>
                                <span className="text-sm text-gray-500">up to 36 months</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-72 md:h-96 rounded-2xl shadow-xl overflow-hidden">
                        {HERO_IMAGES.map((src, i) => (
                            <img
                                key={src}
                                src={src}
                                alt={`hero-${i}`}
                                className={`absolute inset-0 w-full h-full object-cover transform transition-all duration-700 ${i === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
                                loading="eager"
                            />
                        ))}

                        <div className="absolute left-4 bottom-4 flex gap-2">
                            {HERO_IMAGES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIdx(i)}
                                    aria-label={`slide-${i}`}
                                    className={`w-10 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-bold mb-6">Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.id}
                            className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md border border-transparent hover:border-gray-100 flex flex-col items-center gap-3"
                        >
                            <div className="text-3xl">{c.icon}</div>
                            <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{c.name}</div>
                        </button>
                    ))}
                </div>
            </section>


            {/* PROMO GRID */}
            <section className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white shadow-lg">
                        <h3 className="text-xl font-bold">Build Discounts</h3>
                        <p className="mt-2 text-sm">Get up to 15% off when purchasing a pre-built system.</p>
                        <div className="mt-4 flex gap-3">
                            <a className="px-4 py-2 bg-white text-blue-600 rounded-lg">View</a>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h4 className="font-semibold">Advantages</h4>
                        <ul className="mt-3 text-sm text-gray-600 space-y-3">
                            <li>✅ Secure payment</li>
                            <li>✅ 30-day return guarantee</li>
                            <li>✅ 24/7 support</li>
                        </ul>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="font-semibold">Newsletter</h4>
                            <p className="mt-2 text-sm text-gray-600">Get promo codes and updates first.</p>
                        </div>
                        <form className="mt-4 flex gap-2">
                            <input
                                aria-label="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                            />
                            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>

            <footer className="max-w-7xl mx-auto px-6 py-10 text-sm text-gray-600">
                <div className="flex flex-col md:flex-row md:justify-between gap-6">
                    <div>
                        <div className="font-bold">MonoPC</div>
                        <div className="mt-2">© {new Date().getFullYear()} MonoPC. All rights reserved.</div>
                    </div>

                    <div className="flex gap-6">
                        <a>Privacy Policy</a>
                        <a>Shipping</a>
                        <a>Contacts</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
