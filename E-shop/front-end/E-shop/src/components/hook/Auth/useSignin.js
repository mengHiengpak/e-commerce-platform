import { useContext, useState } from "react";
import { api } from "../../../config/app.js";
import { setToken } from "../../../config/token.js";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";


export const useSignin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { refetch } = useContext(AuthContext);

    const signin = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.post('/customer/signin', {email, password})
            setToken(res?.data?.result?.token)
            toast.success(res?.data?.message || 'Signed in successfully!')
            await refetch()
            return res.data
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'server is error'
            setError(msg)
            toast.error(msg)
            console.log(msg)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        signin
    }
}
