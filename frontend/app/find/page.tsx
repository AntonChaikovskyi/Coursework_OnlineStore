"use client"

import React, {useEffect, useMemo, useState} from "react"
import Link from "next/link";


type Product = {
    id: number
    name: string
    slug: string
    brand: string
    brand_slug?: string
    category: string
    category_slug?: string
    price: number
    stock: number
    description?: string
    image_url?: string
}


export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // filters state
    const [query, setQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
    const [minPrice, setMinPrice] = useState<number | "">("")
    const [maxPrice, setMaxPrice] = useState<number | "">("")
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sort, setSort] = useState<"newest" | "price_asc" | "price_desc">("newest")

    // pagination
    const [page, setPage] = useState(1)
    const pageSize = 12

    // 🔥 Fetch data from Strapi
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const res = await fetch("http://localhost:1337/api/products?populate=*&pagination[pageSize]=100")
                if (!res.ok) throw new Error("Failed to fetch products")

                const json = await res.json()

                // transform response (Strapi v4 structure)
                const normalized = json.data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    brand: item.brand?.data?.attributes?.name || "Unknown",
                    brand_slug: item.brand?.data?.attributes?.slug,
                    category: item.category_id?.data?.attributes?.name || "Uncategorized",
                    category_slug: item.category_id?.data?.attributes?.slug,
                    price: item.price,
                    stock: item.stock,
                    description: item.description,
                    image_url: item.image_url,
                }))

                setProducts(normalized)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    // compute categories & brands
    const categories = useMemo(() => {
        const map = new Map<string, string>()
        for (const p of products) map.set(p.category_slug ?? p.category, p.category)
        return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }))
    }, [products])

    const brands = useMemo(() => {
        const map = new Map<string, string>()
        for (const p of products) map.set(p.brand_slug ?? p.brand, p.brand)
        return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }))
    }, [products])

    // filtering
    const filtered = useMemo(() => {
        let arr = [...products]

        if (query.trim()) {
            const q = query.trim().toLowerCase()
            arr = arr.filter(
                (p) => p.name.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
            )
        }

        if (selectedCategory) arr = arr.filter((p) => (p.category_slug ?? p.category) === selectedCategory)
        if (selectedBrand) arr = arr.filter((p) => (p.brand_slug ?? p.brand) === selectedBrand)

        if (minPrice !== "") arr = arr.filter((p) => p.price >= Number(minPrice))
        if (maxPrice !== "") arr = arr.filter((p) => p.price <= Number(maxPrice))

        if (inStockOnly) arr = arr.filter((p) => p.stock > 0)

        if (sort === "price_asc") arr.sort((a, b) => a.price - b.price)
        if (sort === "price_desc") arr.sort((a, b) => b.price - a.price)
        if (sort === "newest") arr.sort((a, b) => b.id - a.id)

        return arr
    }, [products, query, selectedCategory, selectedBrand, minPrice, maxPrice, inStockOnly, sort])

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

    function clearFilters() {
        setQuery("")
        setSelectedCategory(null)
        setSelectedBrand(null)
        setMinPrice("")
        setMaxPrice("")
        setInStockOnly(false)
        setPage(1)
        setSort("newest")
    }

    if (loading) return <p className="p-10 text-center">Loading products...</p>
    if (error) return <p className="p-10 text-center text-red-500">Error: {error}</p>

    return (
        <main className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Products</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters column */}
                <aside className="col-span-1 rounded-2xl p-4 shadow-sm">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Search</label>
                            <input
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
                                placeholder="Search products, e.g. RTX 4080"
                                className="mt-2 block w-full rounded-md border px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Category</label>
                            <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-auto">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedCategory(null); setPage(1) }}
                                    className={`text-sm text-left py-1 rounded-md`}
                                >
                                    All
                                </button>
                                {categories.map((c) => (
                                    <button
                                        key={c.slug}
                                        type="button"
                                        onClick={() => { setSelectedCategory(c.slug); setPage(1) }}
                                        className={`text-sm text-left py-1 rounded-md ${selectedCategory === c.slug ? "font-semibold" : ""}`}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Brand</label>
                            <div className="mt-2 flex flex-col gap-2 max-h-40 overflow-auto">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedBrand(null); setPage(1) }}
                                    className="text-sm text-left py-1 rounded-md"
                                >
                                    All
                                </button>
                                {brands.map((b) => (
                                    <button
                                        key={b.slug}
                                        type="button"
                                        onClick={() => { setSelectedBrand(b.slug); setPage(1) }}
                                        className={`text-sm text-left py-1 rounded-md ${selectedBrand === b.slug ? "font-semibold" : ""}`}
                                    >
                                        {b.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Price</label>
                            <div className="mt-2 flex gap-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value === "" ? "" : Number(e.target.value)); setPage(1) }}
                                    placeholder="Min"
                                    className="w-1/2 rounded-md border px-2 py-1"
                                />
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value === "" ? "" : Number(e.target.value)); setPage(1) }}
                                    placeholder="Max"
                                    className="w-1/2 rounded-md border px-2 py-1"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input id="instock" type="checkbox" checked={inStockOnly} onChange={(e) => { setInStockOnly(e.target.checked); setPage(1) }} />
                            <label htmlFor="instock" className="text-sm">In stock only</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Sort</label>
                            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="mt-2 block w-full rounded-md border px-3 py-2">
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: low to high</option>
                                <option value="price_desc">Price: high to low</option>
                            </select>
                        </div>

                        <div className="pt-2">
                            <button type="button" onClick={clearFilters} className="rounded-md px-3 py-2 font-medium">
                                Clear filters
                            </button>
                        </div>

                        <div className="pt-4 text-sm">
                            <p>Results: <strong>{total}</strong></p>
                        </div>
                    </div>
                </aside>

                {/* Products list */}
                <section className="col-span-3">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm">
                            Showing <strong>{paginated.length}</strong> of <strong>{total}</strong> products
                        </p>
                    </div>

                    {total === 0 ? (
                        <div className="rounded-2xl p-6 shadow-sm text-center">
                            No products found. Try adjusting filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginated.map((p) => (
                                <Link href={'/product/' + p.slug}
                                    key={p.id}
                                    className="rounded-2xl p-4 shadow-sm flex flex-col hover:shadow-lg transition"
                                >
                                    <div className="h-44 w-full bg-muted rounded-md overflow-hidden mb-3 flex items-center justify-center">
                                        {p.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={p.image_url} alt={p.name} className="object-cover h-full w-full" />
                                        ) : (
                                            <div className="text-sm">No image</div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-base font-semibold">{p.name}</h3>
                                        <p className="text-sm mt-1">{p.brand} • {p.category}</p>
                                        <p className="mt-3 font-medium">${p.price.toFixed(2)}</p>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-sm">
                                            {p.stock > 0 ? `In stock: ${p.stock}` : "Out of stock"}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="rounded-md px-3 py-1 text-sm">Quick view</button>
                                            <button className="rounded-md px-3 py-1 text-sm" disabled={p.stock === 0}>
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </section>
            </div>
        </main>
    )
}
