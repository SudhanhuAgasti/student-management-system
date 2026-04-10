const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied. Requires one of these roles: ${roles.join(', ')}` });
    }
    next();
  };
};

module.exports = authorizeRoles;
