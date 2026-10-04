import React from 'react'
import { IoCloseSharp } from "react-icons/io5";


function Modal({open, onClose, title, children}) {
  return (
    <>
    <div className={`fixed inset-0 flex z-[999] transition-all justify-center items-center backdrop-blur-sm duration-300 p-3 sm:p-5 ${open ? 'visible' : 'invisible'}`}>
        <div className={`bg-white rounded-xl border transition-all duration-300 border-gray-100 shadow-xl p-4 sm:p-6 w-full max-w-[460px] max-h-[90vh] overflow-y-auto relative ${open ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
            <div className='flex justify-between items-start gap-3 sticky top-0 bg-white pt-1 pb-2'>
                <h1 className='font-bold text-lg sm:text-xl break-words'>{title}</h1>
                <div onClick={onClose} className='shrink-0 hover:text-white duration-300 w-5 h-5 rounded-full bg-white text-red-400 hover:bg-red-700 cursor-pointer'>
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

export default Modal
