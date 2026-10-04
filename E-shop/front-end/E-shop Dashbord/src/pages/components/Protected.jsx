import React from 'react'
import useCurrent from '../../hook/auth/useCurrent'
import { Navigate } from 'react-router'

function Protected({ allowedRole, children }) {
    const { data, isLoading } = useCurrent()
    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-full min-h-screen'>
                <span className="loading loading-ring loading-xl"></span>
            </div>
        )
    }

    if (data?.role && allowedRole.includes(data?.role)) {
        return children
    } else {
        return <Navigate to="/signin" />
    }
}

export default Protected