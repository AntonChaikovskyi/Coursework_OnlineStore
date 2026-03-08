"use client"

import React, { useState } from "react";
import { Mail, Lock, LogIn, Cpu } from "lucide-react";
import {useRouter} from "next/navigation";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({} as Record<string, string>);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((s) => ({ ...s, [key]: value }));
        setErrors((e) => ({ ...e, [key]: "" }));
    }

    function validate() {
        const e: Record<string, string> = {};
        if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Please enter a valid email";
        if (form.password.length < 8) e.password = "Minimum 8 characters required";
        return e;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        const eobj = validate();
        if (Object.keys(eobj).length) {
            setErrors(eobj);
            return;
        }
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            router.push("/");
        } catch (err: any) {
            setErrors({ global: err.message || "Login failed" });
        } finally {
            setLoading(false);
        }


    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left visual column */}
                <section className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-white/60 backdrop-blur-md shadow-2xl">
                    <div className="mb-6">
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                            <Cpu className="w-9 h-9 text-indigo-600/90" />
                            Welcome back!
                        </h1>
                        <p className="mt-2 text-slate-600">Sign in to your PC Components Store account and manage your orders.</p>
                    </div>

                    <ul className="space-y-3 mt-4">
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">✓</div>
                            <p className="text-sm text-slate-600">Secure authentication and password validation.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">⚙</div>
                            <p className="text-sm text-slate-600">Access to your saved builds, wishlist, and purchases.</p>
                        </li>
                    </ul>

                    <div className="mt-6 text-sm text-slate-500">
                        Don’t have an account? <a href="/register" className="text-indigo-600 hover:underline">Create one</a>.
                    </div>

                    <div className="mt-8 text-xs text-slate-400 border-t pt-3">
                        🔒 Your data is never shared. This is a UI component for your PC parts store. Replace the simulated API call with your server endpoint and store passwords securely on the backend.
                    </div>
                </section>

                {/* Right form column */}
                <section className="rounded-3xl p-8 bg-white shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email</label>
                            <div className="mt-2 relative">
                                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${
                                        errors.email ? "border-rose-400" : "border-slate-200"
                                    }`}
                                    placeholder="you@pcstore.com"
                                    aria-invalid={!!errors.email}
                                />
                                {errors.email && <p className="text-rose-600 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <div className="mt-2 relative">
                                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => update("password", e.target.value)}
                                    className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${
                                        errors.password ? "border-rose-400" : "border-slate-200"
                                    }`}
                                    placeholder="••••••••"
                                    aria-invalid={!!errors.password}
                                />
                                {errors.password && <p className="text-rose-600 text-sm mt-1">{errors.password}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"
                        >
                            <LogIn className="w-4 h-4" />
                            {loading ? "Signing in..." : "Sign in"}
                        </button>

                        {errors.global && <p className="text-rose-600 text-sm text-center">{errors.global}</p>}

                        <div className="text-center text-sm text-slate-500">
                            Forgot your password? <a href="/reset-password" className="text-indigo-600 hover:underline">Reset it</a>.
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}
