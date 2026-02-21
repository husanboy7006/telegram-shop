import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, ChevronLeft } from 'lucide-react';

const Checkout = ({ cart, products, onSubmit, onBack }) => {
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle -> loading -> success
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus first input automatically
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const validate = () => {
        const newErrors = {};
        if (formData.name.trim().length < 3) newErrors.name = "Ism kamida 3 ta harfdan iborat bo'lishi kerak";
        if (!formData.phone.match(/^\+?[0-9\s-]{9,15}$/)) newErrors.phone = "Raqamni to'g'ri kiriting (+998...)";
        if (formData.address.trim().length < 10) newErrors.address = "Manzilni aniqroq kiriting (tuman, ko'cha)";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
            }
            return;
        }

        setStatus('loading');

        // Simulate real network wait
        setTimeout(() => {
            setStatus('success');
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }

            setTimeout(() => {
                onSubmit(formData);
            }, 1200);
        }, 1500);
    };

    const isFormValid = formData.name && formData.phone && formData.address;

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-500 w-12 h-12" />
                    </div>
                </motion.div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Buyurtma Qabul Qilindi!</h2>
                <p className="text-gray-500 font-medium">Tez orada siz bilan bog'lanamiz.</p>
            </div>
        );
    }

    return (
        <div className="pt-8 px-4 pb-10 min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">

            {/* Mini custom header for checkout specifically */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-800 dark:text-white active:scale-95">
                    <ChevronLeft size={20} />
                </button>
                <h2 className="text-2xl font-black tracking-tight dark:text-white">Ariza To'ldirish</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] shadow-sm dark:shadow-none space-y-6 border border-gray-100 dark:border-gray-800">

                    <div className="relative">
                        <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 px-1">Qabul Qiluvchi Ismi</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={formData.name}
                            onChange={e => { setFormData({ ...formData, name: e.target.value }); if (errors.name) validate(); }}
                            className={`w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 font-bold text-[16px] rounded-[16px] outline-none transition-all border-2 ${errors.name ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'}`}
                            placeholder="Familiya va Ism"
                        />
                        {errors.name && <p className="text-red-500 text-xs font-bold mt-2 px-2">{errors.name}</p>}
                    </div>

                    <div className="relative">
                        <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 px-1">Bog'lanish uchun tel raqam</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={e => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) validate(); }}
                            className={`w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 font-bold text-[16px] tracking-wide rounded-[16px] outline-none transition-all border-2 ${errors.phone ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'}`}
                            placeholder="+998"
                        />
                        {errors.phone && <p className="text-red-500 text-xs font-bold mt-2 px-2">{errors.phone}</p>}
                    </div>

                    <div className="relative">
                        <label className="block text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 px-1">To'liq Yetkazish Manzili</label>
                        <textarea
                            rows={3}
                            value={formData.address}
                            onChange={e => { setFormData({ ...formData, address: e.target.value }); if (errors.address) validate(); }}
                            className={`w-full p-4 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 font-bold text-[16px] rounded-[16px] outline-none transition-all resize-none border-2 ${errors.address ? 'border-red-400 focus:border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-900'}`}
                            placeholder="Viloyat, tuman, mahalla, uy raqami va qo'shimcha mo'ljal..."
                        />
                        {errors.address && <p className="text-red-500 text-xs font-bold mt-2 px-2">{errors.address}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={status === 'loading' || !isFormValid}
                    className={`w-full py-4 mt-2 rounded-[20px] font-black tracking-wide text-[16px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${(!isFormValid || status === 'loading')
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/30 dark:shadow-green-900/40'
                        }`}
                >
                    {status === 'loading' ? <Loader2 className="animate-spin" size={24} /> : "Buyurtmani Tasdiqlash"}
                </button>
            </form>
        </div>
    );
};

export default Checkout;
