import { Plus } from 'lucide-react';

const ProductCard = ({ product, onAdd }) => {
    return (
        <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all active:scale-95 border border-gray-100 flex flex-col h-full">
            <div className="w-full aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center text-gray-300 relative overflow-hidden group">
                {/* Placeholder for image */}
                <span className="text-xs font-medium">No Image</span>
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{product.category}</span>
                    <h3 className="text-sm font-semibold text-gray-800 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-bold text-gray-900">
                        {product.price.toLocaleString('uz-UZ').replace(/,/g, ' ')}
                    </span>
                    <button
                        onClick={() => onAdd(product.id)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-90 transition-transform hover:bg-indigo-700"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
