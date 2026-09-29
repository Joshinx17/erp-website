import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Spinner } from 'react-bootstrap'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    const isInstitutionOperator = ['admin', 'SUPER_ADMIN', 'INSTITUTION_ADMIN', 'PRINCIPAL_DIRECTOR', 'ACADEMIC_ADMIN'].includes(user.role)
    return <Navigate to={isInstitutionOperator ? '/dashboard' : `/${user.role}/dashboard`} replace />
  }
  return children
}
