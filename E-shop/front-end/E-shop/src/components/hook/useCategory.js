import {api} from "../../config/app.js";
import toast from "react-hot-toast";
import {useState} from "react";


export const useCategory = () => {
    const [isLoading, setIsLoading] = useState(true);
    const category = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/categories')
            return response.data
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || e?.message || 'server is error!'
            toast.error(msg)
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        category,
    }
}