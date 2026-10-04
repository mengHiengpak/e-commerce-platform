import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useCollection } from '../../hook/useCollection'
import toast from 'react-hot-toast';

function DeleteUser() {
    const [id, setId] = useState("")
    const [, , , remove] = useCollection('users');
    const navigate = useNavigate();

    const handleSubmite = async (e) => {
        e.preventDefault()
        if(!id.trim()) return toast.error("please enter the user ID");
        if(!confirm("are your sure you want to delete this User")) return;
        const res = await remove(id);
        if(res?.success) {
            toast.success("user is delete successfully!");
            navigate("/users");
        } else {
            toast.error(res?.message || "faild to delete User ")
        }
    }
  return (
    <div>
        <h1 className='text-xl font-semibold'>Delete User</h1>

        <div className='max-w-lg bg-white p-3 rounded-md mt-4 '>
            <form onSubmit={handleSubmite}>
                <div className="mb-3">
                    <label className='block mb-2'>Category ID**</label>
                    <input type="text"
                    name="id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className='input w-full'
                    placeholder='Enter User ID'
                    required
                    />
                </div>

                <div className="mb-3 flex items-center justify-end gap-4">
                    <Link to={"/user"} className='btn btn-ghost '>
                        Cancel
                    </Link>

                    <button type="submit" className="btn btn-error">
                        Delete
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default DeleteUser