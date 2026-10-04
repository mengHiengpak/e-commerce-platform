import { useNavigate } from 'react-router-dom'
import { BiPackage, BiRefresh, BiSupport } from 'react-icons/bi';
import { FaCheck, FaStar, FaShieldAlt } from 'react-icons/fa';
import { useLanguage } from '../hook/LanguageContext';

function Hero() {
    const navigate = useNavigate();
    const { t } = useLanguage();
    return (
        <>
        <section className="relative overflow-hidden bg-gradient-to-br from-white to-orange-50 py-8 sm:py-16 lg:py-24 font-semibold">
            <div className="max-w-7xl mx-auto px-4 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className="flex flex-col space-y-6">
                        <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-1.5 text-sm text-orange-600 font-medium shadow-sm w-fit">
                            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            {t('hero_badge')}
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#1A1D20] leading-[1.1] tracking-tight">
                                {t('hero_title_1')} <br className="hidden sm:block" />
                                <span className="text-orange-600">{t('hero_title_2')}</span>
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 max-w-lg leading-relaxed">
                                {t('hero_desc')}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 shadow-lg shadow-orange-200 hover:-translate-y-1 active:scale-95 text-center"
                            >
                                {t('shop_now')}
                            </button>
                            <button
                                onClick={() => navigate('/products')}
                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-gray-700 font-bold rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 active:scale-95"
                            >
                                {t('view_deals')}
                            </button>
                        </div>

                        <div className="pt-8 border-t border-gray-200 flex flex-wrap items-center gap-x-8 gap-y-4 sm:gap-10">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-[#1A1D20]">10K+</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wider">{t('products_label')}</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-1">
                                    <span className="text-2xl font-black text-[#1A1D20]">4.9</span>
                                    <FaStar className="text-yellow-400 text-sm" />
                                </div>
                                <span className="text-sm text-gray-500 uppercase tracking-wider">{t('avg_rating')}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-[#1A1D20]">500K+</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wider">{t('customers_label')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src="/poster.avif"
                                alt="Hero Poster"
                                className="w-full h-auto object-cover"
                            />
                        </div>

                        <div className="absolute -top-6 -left-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-50">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <FaStar className="text-yellow-500 text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-gray-900">{t('hero_rating')}</p>
                                <p className="text-xs text-gray-500">{t('hero_reviews')}</p>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-6 z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-50">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <FaCheck className="text-green-600 text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-sm font-bold text-gray-900">{t('hero_free_shipping')}</p>
                                <p className="text-xs text-gray-500">{t('hero_free_shipping_desc')}</p>
                            </div>
                        </div>

                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-200 rounded-full blur-3xl opacity-30" />
                    </div>

                </div>
            </div>
        </section>
        
        <section className="bg-gray-50 py-8 sm:py-12 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 font-semibold">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <BiSupport />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-base">{t('customer_service')}</h3>
                            <p className="text-gray-500 text-xs">{t('customer_service_desc')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <FaShieldAlt />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-base">{t('secure_marketplace')}</h3>
                            <p className="text-gray-500 text-xs">{t('secure_marketplace_desc')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <BiPackage />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-base">{t('free_shipping')}</h3>
                            <p className="text-gray-500 text-xs">{t('free_shipping_desc')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                            <BiRefresh />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-bold text-gray-900 text-base">{t('easy_returns')}</h3>
                            <p className="text-gray-500 text-xs">{t('easy_returns_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}

export default Hero;
