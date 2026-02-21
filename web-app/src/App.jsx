import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Components
import Home from './components/Home';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import BottomNav from './components/BottomNav';
import { PRODUCTS } from './data/products';

function App() {
    const [cart, setCart] = useState({});
    const [view, setView] = useState('home'); // home, catalog, cart, checkout, profile
    const [isLoaded, setIsLoaded] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Native TG BackButton setup
    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 1200); // 1.2s loading effect for premium feel

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            if (tg.colorScheme === 'dark') {
                document.documentElement.classList.add('dark');
            }

            tg.BackButton.onClick(() => {
                if (view === 'checkout') setView('cart');
                else setView('home');
            });
        }
    }, []);

    // BackButton visibility
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            if (['home', 'catalog', 'profile'].includes(view)) {
                tg.BackButton.hide();
            } else {
                tg.BackButton.show();
            }
        }
        window.scrollTo(0, 0);
    }, [view]);

    // Toast helper
    const showToast = (message) => {
        setToastMessage(message);
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        setTimeout(() => setToastMessage(''), 2500);
    };

    const addToCart = (product) => {
        const id = product.id;
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
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
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.selectionChanged();
        }
    };

    const handleCheckoutSubmit = (formData) => {
        const payload = { cart, user_info: formData };
        if (window.Telegram?.WebApp && window.Telegram.WebApp.sendData) {
            window.Telegram.WebApp.sendData(JSON.stringify(payload));
        } else {
            alert('Bu loyiha telegram orqali ishlaydi!');
        }
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

    // Skeleton Loader Component
    const LoadingSkeleton = () => (
        <div className="pt-24 px-4 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-[28px] animate-pulse mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3].map(i => (
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100 overflow-x-hidden">

            {/* Global Action Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                        exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="fixed top-6 left-1/2 z-[100]"
                    >
                        <div className="bg-gray-900/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-gray-900 px-6 py-3.5 rounded-full shadow-2xl text-[14px] font-bold flex items-center gap-2.5 whitespace-nowrap">
                            <CheckCircle2 size={18} className="text-green-400 dark:text-green-500" />
                            {toastMessage}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isLoaded ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {/* Framer Motion for Page Transitions */}
                    <AnimatePresence mode="wait">
                        {view === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                <Home products={PRODUCTS} onAddToCart={addToCart} />
                            </motion.div>
                        )}
                        {view === 'catalog' && (
                            <motion.div key="catalog" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                                <Catalog products={PRODUCTS} onAddToCart={addToCart} />
                            </motion.div>
                        )}
                        {view === 'cart' && (
                            <motion.div key="cart" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.2 }}>
                                <Cart cart={cart} products={PRODUCTS} onUpdateQty={updateQty} onCheckout={() => setView('checkout')} />
                            </motion.div>
                        )}
                        {view === 'checkout' && (
                            <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }}>
                                <Checkout cart={cart} products={PRODUCTS} onSubmit={handleCheckoutSubmit} onBack={() => setView('cart')} />
                            </motion.div>
                        )}
                        {view === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                                <Profile />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Bottom Navigation is visible on specific pages */}
                    {['home', 'catalog', 'cart', 'profile'].includes(view) && (
                        <BottomNav activeView={view} onViewChange={setView} cartCount={totalItems} />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
