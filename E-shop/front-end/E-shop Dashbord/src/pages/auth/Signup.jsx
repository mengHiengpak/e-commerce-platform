import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import useSignUp from '../../hook/auth/useSignUp'

function Signup() {
    const [isInvalid, setIsInvalid] = useState(false)
    const {isLoading, signUp} = useSignUp()
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handSubmit = async (e) => {
        e.preventDefault()
        const res = await signUp(name, email, password)
        if(res?.success){
            navigate('/signin')
        }
    }

    return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-6 bg-amber-50 p-4'>
            <img className={`w-24 h-24 shrink-0 shadow-2xl shadow-amber-200 transition-all duration-300 ${isInvalid ? 'scale-105' : 'scale-100'}`} src="/src/assets/user.png" alt="" />
            <form onSubmit={handSubmit} onChange={(e) => setIsInvalid(!e.currentTarget.checkValidity())} className={`w-full max-w-md p-6 text-center bg-amber-200 rounded-xl shadow-[0px_10px_20px_-4px_rgba(0,0,0,0.35)] transition-all duration-300 ${isInvalid ? 'sm:min-h-140' : 'sm:min-h-110'}`}>
                <h2 className='mb-6 mt-3 text-2xl font-bold text-center text-indigo-950'>E-Shop</h2>

                <div className='mb-3 relative items-center'>
                    <label className="input validator">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </g>
                        </svg>
                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Name" required />
                    </label>
                </div>

                <div className='mb-3 relative items-center'>
                    <label className="input validator">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                            </g>
                        </svg>
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder="mail@site.com" required />
                    </label>
                    <div className="validator-hint hidden">Enter valid email address</div>
                </div>

                <div className='mb-3 relative items-center'>
                    <label className="input validator">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                            </g>
                        </svg>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            type="password"
                            required
                            placeholder="Password"
                            minLength="8"
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                            title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        />
                    </label>
                    <p className="validator-hint hidden">
                        Must be more than 8 characters, including
                        <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                    </p>
                </div>

                <button
                    disabled={isLoading}
                    type="submit"
                    className=" mb-2 w-full sm:w-72 btn btn-neutral hover:bg-amber-700 transition-all duration-200 hover:scale-105 transform-gpu will-change-transform">
                    {
                        isLoading ? (<span className='loading loading-spinner loading-sm'></span>) : (<span>Sign Up</span>)
                    }
                </button>
                <div className='text-center mb-4 flex flex-wrap justify-center gap-2 text-indigo-950'>
                    <h6>Already have an account? </h6>
                    <Link to="/signin">Sign In</Link>
                </div>

            </form>
        </div>
    )
}

export default Signup
