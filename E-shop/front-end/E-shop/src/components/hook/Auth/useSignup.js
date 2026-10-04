import {api} from "../../../config/app.js";
import {useState} from "react";
import toast from "react-hot-toast";


export const useSignup = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const signup = async ({phone, name, email, password, confirmPassword}) => {
        setIsLoading(true);
        setError('');
        if (password !== confirmPassword) {
            setIsLoading(false)
            const msg = 'Passwords do not match'
            setError(msg)
            toast.error(msg)
            throw new Error(msg)
        }
        try{
            const res = await api.post('/customer/signup', {phone, name, email, password, confirmPassword})
            toast.success(res?.data?.message || 'Account created successfully!')
            return res.data
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || 'server is error'
            setError(msg)
            toast.error(msg)
            console.log(msg)
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        error,
        signup,
    }
}