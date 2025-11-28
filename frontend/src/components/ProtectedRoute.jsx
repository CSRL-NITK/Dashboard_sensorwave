import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const isAuthenticated = sessionStorage.getItem('accessToken');
  const roles = JSON.parse(sessionStorage.getItem('role') || '[]');
  const hasAccess = allowedRoles.some(role => roles.includes(role));

  if (!isAuthenticated) {
    return <Navigate to="/introduction" replace />;
  }

  return hasAccess ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
