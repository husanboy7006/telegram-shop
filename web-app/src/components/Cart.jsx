import { Minus, Plus } from 'lucide-react';

const Cart = ({ cart, products, onUpdateQty, onCheckout }) => {
    const cartItems = Object.entries(cart).map(([id, count]) => {
        const product = products.find(p => p.id == id);
        return { ...product, count };
    }).filter(item => item.count > 0);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-950 transition-colors">
                <p className="text-lg font-medium">Savatingiz bo'sh</p>
            </div>
        );
    }

    return (
        <div className="pt-24 px-4 pb-32 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Savat ({cartItems.length} ta)</h2>

            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm flex items-center gap-4 dark:border dark:border-gray-800">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[14px] object-cover bg-gray-50 dark:bg-gray-800 flex-shrink-0" />

                        <div className="flex-1">
                            <h3 className="font-semibold text-[14px] text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</h3>
                            <p className="text-[13px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                {item.price.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl">
                            <button
                                onClick={() => onUpdateQty(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-200 active:scale-90 transition-transform"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold w-4 text-center text-sm dark:text-gray-100">{item.count}</span>
                            <button
                                onClick={() => onUpdateQty(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-200 active:scale-90 transition-transform"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-center mb-4 px-2 tracking-wide">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Jami tasdiqlash uchun:</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">
                        {total.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 active:scale-[0.98] transition-all"
                >
                    Buyurtmaga o'tish
                </button>
            </div>
        </div>
    );
};

export default Cart;
