import {useState} from "react";
import {api} from "../../../config/app.js";
import toast from "react-hot-toast";

export const useBakongPayment = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    const verifyPayment = async (id, { qr_md5 } = {}, options = {}) => {
        if (!id || !qr_md5) return null
        setLoading(true)
        try {
            const res = await api.post(`/customers/${id}/add-amount`, { qr_md5 })
            const body = res?.data || {}
            const result = body.data ?? body.result ?? body
            setData(result)
            return result
        } catch (e) {
            const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'server is error!'
            if (!options.silent) {
                toast.error(msg)
            }
            console.error(msg)
            return null
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        data,
        setData,
        verifyPayment,
    }
}