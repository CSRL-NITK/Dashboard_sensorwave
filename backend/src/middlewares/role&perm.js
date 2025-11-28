function checkRole(allowedRoles = []) {
  return function (req, res, next) {
    const roles = req.auth?.payload?.['https://sensor-wave-app.com/roles'];

    if (!roles || !Array.isArray(roles)) {
      return res.status(403).json({ message: 'No valid roles found in token' });
    }

    const hasAccess = roles.some(role => allowedRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied. Insufficient role' });
    }

    next();
  };
}

function checkPermission(allowedPermission = "") {
  return function (req, res, next) {
    const permissions = req.auth?.payload?.permissions;
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(403).json({ message: "No valid permissions found in token" });
    }
    const hasAccess = permissions.includes(allowedPermission);

    if (!hasAccess) {
      return res.status(404).json({ message: 'Access denied.' });
    }
    next();
  };
}

module.exports = { checkRole, checkPermission };
