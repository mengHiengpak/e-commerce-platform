import React, { useState } from 'react'
import { useCollection } from '../../hook/useCollection'
import toast from 'react-hot-toast'
import { Link } from 'react-router'

function CreateSupplier() {

    const [businessName, setBusinessName] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [isLoading, creates] = useCollection('supplies')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = {
            businessName,
            name,
            phone,
            email,
            address
        }
        console.log(data)
        const res = await creates(data)
        if (res) {
            toast.success("Supplier created successfully!")
            setBusinessName("")
            setName("")
            setPhone("")
            setEmail("")
            setAddress("")
        }
    }

    return (
        <>
            <h1 className='text-xl font-semibold'>Create New Supplier</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
                <form onSubmit={handleSubmit} action="">
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Business Name*</label>
                        <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} type="text" className='input w-full' placeholder='Enter Business Name' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Name*</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input w-full' placeholder='Enter Name' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Phone*</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className='input w-full' placeholder='Enter Phone' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Email*</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" className='input w-full' placeholder='Enter Email' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Address*</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className='input w-full' placeholder='Enter Address' required />
                    </div>

                    <div  className='mb-3 flex items-center justify-end gap-4'>
                        <Link to="/supplier">Back</Link>
                        <button disabled={isLoading} className='btn btn-neutral'>Save</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateSupplier