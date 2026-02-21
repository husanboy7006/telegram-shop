import { X, ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductModal = ({ product, isOpen, onClose, onAdd }) => {
    if (!product) return null;

    const discountPercent = product.oldPrice
        ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
        : 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/60 backdrop-blur-sm"
                    />

                    {/* Bottom Sheet Modal */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-gray-900 rounded-t-[32px] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl"
                    >
                        {/* Handle Bar */}
                        <div className="w-full flex justify-center py-3 bg-white dark:bg-gray-900 absolute top-0 z-10" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        </div>

                        <div className="overflow-y-auto pb-[100px] pt-8 bg-gray-50 dark:bg-gray-950">
                            {/* Image Gallery area */}
                            <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-800">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white active:scale-90 transition-transform"
                                >
                                    <X size={20} />
                                </button>

                                {discountPercent > 0 && (
                                    <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-[16px] font-black text-lg shadow-lg">
                                        -{discountPercent}%
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-900 -mt-6 rounded-t-[32px] relative z-10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">{product.category}</span>
                                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg">
                                        <Star className="fill-yellow-500 text-yellow-500" size={14} />
                                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{product.rating}</span>
                                    </div>
                                </div>

                                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4">{product.name}</h2>

                                <div className="flex flex-col mb-6">
                                    {product.oldPrice && (
                                        <span className="text-sm font-bold text-gray-400 line-through mb-1">
                                            {product.oldPrice.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                                        </span>
                                    )}
                                    <span className="text-3xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
                                        {product.price.toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-lg font-bold text-gray-500">so'm</span>
                                    </span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Mahsulot haqida</h3>
                                    <p className="text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                                        {product.description || "Ushbu mahsulot haqida batafsil ma'lumot tez orada qo'shiladi."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Kafolatlangan<br />Sifat</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center">
                                            <Truck size={20} />
                                        </div>
                                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tezkor<br />Yetkazish</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Bottom Action Bar inside Modal */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom,16px)]">
                            <button
                                onClick={() => {
                                    onAdd(product);
                                    onClose();
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-14 rounded-[20px] font-black text-[17px] shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingCart size={20} />
                                Savatga Qo'shish
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProductModal;
