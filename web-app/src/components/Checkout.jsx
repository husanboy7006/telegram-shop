import { useState } from 'react';

const Checkout = ({ cart, products, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="pt-24 px-4 pb-10 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Ma'lumotlar</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm space-y-5 dark:border dark:border-gray-800">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ms-2">Ism-familiya</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 text-[15px] rounded-[16px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent dark:border-gray-700"
                            placeholder="Ismingizni kiriting"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ms-2">Telefon raqam</label>
                        <input
                            required
                            type="tel"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 text-[15px] rounded-[16px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-transparent dark:border-gray-700"
                            placeholder="+998 90 123 45 67"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ms-2">Manzil</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 text-[15px] rounded-[16px] outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none border border-transparent dark:border-gray-700"
                            placeholder="Viloyat, tuman, ko'cha, uy raqami..."
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 mt-2 rounded-2xl font-bold text-[17px] shadow-lg shadow-green-200 dark:shadow-green-900/30 active:scale-[0.98] transition-all"
                >
                    Tasdiqlash
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="w-full bg-transparent text-gray-500 dark:text-gray-400 py-3 font-semibold hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    Ortga qaytish
                </button>
            </form>
        </div>
    );
};

export default Checkout;
