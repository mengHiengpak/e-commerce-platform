import { useCallback, useEffect, useState } from "react";
import { api } from "../../config/app.js";
import toast from "react-hot-toast";

export const useProduct = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    const fetchProducts = useCallback(async (keyword = '') => {
        setIsLoading(true);
        try {
            const params = { limit: 100 }
            if (keyword) params.search = keyword
            const res = await api.get('/product', { params })
            setData(Array.isArray(res.data?.result) ? res.data.result : [])
        } catch (err) {
            const msg = err?.response?.data?.error || err?.response?.data?.message || 'Server is error!'
            setError(msg)
            toast.error(msg)
            console.error(msg)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    const search = useCallback(async (keyword) => {
        await fetchProducts(keyword)
    }, [fetchProducts])

    return {
        isLoading,
        error,
        data,
        search
    }
}