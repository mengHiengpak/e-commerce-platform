import { useState } from "react"
import { Link } from "react-router"
import { useSignUp } from "../../hook/auth/useSignUp"
import useCurrent from "../../hook/auth/useCurrent"

function CreateUser() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("cashier")
    const { isLoading, signUp } = useSignUp()
    const { data: currentUser } = useCurrent()

    const handlerSubmite = async (e) => {
        e.preventDefault()
        const res = await signUp(name, email, password, role)
        if (res) {
            setName("")
            setEmail("")
            setPassword("")
            setRole("cashier")
        }
    }

    return (
        <>
            <h1 className='text-xl font-semibold'>New User</h1>

            <div className='max-w-lg bg-white p-3 rounded-md mt-4'>
                <form onSubmit={handlerSubmite}>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Username*</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="text" className='input w-full' placeholder='Enter Name' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Email*</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='input w-full' placeholder='Enter Email' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Password*</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className='input w-full' placeholder='Enter Password' required />
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="" className='block mb-2'>Role*</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)} className='select w-full' required>
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

export default CreateUser