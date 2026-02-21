import { useState } from 'react';
import { Plus, Star, Check, Loader2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAdd, onClick }) => {
    const [status, setStatus] = useState('idle'); // idle | loading | success

    const handleAdd = (e) => {
        e.stopPropagation(); // Prevent opening modal when clicking add
        if (status !== 'idle') return;
        setStatus('loading');

        setTimeout(() => {
            onAdd(product);
            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
            }, 1500);
        }, 400);
    };

    const discountPercent = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => onClick && onClick(product)}
            className="bg-white dark:bg-gray-900 rounded-[24px] p-2.5 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] border border-gray-100 dark:border-gray-800 flex flex-col h-full group relative cursor-pointer"
        >
            <div className="relative w-full h-48 sm:h-56 rounded-[18px] mb-3 overflow-hidden bg-gray-50/50 dark:bg-gray-800/50">
                <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5">
                    {product.isTop && (
                        <span className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                            <Zap size={10} className="fill-white" /> Xit sotuv
                        </span>
                    )}
                    {product.isNew && !product.isTop && (
                        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                            Yangi
                        </span>
                    )}
                    {discountPercent > 0 && (
                        <span className="bg-black/80 dark:bg-white/90 backdrop-blur-md text-white dark:text-black text-[10px] font-black tracking-wider px-2.5 py-1.5 rounded-full shadow-sm">
                            -{discountPercent}%
                        </span>
                    )}
                </div>

                {/* Category badge - bottom right of image */}
                <div className="absolute bottom-2.5 right-2.5 z-10">
                    <span className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md text-gray-800 dark:text-gray-200 text-[9px] font-bold px-2 py-1 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                        {product.category}
                    </span>
                </div>

                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between px-2 pb-1.5">
                <div>
                    <div className="flex items-center gap-1 mb-1.5">
                        <Star className="fill-yellow-400 text-yellow-400" size={13} />
                        <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mt-0.5">{product.rating}</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-gray-800 dark:text-gray-100 leading-snug mb-2 line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                        {product.oldPrice && (
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 line-through mb-0.5">
                                {product.oldPrice.toLocaleString('uz-UZ').replace(/,/g, ' ')}
                            </span>
                        )}
                        <span className="text-[17px] font-black tracking-tight text-indigo-600 dark:text-indigo-400 leading-none">
                            {product.price.toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 tracking-normal">so'm</span>
                        </span>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={status !== 'idle'}
                        className={`w-[38px] h-[38px] rounded-[14px] flex items-center justify-center transition-all duration-300 active:scale-90 ${status === 'success'
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 shadow-lg shadow-gray-900/20 dark:shadow-white/10'
                            }`}
                    >
                        {status === 'idle' && <Plus size={18} strokeWidth={3} />}
                        {status === 'loading' && <Loader2 size={16} strokeWidth={3} className="animate-spin" />}
                        {status === 'success' && <Check size={16} strokeWidth={4} className="animate-in zoom-in" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
