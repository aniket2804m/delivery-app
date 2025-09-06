const authorize = (roles = []) => {
  // roles param can be a single role string (e.g. 'Admin') or an array of roles (e.g. ['Admin', 'Distributor'])
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    // If no roles are specified, allow any authenticated user (useful for protect middleware alone)
    if (roles.length === 0 && req.user) {
      return next();
    }

    if (!req.user || !req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role to access this resource.' });
    }

    next();
  };
};

module.exports = authorize;