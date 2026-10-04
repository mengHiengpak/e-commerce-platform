import React, { useState } from 'react'
import { Link } from 'react-router'
import { useCollection } from '../../hook/useCollection'
import toast from 'react-hot-toast'

function CreateCustomer() {

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")
    const [isLoading, creates] = useCollection('customers')


    const handlerSubmite = async (e) => {
         e.preventDefault()
         const data = {
            name,
            phone,
            email,
            address,
            note
         }
         console.log(data)
         const res = await creates(data)
         if(res) {
            toast.success("inseted data is successfully!")
            setName("")
            setPhone("")
            setEmail("")
            setAddress("")
            setNote("")
         }
    }

  return (
    <>
        <h1 className='text-xl font-semibold'>Create New Customer</h1>

        <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
            <form onSubmit={handlerSubmite} action="">
                <div className='mb-3'>
                    <label htmlFor="" className='block mb-2'>Name*</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input w-full' placeholder='Emter Name' required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='block mb-2'>Phone*</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className='input w-full' placeholder='Emter Phone' required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='block mb-2'>Email*</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='input w-full' placeholder='Emter Email' required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='block mb-2'>Address*</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className='input w-full' placeholder='Emter Address' required/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="" className='block mb-2'>Note*</label>
                    <input value={note} onChange={(e) => setNote(e.target.value)} className='textarea w-full' placeholder='Emter Note' />
                </div>

                <div className='mb-3 flex items-center justify-end gap-4'>
                    <Link to="/customer">Back</Link>
                    <button disabled={isLoading} className='btn btn-neutral'>Save</button>
                </div>
            </form>
        </div>
    </>
  )
}

export default CreateCustomer