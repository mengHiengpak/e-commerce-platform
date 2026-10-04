import React, {useState} from 'react'
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from "../hook/Auth/useCurrent.js";
import {useCustomerStore} from "../hook/useCustomerStore.js";
import {useProduct} from "../hook/useProduct.js";
import {apiUrlBase} from "../../config/env.js";
import {useDeleteCustomerStoreById} from "../hook/useDeleteCustomerStoreById.js";
import {Link} from "react-router-dom";

function ProductStore({open, closeOpen}) {
    const { t } = useLanguage()
    const { data: customer } = useCurrent()
    const { data, isLoading, refetch } = useCustomerStore(customer?._id)
    const { data: allProducts } = useProduct()
    const { remove, loading } = useDeleteCustomerStoreById()



    const [quantities, setQuantities] = useState({})
    const [removed, setRemoved] = useState([])

    const stored = (data?.products || [])
        .filter(p => !removed.includes(p.storeId ?? p._id))
        .map((p, index) => {
            const productId = p.productId ?? p.product ?? p._id
            const productDetail = allProducts?.find(pp => pp._id === productId)
            const unitPrice = Number(p.unitPrice ?? p.uniPrice ?? productDetail?.salePrice ?? 0)
            const id = p.storeId ?? p._id ?? index
            return {
                ...p,
                id,
                productId,
                productName: p.productName ?? p.name ?? productDetail?.name ?? 'Product',
                invoiceNumber: p.invoiceNumber ?? id,
                unitPrice,
                imageUrl: p.imageUrl ?? productDetail?.imageUrl ?? '',
                quantity: quantities[id] ?? Number(p.purchasedQuantity ?? p.quantity ?? 1)
            }
        })

    const adjust = (id, delta) => {
        setQuantities(prev => {
            const item = stored.find(c => c.id === id)
            const current = prev[id] ?? item?.quantity ?? 1
            return { ...prev, [id]: Math.max(1, current + delta) }
        })
    }

    const handleRemove = async (storeId) => {
        if (!storeId) return
        await remove(storeId)
        setRemoved(prev => [...prev, storeId])
        refetch()
    }

    const subtotal = stored.reduce((sum, it) => sum + Number(it.unitPrice || 0) * it.quantity, 0)

    return (
        <div className={`fixed inset-0 z-[999] flex items-end justify-end bg-black/40 backdrop-blur-sm transition-all duration-300 ${open ? 'visible' : 'invisible'}`}>
            <div onClick={closeOpen} className="absolute inset-0" />
            <div className={`relative flex h-full w-full max-w-md flex-col bg-[#FAF9F7] shadow-2xl ${open ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-b border-gray-200 bg-white px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400">Cart</p>
                            <h2 className="font-serif text-xl font-semibold text-gray-900">{t('title_storing')}</h2>
                        </div>
                        <button
                            onClick={closeOpen}
                            className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-200 bg-white px-6 py-3">
                    <p className="text-xs font-medium text-[#8A6D3B]">{t('disount_store_title')}</p>
                </div>

                <div className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
                    {isLoading && (
                        <div className="py-10 text-center text-sm text-gray-500">{t('loading')}</div>
                    )}

                    {!isLoading && stored.length === 0 && (
                        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
                            <div className="grid h-16 w-16 place-items-center rounded-full border border-gray-200 bg-white text-gray-400">
                                <FaShoppingCart className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-serif text-base font-semibold text-gray-900">{t('status_storing')}</h3>
                                <p className="mt-1 text-sm text-gray-500">{t('add_storing')}</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && stored.length > 0 && (
                        <ul className="divide-y divide-gray-200">
                            {stored.map((item, index) => (
                                <li key={item.id || item.storeId || index} className="py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-serif text-[15px] font-semibold text-gray-900">
                                                {item.productName}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-400">#{item.invoiceNumber}</p>
                                            <p className="mt-2 text-base font-semibold text-gray-900">
                                                ៛{Number(item.unitPrice || 0).toFixed(2)}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(item.storeId ?? item.id)}
                                            disabled={loading}
                                            title="Remove"
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                                        >
                                            <FaTrashAlt className="text-sm" />
                                        </button>
                                    </div>

                                    {item.imageUrl && (
                                        <img
                                            src={`${apiUrlBase}/uploads/${item.imageUrl}`}
                                            alt={item.productName}
                                            className="mt-4 h-16 w-16 rounded-lg object-contain bg-gray-100"
                                        />
                                    )}

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="inline-flex items-center rounded-full border border-gray-300 bg-white">
                                            <button
                                                type="button"
                                                onClick={() => adjust(item.storeId ?? item.id, -1)}
                                                className="grid h-9 w-9 place-items-center text-gray-600 transition-colors hover:text-gray-900"
                                            >
                                                −
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold text-gray-900">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => adjust(item.storeId ?? item.id, 1)}
                                                className="grid h-9 w-9 place-items-center text-gray-600 transition-colors hover:text-gray-900"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[11px] uppercase tracking-wider text-gray-400">Line Total</p>
                                            <p className="font-serif text-lg font-semibold text-gray-900">
                                                ${(Number(item.unitPrice || 0) * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {!isLoading && stored.length > 0 && (
                    <div className="border-t border-gray-200 bg-white px-6 py-5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm uppercase tracking-wider text-gray-500">Subtotal</span>
                            <span className="font-serif text-2xl font-semibold text-gray-900">៛{subtotal.toFixed(2)}</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-400">Tax and shipping calculated at checkout.</p>

                        <Link
                            to={`/account/${customer?._id}/methodProductStore`}
                            onClick={closeOpen}
                            className="mt-4 block w-full rounded-md bg-gray-900 py-3.5 text-center text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#8A6D3B]"
                        >
                            View Cart &amp; Checkout · ៛{subtotal.toFixed(2)}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductStore