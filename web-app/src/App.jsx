import { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2 } from 'lucide-react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { PRODUCTS } from './data/products';

const CATEGORIES = ["Barchasi", "Elektronika", "Aksessuar", "Gadjet", "Sumka"];

function App() {
    const [cart, setCart] = useState({});
    const [view, setView] = useState('home'); // home, cart, checkout
    const [activeCategory, setActiveCategory] = useState('Barchasi');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Loading & Toasts
    const [isLoaded, setIsLoaded] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 800); // skeleton namoyishi uchun vaqt

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            // Theme setting for background (if needed matching telegram theme)
            if (tg.colorScheme === 'dark') {
                document.documentElement.classList.add('dark');
            }

            tg.BackButton.onClick(() => {
                if (view === 'checkout') setView('cart');
                else if (view === 'cart') setView('home');
            });
        }
    }, [view]);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            if (view === 'home') tg.BackButton.hide();
            else tg.BackButton.show();
        }
        window.scrollTo(0, 0);
    }, [view]);

    // Show Toast
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 2000);
    };

    const addToCart = (product) => {
        const id = product.id;
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        showToast(`${product.name} savatga qo'shildi!`);
    };

    const updateQty = (id, delta) => {
        setCart(prev => {
            const newQty = (prev[id] || 0) + delta;
            if (newQty <= 0) {
                const { [id]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [id]: newQty };
        });
    };

    const handleCheckoutSubmit = (formData) => {
        const payload = { cart, user_info: formData };
        if (window.Telegram?.WebApp && window.Telegram.WebApp.sendData) {
            window.Telegram.WebApp.sendData(JSON.stringify(payload));
        } else {
            alert('Bu loyiha telegram bot orqali ochilganda ishlaydi!');
        }
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
        const p = PRODUCTS.find(prod => prod.id == id);
        return sum + (p.price * count);
    }, 0);

    let filteredProducts = PRODUCTS.filter(product => {
        const matchCategory = activeCategory === 'Barchasi' || product.category === activeCategory;
        const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    filteredProducts = filteredProducts.sort((a, b) => {
        if (sortBy === 'popular') return b.popularity - a.popularity;
        if (sortBy === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'price_asc') return a.price - b.price;
        return 0;
    });

    const getSortLabel = () => {
        if (sortBy === 'popular') return 'Eng mashhur';
        if (sortBy === 'new') return 'Eng yangi';
        if (sortBy === 'price_asc') return 'Arzon';
        return 'Saralash';
    };

    // Skeleton Loader Component
    const LoadingSkeleton = () => (
        <div className="pt-24 px-4 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="flex gap-2 mb-6">
                <div className="h-11 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full animate-pulse"></div>
                <div className="h-11 bg-gray-200 dark:bg-gray-800 rounded-2xl w-32 animate-pulse"></div>
            </div>
            <div className="flex gap-2 mb-8 overflow-hidden">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-9 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse flex-shrink-0"></div>)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-[24px] p-3 border border-gray-100 dark:border-gray-800 animate-pulse">
                        <div className="w-full h-56 bg-gray-200 dark:bg-gray-800 rounded-[16px] mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-5"></div>
                        <div className="flex justify-between items-end">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100 transition-colors">
            <Header cartCount={totalItems} onCartClick={() => setView('cart')} />

            {/* Global Toast */}
            {toastMessage && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
                    <div className="bg-gray-900/90 dark:bg-white/95 backdrop-blur-md text-white dark:text-gray-900 px-5 py-3 rounded-full shadow-2xl text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                        <CheckCircle2 size={16} className="text-green-400 dark:text-green-600" />
                        {toastMessage}
                    </div>
                </div>
            )}

            {/* If not loaded, show skeleton */}
            {!isLoaded ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {view === 'home' && (
                        <main className={`pt-24 px-4 pb-28 ${totalItems > 0 ? 'pb-32' : ''}`}> {/* extra padding if fix btn */}

                            <div className="flex gap-2 mb-5 relative z-20">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Search size={18} className="text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Qidirish..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm xl:text-base rounded-2xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow shadow-sm dark:text-gray-100"
                                    />
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortOpen(!isSortOpen)}
                                        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 h-full px-4 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-sm active:scale-95 transition-all"
                                    >
                                        <span className="hidden sm:inline">{getSortLabel()}</span>
                                        <span className="sm:hidden">Saralash</span>
                                        <ChevronDown size={18} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isSortOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-[20px] shadow-xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden z-20 origin-top-right animate-in fade-in zoom-in-95">
                                                {['popular', 'new', 'price_asc'].map(sortKey => (
                                                    <button
                                                        key={sortKey}
                                                        onClick={() => { setSortBy(sortKey); setIsSortOpen(false); }}
                                                        className={`w-full text-left px-5 py-3 text-sm transition-colors ${sortBy === sortKey ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                    >
                                                        {sortKey === 'popular' ? 'Eng mashhur' : sortKey === 'new' ? 'Eng yangi' : 'Narx (Arzon → Qimmat)'}
                                                    </button>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2 -mx-4 px-4">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${activeCategory === category
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40'
                                                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAdd={addToCart}
                                    />
                                ))}
                            </div>
                            {filteredProducts.length === 0 && (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-16 flex flex-col items-center">
                                    <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                                    <p className="font-medium text-[15px]">Bu talablarga mos<br />mahsulot topilmadi.</p>
                                </div>
                            )}

                            {/* FIXED BOTTOM CART BUTTON */}
                            {totalItems > 0 && view === 'home' && (
                                <div className="fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-8 duration-500">
                                    <button
                                        onClick={() => setView('cart')}
                                        className="w-full bg-gray-900 dark:bg-indigo-600 text-white py-4 px-5 rounded-[24px] shadow-2xl shadow-gray-900/30 dark:shadow-indigo-900/50 flex justify-between items-center active:scale-[0.98] transition-transform backdrop-blur-md"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="bg-white/20 px-3 py-1.5 rounded-xl text-xs font-black tracking-wide">{totalItems} ta</span>
                                            <span className="text-sm font-bold tracking-wide">Savatga kirish</span>
                                        </div>
                                        <span className="text-lg font-black">{totalPrice.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm</span>
                                    </button>
                                </div>
                            )}

                        </main>
                    )}

                    {view === 'cart' && <Cart cart={cart} products={PRODUCTS} onUpdateQty={updateQty} onCheckout={() => setView('checkout')} />}
                    {view === 'checkout' && <Checkout cart={cart} products={PRODUCTS} onSubmit={handleCheckoutSubmit} onBack={() => setView('cart')} />}
                </>
            )}
        </div>
    );
}

export default App;
