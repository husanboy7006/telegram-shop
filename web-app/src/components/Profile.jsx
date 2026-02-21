import { ChevronRight, Package, Search, Heart, MapPin, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import Header from './Header';

const Profile = () => {
    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const firstName = tgUser?.first_name || 'Foydalanuvchi';
    const username = tgUser?.username || '';
    const photoUrl = tgUser?.photo_url;

    const menuGroups = [
        {
            title: "Buyurtmalar va Kuzatuv",
            items: [
                { icon: Package, label: "Mening buyurtmalarim", value: "3 aktiv" },
                { icon: Heart, label: "Saqlangan mahsulotlar", value: "" },
            ]
        },
        {
            title: "Sozlamalar",
            items: [
                { icon: MapPin, label: "Yetkazib berish manzili", value: "" },
                { icon: CreditCard, label: "To'lov usullari", value: "" },
            ]
        },
        {
            title: "Yordam",
            items: [
                { icon: HelpCircle, label: "Mijozlarni qo'llab-quvvatlash", value: "" },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 transition-colors">
            <Header title="Profil" />

            {/* User Info Card */}
            <div className="px-4 mt-6 mb-6">
                <div className="bg-white dark:bg-gray-900 p-5 rounded-[24px] shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-indigo-400 to-purple-500 p-0.5">
                        {photoUrl ? (
                            <img src={photoUrl} alt={firstName} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" />
                        ) : (
                            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-indigo-500">
                                {firstName.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{firstName}</h2>
                        {username && <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">@{username}</p>}
                    </div>
                </div>
            </div>

            {/* Menus */}
            <div className="px-4 space-y-6">
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        <h3 className="text-[12px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 ms-2">{group.title}</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-[20px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                            {group.items.map((item, idj) => (
                                <button
                                    key={idj}
                                    className={`w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:bg-gray-100 dark:active:bg-gray-800 ${idj !== group.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800/50' : ''}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                                            <item.icon size={18} strokeWidth={2.5} />
                                        </div>
                                        <span className="font-semibold text-[15px] text-gray-800 dark:text-gray-200">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                                        {item.value && <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">{item.value}</span>}
                                        <ChevronRight size={18} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
