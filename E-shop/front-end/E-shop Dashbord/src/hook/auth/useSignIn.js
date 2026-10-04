import { useState } from "react";
import { api, setToken } from "../../config/app";
import toast from "react-hot-toast";

export const useSignIn = () => {
    
    const [isLoading, setIsLoading] = useState(false);

    const Signin = async (email, password) => {
        try {
            setIsLoading(true)
            const res = await api.post('/auth/signin', {email, password})
            if (res.data?.success) {
                setToken(res.data?.result?.token)
            }
            return res.data
        } catch (error) {
            const msg = error?.response?.data?.error || 'server is error!'
            console.error(msg)
            toast.error(msg)
        }finally{
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        Signin
    }
}

export default useSignIn