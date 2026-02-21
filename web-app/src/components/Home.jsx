import Header from './Header';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const Home = ({ products, onAddToCart }) => {
    const popular = [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 transition-colors">
            <Header title="Super Chegirmalar 🎉" showUserName={true} />

            <div className="px-4 mt-6">
                {/* Banner */}
                <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[24px] p-6 text-white shadow-xl shadow-indigo-500/20 mb-8 relative overflow-hidden group">
                    <div className="relative z-10">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Mavsumiy Skidka</span>
                        <h2 className="text-3xl font-black leading-tight mb-2">Barcha<br />Aksessuarlar</h2>
                        <p className="font-semibold text-white/80">-50% gacha arzonlashdi!</p>
                    </div>
                    {/* Decorative circles */}
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute right-12 -top-12 w-24 h-24 bg-purple-400/30 rounded-full blur-xl group-hover:bg-purple-400/50 transition-colors duration-700"></div>
                </div>

                {/* Section */}
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Xit Sotuvlar</h3>
                    <span className="text-sm font-bold text-indigo-500">Barchasi &rarr;</span>
                </div>

                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {popular.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAdd={onAddToCart}
                        />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Home;
