import {useState} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";

export const useCustomerStoreProduct = () => {
    const [loading, setLoading] = useState(false)
    const [refetch, setRefetch] = useState(true)
    const sale = async (data) => {
        setLoading(true)
        setRefetch(true)
        try {
            const res = await api.post('/customerstore', data)
            toast.success(res?.data?.message || 'Added to cart successfully!')
            return res.data
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || e?.message || 'server is error!'
            toast.error(msg)
        } finally {
            setLoading(false)
            setRefetch(false)
        }
    }
    return {
        sale,
        loading,
        refetch
    }
}