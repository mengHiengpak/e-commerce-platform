import { Navigate, useLocation } from 'react-router-dom'
import useCurrent from './hook/Auth/useCurrent.js'

function ProtectedRoute({ children }) {
    const { data, isLoading } = useCurrent()
    const location = useLocation()

    // Wait for /customer/me to settle, otherwise a signed-in customer gets
    // bounced to the sign-in form on every full page load.
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <span className="loading loading-ring loading-xl"></span>
            </div>
        )
    }

    if (!data) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    return children
}

export default ProtectedRoute
