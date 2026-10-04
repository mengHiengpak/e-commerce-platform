import { FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import { useLanguage } from '../components/hook/LanguageContext'

function FieldLabel({ children }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{children}</label>
  )
}

const inputClass =
  'w-full px-4 py-3 text-sm bg-white border border-gray-300 rounded-xl outline-none transition-colors placeholder:text-gray-400 focus:border-orange-600 focus:ring-2 focus:ring-orange-100'

function Contact() {
  const { t } = useLanguage()

  const contactItems = [
    {
      label: t('visit_our_store'),
      line1: t('store_address_1'),
      line2: t('store_address_2'),
      icon: <FaLocationDot className="text-lg" />,
    },
    {
      label: t('call_us'),
      line1: '096 635 5105',
      line2: t('call_hours'),
      icon: <FaPhone className="text-lg" />,
    },
    {
      label: t('email_us'),
      line1: 'menghiengpak096@eshop.com',
      line2: t('email_reply'),
      icon: <FaEnvelope className="text-lg" />,
    },
    {
      label: t('business_hours'),
      line1: t('business_hours_1'),
      line2: t('business_hours_2'),
      icon: <FaClock className="text-lg" />,
    },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    e.target.reset()
    toast.success(t('send_message_success'))
  }

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12 px-4 font-semibold">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-[#1A1D20] tracking-tight">{t('contact_us')}</h1>
          <p className="text-gray-500 font-medium mt-2">
            {t('contact_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-2xl group-hover:bg-red-600 group-hover:text-white transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-bold text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-600 font-medium">{item.line1}</p>
                  <p className="text-xs text-gray-400">{item.line2}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
            <h2 className="text-lg font-bold text-[#1A1D20] mb-1">{t('send_us_message')}</h2>
            <p className="text-sm text-gray-500 mb-6">{t('send_message_desc')}</p>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={handleSubmit}>
              <div>
                <FieldLabel>{t('full_name')}</FieldLabel>
                <input type="text" required placeholder={t('full_name_placeholder')} className={inputClass} />
              </div>
              <div>
                <FieldLabel>{t('email_address')}</FieldLabel>
                <input type="email" required placeholder={t('email_placeholder')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{t('subject')}</FieldLabel>
                <input type="text" required placeholder={t('subject_placeholder')} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>{t('message')}</FieldLabel>
                <textarea
                  required
                  rows="5"
                  placeholder={t('message_placeholder')}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all duration-300 shadow-lg shadow-orange-200 hover:-translate-y-0.5 active:scale-95"
                >
                  {t('send_message_btn')}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-[#1A1D20]">{t('find_us_map')}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{t('map_address')}</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-full hover:border-orange-600 hover:text-orange-600 transition-all">
              <FaLocationDot className="text-sm" />
              {t('edit')}
            </button>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3911.4147715197696!2d104.8914528751785!3d11.377391347821204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDIyJzM4LjYiTiAxMDTCsDUzJzM4LjUiRQ!5e0!3m2!1sen!2skh!4v1789481584990!5m2!1sen!2skh"
            title="Store location"
            className="w-full h-64 md:h-[380px]"
            height="380"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </div>
  )
}

export default Contact
