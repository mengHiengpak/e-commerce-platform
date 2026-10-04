import {useCallback, useEffect, useState} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";


export const useProductById = (collection, id ) => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchData = useCallback(async () => {
        if(!id || !collection) return
        try {
            const res = await api.get(`/${collection}/${id}`)
            setProducts(res.data)
        } catch (error) {
            const msg = error.response?.data?.error || error.response?.data?.message || error?.message || 'server is error!'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }, [id, collection])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const refetch = async () => {
        setLoading(true)
        await fetchData()
    }

    return {
        products,
        loading,
        refetch
    }
}
