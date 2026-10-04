import React, { useState } from 'react'
import { AiFillHome } from 'react-icons/ai'
import { FaBoxOpen, FaCashRegister, FaHandshake, FaShoppingCart, FaUserFriends } from 'react-icons/fa'
import { GoChevronDown } from 'react-icons/go'
import { HiDocumentReport } from 'react-icons/hi'
import { LuLayoutGrid } from 'react-icons/lu'
import { MdPerson } from 'react-icons/md'
import { TbActivityHeartbeat } from 'react-icons/tb'
import { NavLink } from 'react-router'

function Slidebar(props) {
    const {isShowSlidebar, onClose} = props
    const [isToggleOpen, setIsToggleOpen] = useState(false)
    const [isReportToggleOpen, setIsReportToggleOpen] = useState(false)

    const widthClass = isShowSlidebar
        ? 'w-72 max-w-[85vw] lg:w-3xs lg:max-w-none'
        : 'w-0 max-w-0'

  return (
    <>
    <div
        inert={!isShowSlidebar}
        className={`${widthClass} shrink-0 overflow-hidden h-screen bg-gray-600 transition-all duration-300 flex flex-col fixed inset-y-0 left-0 z-50 lg:relative`}
    >
        <h1 className='h-16 shrink-0 flex items-center justify-center text-xl font-bold text-nowrap mt-3 mb-3 text-white'>E-Shop</h1>
        <ul className='p-2 space-y-2 mb-5 flex-1 overflow-y-auto overscroll-contain'>
            <li>
                <NavLink
                to='/'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <AiFillHome/> </span>
                <span>Home</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                to='/customer'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <FaUserFriends/> </span>
                <span>Customer</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                to='/supplier'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <FaHandshake/> </span>
                <span>Supplier</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                to='/category'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <LuLayoutGrid /> </span>
                <span>Category</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                to='/products'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <FaBoxOpen/> </span>
                <span>Product</span>
                </NavLink>
            </li>

            <li>
                <NavLink
                to='/purchase'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <FaShoppingCart/> </span>
                <span>Purchase</span>
                </NavLink>
            </li>

            <li
            className='mb-3 p-3 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
            >
                <button onClick={() => setIsToggleOpen(!isToggleOpen)} className='flex w-full items-center justify-between btn-neutral '>
                        <div className='flex gap-2 items-center'>
                            <FaCashRegister />
                            <span>Sale</span>
                        </div>

                        <div  className={`${isToggleOpen ? 'rotate-180' : ''} transition-all duration-300 `}>
                                <GoChevronDown />
                        </div>
                </button>
            </li>

            <li>
                <ul className={`p-2 ml-2 mr-2 bg-gray-300 rounded-md ${isToggleOpen ? 'block aria-[current=page]:bg-black' : 'hidden'}`}>
                    <li>
                        <NavLink
                        to="/sale/list"
                        className="rounded-md w-full aria-[current=page]:font-bold"
                        >
                            <div className='flex items-center gap-2 text-sm'>
                                <TbActivityHeartbeat />
                                <span>List Price</span>
                            </div>
                        </NavLink>
                    </li>
                </ul>

                  <ul className={`p-2 mt-2 ml-2 mr-2 bg-gray-300 rounded-md ${isToggleOpen ? 'block aria-[current=page]:bg-black' : 'hidden'}`}>
                    <li>
                        <NavLink
                        to="/sale/POS"
                        className="rounded-md w-full aria-[current=page]:font-bold"
                        >
                            <div className='flex items-center gap-2 text-sm'>
                                <TbActivityHeartbeat />
                                <span>POS</span>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </li>

                        <li>
                <NavLink
                to='/user'
                className='mb-3 p-3 flex items-center gap-2 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
                >
                <span> <MdPerson/> </span>
                <span>User</span>
                </NavLink>
            </li>

            <li
            className='mb-3 p-3 hover:bg-base-200 transition-all duration-300 rounded-md w-full aria-[current=page]:bg-neutral aria-[current=page]:text-white'
            >
                <button onClick={() => setIsReportToggleOpen(!isReportToggleOpen)} className='flex w-full items-center justify-between btn-neutral '>
                        <div className='flex items-center'>
                            <HiDocumentReport />
                            <span>Report</span>
                        </div>

                        <div  className={`${isReportToggleOpen ? 'rotate-180' : ''} transition-all duration-300 `}>
                                <GoChevronDown />
                        </div>
                </button>
            </li>

            <li>
                <ul className={`p-2 ml-2 mr-2 bg-gray-300 rounded-md ${isReportToggleOpen ? 'block aria-[current=page]:bg-black' : 'hidden'}`}>
                    <li>
                        <NavLink
                        to="/sale/report"
                        className="rounded-md w-full aria-[current=page]:font-bold"
                        >
                            <div className='flex items-center gap-2 text-sm'>
                                <TbActivityHeartbeat />
                                <span>Sale Report</span>
                            </div>
                        </NavLink>
                    </li>
                </ul>

                  <ul className={`p-2 mt-2 ml-2 mr-2 bg-gray-300 rounded-md ${isReportToggleOpen ? 'block aria-[current=page]:bg-black' : 'hidden'}`}>
                    <li>
                        <NavLink
                        to="/stock/report"
                        className="rounded-md w-full aria-[current=page]:font-bold"
                        >
                            <div className='flex items-center gap-2 text-sm'>
                                <TbActivityHeartbeat />
                                <span>Stock Report</span>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </li>

        </ul>
    </div>

    {isShowSlidebar && (
        <div
            onClick={onClose}
            className='fixed inset-0 z-40 bg-black/50 lg:hidden'
            aria-hidden='true'
        />
    )}
    </>
  )
}


export default Slidebar
