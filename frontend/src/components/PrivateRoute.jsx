import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const storedUser = JSON.parse(localStorage.getItem('user'))
  if (allowedRoles && storedUser && !allowedRoles.includes(storedUser.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default PrivateRoute
