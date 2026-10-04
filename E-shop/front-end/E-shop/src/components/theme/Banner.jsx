import { FaTruck, FaTag } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hook/LanguageContext'

function Banner() {
    const { t } = useLanguage()
    return (
        <div className="w-full px-4 py-0 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-15 ">
            <div className="flex-1 relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl px-6 sm:px-10 md:px-12 py-6 md:py-12 text-white shadow-xl shadow-orange-200 group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            <FaTruck className="text-xs" />
                            {t('limited_time')}
                        </div>
                        <h2 className="text-xl font-black leading-tight mb-2">
                            {t('free_shipping_title')} <br className="hidden md:block" />
                            <span className="text-orange-100">{t('free_shipping_subtitle')}</span>
                        </h2>
                        <Link to="/products" className="mt-6 inline-block font-medium underline underline-offset-4 hover:opacity-80">
                            {t('shop_now_link')}
                        </Link>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="text-8xl opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                            📦
                        </div>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl" />
            </div>

            <div className="flex-1 relative overflow-hidden bg-[#1A1D20] rounded-3xl px-6 sm:px-10 md:px-12 py-6 md:py-12 text-white shadow-xl group">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-orange-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            <FaTag className="text-xs" />
                            {t('clearance_event')}
                        </div>
                        <h2 className="text-xl font-black leading-tight mb-2">
                            {t('black_friday')} <br className="hidden md:block" />
                            <span className="text-orange-500">{t('black_friday_discount')}</span>
                        </h2>
                        <Link to="/products" className="mt-6 inline-block font-medium underline underline-offset-4 hover:opacity-80">
                            {t('browse_deals')}
                        </Link>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="text-8xl opacity-20 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                            ⚡
                        </div>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gray-700/20 rounded-full blur-3xl" />
            </div>
        </div>
    )
}

export default Banner
