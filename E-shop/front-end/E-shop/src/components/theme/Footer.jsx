import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { useLanguage } from '../hook/LanguageContext'

function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="bg-[#1A1D20] text-gray-300 pt-10 sm:pt-16 pb-6 mt-5 sm:pb-8 font-semibold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 pb-8 sm:pb-12 border-b border-gray-800">
                <div className="max-w-md text-center md:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('stay_in_loop')}</h2>
                    <p className="text-sm text-gray-400">{t('stay_in_loop_desc')}</p>
                </div>
                <div className="flex w-full max-w-md flex-col sm:flex-row gap-2">
                    <input
                        type="email"
                        placeholder={t('email_input_placeholder')}
                        className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none focus:border-orange-500 transition-colors"
                    />
                    <button className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all active:scale-95">
                        {t('subscribe')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 sm:gap-x-10 py-8 sm:py-12">
                <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                    <button className="flex items-center gap-1 w-fit group">
                        <span className="font-black text-2xl text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>e-shop</span>
                        <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-125 transition-transform" />
                    </button>
                    <p className="text-sm leading-relaxed text-gray-400">
                        {t('footer_brand_desc')}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                        {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, i) => (
                            <a key={i} href="#" className="p-2 bg-gray-800 rounded-full hover:bg-orange-600 hover:text-white transition-all text-gray-400">
                                <Icon className="text-sm" />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-base">{t('company')}</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">{t('about_us')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('careers')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('press')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('blog')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('contact_footer')}</a></li>
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <h3 className="text-white font-bold text-base">{t('support')}</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">{t('help_center')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('track_order')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('returns')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('warranty')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('community')}</a></li>
                    </ul>
                </div>

                <div className="col-span-2 lg:col-span-1 flex flex-col gap-3">
                    <h3 className="text-white font-bold text-base">{t('legal')}</h3>
                    <ul className="flex flex-col gap-2 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">{t('privacy_policy')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('terms_of_use')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('cookie_settings')}</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">{t('accessibility')}</a></li>
                    </ul>
                </div>
            </div>

            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-xs text-gray-500 text-center md:text-left">
                    {t('all_rights', { year: new Date().getFullYear() })}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-end">
                    {['VISA', 'MasterCard', 'AMEX', 'PayPal', 'Google Pay', 'Apple Pay'].map(method => (
                        <span key={method} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-gray-400 cursor-default transition-colors">
                            {method}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer