
import { Navigate } from 'react-router-dom'
import useCurrent from "./hook/Auth/useCurrent.js";

function AuthRedirect({ children }) {
    const { data, isLoading } = useCurrent()

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen h-full'>
                <span className="loading loading-ring loading-xl"></span>
            </div>
        )
    }

    const role = data?.role

    if (role === 'customer') {
        return <Navigate to="/" />
    }
    // Not signed in: render the sign-in form.
    return children


}

export default AuthRedirect