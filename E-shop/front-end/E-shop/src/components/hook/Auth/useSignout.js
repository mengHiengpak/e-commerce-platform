import { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { api } from "../../../config/app.js";
import { setToken } from "../../../config/token.js";
import { AuthContext } from "./AuthContext.jsx";

function useSignout() {

    const [isLoading, setIsLoading] = useState(false)
    const { clearUser } = useContext(AuthContext)

    const signOut = async () => {
        try {
            setIsLoading(true)
            const res = await api.post('/customer/signout')
            setToken("")
            clearUser()
            toast.success(res?.data?.message || 'Signed out successfully!')
            return res.data
        } catch (error) {
            const msg = error?.response?.data?.error || 'server is error!'
            console.error(msg)
            toast.error(msg)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, signOut }
}

export default useSignout
