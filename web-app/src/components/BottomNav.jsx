import { Home, Search, ShoppingCart, User } from 'lucide-react';

const BottomNav = ({ activeView, onViewChange, cartCount }) => {
    const navItems = [
        { id: 'home', icon: Home, label: 'Asosiy' },
        { id: 'catalog', icon: Search, label: 'Katalog' },
        { id: 'cart', icon: ShoppingCart, label: 'Savat', badge: cartCount },
        { id: 'profile', icon: User, label: 'Profil' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)]">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id)}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200"
                        >
                            <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'scale-110' : 'scale-100'} />

                                {/* Badge rendering */}
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white dark:border-gray-900 shadow-sm animate-in zoom-in">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
