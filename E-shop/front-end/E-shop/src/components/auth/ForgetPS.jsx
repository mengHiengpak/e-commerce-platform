import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hook/LanguageContext'
import {useForgetPS} from "../hook/Auth/useForgetPS.js";

function ForgetPS() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const {forgetPS, error, isLoading} = useForgetPS()
  const {t} = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await forgetPS({email, password, confirmPassword})
      navigate('/signin', { state: location.state })
    } catch (err) {
      console.log('Reset password in failed:', err)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4 font-semibold text-slate-800">
      <div className="w-full max-w-md rounded-xl border border-slate-300 bg-white p-8 shadow-md">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-3xl font-normal tracking-wide text-slate-900 w-full">
            <div className="flex-shrink-0 flex justify-center gap-0.5 group">
              <span className="tracking-tight">{t('Reset_Password')}</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5243] mb-1.5 group-hover:scale-125 transition-transform" />
            </div>
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
            {t('SET_YOUR_NEW_CREDENTIALS')}
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-amber-700"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs text-red-600 font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              {t('EMAIL_ADDRESS')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border font-sans rounded-xl border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors duration-200 focus:border-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* New Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              {t('NEW_PASSWORD')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border font-sans rounded-xl border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors duration-200 focus:border-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              {t('CONFIRM_PASSWORD')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border font-sans rounded-xl border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder-slate-400 transition-colors duration-200 focus:border-slate-800 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full border rounded-xl border-slate-900 bg-slate-900 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:bg-slate-950 mt-2"
          >
            {t('RESET_PASSWORD')}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          {t('Remember_your_password')}{' '}
          <Link to="/signin" state={location.state} className="font-semibold text-slate-900 hover:underline">
            {t('Login_here')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgetPS