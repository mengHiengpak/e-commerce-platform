import {useState} from "react";
import {api} from "../../../config/app.js";
import toast from "react-hot-toast";

export const useBakong = () => {
    const [loading, setLoading] = useState(false)
    const [qrData, setQrData] = useState(null)

    const generateQr = async (id, { amount } = {}) => {
        if (!id || !(Number(amount) > 0)) return null
        setLoading(true)
        setQrData(null)
        try {
            const res = await api.post(`/customers/${id}/generate-khqr`, { amount })
            const body = res?.data || {}
            const result = body.data ?? body.result ?? body
            if (!result?.qr_code || !result?.qr_md5) {
                toast.error(result?.message || body?.message || 'QR generation failed!')
                return null
            }
            setQrData(result)
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
        qrData,
        setQrData,
        generateQr,
    }
}