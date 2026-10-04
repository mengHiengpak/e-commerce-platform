import useCurrent from '../../hook/auth/useCurrent'
import { Navigate } from 'react-router'

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

    if (role === 'admin' || role === 'super') {
        return <Navigate to={'/'}/>
    }
    if (role === 'cashier') {
        return <Navigate to={'/cashier/pos'}/>
    }
    if (role) {
        // Signed in, but the role has no landing page.
        return <Navigate to={'/unauthorization'}/>
    }
    // Not signed in: render the sign-in form.
    return children
}

export default AuthRedirect