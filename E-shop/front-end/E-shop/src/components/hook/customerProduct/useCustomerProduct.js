import {useEffect, useState} from "react";
import {api} from "../../../config/app.js";
import useCurrent from "../Auth/useCurrent.js";
import toast from "react-hot-toast";

export const useCustomerProduct = () => {
    const {data: customer} = useCurrent()
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!customer?._id) {
            setIsLoading(false)
            return
        }
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const res = await api.get(`/sales/customer/${customer._id}`)
                setData(res.data)
            } catch (error) {
                if (error.response?.status === 404) {
                    setData(null)
                } else {
                    const msg = error.response?.data?.error || error.response?.data?.message || 'server is error!'
                    setError(msg)
                    toast.error(msg)
                    console.error(msg)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [customer])

    return {
        isLoading,
        error,
        data,
    }
}