import { Navigate } from 'react-router-dom';
// Utility to check if all required permissions are present
const hasAllPermissions = (userPermissions, requiredPermissions) => {
    if (!Array.isArray(requiredPermissions)) {
        requiredPermissions = [requiredPermissions];
    }
    return requiredPermissions.every(p => userPermissions.includes(p));
};
const ProtectedRoute = ({ element, permission }) => {
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    if (permissions.includes(permission)) {
        return element;
    } else {
        return <Navigate to="/" />;
    }
};

export default ProtectedRoute;
