import {
  FiShoppingBag,
  FiCreditCard,
  FiMapPin,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hook/LanguageContext'
import useSignout from '../hook/Auth/useSignout.js'
import useCurrent from '../hook/Auth/useCurrent.js'

function SlidbarProfile() {
  const { t } = useLanguage()
  const { data: currentUser } = useCurrent()
  const { isLoading, signOut } = useSignout()
  const navigate = useNavigate()


  const navItems = [
    { labelKey: 'my_orders', icon: <FiShoppingBag />, to: 'orderplace' },
    { labelKey: 'wallet', icon: <FiCreditCard />, to: 'wallets' },
    { labelKey: 'addresses', icon: <FiMapPin />, to: 'address' },
    { labelKey: 'account_detail', icon: <FiSettings />, to: '/account/detail' },
  ]

  const handlesSignOut = async () => {
    try {
      await signOut()
      navigate('/signin')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  return (
      <>
        <div className="mb-5">
        <span className="text-3xl text-black font-bold tracking-wider">
          {t('my_profile')}
        </span>
        </div>

        <div className="flex flex-col w-64 bg-white border border-gray-300 p-5 text-gray-700 shadow-sm shadow-gray-400 rounded-xl">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-4 transition-all hover:bg-gray-100 cursor-pointer group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm group-hover:scale-105 transition-transform">
              {String(currentUser?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentUser?.name || 'Customer'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200" />

          <div className="flex flex-col gap-1 mt-2">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-indigo-50 hover:text-indigo-600 group"
                >
              <span className="text-lg text-gray-400 group-hover:text-indigo-600 transition-colors">
                {item.icon}
              </span>
                  <span>{t(item.labelKey)}</span>
                </Link>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
                onClick={handlesSignOut}
                disabled={isLoading}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 transition-colors hover:bg-red-50 group disabled:cursor-not-allowed disabled:opacity-50"
            >
            <span className="text-lg text-red-400 group-hover:text-red-600 transition-colors">
              <FiLogOut />
            </span>
              <span>{t('log_out')}</span>
            </button>
          </div>
        </div>
      </>
  )
}

export default SlidbarProfile