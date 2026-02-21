import { Minus, Plus, ShoppingBag } from 'lucide-react';
import Header from './Header';

const Cart = ({ cart, products, onUpdateQty, onCheckout }) => {
    const cartItems = Object.entries(cart).map(([id, count]) => {
        const product = products.find(p => p.id == id);
        return { ...product, count };
    }).filter(item => item.count > 0);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);
    const oldTotal = cartItems.reduce((sum, item) => sum + ((item.oldPrice || item.price) * item.count), 0);
    const savings = oldTotal - total;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col pt-20">
                <Header title="Savat" />
                <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                    <div className="w-32 h-32 bg-indigo-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag size={50} className="text-indigo-500/50 dark:text-indigo-400/50" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">Savatingiz bo'sh</h2>
                    <p className="text-sm font-semibold text-gray-500 px-10 text-center">Katalog orqali mahsulot qo'shib, bu yerdan xarid qilishingiz mumkin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 px-4 pb-48 bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors">
            <Header title="Savat" />

            <div className="mt-8 space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 p-3 rounded-[24px] shadow-sm flex items-center gap-4 dark:border dark:border-gray-800">
                        <div className="relative w-24 h-24 rounded-[16px] bg-gray-50 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            {item.oldPrice && (
                                <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md">YANGI</span>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 pr-1 flex flex-col h-full py-1">
                            <h3 className="font-bold text-[14px] text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug mb-2">{item.name}</h3>

                            <div className="flex justify-between items-end mt-auto">
                                <div className="flex flex-col">
                                    {item.oldPrice && (
                                        <span className="text-[10px] font-bold text-gray-400 line-through mb-0.5">
                                            {(item.oldPrice * item.count).toLocaleString('uz-UZ').replace(/,/g, ' ')}
                                        </span>
                                    )}
                                    <span className="text-[16px] font-black text-indigo-600 dark:text-indigo-400 leading-none">
                                        {(item.price * item.count).toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[10px] font-semibold text-gray-500 tracking-wider uppercase">so'm</span>
                                    </span>
                                </div>

                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-[12px] border border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => onUpdateQty(item.id, -1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-600 dark:text-gray-200 active:scale-90 transition-transform"
                                    >
                                        <Minus size={14} strokeWidth={3} />
                                    </button>
                                    <span className="font-bold w-3 text-center text-sm dark:text-white leading-none">{item.count}</span>
                                    <button
                                        onClick={() => onUpdateQty(item.id, 1)}
                                        className="w-7 h-7 flex items-center justify-center bg-white dark:bg-indigo-600 rounded-lg shadow-sm text-gray-600 dark:text-white active:scale-90 transition-transform"
                                    >
                                        <Plus size={14} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-[72px] left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-40">

                {/* Receipt summary box */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[20px] p-4 mb-4 space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 font-bold text-[13px]">Mahsulotlar ({cartItems.length} ta):</span>
                        <span className="text-gray-700 dark:text-gray-300 font-bold text-[14px]">{oldTotal.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm</span>
                    </div>
                    {savings > 0 && (
                        <div className="flex justify-between items-center">
                            <span className="text-green-500 font-bold text-[13px]">Chegirma:</span>
                            <span className="text-green-500 font-bold text-[14px]">- {savings.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm</span>
                        </div>
                    )}
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-2 block"></div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-gray-900 dark:text-white font-black text-[18px]">Jami:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-black text-[22px] tracking-tight">{total.toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-xs uppercase text-gray-500 tracking-wider">so'm</span></span>
                    </div>
                </div>

                <button
                    onClick={onCheckout}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 min-h-[56px] rounded-[20px] font-black tracking-wide text-[16px] shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-[0.98] transition-all flex items-center justify-center"
                >
                    Buyurtmaga O'tish
                </button>
            </div>
        </div>
    );
};

export default Cart;
