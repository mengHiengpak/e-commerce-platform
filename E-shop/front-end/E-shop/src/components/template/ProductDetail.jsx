import {useEffect, useState} from 'react'
import { FaPaypal, FaStar, FaMinus, FaPlus, FaShieldAlt, FaUndo, FaTruck } from 'react-icons/fa'
import { useLanguage } from '../hook/LanguageContext'
import {useProductById} from "../hook/useProductById.js";
import {useCategory} from "../hook/useCategory.js";
import {Link, useParams} from "react-router-dom";
import {apiUrlBase} from "../../config/env.js";
import {useCustomerStoreProduct} from "../hook/useCustomerStoreProduct.js";
import useCurrent from "../hook/Auth/useCurrent.js";

function ProductDetail() {
    const { id } = useParams()
    const { products, refetch } = useProductById('product', id)
    const { category } = useCategory()
    const [categories, setCategories] = useState([])

    useEffect(() => {
        category().then(res => {
            setCategories(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
        }).catch(() => {})
    }, [])

    const doc = products?.result?.doc
    const categoryId = doc?.category?._id || doc?.category
    const categoryName = categories.find(c => c._id === categoryId)?.name || doc?.category?.name || ''

    const [quantity, setQuantity] = useState(1);
    const { t } = useLanguage();

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const { sale, loading } = useCustomerStoreProduct()
    const { data: customer } = useCurrent()

    const salePrice = Number(products?.result?.doc?.salePrice || 0)
    const totalprice = quantity * salePrice

    const handleSubmit = async (e) => {
        e.preventDefault()
        const customerstore = {
            customer: customer?._id,
            items: [
                {
                    product: id,
                    quantity: quantity,
                    uniPrice: salePrice,
                    totalPrice: totalprice
                }
            ],
            totalCost: totalprice,
        }
        await sale(customerstore)
        refetch()
    }


    return (
        <div className="bg-white min-h-screen py-8 sm:py-12 px-4 font-semibold">
            <div className="max-w-7xl mx-auto">
                <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 sm:mb-8 flex-wrap">
                    <Link to="/" className="hover:text-orange-600 transition-colors">{t('home')}</Link>
                    <span>&gt;</span>
                    <Link to="/products" className="hover:text-orange-600 transition-colors">{categoryName || t('all_category')}</Link>
                    <span>&gt;</span>
                    <span className="text-gray-900 font-medium truncate">{products?.result?.doc?.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
                    <div className="relative group bg-gray-50 rounded-3xl overflow-hidden p-8 aspect-square flex items-center justify-center border border-gray-100">
                        <img
                            src={`${apiUrlBase}/uploads/${products?.result?.doc?.imageUrl}`}
                            alt="Product"
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">{categoryName || t('all_category')}</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full">{t('best_seller')}</span>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl font-black text-[#1A1D20] leading-tight">
                                {products?.result?.doc?.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <FaStar />
                                    <span className="text-gray-900 font-bold text-sm ml-1">4.8</span>
                                    <span className="text-gray-400 text-sm ml-1">· 2,341 {t('reviews_label')}</span>
                                </div>
                                <div>
                                    {Number(products?.result?.doc?.currentstock) === 0 ? (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                        {t('out_of_stock')}
                                    </div>
                                    ) : (
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-600 rounded-md text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                        {t('in_stock')}
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 py-4 border-y border-gray-100">
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-3xl sm:text-4xl font-black text-[#1A1D20]">{`${Number(products?.result?.doc?.costPrice || 0).toFixed(2)}៛`}</span>
                                <span className="text-lg sm:text-xl text-gray-400 line-through">{`${Number(products?.result?.doc?.salePrice || 0).toFixed(2)}៛`}</span>
                                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-xs font-bold">-30%</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaPaypal className="text-blue-600" />
                                <span>{t('or_payments')} <span className="font-bold text-gray-900">$70.00</span> with Klarna / Afterpay</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 w-fit">
                                <label className="text-sm font-bold text-gray-700">{t('quantity')}</label>
                                <div className="inline-flex items-center justify-between w-32 px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                                    >
                                        <FaMinus className="w-3 h-3" />
                                    </button>
                                    <span className="text-base font-bold text-gray-900">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        <FaPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-[#1A1D20] text-white font-bold rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200">
                                    {loading ? t('loading') : t('add_to_cart')}
                                </button>
                                <Link to={`/account/${id}/method`} className="flex-1 text-center py-4 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-200">
                                    {t('buy_now')}
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaShieldAlt className="text-orange-600" />
                                <span className="text-xs font-bold text-gray-600">{t('secure_checkout')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaUndo className="text-orange-600" />
                                <span className="text-xs font-bold text-gray-600">{t('easy_returns_badge')}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaTruck className="text-orange-600" />
                                <span className="text-xs font-bold text-gray-600">{t('free_shipping_badge')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail
