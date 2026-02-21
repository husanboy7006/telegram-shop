import { ShoppingCart } from 'lucide-react';

const Header = ({ cartCount, onCartClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-4 shadow-sm rounded-b-2xl flex justify-between items-center border-b border-gray-100 dark:border-gray-800 transition-colors">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Telegram Shop
            </h1>
            <button
                onClick={onCartClick}
                className="relative p-2.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 active:scale-95 transition-transform"
            >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[11px] font-extrabold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-pulse border-2 border-white dark:border-gray-900">
                        {cartCount}
                    </span>
                )}
            </button>
        </header>
    );
};

export default Header;
