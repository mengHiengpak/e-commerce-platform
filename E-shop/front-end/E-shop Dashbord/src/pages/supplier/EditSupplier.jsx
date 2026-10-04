import React, { useState, useEffect } from 'react'
import { useCollection } from '../../hook/useCollection'
import { useFindById } from '../../hook/useFindById'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import { Link } from 'react-router'

function EditSupplier() {

    const [businessName, setBusinessName] = useState("")
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [isLoading, , updates] = useCollection('supplies')
    const route = useParams()
    const { data: suppliers, isLoading: isFinding } = useFindById('supplies', route.id)

    const handlerSubmite = async (e) => {
        e.preventDefault()
        const data = {
            businessName,
            name,
            phone,
            email,
            address
        }
        console.log(data)
        const res = await updates(route.id, data)
        if (res) {
            toast.success("updated data is successfully!")
        }
    }

    useEffect(() => {
        if (suppliers && !isFinding) {
            setBusinessName(suppliers?.businessName || "")
            setName(suppliers?.name || "")
            setPhone(suppliers?.phone || "")
            setEmail(suppliers?.email || "")
            setAddress(suppliers?.address || "")
        }
    }, [suppliers, isFinding])

    return (
        <>
            <h1 className='text-xl font-semibold'>Edit Supplier</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
                <form onSubmit={handlerSubmite} action="">
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

                    <div className='mb-3 flex items-center justify-end gap-4'>
                        <Link to="/supplier">Back</Link>
                        <button disabled={isLoading} className='btn btn-neutral'>Update</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditSupplier