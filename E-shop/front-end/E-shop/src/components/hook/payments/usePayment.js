import {useState} from "react";
import {api} from "../../../config/app.js";
import toast from "react-hot-toast";

export const usePayment = () => {
    const [loading, setLoading] = useState(false)

    const payment = async (id, data = {}) => {
        if (!id) return null
        const paidAmount = Number(data?.paidAmount ?? data?.painAmount)
        if (!paidAmount || isNaN(paidAmount) || paidAmount <= 0) {
            toast.error('Please provide a valid paidAmount greater than 0!')
            return null
        }
        setLoading(true)
        try {
            const res = await api.post(`/customerstore/payment/${id}`, { paidAmount })
            const body = res?.data || {}
            const result = body.data ?? body.result ?? body
            if (result?.success) {
                toast.success(result?.message || body?.message || 'Payment successful!')
            }
            return result
        } catch (e) {
            const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'server is error!'
            toast.error(msg)
            console.error(msg)
            return null
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        payment,
    }
}