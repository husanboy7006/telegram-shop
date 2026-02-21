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
import ProductModal from './components/ProductModal';
import { PRODUCTS } from './data/products';

function App() {
    const [cart, setCart] = useState({});
    const [view, setView] = useState('home');
    const [isLoaded, setIsLoaded] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Modal State
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Native TG BackButton setup
    useEffect(() => {
        // 1.5s simulated boot loading
        setTimeout(() => setIsLoaded(true), 1500);

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            // Native pull to refresh setup if supported context
            tg.enableClosingConfirmation();
            if (tg.isExpanded) {
                // we are fully loaded
            }

            if (tg.colorScheme === 'dark') {
                document.documentElement.classList.add('dark');
            }

            tg.BackButton.onClick(() => {
                if (view === 'checkout') setView('cart');
                else setView('home');
            });
        }
    }, []);

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

    const showToast = (message) => {
        setToastMessage(message);
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        setTimeout(() => setToastMessage(''), 3000);
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
            alert('Bu loyiha telegram orqali ishlaydi! Ammo maʼlumot tayyorlandi.');
            console.log("PAYLOAD: ", payload);
        }
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

    const LoadingSkeleton = () => (
        <div className="pt-24 px-4 pb-24 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <div className="w-full h-[300px] bg-gray-200 dark:bg-gray-800 rounded-[32px] animate-pulse mb-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_2s_infinite]"></div>
            </div>
            <div className="flex justify-between w-full h-8 mb-4 px-2">
                <div className="w-32 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-[24px] p-2.5 border border-gray-100 dark:border-gray-800 animate-pulse h-64">
                        <div className="w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-[16px] mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-3"></div>
                        <div className="flex justify-between">
                            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100/30 overflow-x-hidden">

            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%', scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
                        exit={{ opacity: 0, y: -20, x: '-50%', scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="fixed top-6 left-1/2 z-[100]"
                    >
                        <div className="bg-gray-900/95 dark:bg-white/95 backdrop-blur-xl text-white dark:text-gray-900 px-6 py-4 rounded-full shadow-2xl text-[14px] font-black tracking-wide flex items-center gap-2.5 whitespace-nowrap">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={14} className="text-white" />
                            </div>
                            {toastMessage}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ProductModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAdd={addToCart}
            />

            {!isLoaded ? (
                <LoadingSkeleton />
            ) : (
                <>
                    <AnimatePresence mode="wait" initial={false}>
                        {view === 'home' && (
                            <motion.div key="home" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                <Home products={PRODUCTS} onAddToCart={addToCart} onProductClick={setSelectedProduct} />
                            </motion.div>
                        )}
                        {view === 'catalog' && (
                            <motion.div key="catalog" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}>
                                <Catalog products={PRODUCTS} onAddToCart={addToCart} onProductClick={setSelectedProduct} />
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
                            <motion.div key="profile" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                                <Profile />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {['home', 'catalog', 'cart', 'profile'].includes(view) && (
                        <BottomNav activeView={view} onViewChange={setView} cartCount={totalItems} />
                    )}
                </>
            )}
        </div>
    );
}

export default App;
