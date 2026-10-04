import { useEffect, useState } from "react"
import { useFindById } from "../../hook/useFindById"
import { Link, useParams } from "react-router"
import { useCollection } from "../../hook/useCollection"
import useCurrent from "../../hook/auth/useCurrent"


function EditUser() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("")
    const route = useParams()
    const {data: result} = useFindById('users', route.id)
    const [isLoading, , updates] = useCollection('users')
    const { data: currentUser } = useCurrent()

    useEffect(() => {
            if (result) {
                setUsername(result?.userResponse?.username)
                setEmail(result?.userResponse?.email)
                setPassword(result?.userResponse?.password)
                setRole(result?.userResponse?.role)
            }
        }, [result])
    
    const handlerSubmite = async (e) => {
        e.preventDefault()
        const data = {
            username,
            email,
            password,
            role
        }
        await updates(route.id, data)
    }


    return (
        <>
            <h1 className='text-xl font-semibold'>Edit User</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4'>
                <form onSubmit={handlerSubmite}>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Username*</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" className='input w-full' placeholder='Enter Name' />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Email*</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='input w-full' placeholder='Enter Email'  />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Password*</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input w-full' placeholder='Enter Password'  />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Role*</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className='select w-full'>
                            <option value="cashier">cashier</option>
                            {
                                currentUser?.role === "super" && (<option value="admin">admin</option>)
                            }
                        </select>
                    </div>

                    <div className='mb-3 flex items-center justify-end gap-4'>
                        <Link to="/user">Back</Link>
                        <button disabled={isLoading} className='btn btn-neutral'>{isLoading ? 'Saving...' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default EditUser