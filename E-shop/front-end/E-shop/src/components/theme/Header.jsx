import { FaEnvelope, FaPhone, FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { LuFacebook, LuInstagram, LuTwitter } from 'react-icons/lu'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../hook/LanguageContext'
import ProductStore from '../assets/ProductStore.jsx'
import {useEffect, useState} from 'react'
import {useCategory} from "../hook/useCategory.js";
import {useCustomerStore} from "../hook/useCustomerStore.js";
import useCurrent from "../hook/Auth/useCurrent.js";

function Header() {
    const {category} = useCategory()
    const [categories, setCategories] = useState([])
    const { data: customer } = useCurrent()
    const { data: storeData} = useCustomerStore(customer?._id)

    const cartTotal = (storeData?.products || [])
        .reduce((sum, it) => sum + Number(it.unitPrice || 0) * Number(it.purchasedQuantity || 1), 0)

    useEffect(() => {
        category().then(res => {
            setCategories(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
        }).catch(() => {})
    }, [])

    const { language, setLanguage, t } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const [query, setQuery] = useState(searchParams.get('search') || '')

    const handleSearch = (e) => {
        e.preventDefault()
        const params = new URLSearchParams(searchParams)
        const q = query.trim()
        if (q) params.set('search', q)
        else params.delete('search')
        navigate(`/products?${params.toString()}`)
    }

    const handleCategory = (e) => {
        const value = e.target.value
        const params = new URLSearchParams(searchParams)
        if (value === 'all') params.delete('category')
        else params.set('category', value)
        navigate(`/products?${params.toString()}`)
    }


    return (
        <div>
            <section className="hidden md:block bg-white border-b border-gray-100 font-semibold">
                <nav className="max-w-7xl mx-auto flex justify-between items-center px-4 py-2 text-xs text-[#5A626A]">
                    <div className="flex items-center gap-3 xl:gap-4">
                        <div className="flex items-center gap-1.5">
                            <FaLocationDot className="text-gray-400" />
                            <span>{t('address')}</span>
                        </div>
                        <div className="w-px h-3 bg-gray-300" />
                        <div className="flex items-center gap-1.5">
                            <FaPhone className="text-gray-400" />
                            <span>0966355105</span>
                        </div>
                        <div className="hidden xl:flex items-center gap-1.5">
                            <FaEnvelope className="text-gray-400" />
                            <span>menghiengpak096@eshop.com</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select className="bg-transparent outline-none cursor-pointer hover:text-black transition-colors">
                            <option>{t('currency_usd')}</option>
                            <option>{t('currency_khmer')}</option>
                        </select>
                        <div className="w-px h-3 bg-gray-300" />
                        <select
                            className="bg-transparent outline-none cursor-pointer hover:text-black transition-colors"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="en">{t('language_english')}</option>
                            <option value="kh">{t('language_khmer')}</option>
                        </select>
                        <div className="hidden lg:flex items-center gap-3">
                            <a href="#" className="hover:text-[#1877F2] transition-colors"><LuFacebook /></a>
                            <a href="#" className="hover:text-[#1DA1F2] transition-colors"><LuTwitter /></a>
                            <a href="#" className="hover:text-[#E4405F] transition-colors"><LuInstagram /></a>
                        </div>
                    </div>
                </nav>
            </section>

            <section className=' shadow-b-sm px-3 py-2 md:p-2 shadow-amber-200 font-semibold'>
                <nav className='max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4 md:gap-5'>

                    <Link to="/" className="flex-shrink-0 ml-3 flex items-center gap-0.5 group">
                        <span className="font-black text-xl sm:text-2xl text-[#1A1D20] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>e-shop</span>
                        <span className="w-2 h-2 rounded-full bg-[#FF5243] mb-0.5 group-hover:scale-125 transition-transform" />
                    </Link>

                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 items-stretch border border-[#E8EAED] rounded-xl overflow-hidden focus-within:border-[#FF5243] focus-within:ring-2 focus-within:ring-[#FFF0ED] transition-all">
                        <select value={searchParams.get('category') || 'all'} onChange={handleCategory} className="flex-shrink-0 px-3 text-sm text-[#5A626A] bg-[#F4F5F7] border-r border-[#E8EAED] outline-none cursor-pointer focus:text-black">
                            <option value="all">All</option>
                            {categories.map((idx) => (
                                <option key={idx._id} value={idx._id}>{idx.name}</option>
                            ))}
                        </select>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 min-w-0 px-4 text-sm outline-none text-[#1A1D20] placeholder:text-[#9CA3AF]"
                            placeholder={t('search_placeholder')}
                        />
                        <button type="submit" className="flex items-center justify-center px-4 sm:px-5 sm:py-3 bg-[#FF5243] text-white hover:bg-[#e03e30] transition-colors">
                            <FaSearch className="w-4 h-4" />
                        </button>
                    </form>

                    <div className='flex items-center gap-3 sm:gap-4'>
                    <div onClick={() => {
                        setIsOpen(true)
                    }} className='flex items-center flex-shrink-0 bg-red-100 rounded-2xl py-1.5 ml-5 px-5 sm:px-3 cursor-pointer hover:bg-red-200 gap-2 sm:gap-3'>
                        <span className='text-xl text-red-500'><FaShoppingCart /></span>
                        <div className='grid grid-cols-1 text-sm'>
                            <span className='hidden sm:block'>{t('my_card')}</span>
                            <span className='font-bold'>{Number(cartTotal || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <Link to="/account" className='flex flex-col flex-shrink-0 items-center text-center hover:bg-gray-300 hover:rounded-xl cursor-pointer py-1 px-2 sm:px-4 sm:py-2.5 hover:text-red-500'>
                        <span ><FaUser /></span>
                        <span className='text-black text-xs hidden sm:block'>{t('accounts')}</span>
                    </Link>
                    </div>
                </nav>

                <form onSubmit={handleSearch} className="md:hidden mt-2 md:mt-3 flex items-stretch border border-[#E8EAED] rounded-xl overflow-hidden focus-within:border-[#FF5243] focus-within:ring-2 focus-within:ring-[#FFF0ED] transition-all">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 min-w-0 px-4 py-3 text-sm outline-none text-[#1A1D20] placeholder:text-[#9CA3AF]"
                        placeholder={t('search_placeholder')}
                    />
                    <button type="submit" className="flex items-center justify-center px-4 sm:px-5 bg-[#FF5243] text-white hover:bg-[#e03e30] transition-colors">
                        <FaSearch className="w-4 h-4" />
                    </button>
                </form>
            </section>


            <section className="bg-orange-600 text-white font-semibold">
                <nav className="max-w-7xl mx-auto flex justify-between items-center px-3 md:px-4 py-2 md:py-3 gap-2">
                    <div className="flex items-center gap-2 md:gap-4 min-w-0">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center gap-2 bg-orange-700 px-2 md:px-3 py-2 rounded-md font-bold text-sm hover:bg-orange-800 transition-all duration-200 shadow-sm flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            <span className="hidden md:inline">{t('all_categories')}</span>
                        </button>
                        <div className='hidden lg:block w-px h-3 bg-orange-500/40' />
                        <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
                            <Link to="/" className="px-3 py-1 rounded-full transition-all duration-200 text-white hover:bg-orange-700 inline-block">{t('all_category')}</Link>
                            <Link to="/products" className="px-3 py-1 rounded-full transition-all duration-200 text-white hover:bg-orange-700 inline-block">{t('product')}</Link>
                            <Link to="/contact" className="px-3 py-1 rounded-full transition-all duration-200 text-white hover:bg-orange-700 inline-block">{t('contact')}</Link>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-sm font-medium">
                        <a href="#" className="px-3 py-1 rounded-full transition-all duration-200 text-white hover:bg-orange-700 inline-block">{t('limit_sale')}</a>
                        <a href="#" className="px-4 py-1 rounded-full transition-all duration-200 bg-white text-orange-600 hover:bg-orange-50 inline-block">{t('best_sale')}</a>
                        <a href="#" className="px-3 py-1 rounded-full transition-all duration-200 text-white hover:bg-orange-700 inline-block">{t('new_arrival')}</a>
                    </div>

                    <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0 justify-end">
                        <Link to="/products" className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-bold text-orange-100 hover:bg-orange-700 transition-all duration-200">{t('limit_sale')}</Link>
                        <Link to="/products" className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-bold bg-white text-orange-600">{t('best_sale')}</Link>
                        <Link to="/products" className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-bold text-orange-100 hover:bg-orange-700 transition-all duration-200">{t('new_arrival')}</Link>
                    </div>
                </nav>
            </section>

            {/* Mobile drawer */}
            <div className={`fixed inset-0 z-[999] md:hidden ${isMenuOpen ? 'visible' : 'invisible'}`} aria-hidden={!isMenuOpen}>
                <div onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-0.5">
                            <span className="font-black text-2xl text-[#1A1D20] tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>e-shop</span>
                            <span className="w-2 h-2 rounded-full bg-[#FF5243] mb-0.5" />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(false)}
                            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Close menu"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            {t('all_category')}
                        </Link>
                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            {t('product')}
                        </Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 rounded-lg text-sm font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            {t('contact')}
                        </Link>

                        <div className="mt-2 mb-1 px-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">{t('all_categories')}</div>
                        {categories.map((cat) => (
                            <Link
                                key={cat._id}
                                to={`/products?category=${cat._id}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                            >
                                {cat.name}
                            </Link>
                        ))}

                        <div className="mt-4 border-t border-gray-100 pt-4 flex flex-col gap-3 px-3">
                            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none">
                                <option>{t('currency_usd')}</option>
                                <option>{t('currency_khmer')}</option>
                            </select>
                            <select
                                className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <option value="en">{t('language_english')}</option>
                                <option value="kh">{t('language_khmer')}</option>
                            </select>
                            <div className="flex items-center gap-3 pt-2">
                                <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[#1877F2] hover:bg-gray-100 transition-colors"><LuFacebook /></a>
                                <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[#1DA1F2] hover:bg-gray-100 transition-colors"><LuTwitter /></a>
                                <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[#E4405F] hover:bg-gray-100 transition-colors"><LuInstagram /></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ProductStore
            open={isOpen}
            closeOpen={() => setIsOpen(false)}
            />
        </div>
    )
}

export default Header