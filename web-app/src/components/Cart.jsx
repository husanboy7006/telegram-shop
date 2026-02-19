import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = ({ cart, products, onUpdateQty, onCheckout }) => {
    const cartItems = Object.entries(cart).map(([id, count]) => {
        const product = products.find(p => p.id == id);
        return { ...product, count };
    }).filter(item => item.count > 0);

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.count), 0);

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <p>Savatingiz bo'sh</p>
            </div>
        );
    }

    return (
        <div className="pt-20 px-4 pb-24">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Savat</h2>

            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex-shrink-0" />

                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                                {item.price.toLocaleString('uz-UZ').replace(/,/g, ' ')}so'm
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
                            <button
                                onClick={() => onUpdateQty(item.id, -1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-90 transition-transform"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold w-4 text-center">{item.count}</span>
                            <button
                                onClick={() => onUpdateQty(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 active:scale-90 transition-transform"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 rounded-t-3xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 font-medium">Jami:</span>
                    <span className="text-xl font-bold text-gray-900">
                        {total.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                    </span>
                </div>

                <button
                    onClick={onCheckout}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
                >
                    Buyurtma berish
                </button>
            </div>
        </div>
    );
};

export default Cart;
