import { Plus, Star } from 'lucide-react';

const ProductCard = ({ product, onAdd }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-[24px] p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out border border-gray-100 dark:border-gray-700/60 flex flex-col h-full group relative">
            <div className="relative w-full h-56 sm:h-48 rounded-[16px] mb-3 overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-gray-100 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                        {product.category}
                    </span>
                </div>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between px-1.5 pb-1">
                <div>
                    <h3 className="text-[15px] font-bold text-gray-800 dark:text-gray-100 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center gap-1.5 mb-3">
                        <Star className="fill-yellow-400 text-yellow-400" size={14} />
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-0.5">{product.rating}</span>
                    </div>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                        {product.oldPrice && (
                            <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 line-through mb-0.5">
                                {product.oldPrice.toLocaleString('uz-UZ').replace(/,/g, ' ')} so'm
                            </span>
                        )}
                        <span className="text-lg font-black text-gray-900 dark:text-white leading-none">
                            {product.price.toLocaleString('uz-UZ').replace(/,/g, ' ')} <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">so'm</span>
                        </span>
                    </div>

                    <button
                        onClick={() => onAdd(product)}
                        className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:dark:bg-indigo-500 hover:text-white dark:hover:text-white hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/40 flex items-center justify-center transition-all duration-300 active:scale-90"
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
