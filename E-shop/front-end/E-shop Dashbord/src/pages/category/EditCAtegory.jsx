import React, { useState, useEffect } from 'react'
import { useCollection } from '../../hook/useCollection'
import { useFindById } from '../../hook/useFindById'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import { Link } from 'react-router'

function EditCategory() {

 const [name, setName] = useState("")
 const [description, setDescription] = useState("")
 const [isLoading, , updates] = useCollection('categories')
 const route = useParams()
 const { data: categories, isLoading: isFinding } = useFindById('categories', route.id)

 const handlerSubmite = async (e) => {
  e.preventDefault()
  const data = {
   name,
   description,

  }
  console.log(data)
  const res = await updates(route.id, data)
  if (res) {
   toast.success("updated data is successfully!")
  }
 }

 useEffect(() => {
  if (categories && !isFinding) {
   setDescription(categories?.description || "")
   setName(categories?.name || "")

  }
 }, [categories, isFinding])

 return (
  <>
   <h1 className='text-xl font-semibold'>Edit Category</h1>

   <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
    <form onSubmit={handlerSubmite} action="">
     <div className='mb-3'>
      <label htmlFor="" className='block mb-2'>Name*</label>
      <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input w-full' placeholder='Enter Name' required />
     </div>
     <div className='mb-3'>
      <label htmlFor="" className='block mb-2'>Description*</label>
      <input value={description} onChange={(e) => setDescription(e.target.value)} type="text" className='input w-full' placeholder='Enter description' required />
     </div>
     <div className='mb-3 flex items-center justify-end gap-4'>
      <Link to="/category">Back</Link>
      <button disabled={isLoading} className='btn btn-neutral'>Update</button>
     </div>
    </form>
   </div>
  </>
 )
}

export default EditCategory
