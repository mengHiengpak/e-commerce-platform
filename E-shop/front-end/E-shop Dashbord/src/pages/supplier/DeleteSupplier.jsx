import { useState } from "react"
import { useCollection } from '../../hook/useCollection'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'

function DeleteSupplier() {
  const [phone, setPhone] = useState("")
  const [, , , remove] = useCollection('supplies')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phone.trim()) return toast.error("Please enter the supplier phone number")
    if (!confirm("Are you sure you want to delete this supplier?")) return
    const res = await remove(phone)
    if (res?.success) {
      toast.success("Supplier deleted successfully!")
      navigate("/supplier")
    } else {
      toast.error(res?.message || "Failed to delete supplier")
    }
  }

  return (
    <div>
      <h1 className='text-xl font-semibold'>Delete Supplier</h1>

      <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='block mb-2'>Phone Number*</label>
            <input type="text" onChange={(e) => setPhone(e.target.value)} name='phone' className='input w-full' placeholder='Enter Supplier Phone Number' required />
          </div>

          <div className='mb-3 flex items-center justify-end gap-4'>
            <Link to="/supplier" className="btn btn-ghost">Cancel</Link>
            <button type='submit' className='btn btn-error'>Delete</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DeleteSupplier