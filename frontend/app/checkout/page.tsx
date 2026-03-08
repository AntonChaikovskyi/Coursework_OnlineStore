"use client"

import React, { useMemo, useState } from "react"

type Product = {
    id: number
    name: string
    price: number
    qty: number
}

export default function CheckoutPage() {
    const [products] = useState<Product[]>([
        { id: 1, name: "NVIDIA RTX 4080", price: 1299, qty: 1 },
        { id: 2, name: "Intel Core i9-14900K", price: 599, qty: 1 },
    ])

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [zip, setZip] = useState("")
    const [country, setCountry] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple">("card")
    const [cardNumber, setCardNumber] = useState("")
    const [cardExpiry, setCardExpiry] = useState("")
    const [cardCvv, setCardCvv] = useState("")
    const [coupon, setCoupon] = useState("")
    const [couponApplied, setCouponApplied] = useState<null | { code: string; value: number }>(null)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState<null | string>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const subtotal = useMemo(
        () => products.reduce((acc, p) => acc + p.price * p.qty, 0),
        [products]
    )

    const shipping = useMemo(() => (subtotal > 1500 ? 0 : 15), [subtotal])
    const discount = couponApplied ? couponApplied.value : 0
    const total = Math.max(0, subtotal + shipping - discount)

    function validate() {
        const e: Record<string, string> = {}
        if (!firstName.trim()) e.firstName = "First name is required"
        if (!lastName.trim()) e.lastName = "Last name is required"
        if (!email.trim() || !email.includes("@")) e.email = "Valid email is required"
        if (!address.trim()) e.address = "Address is required"
        if (!city.trim()) e.city = "City is required"
        if (!zip.trim()) e.zip = "ZIP is required"
        if (!country.trim()) e.country = "Country is required"
        if (!agreeTerms) e.terms = "You must agree to terms"

        if (paymentMethod === "card") {
            const digits = cardNumber.replace(/\s+/g, "")
            if (digits.length < 13) e.cardNumber = "Enter a valid card number"
            if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(cardExpiry)) e.cardExpiry = "Expiry must be MM/YY"
            if (cardCvv.length < 3) e.cardCvv = "CVV is required"
        }

        setErrors(e)
        return Object.keys(e).length === 0
    }

    function formatCurrency(n: number) {
        return `$${n.toFixed(2)}`
    }

    function applyCoupon() {
        // demo coupon logic — replace with real call
        const code = coupon.trim().toUpperCase()
        if (!code) return
        if (code === "SAVE50") {
            setCouponApplied({ code, value: 50 })
            setCoupon("")
        } else if (code === "FREESHIP") {
            setCouponApplied({ code, value: shipping })
            setCoupon("")
        } else {
            setErrors((prev) => ({ ...prev, coupon: "Invalid coupon" }))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSuccess(null)
        setErrors({})
        if (!validate()) return

        setSubmitting(true)
        try {
            // simulate payment processing
            await new Promise((r) => setTimeout(r, 900))
            // In production: send data to your backend, create payment intent, etc.
            setSuccess("Order placed successfully. Thank you for your purchase!")
        } catch (err) {
            setErrors({ form: "Payment failed. Try again." })
        } finally {
            setSubmitting(false)
        }
    }

    // simple input helpers
    function onCardNumberChange(val: string) {
        // allow only digits and spaces, add spacing every 4 digits
        const digits = val.replace(/[^0-9]/g, "").slice(0, 19)
        const parts = []
        for (let i = 0; i < digits.length; i += 4) parts.push(digits.slice(i, i + 4))
        setCardNumber(parts.join(" "))
    }

    function onExpiryChange(val: string) {
        const digits = val.replace(/[^0-9]/g, "").slice(0, 4)
        if (digits.length >= 3) setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`)
        else setCardExpiry(digits)
    }

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Contact & Shipping</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-2 focus:outline-offset-2`}
                                    aria-invalid={!!errors.firstName}
                                />
                                {errors.firstName && <p className="mt-1 text-sm">{errors.firstName}</p>}
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2"
                                    aria-invalid={!!errors.lastName}
                                />
                                {errors.lastName && <p className="mt-1 text-sm">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border px-3 py-2"
                                aria-invalid={!!errors.email}
                            />
                            {errors.email && <p className="mt-1 text-sm">{errors.email}</p>}
                        </div>

                        <div className="mt-4">
                            <label htmlFor="address" className="block text-sm font-medium">
                                Address
                            </label>
                            <input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="mt-1 block w-full rounded-md border px-3 py-2"
                                aria-invalid={!!errors.address}
                            />
                            {errors.address && <p className="mt-1 text-sm">{errors.address}</p>}
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="city" className="block text-sm font-medium">
                                    City
                                </label>
                                <input
                                    id="city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2"
                                    aria-invalid={!!errors.city}
                                />
                                {errors.city && <p className="mt-1 text-sm">{errors.city}</p>}
                            </div>

                            <div>
                                <label htmlFor="zip" className="block text-sm font-medium">
                                    ZIP
                                </label>
                                <input
                                    id="zip"
                                    value={zip}
                                    onChange={(e) => setZip(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2"
                                    aria-invalid={!!errors.zip}
                                />
                                {errors.zip && <p className="mt-1 text-sm">{errors.zip}</p>}
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium">
                                    Country
                                </label>
                                <input
                                    id="country"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="mt-1 block w-full rounded-md border px-3 py-2"
                                    aria-invalid={!!errors.country}
                                />
                                {errors.country && <p className="mt-1 text-sm">{errors.country}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Payment</h2>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input
                                    id="pm-card"
                                    name="payment"
                                    type="radio"
                                    checked={paymentMethod === "card"}
                                    onChange={() => setPaymentMethod("card")}
                                />
                                <label htmlFor="pm-card" className="text-sm font-medium">
                                    Card
                                </label>

                                <input
                                    id="pm-paypal"
                                    name="payment"
                                    type="radio"
                                    className="ml-6"
                                    checked={paymentMethod === "paypal"}
                                    onChange={() => setPaymentMethod("paypal")}
                                />
                                <label htmlFor="pm-paypal" className="text-sm font-medium">
                                    PayPal
                                </label>

                                <input
                                    id="pm-apple"
                                    name="payment"
                                    type="radio"
                                    className="ml-6"
                                    checked={paymentMethod === "apple"}
                                    onChange={() => setPaymentMethod("apple")}
                                />
                                <label htmlFor="pm-apple" className="text-sm font-medium">
                                    Apple Pay
                                </label>
                            </div>

                            {paymentMethod === "card" && (
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium">Card number</label>
                                        <input
                                            value={cardNumber}
                                            onChange={(e) => onCardNumberChange(e.target.value)}
                                            inputMode="numeric"
                                            placeholder="1234 5678 9012 3456"
                                            className="mt-1 block w-full rounded-md border px-3 py-2"
                                            aria-invalid={!!errors.cardNumber}
                                        />
                                        {errors.cardNumber && <p className="mt-1 text-sm">{errors.cardNumber}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">Expiry (MM/YY)</label>
                                        <input
                                            value={cardExpiry}
                                            onChange={(e) => onExpiryChange(e.target.value)}
                                            placeholder="MM/YY"
                                            className="mt-1 block w-full rounded-md border px-3 py-2"
                                            aria-invalid={!!errors.cardExpiry}
                                        />
                                        {errors.cardExpiry && <p className="mt-1 text-sm">{errors.cardExpiry}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">CVV</label>
                                        <input
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                                            inputMode="numeric"
                                            placeholder="123"
                                            className="mt-1 block w-full rounded-md border px-3 py-2"
                                            aria-invalid={!!errors.cardCvv}
                                        />
                                        {errors.cardCvv && <p className="mt-1 text-sm">{errors.cardCvv}</p>}
                                    </div>
                                </div>
                            )}

                            {errors.form && <p className="text-sm">{errors.form}</p>}
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="text-sm">
                                I agree to the terms and conditions
                            </label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="rounded-md px-4 py-2 font-medium"
                            >
                                {submitting ? "Processing..." : "Place order"}
                            </button>
                        </div>
                    </div>

                    {success && (
                        <div className="rounded-2xl p-4 shadow-sm" role="status">
                            <p className="font-medium">{success}</p>
                        </div>
                    )}
                </section>

                <aside className="space-y-6">
                    <div className="rounded-2xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4">Order summary</h2>

                        <ul className="space-y-3">
                            {products.map((p) => (
                                <li key={p.id} className="flex justify-between">
                                    <div>
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-sm">Qty: {p.qty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(p.price * p.qty)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between font-semibold pt-2 border-t">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium">Coupon</label>
                            <div className="flex gap-2 mt-2">
                                <input
                                    value={coupon}
                                    onChange={(e) => {
                                        setCoupon(e.target.value)
                                        setErrors((prev) => ({ ...prev, coupon: "" }))
                                    }}
                                    placeholder="Enter coupon code"
                                    className="flex-1 rounded-md border px-3 py-2"
                                />
                                <button type="button" onClick={applyCoupon} className="rounded-md px-3 py-2 font-medium">
                                    Apply
                                </button>
                            </div>
                            {errors.coupon && <p className="mt-1 text-sm">{errors.coupon}</p>}
                            {couponApplied && <p className="mt-1 text-sm">Applied: {couponApplied.code}</p>}
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() => window.alert("Preview checkout — integrate real payments in backend")}
                                className="w-full rounded-md px-4 py-2 font-medium"
                            >
                                Continue to payment
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl p-6 shadow-sm">
                        <h3 className="text-sm font-semibold">Need help?</h3>
                        <p className="mt-2 text-sm">Contact our support or check delivery times before placing an order.</p>
                        <div className="mt-4 text-sm">
                            <p>Phone: +1 (555) 123-4567</p>
                            <p className="mt-1">Email: support@monopc.com</p>
                        </div>
                    </div>
                </aside>
            </form>
        </main>
    )
}
