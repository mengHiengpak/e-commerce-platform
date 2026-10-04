import { FiCreditCard, FiStar, FiPlus } from 'react-icons/fi'
import { useLanguage } from '../hook/LanguageContext'
import {Link} from "react-router-dom";
import useCurrent from "../hook/Auth/useCurrent.js";
import {useEffect, useState} from "react";

function Wallets() {
  const { t } = useLanguage()
  const {isLoading, data: customer, refetch: fetchData} = useCurrent()
  const [amount, setAmount] = useState([])

  useEffect(() => {
    fetchData().then(res => {
      setAmount(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [])
    }).catch(() => {})
  }, [])

  console.log(customer)


  return (
    <div className="w-full text-gray-800 pt-6 md:pt-22">
      <div className="flex items-end justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl text-[#1A1D20] tracking-tight">{t('wallet_payment')}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{t('manage_balance')}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl p-5 text-white shadow-md shadow-orange-200">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-orange-100">
            <span>{t('available_balance')}</span>
          </div>
          <h1 className="relative z-10 text-4xl font-black tracking-tight mt-1">{`៛ ${customer?.walletBalance}`}</h1>

          <div className="relative z-10 mt-4 pt-4 border-t border-white/20 flex items-end justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                <FiStar className="text-sm" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-100">{t('reward_points')}</span>
                <span className="text-sm font-black">1,240 pts</span>
              </div>
            </div>
            <Link to="/account/wallets/account/walltes" className="px-4 py-2 bg-white text-orange-600 text-sm font-bold rounded-full hover:bg-orange-50 transition-all duration-300 shadow active:scale-95">
              {t('add_funds')}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
          <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm text-[#1A1D20]">{t('saved_payment')}</h3>
          </div>
          <ul>
            {customer?.wallet?.map((item, index) =>
                    item?.status === 'paid' ? (
                        <li key={item?.id || index} className="flex items-center justify-between px-5 py-3.5 group">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-red-50 text-red-600 rounded-lg text-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                              <FiCreditCard className="text-sm" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-gray-900">{item?.fromAccountId || 'null'}</span>
                              <span className="text-xs text-gray-500">Expires 12/28</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                              <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                  {t('default_label')}
                              </span>
                          </div>
                        </li>
                    ) : (<div></div>)
                )}
          </ul>
        </div>

        <Link to="/account/wallets/account/walltes" className="inline-flex justify-center items-center gap-1.5 border border-dashed border-gray-200 text-gray-600 py-2 w-full bg-white text-sm font-semibold rounded-full hover:border-orange-600 hover:text-orange-600 transition-all active:scale-95">
          <FiPlus />
          {t('add_new_payment')}
        </Link>
      </div>
    </div>
  )
}

export default Wallets
