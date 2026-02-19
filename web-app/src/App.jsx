import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { PRODUCTS } from './data/products';

function App() {
    const [cart, setCart] = useState({});
    const [view, setView] = useState('home'); // home, cart, checkout
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsLoaded(true), 500);

        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();

            // Handle Back Button
            tg.BackButton.onClick(() => {
                if (view === 'checkout') setView('cart');
                else if (view === 'cart') setView('home');
            });
        }
    }, [view]);

    // Update BackButton visibility
    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            if (view === 'home') tg.BackButton.hide();
            else tg.BackButton.show();
        }
        window.scrollTo(0, 0);
    }, [view]);

    const addToCart = (id) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
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
        const payload = {
            cart,
            user_info: formData
        };
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.sendData(JSON.stringify(payload));
        } else {
            console.log('Order submitted:', payload);
            alert('Buyurtma yuborildi! (Demo)');
        }
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100">
            {view === 'home' && (
                <>
                    <Header cartCount={totalItems} onCartClick={() => setView('cart')} />
                    <main className="pt-20 px-4 pb-24">
                        <h2 className="text-lg font-bold mb-4 text-gray-800">Barcha mahsulotlar</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {PRODUCTS.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAdd={addToCart}
                                />
                            ))}
                        </div>
                    </main>
                </>
            )}

            {view === 'cart' && (
                <Cart
                    cart={cart}
                    products={PRODUCTS}
                    onUpdateQty={updateQty}
                    onCheckout={() => setView('checkout')}
                />
            )}

            {view === 'checkout' && (
                <Checkout
                    cart={cart}
                    products={PRODUCTS}
                    onSubmit={handleCheckoutSubmit}
                    onBack={() => setView('cart')}
                />
            )}
        </div>
    );
}

export default App;
