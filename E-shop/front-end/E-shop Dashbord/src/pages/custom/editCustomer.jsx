import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useCollection } from '../../hook/useCollection'
import toast from 'react-hot-toast'
import { useFindById } from '../../hook/useFindById'

function EditCustomer() {

    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [address, setAddress] = useState("")
    const [note, setNote] = useState("")
    const [isLoading, , updates] = useCollection('customers')
    const route = useParams()
    const { data: customer, isLoading: isFinding } = useFindById('customers', route.id)

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
        const res = await updates(route.id, data)
        if (res) {
            toast.success("updated data is successfully!")
            setName("")
            setPhone("")
            setEmail("")
            setAddress("")
            setNote("")
        }
    }

    useEffect(() => {
        if (customer && !isFinding) {
            setName(customer?.name || "")
            setPhone(customer?.phone || "")
            setEmail(customer?.email || "")
            setAddress(customer?.address || "")
            setNote(customer?.note || "")
        }
    }, [customer, isFinding])

    return (
        <>
            <h1 className='text-xl font-semibold'>Edit Customer</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
                <form onSubmit={handlerSubmite} action="">
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
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Note*</label>
                        <input value={note} onChange={(e) => setNote(e.target.value)} className='textarea w-full' placeholder='Enter Note' />
                    </div>

                    <div className='mb-3 flex items-center justify-end gap-4'>
                        <Link to="/customer">Back</Link>
                        <button disabled={isLoading} className='btn btn-neutral'>Update</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditCustomer