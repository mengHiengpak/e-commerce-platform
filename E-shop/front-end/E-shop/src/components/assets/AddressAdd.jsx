import React from 'react'
import { IoCloseSharp } from "react-icons/io5";

function AddressAdd({open, onClose, title, children}) {
    return (
        <>
            <div className={`fixed inset-0 flex z-[999] transition-all justify-center items-center backdrop-blur-sm duration-300 ${open ? 'visible' : 'invisible'}`}>
                <div className={`bg-white rounded-xl border transition-all duration-300 border-gray-100 shadow-xl p-6 w-full max-w-[460px] mx-4 relative in ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <div className='flex justify-between items-center gap-5'>
                        <h1 className='font-bold text-xl'>{title}</h1>
                        <div onClick={onClose} className='hover:text-white duration-300 w-5 h-5 rounded-full bg-white text-red-400 hover:bg-red-700'>
                            <IoCloseSharp className='text-xl'/>
                        </div>
                    </div>
                    <div className='mt-2'>
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddressAdd