import {useState} from "react";
import {api} from "../../../config/app.js";
import toast from "react-hot-toast";

export const useForgetPS = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const forgetPS = async ({email, password, confirmPassword}) => {
        setIsLoading(true)
        setError('')

        if (password !== confirmPassword) {
            setIsLoading(false)
            const msg = 'Passwords do not match'
            setError(msg)
            toast.error(msg)
            throw new Error(msg)
        }

        try {
            const res = await api.patch('/customer/email', {email, password})
            toast.success(res?.data?.message || 'Password updated successfully')
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

    return { isLoading, error, forgetPS }
}