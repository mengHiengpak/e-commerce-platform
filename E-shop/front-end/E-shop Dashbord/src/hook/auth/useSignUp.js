import { useState } from "react";
import { api } from "../../config/app";
import toast from "react-hot-toast";

export const useSignUp = () => {

    const [isLoading, setIsLoading] = useState(false);

    const signUp = async (username, email, password, role) => {
        try {
            setIsLoading(true)
            const res = await api.post('/auth/signup', { username, email, password, role })
            if (res.data?.success) {
                toast.success(res.data?.message || "Created successfully!")
            }
            return res.data
        } catch (error) {
            console.error(error?.response?.data?.error || 'server is error!')
            toast.error(error?.response?.data?.error || 'server is error!')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        signUp
    }
}

export default useSignUp
