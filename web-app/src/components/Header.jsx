import { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';

const Header = ({ title, showUserName = false, cartCount, onCartClick }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const firstName = tgUser?.first_name || 'Mehmon';

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl shadow-sm border-b border-gray-100 dark:border-gray-800/50 py-3'
                    : 'bg-transparent py-5 dark:bg-transparent'
                } px-4 flex justify-between items-center`}
        >
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-[2px] shadow-md shadow-indigo-500/20">
                    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-900">
                        {tgUser?.photo_url ? (
                            <img src={tgUser.photo_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                {firstName.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col">
                    {showUserName && (
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-0.5 opacity-80">
                            Xush kelibsiz, {firstName}
                        </span>
                    )}
                    <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                        {title || "TG Do'kon"}
                    </h1>
                </div>
            </div>

            {/* Cart Button in Header for quick access */}
            {cartCount !== undefined && (
                <button
                    onClick={onCartClick}
                    className="relative p-2.5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-[14px] text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/50 dark:border-gray-700/50 active:scale-95 transition-transform"
                >
                    <ShoppingCart size={22} strokeWidth={2.5} />
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-extrabold w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-md shadow-indigo-500/40 border-2 border-white dark:border-gray-900 animate-in zoom-in">
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </button>
            )}
        </header>
    );
};

export default Header;
