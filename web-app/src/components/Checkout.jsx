import { useState } from 'react';

const Checkout = ({ cart, products, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="pt-20 px-4 pb-10 min-h-screen bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Buyurtmani rasmiylashtirish</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ismingiz</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Ismingizni kiriting"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Telefon</label>
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="+998 90 123 45 67"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Manzil</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            placeholder="Aniq manzilingiz"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 active:scale-95 transition-transform"
                >
                    Tasdiqlash
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="w-full bg-transparent text-gray-500 py-4 font-medium"
                >
                    Orqaga qaytish
                </button>
            </form>
        </div>
    );
};

export default Checkout;
