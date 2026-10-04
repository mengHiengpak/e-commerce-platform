import { useMemo } from 'react'
import { useLanguage } from '../hook/LanguageContext'
import {useCustomerProduct} from "../hook/customerProduct/useCustomerProduct.js";

function MyOrder() {
  const { t } = useLanguage()
  const {isLoading, error, data} = useCustomerProduct()
  const orders = useMemo(() => {
    if (Array.isArray(data)) return data
    const r = data?.result ?? data
    if (Array.isArray(r)) return r
    if (r && typeof r === 'object') {
      return r.sales || r.orders || r.items || r.products || r.result || []
    }
    return []
  }, [data])

  console.log(orders)

  return (
    <div className="w-full text-gray-800 pt-6 md:pt-22">
      <div className="flex items-center justify-between mb-2 pb-4 ">
        <div>
          <span className="text-lg font-bold text-gray-900 tracking-wide">
            {t('order_history')}
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
          {t('orders_count', { count: orders.length })}
        </span>
      </div>

      {isLoading && <div className="text-sm text-gray-500">{t('loading')}</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      {orders.length === 0 && !isLoading && !error ? (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center text-sm text-gray-500">
          {t('no_orders')}
        </div>
      ) : (
        orders.map((order, index) => (
          <div key={order._id || order.id || index} className="p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-900">{`#eshop-${order.invoiceNumber || order._id}`}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                    {order.status || t('delivered')}
                  </span>
                </div>
                <div className="mt-1.5">
                  <span className="text-sm text-gray-500">{order.createdAt || ''} · {t('items_count', { count: order.purchasedQuantity || order.items?.length || 0 })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">៛{Number(order.totalPrice ?? order.total ?? 0).toFixed(2)}</span>
                <button className="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {t('view_details')}
                </button>
                <button className="px-4 py-2 rounded-full bg-red-500 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                  {t('reorder')}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default MyOrder
