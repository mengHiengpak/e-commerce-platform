import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLanguage } from '../hook/LanguageContext'
import useCurrent from "../hook/Auth/useCurrent.js";
import { api } from '../../config/app.js'

const inputClass = "w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 rounded-lg outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-gray-700 mb-1.5">{children}</label>
  )
}

function AccountDetail() {
  const { data } = useCurrent()
  const { t } = useLanguage()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!data) return
    const [first = '', ...rest] = String(data.name || '').trim().split(/\s+/)
    setFirstName(first)
    setLastName(rest.join(' '))
    setEmail(data.email || '')
    setPhone(data.phone || '')
  }, [data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await api.put('/customer/me', {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
      })
      toast.success(res?.data?.message || 'Updated successfully!')
    } catch (err) {
      const msg = err?.response?.data?.error || 'Server is error!'
      toast.error(msg)
      console.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form className="w-full text-gray-800 pt-6 md:pt-22" onSubmit={handleSubmit}>
      <div className="mb-6 pb-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('account_details_title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('keep_info_current')}</p>
      </div>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">{t('personal_information')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <FieldLabel htmlFor="first-name">{t('first_name')}</FieldLabel>
            <input
              id="first-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t('first_name_placeholder')}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="last-name">{t('last_name')}</FieldLabel>
            <input
              id="last-name"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t('last_name_placeholder')}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="email">{t('email_label')}</FieldLabel>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_detail_placeholder')}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="phone">{t('phone_number')}</FieldLabel>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone_placeholder')}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mt-6">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5">{t('change_password')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
          <div>
            <FieldLabel htmlFor="current-password">{t('current_password')}</FieldLabel>
            <input
              id="current-password"
              type="password"
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel htmlFor="new-password">{t('new_password')}</FieldLabel>
            <input
              id="new-password"
              type="password"
              required
              minLength="8"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">
          {t('password_hint')}
        </p>
      </section>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t('cancel')}
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? t('LOADING') : t('save_changes')}
        </button>
      </div>
    </form>
  )
}

export default AccountDetail