"use client"
import React, {useState} from "react";
import {Mail, User, Lock, Cpu, CheckSquare, XSquare} from "lucide-react";
import {useRouter} from "next/navigation";

export default function RegistrationPage() {
    const [form, setForm] = useState({username: "", email: "", password: "",});
    const [errors, setErrors] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
        global: undefined
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    function update(key: string, value: any) {
        setForm((s) => ({...s, [key]: value}));
        setErrors((e) => ({...e, [key]: ""}));
    }

    function validate() {
        const e = {username: '', email: '', password: ''};
        if (!form.username.trim()) e.username = "Username is required";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Please enter a valid email";
        if (form.password.length < 8) e.password = "Password must be at least 8 characters";
        return e;
    }

    function passwordStrength(pw) {
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const eobj = validate();
        if (Object.keys(eobj).length) {
            setErrors(eobj);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            router.push("/");
        } catch (err: any) {
            console.error(err);
            setErrors({ global: err.message || "Registration failed" });
        } finally {
            setLoading(false);
        }
    }

    return (<main
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <aside
                className="hidden md:flex flex-col justify-center rounded-2xl p-8 bg-white/60 backdrop-blur-md shadow-2xl">
                <div className="mb-6"><h1
                    className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
                    <Cpu className="w-10 h-10 text-indigo-600/90"/> MSI Store —
                    Create your account </h1> <p
                    className="mt-2 text-slate-600">Manage your builds,
                    wishlist, and orders with a single account.</p></div>
                <div className="flex-1 grid gap-4">
                    <div
                        className="rounded-xl p-4 border border-dashed border-indigo-100 bg-gradient-to-b from-indigo-50/40 to-white/60">
                        <h3 className="text-sm font-semibold text-indigo-700">Why
                            create an account?</h3> <p
                        className="mt-1 text-sm text-slate-600">Save builds, get
                        stock notifications, and speed through checkout.</p>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3"><CheckSquare
                            className="w-5 h-5 mt-1 text-emerald-600"/>
                            <div><strong className="text-black block">Order
                                history</strong> <span
                                className="text-sm text-slate-600">Track past purchases and invoices.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3"><XSquare
                            className="w-5 h-5 mt-1 text-rose-600"/>
                            <div><strong className="text-black block">Admin
                                controls</strong> <span
                                className="text-sm text-slate-600">Block or confirm users from the admin dashboard.</span>
                            </div>
                        </li>
                    </ul>
                    <div className="mt-6 text-sm text-slate-500"><strong>Security
                        tip:</strong> This is an online store for computer
                        components where you can safely browse, customize, and
                        order parts for your PC.
                    </div>
                </div>
            </aside>
            <section
                className="rounded-3xl p-8 bg-white shadow-xl"> {submitted ? (
                <div
                    className="p-6 rounded-xl border border-green-100 bg-green-50">
                    <h2 className="text-xl font-semibold text-emerald-800">Account
                        created 🎉</h2> <p className="mt-2 text-slate-700">Your
                    account has been prepared. Integrate the API endpoint to
                    persist the user to your database.</p></div>) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div><label
                        className="block text-sm font-medium text-slate-700">Username*</label>
                        <div className="mt-2 relative"><User
                            className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
                            <input value={form.username}
                                   onChange={(e) => update("username", e.target.value)}
                                   className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.username ? "border-rose-400" : "border-slate-200"}`}
                                   placeholder="e.g. gamer_alan"
                                   aria-invalid={!!errors.username}/> {errors.username &&
														<p
															className="text-rose-600 text-sm mt-1">{errors.username}</p>}
                        </div>
                    </div>
                    <div><label
                        className="block text-sm font-medium text-slate-700">Email*</label>
                        <div className="mt-2 relative"><Mail
                            className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
                            <input type="email" value={form.email}
                                   onChange={(e) => update("email", e.target.value)}
                                   className={`w-full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.email ? "border-rose-400" : "border-slate-200"}`}
                                   placeholder="you@pcparts.com"
                                   aria-invalid={!!errors.email}/> {errors.email &&
														<p
															className="text-rose-600 text-sm mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div><label
                        className="block text-sm font-medium text-slate-700">Password*</label>
                        <div className="mt-2 relative"><Lock
                            className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
                            <input type="password" value={form.password}
                                   onChange={(e) => update("password", e.target.value)}
                                   className={`w - full pl-10 pr-3 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.password ? "border-rose-400" : "border-slate-200"}`}
                                   placeholder="Create a strong password"
                                   aria-invalid={!!errors.password}/></div>
                        <div className="mt-3 flex items-center gap-3">
                            <div
                                className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{width: `${(passwordStrength(form.password) / 4) * 100}%`}}/>
                            </div>
                            <div
                                className="text-sm text-slate-500">{["", "Weak", "Below average", "Good", "Strong"][passwordStrength(form.password)]}</div>
                        </div>
                        {errors.password && <p
													className="text-rose-600 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button type="submit" disabled={loading}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md hover:scale-[1.01] transition-transform disabled:opacity-60"> {loading ? "Saving..." : "Create account"} </button>
                        </div>
                    </div>
                    {errors.global &&
											<p className="text-rose-600 text-sm">{errors.global}</p>}
                </form>)}
                <div className="mt-6 text-xs text-slate-400">Your data is never
                    shared with third parties and is used exclusively within our
                    service to create and manage your orders securely.
                </div>
            </section>
        </div>
    </main>);
}