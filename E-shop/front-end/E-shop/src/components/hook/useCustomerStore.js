import {useEffect, useState} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";

export const useCustomerStore = (customerId) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStore = async (id) => {
        if (!id) return
        setIsLoading(true)
        setError(null)
        try {
            const res = await api.get(`/customerstore/customer/${id}`)
            setData(res.data)
        } catch (e) {
            const status = e.response?.status
            if (status === 404 || status === 400) {
                setData(null)
            } else {
                const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'server is error!'
                setError(msg)
                toast.error(msg)
                console.error(msg)
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStore(customerId)
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [customerId])

    return {
        data,
        isLoading,
        error,
        refetch: () => fetchStore(customerId)
    }
}