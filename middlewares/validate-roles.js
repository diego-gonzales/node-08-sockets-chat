const { request, response } = require('express');


const isAdminRole = (req = request, res = response, next) => {

  // This 'if' is in case the middleware 'validate-jwt' in not called before this middleware, so the 'req.userAuthenticated' is not defined yet
  if (!req.userAuthenticated) {
    return res.status(500).json({ msg: "Internal Server Error - Call middleware 'validate-jwt' first" });
  }

  if (req.userAuthenticated.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ msg: 'You are not authorized to access this resource' });
  }
};

const haveRole = (...roles) => {
  return (req = request, res = response, next) => {
    // This 'if' is in case the middleware 'validate-jwt' in not called before this middleware, so the 'req.userAuthenticated' is not defined yet
    if (!req.userAuthenticated) {
      return res.status(500).json({ msg: "Internal Server Error - Call middleware 'validate-jwt' first" });
    }

    if (roles.includes(req.userAuthenticated.role)) {
      next();
    } else {
      res.status(403).json({ msg: 'You are not authorized to access this resource' });
    }
  }
};

module.exports = {
  isAdminRole,
  haveRole
}