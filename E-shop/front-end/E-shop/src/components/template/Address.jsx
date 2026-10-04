import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiMapPin, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from "../hook/Auth/useCurrent.js";
import AddressAdd from "../assets/AddressAdd.jsx";
import { api } from '../../config/app.js'

function Address() {
  const [isOpenStatus, setOpenStatus] = useState(false);
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const {data, refetch} = useCurrent()
  const { t } = useLanguage()

  const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

  const addresses = data ? [{
    id: data._id || 1,
    label: 'Home',
    name: data.name || '',
    line1: data.address || '',
    line2: data.address || '',
    phone: data.phone || '',
    isDefault: true,
  }] : []

  const openAdd = () => {
    setIsEditing(false)
    setName('')
    setAddress('')
    setPhone('')
    setOpenStatus(true)
  }

  const openEdit = () => {
    setIsEditing(true)
    setName(data?.name || '')
    setAddress(data?.address || '')
    setPhone(data?.phone || '')
    setOpenStatus(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !address || !phone) {
      toast.error('Please fill all fields!')
      return
    }
    setIsSaving(true)
    try {
      await api.put('/customer/me', { name, address, phone })
      toast.success(isEditing ? 'Address updated successfully!' : 'Address added successfully!')
      setOpenStatus(false)
      await refetch()
    } catch (err) {
      const msg = err?.response?.data?.error || 'Server is error!'
      toast.error(msg)
      console.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
      <>

        <AddressAdd
          open={isOpenStatus}
          onClose={() => setOpenStatus(false)}
          title={isEditing ? t('edit') : t('add_new_address')}
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t('full_name')}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t('address')}</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">{t('phone_number')}</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('phone_placeholder')}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="w-full px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? t('LOADING') : t('save_changes')}
            </button>
          </form>
        </AddressAdd>

    <div className="w-full text-gray-800 pt-6 md:pt-[5.5rem]">
      <div className="flex items-center justify-between mb-5 gap-4">
        <div>
          <h1 className="text-xl font-black text-[#1A1D20] tracking-tight">{t('addresses_title')}</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">{t('manage_addresses')}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold">
          {t('saved_count', { count: addresses.length })}
        </span>
      </div>

      <div className="space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-5 group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition-colors flex-shrink-0">
                  <FiMapPin className="text-base" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{addr.label}</span>
                    <span className="text-xs text-gray-500">{addr.name}</span>
                    {addr.isDefault && (
                      <span className="bg-orange-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {t('default')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-snug">
                    {addr.line1}
                    <br />
                    {addr.line2}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{addr.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={openEdit} className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:border-orange-600 hover:text-orange-600 transition-all">
                  <FiEdit2 /> {t('edit')}
                </button>
                {!addr.isDefault && (
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={openAdd} className="mt-5 inline-flex items-center gap-1.5 border border-dashed border-gray-300 text-gray-600 py-2.5 px-5 bg-white text-sm font-semibold rounded-full hover:border-orange-600 hover:text-orange-600 transition-all active:scale-95 w-full justify-center">
        <FiPlus />
        {t('add_new_address')}
      </button>
    </div>
      </>
  )
}

export default Address
