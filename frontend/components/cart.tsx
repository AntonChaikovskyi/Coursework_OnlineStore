'use client'

import React, { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {DialogTitle} from "@radix-ui/react-dialog";

type CartItem = {
    id: number;
    documentId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
};

type ApiResponse = {
    data: CartItem[];
    meta?: { pagination?: Record<string, any> };
};
export default function CartDrawer({
                                       children,
                                       token,
                                   }: {
    children: React.ReactNode;
    token?: string;
}) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let aborted = false;
        const fetchItems = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch("/api/cart", { credentials: "include" });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json: ApiResponse = await res.json();
                if (!aborted) setItems(json.data ?? []);
            } catch (err: any) {
                if (!aborted) setError(err.message ?? "Failed to fetch");
            } finally {
                if (!aborted) setLoading(false);
            }
        };

        fetchItems();
        return () => {
            aborted = true;
        };
    }, [token]);

    const totalCount = items.reduce((s, it) => s + it.quantity, 0);

    const formatDate = (iso?: string) => {
        if (!iso) return "";
        try {
            const d = new Date(iso);
            return d.toLocaleString();
        } catch {
            return iso;
        }
    };

    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent className="p-0 max-w-lg w-full">
                    {/* Header */}
                    <DialogTitle/>
                    <header className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
                        <h3 className="text-2xl font-semibold">Your Cart</h3>
                        <p className="text-sm opacity-90 mt-1">{totalCount} items · Cart updated {items.length ? formatDate(items[0].updatedAt) : "—"}</p>
                    </header>

                    <div className="p-6 space-y-4 bg-white min-h-[320px]">
                        {loading && (
                            <div className="text-center py-12 text-sm text-slate-500">Loading cart items…</div>
                        )}

                        {error && (
                            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">Error: {error}</div>
                        )}

                        {!loading && !items.length && !error && (
                            <div className="text-center py-20 text-slate-500">Your cart is empty.</div>
                        )}

                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex-none w-20 h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-600 font-medium shadow-inner">
                                        <img src='https://c.428.ua/img/3802016/3000/2000/videokarta_msi_pci-e_geforce_rtx_4060_ti_8gb_ddr6_rtx_4060_ti_ventus_2x_black_8g_oc~1813~1600.jpg' alt='' />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-base">Product • <span className="font-semibold">{item.documentId}</span></h4>
                                                <p className="text-xs text-slate-500 mt-1">Added {formatDate(item.createdAt)}</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-sm font-semibold">Qty: <span className="text-slate-700">{item.quantity}</span></div>
                                                <div className="text-xs text-slate-400 mt-2">ID: {item.id}</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex gap-2 text-xs">
                                            <a
                                                className="inline-block px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                href={`/products/${item.documentId}`}
                                            >
                                                View product
                                            </a>

                                            <button
                                                className="inline-block px-3 py-1 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                                                onClick={() => {
                                                    setItems((prev) => prev.filter((p) => p.id !== item.id));
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Footer / Checkout button */}
                    <div className="p-4 border-t sticky bottom-0 bg-white rounded-b-2xl">
                        <div className="max-w-xl mx-auto flex gap-3">
                            <div className="flex-1">
                                <div className="text-xs text-slate-500">Subtotal</div>
                                <div className="text-lg font-semibold">{totalCount - 1} item(s)</div>
                            </div>

                            <a
                                href="/checkout"
                                className="inline-flex items-center justify-center px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:scale-[1.01] transition-transform"
                            >
                                Go to checkout
                            </a>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2 text-center">Secure checkout · Free shipping on orders over a certain amount</p>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
