import {useState} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";


export const useDeleteCustomerStoreById = () => {
    const [loading, setLoading] = useState(false)
    const remove = async (id) => {
        if (!id) return
        setLoading(true)
        try {
            const res = await api.delete(`/customerstore/${id}`)
            toast.success(res?.data?.message || 'Item removed successfully!')
            return res.data
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || e?.message || 'server is error!'
            toast.error(msg)
            throw e
        } finally {
            setLoading(false)
        }
    }
    return {
        remove,
        loading
    }
}