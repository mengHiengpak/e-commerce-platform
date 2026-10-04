import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useSignIn from '../../hook/auth/useSignIn'

function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { isLoading, Signin } = useSignIn()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await Signin(email, password)
    if (res?.success) {
      if(res?.result?.role == 'admin' || res?.result?.role == 'super') {
        navigate('/')
      }else if(res?.result?.role == 'cashier') {
        navigate('/cashier/pos')
      } else {
        navigate('/unauthorization')
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-stone-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white border-t-4 border-amber-600 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] px-10 py-12"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-semibold text-slate-900 tracking-wide">E-Shop</h2>
          <div className="w-12 h-px bg-amber-600 mx-auto mt-4"></div>
          <p className="text-sm text-stone-500 mt-4 uppercase tracking-widest">Sign in to your account</p>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-widest mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mail@site.com"
            required
            className="w-full bg-transparent border-b border-stone-300 py-2 text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <div className="mb-8">
          <label className="block text-xs font-medium text-slate-700 uppercase tracking-widest mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-transparent border-b border-stone-300 py-2 text-slate-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-white uppercase tracking-widest py-3 hover:bg-amber-600 transition-colors duration-200"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="text-center text-sm mt-6">
          <button type="button" className="text-stone-500 hover:text-slate-900 transition-colors">Forget Password?</button>
        </div>

        <div className="text-center text-sm text-stone-500 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-slate-900 font-medium underline underline-offset-4 hover:text-amber-600 transition-colors">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signin