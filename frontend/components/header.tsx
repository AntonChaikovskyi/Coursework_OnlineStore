import React from 'react';
import Cart from "@/components/cart";

const Header = () => {
    return (
        <header className="sticky bg-white top-0 left-0 z-50 w-full text-black  mx-auto px-16 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="font-extrabold text-2xl tracking-tight">MonoPC</div>
                <nav className="hidden md:flex gap-6 text-sm text-gray-600">
                    <a className="hover:text-gray-900">Categories</a>
                    <a className="hover:text-gray-900">Sales</a>
                    <a className="hover:text-gray-900">About</a>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <button className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">🔍 Find</button>
                <Cart>
                <button className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">Cart</button>
                </Cart>
            </div>
        </header>
    );
};

export default Header;