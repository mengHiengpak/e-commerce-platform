import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaLock, FaCheck, FaArrowLeft } from 'react-icons/fa'
import { useProductById } from './hook/useProductById.js'
import useCurrent from './hook/Auth/useCurrent.js'
import { useCustomerStoreProduct } from './hook/useCustomerStoreProduct.js'
import { apiUrlBase } from '../config/env.js'
import {usePayment} from "./hook/payments/usePayment.js";

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors duration-200 focus:border-slate-800 focus:bg-white'

function Field({ icon: Icon, label, name, type = 'text', placeholder, value, onChange, required = true }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Icon className="h-4 w-4" />
        </span>
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={inputClass}
        />
      </div>
    </div>
  )
}

function BuyMethod() {
  const { id } = useParams()
  const { products } = useProductById('product', id)
  const { data: customer } = useCurrent()
  const { sale, loading } = useCustomerStoreProduct()
  const { payment, loading: paymentLoading } = usePayment()

  const doc = products?.result?.doc
  const price = Number(doc?.salePrice || 0)

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '' })

  useEffect(() => {
    if (!customer) return
    setForm((f) => ({
      name: f.name || customer.name || '',
      phone: f.phone || customer.phone || '',
      email: f.email || customer.email || '',
      address: f.address || customer.address || '',
    }))
  }, [customer])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customer || !price) return
    const customerstore = {
      customer: customer?._id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      items: [{ product: id, quantity: 1, uniPrice: price, totalPrice: price }],
      totalCost: price,
    }
    const created = await sale(customerstore)
    const storeId = created?.result?.customerStore?._id || created?.result?._id || created?._id
    if (storeId) await payment(storeId, { paidAmount: price })
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl mt-6 sm:mt-15">
        <Link
          to={`/product/${id}`}
          className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          Back to product
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Order Summary</h2>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {doc?.imageUrl && (
                      <img
                        src={`${apiUrlBase}/uploads/${doc.imageUrl}`}
                        alt={doc?.name}
                        className="h-14 w-14 rounded-xl border border-slate-100 bg-slate-50 object-contain p-1"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{doc?.name || 'Product'}</p>
                      <p className="text-xs text-slate-400">Qty × 1</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total</span>
                    <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
                  Payment is taken from your wallet balance.
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 border-b border-slate-100 pb-5">
                <h1 className="text-xl font-bold text-slate-900">Form Information</h1>
                <p className="mt-1 text-sm text-slate-500">Enter your delivery details to complete the purchase.</p>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  icon={FaUser}
                  name="name"
                  label="Name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                <Field
                  icon={FaPhoneAlt}
                  name="phone"
                  label="Phone"
                  type="tel"
                  placeholder="012 345 678"
                  value={form.phone}
                  onChange={handleChange}
                />
                <div className="sm:col-span-2">
                  <Field
                    icon={FaEnvelope}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="name@gmail.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    icon={FaMapMarkerAlt}
                    name="address"
                    label="Address"
                    placeholder="Street, City"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <FaLock className="text-slate-400" /> Secured payment
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaCheck className="text-emerald-500" /> Bank transfer / ABA
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FaCheck className="text-emerald-500" /> Cancel anytime
                </span>
              </div>

              <button
                  type="submit"
                  disabled={loading || paymentLoading}
                  className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading || paymentLoading ? 'Processing...' : `Pay $${price.toFixed(2)}`}
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuyMethod