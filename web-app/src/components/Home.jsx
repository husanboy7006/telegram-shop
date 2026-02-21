import { useState, useEffect } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';

const Home = ({ products, onAddToCart, onProductClick }) => {
    const popular = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    const [timeLeft, setTimeLeft] = useState({ hours: 12, mins: 45, secs: 30 });

    // Fake countdown simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, mins, secs } = prev;
                if (secs > 0) secs--;
                else { secs = 59; if (mins > 0) mins--; else { mins = 59; hours--; } }
                return { hours, mins, secs };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28 pt-20 transition-colors">

            <div className="px-4 mt-2">
                {/* PRO Hero Banner */}
                <div className="w-full bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-600 rounded-[32px] p-6 text-white shadow-2xl shadow-indigo-500/30 mb-8 relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col items-start">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-flex items-center gap-1.5 border border-white/20"
                        >
                            <Flame size={12} className="text-orange-400" /> Qaynoq Skidkalar
                        </motion.div>

                        <h2 className="text-3xl sm:text-4xl font-black leading-[1.1] mb-2 tracking-tight">Katta Qishki<br />Sotuvlar</h2>
                        <p className="font-semibold text-white/80 text-sm mb-6">Tanlangan mahsulotlarga -50% gacha</p>

                        {/* Countdown styling */}
                        <div className="flex gap-2 mb-6">
                            <div className="bg-black/30 backdrop-blur-sm rounded-xl w-12 h-12 flex flex-col items-center justify-center border border-white/10">
                                <span className="font-black text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                                <span className="text-[8px] uppercase tracking-wider opacity-70">Soat</span>
                            </div>
                            <div className="text-xl font-bold pt-2 opacity-50">:</div>
                            <div className="bg-black/30 backdrop-blur-sm rounded-xl w-12 h-12 flex flex-col items-center justify-center border border-white/10">
                                <span className="font-black text-lg">{String(timeLeft.mins).padStart(2, '0')}</span>
                                <span className="text-[8px] uppercase tracking-wider opacity-70">Daq</span>
                            </div>
                            <div className="text-xl font-bold pt-2 opacity-50">:</div>
                            <div className="bg-black/30 backdrop-blur-sm rounded-xl w-12 h-12 flex flex-col items-center justify-center border border-white/10">
                                <span className="font-black text-lg">{String(timeLeft.secs).padStart(2, '0')}</span>
                                <span className="text-[8px] uppercase tracking-wider opacity-70">Son</span>
                            </div>
                        </div>

                        <button className="bg-white text-indigo-700 w-full py-3.5 rounded-2xl font-black text-[15px] shadow-xl active:scale-95 transition-transform">
                            Hozir xarid qilish
                        </button>
                    </div>

                    {/* Glowing orbs animated */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-400 rounded-full blur-[60px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="absolute right-10 -top-10 w-32 h-32 bg-indigo-400 rounded-full blur-[50px]"
                    />
                </div>

                {/* Section Header */}
                <div className="flex justify-between items-end mb-5 px-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Xit Sotuvlar</h3>
                    <span className="text-[13px] font-bold text-indigo-500 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full">Barchasi &rarr;</span>
                </div>

                <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                    {popular.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProductCard
                                product={product}
                                onAdd={onAddToCart}
                                onClick={onProductClick}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
