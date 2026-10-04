import React from 'react'
import { FaListUl, FaUserCog, FaUserCheck } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { Link, useNavigate } from 'react-router'
import { TbLogout2 } from 'react-icons/tb'
import { AiOutlineUser } from 'react-icons/ai'
import useSignout from '../../hook/auth/useSignout'
import useCurrent from '../../hook/auth/useCurrent'

function Topmenu(props) {
    const { onShowSidebar, isShowSidebarButton = false } = props
    const {data: user} = useCurrent()
    const { isLoading, signOut } = useSignout()
    const navigate = useNavigate()

    const handlesSignOut = async () => {
        try {
            await signOut()
            navigate('/signin')
        } catch {}
    }

    return (

        <div className='h-16 shrink-0 border-b flex items-center w-full px-3 sm:px-4 gap-2 justify-between'>
            {/*<h1 className='text-lg md:text-xl lg:text-2xl font-bold'>Menghieng POS</h1>*/}
            {isShowSidebarButton && onShowSidebar && (
                <button
                    onClick={onShowSidebar}
                    aria-label='Toggle navigation menu'
                    className='btn btn-ghost btn-sm px-2 shrink-0'
                >
                    <FaListUl />
                </button>
            )}

            <div className='flex items-center gap-1 sm:gap-2 ms-auto'>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-sm flex items-center px-2 sm:px-3">
                        <FaUserCog />
                        <span className='hidden sm:inline'>{user?.username}</span>
                    </div>
                    <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">

                        <li className='border-b border-gray-200 mb-2'>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                <span className=""><MdEmail /></span>
                                <span className="break-all">{user?.email}</span>
                            </a>
                        </li>

                        <li className='gap-2 mb-2'>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                                <span><FaUserCheck /></span>
                                <span>{user?.username}</span>
                            </a>
                        </li>

                        <li type="button" className='gap-2 text-red-600 mb-2'>
                            <button onClick={handlesSignOut}>
                            {
                                isLoading ? (<span className='loading loading-spinner loading-sm'></span>) : (<><span><TbLogout2 /></span><span>Sign out</span></>)
                            }
                        </button>
                        </li>
                    </ul>
                </div>

                <Link to={"/sale/POS"} className='btn btn-neutral btn-sm btn-outline px-2 sm:px-4'>
                    POS
                </Link>

                <div>
                    <button className='flex items-center gap-2 btn btn-neutral btn-sm btn-outline px-2 sm:px-4'>
                        <span className=""><AiOutlineUser /></span>
                        <span className='hidden md:inline'>{user?.role}</span>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Topmenu
