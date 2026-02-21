import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

const Catalog = ({ products, onAddToCart }) => {
    const [activeCategory, setActiveCategory] = useState('Barchasi');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [isSortOpen, setIsSortOpen] = useState(false);

    const categories = ["Barchasi", ...Array.from(new Set(products.map(p => p.category)))];

    let filtered = products.filter(p => {
        const matchCat = activeCategory === 'Barchasi' || p.category === activeCategory;
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    filtered = filtered.sort((a, b) => {
        if (sortBy === 'popular') return b.popularity - a.popularity;
        if (sortBy === 'new') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
    });

    const getSortLabel = () => {
        if (sortBy === 'popular') return 'Eng mashhur';
        if (sortBy === 'new') return 'Yangi';
        if (sortBy === 'price_asc') return 'Arzon';
        if (sortBy === 'price_desc') return 'Qimmat';
        return 'Saralash';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 transition-colors">
            <Header title="Katalog" />

            <div className="px-4 mt-2 sticky top-[72px] z-40 bg-gray-50/90 dark:bg-gray-950/90 backdrop-blur-xl py-3 border-b border-transparent dark:border-transparent">
                {/* Search & Sort */}
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Search size={18} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Mahsulotlarni izlash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-[15px] rounded-[16px] py-3.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm dark:text-white"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 h-full px-4 rounded-[16px] flex items-center gap-2 text-sm font-bold shadow-sm active:scale-95 transition-all"
                        >
                            <span className="hidden sm:inline">{getSortLabel()}</span>
                            <span className="sm:hidden">Saralash</span>
                            <ChevronDown size={18} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isSortOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsSortOpen(false)} />
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-900 rounded-[20px] shadow-2xl border border-gray-100 dark:border-gray-800 py-2 overflow-hidden z-20 origin-top-right"
                                    >
                                        {['popular', 'new', 'price_asc', 'price_desc'].map(sortKey => (
                                            <button
                                                key={sortKey}
                                                onClick={() => { setSortBy(sortKey); setIsSortOpen(false); }}
                                                className={`w-full text-left px-5 py-3 text-[14px] transition-colors ${sortBy === sortKey ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-gray-800' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            >
                                                {sortKey === 'popular' ? 'Eng mashhur' : sortKey === 'new' ? 'Eng yangi' : sortKey === 'price_asc' ? 'Narx (Arzon → Qimmat)' : 'Narx (Qimmat → Arzon)'}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Categories Horizontal Scroll */}
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 -mx-4 px-4">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 active:scale-95 ${activeCategory === category
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 dark:shadow-indigo-900/40 transform scale-105'
                                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 mt-4">
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {filtered.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAdd={onAddToCart}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filtered.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center text-gray-500 dark:text-gray-400 py-20 flex flex-col items-center"
                    >
                        <Search className="w-14 h-14 text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="font-semibold text-lg">Hech nima topilmadi</p>
                        <p className="text-sm mt-1">Boshqa so'z bilan izlab ko'ring</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Catalog;
