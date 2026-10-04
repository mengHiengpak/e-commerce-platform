import { useState } from "react"

function DeleteCustomer() {
const [formData, setFormData] = useState({})

const handleChange = (e) => {
const {name, value} = e.target
setFormData({...formData, [name]: value})
}

const hanldeSubmit = async (e) => {
e.preventDefault()
}

return (
<div>
  <h1 className='text-xl font-semibold'>Delete Customer</h1>

  <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
    <form onSubmit={hanldeSubmit}>
      <div className='mb-3'>
        <label htmlFor="" className='block mb-2'>Phone Number*</label>
        <input type="text" onChange={handleChange} name='phone' className='input w-full' placeholder='Enter Customer Phone Number' required/>
      </div>

      <div className='mb-3 flex items-center justify-end gap-4'>
        <button type='submit' className='btn btn-neutral'>Delete</button>
      </div>
    </form>
  </div>
</div>
)
}

export default DeleteCustomer
