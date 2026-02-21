import { ShoppingCart } from 'lucide-react';

const Header = ({ title, showUserName = false }) => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const firstName = tgUser?.first_name || 'Mehmon';

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-4 flex justify-between items-center shadow-sm dark:shadow-gray-950/20">
            <div className="flex flex-col">
                {showUserName && (
                    <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                        Xush kelibsiz, {firstName}
                    </span>
                )}
                <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight">
                    {title || "Telegram Shop"}
                </h1>
            </div>

            {/* Optional Right Action Area, maybe profile pic */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-inner border border-white/50 dark:border-white/5">
                {firstName.charAt(0).toUpperCase()}
            </div>
        </header>
    );
};

export default Header;
