import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../hook/LanguageContext'
import {useSignin} from "../hook/Auth/useSignin.js";

function Signin() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const { t } = useLanguage()
const navigate = useNavigate()
const location = useLocation()
const { signin, isLoading, error } = useSignin()

// The page that sent us here before the customer was signed in.
const from = location.state?.from
const redirectTo = from?.pathname
  ? `${from.pathname}${from.search || ''}`
  : '/'

const handleSubmit = async (e) => {
  e.preventDefault() 

  try {
    const res = await signin(email, password)

    if (res?.success) {
      navigate(redirectTo, { replace: true }) 
    }
  } catch (err) {
    console.error('Sign in failed:', err)
  }
}

  return (

    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4 font-semibold text-slate-800">
      <div className="w-full max-w-md rounded-xl border border-slate-300 bg-white p-8 shadow-md">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="text-3xl font-normal tracking-wide text-slate-900 w-full">
            <div className="flex-shrink-0 flex justify-center gap-0.5 group">
              <span className="tracking-tight" >{t('Sign_In')}</span>
              <span className="w-2 h-2 rounded-full bg-[#FF5243] mb-1.5 group-hover:scale-125 transition-transform" />
            </div>
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest text-slate-500">
            {t('ACCESS_YOUR_ACCOUNT')}
          </p>
          <div className="mx-auto mt-4 h-px w-12 bg-amber-700"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 ">
          
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

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                {t('PASSWORD')}
              </label>
              <Link to="/forgot" state={location.state} className="text-xs text-amber-800 hover:underline">
                {t('Forgot')}
              </Link>
            </div>
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

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 py-2.5 px-4 text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full border rounded-xl border-slate-900 bg-slate-900 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-200 hover:bg-slate-800 hover:shadow-sm active:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-slate-900"
          >
            {isLoading ? t('LOADING') : t('SIGN_IN')}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-500">
          {t('Need_an_account')} {' '}
          <Link to="/signup" state={location.state} className="font-semibold text-slate-900 hover:underline">
            {t('Register_here')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Signin