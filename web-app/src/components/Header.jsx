import { ShoppingCart } from 'lucide-react';

const Header = ({ cartCount, onCartClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md p-4 shadow-sm rounded-b-2xl flex justify-between items-center border-b border-gray-100">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Telgram Shop
            </h1>
            <button
                onClick={onCartClick}
                className="relative p-2 bg-indigo-50 rounded-xl text-indigo-600 active:scale-95 transition-transform"
            >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        {cartCount}
                    </span>
                )}
            </button>
        </header>
    );
};

export default Header;
