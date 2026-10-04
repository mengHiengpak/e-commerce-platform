import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import { useLanguage } from '../components/hook/LanguageContext'
import { useCategory } from '../components/hook/useCategory.js'
import { useProduct } from '../components/hook/useProduct.js'
import { useCustomerStoreProduct } from '../components/hook/useCustomerStoreProduct.js'
import useCurrent from '../components/hook/Auth/useCurrent.js'
import { apiUrlBase } from '../config/env.js'

function Product() {
    const { t } = useLanguage()
    const { isLoading, error, data: products } = useProduct()
    const { sale, loading } = useCustomerStoreProduct()
    const { data: customer } = useCurrent()
    const { category } = useCategory()
    const [categories, setCategories] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const activeCategory = searchParams.get('category') || 'all'
    const keyword = (searchParams.get('search') || '').trim().toLowerCase()
    const setActiveCategory = (cat) => {
        const params = new URLSearchParams(searchParams)
        if (cat === 'all') params.delete('category')
        else params.set('category', cat)
        setSearchParams(params)
    }

    useEffect(() => {
        category().then(res => {
            setCategories(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
        }).catch(() => {})
    }, [])

    const filtered = products.filter(p => {
        const catOk = activeCategory === 'all' || p.category?._id === activeCategory || p.category === activeCategory
        const kwOk = !keyword
            || (p.name || '').toLowerCase().includes(keyword)
            || (p.code || '').toLowerCase().includes(keyword)
        return catOk && kwOk
    })

const discount = (product) => {
        const cost = Number(product.costPrice)
        const sale = Number(product.salePrice)
        if (!cost || !sale || cost <= sale) return null
        return `-${Math.round((1 - sale / cost) * 100)}%`
    }

    const addToStore = async (e, product) => {
        e.preventDefault()
        e.stopPropagation()
        const totalPrice = Number(product.salePrice) || 0
        await sale({
            customer: customer?._id,
            items: [
                {
                    product: product._id,
                    quantity: 1,
                    uniPrice: totalPrice,
                    totalPrice
                }
            ],
            totalCost: totalPrice,
        })
    }



    return (
        <div className="bg-white min-h-screen py-8 sm:py-12 px-4">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-90 mb-4 lg:mb-5">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black text-[#1A1D20] tracking-tight whitespace-nowrap">{t('featured_products')}</h1>
                    <p className="text-gray-500 font-medium">{t('products_found', { count: filtered.length })}</p>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1 max-w-full">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`shrink-0 py-2 px-6 font-bold rounded-full transition-all active:scale-95 ${activeCategory === 'all' ? 'bg-orange-600 text-white' : 'border border-gray-200 text-gray-600 bg-white font-medium hover:border-orange-600 hover:text-orange-600'}`}
                    >
                        {t('all_btn')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat._id}
                            onClick={() => setActiveCategory(cat._id)}
                            className={`shrink-0 py-2 px-6 rounded-full transition-all active:scale-95 ${activeCategory === cat._id ? 'bg-orange-600 text-white' : 'border border-gray-200 text-gray-600 bg-white font-medium hover:border-orange-600 hover:text-orange-600'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading && <div className="text-center py-10 text-gray-500">{t('loading')}</div>}
            {error && <div className="text-center py-10 text-red-500">{error}</div>}

            <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-8">
                {filtered.map(product => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative cursor-pointer block"
                    >
                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                            {discount(product) && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">{discount(product)}</span>
                            )}
                            <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-gray-100 shadow-sm">
                                {product.category?.name || t('featured_products')}
                            </span>
                        </div>

                        <div className="aspect-square bg-gray-50 overflow-hidden relative p-4 sm:p-8 group-hover:bg-orange-50 transition-colors duration-300">
                            <img
                                src={`${apiUrlBase}/uploads/${product.imageUrl}`}
                                alt={product.name}
                                className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>

                        <div className="p-4 sm:p-6">
                            <p className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{product.category?.name || t('featured_products')}</p>
                            <h3 className="text-sm sm:text-lg font-bold text-[#1A1D20] leading-tight mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                                {product.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mb-2">
                                <div className="flex items-center gap-0.5 text-[10px] sm:text-xs">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < Math.floor(Number(product.rating) || 4.5) ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-gray-500 font-semibold">{(Number(product.rating) || 4.5).toFixed(1)}</span>
                            </div>
                            {product.note && (
                                <p className="text-[10px] sm:text-xs text-gray-500 mb-3 line-clamp-2">{product.note}</p>
                            )}
                            <div className="flex items-end justify-between gap-2 mt-auto">
                                <div className="flex flex-col">
                                    <span className="text-base sm:text-2xl font-black text-[#1A1D20]">
                                        ៛{Number(product.salePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    {Number(product.costPrice) > Number(product.salePrice) && (
                                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                                            ${Number(product.costPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    )}
                                    <span className={`text-[10px] sm:text-xs font-semibold mt-1 ${Number(product.currentstock) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {Number(product.currentstock) > 0 ? `${t('in_stock')}: ${product.currentstock}` : t('out_of_stock')}
                                    </span>
                                </div>
                                <button
                                    onClick={(e) => addToStore(e, product)}
                                    disabled={loading}
                                    className="p-2.5 sm:p-3 bg-[#1A1D20] text-white rounded-xl sm:rounded-2xl hover:bg-orange-600 transition-all active:scale-90 shadow-lg shadow-gray-200 disabled:opacity-40"
                                >
                                    <FaShoppingCart />
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Product