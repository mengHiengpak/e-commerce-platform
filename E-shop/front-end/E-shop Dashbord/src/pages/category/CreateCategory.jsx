import React, { useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { useCollection } from '../../hook/useCollection'

function CreateCategory() {

    const [description, setDescription] = useState("")
    const [name, setName] = useState("")
    const [isLoading, creates] = useCollection('categories')

    const handleSubmit = async (e) => {
         e.preventDefault()
         const data = {
            name,
            description
         }
         console.log(data)
         const res = await creates(data)
         if(res?.success) {
            toast.success("inseted data is successfully!")
            setName("")
            setDescription("")
         }
    }

  return (
    <>
            <h1 className='text-xl font-semibold'>Create New Category</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
                <form onSubmit={handleSubmit} action="">
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Name*</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input w-full' placeholder='Enter Name' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Description*</label>
                        <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className='input w-full' placeholder='Enter Description'  />
                    </div>
                    <div className='mb-3 flex items-center justify-end gap-4'>
                        <Link to="/category">Back</Link>
                        <button disabled={isLoading} type="submit" className="btn btn-neutral">Save</button>
                    </div>
                </form>
            </div>
        </>
  )
}

export default CreateCategory