module.exports = function checkRole(role) {
  return function (req, res, next) {
    const roles = req.oidc?.user?.['http://localhost:3000/roles'] || [];
    if (roles.includes(role)) {
      next();
    } else {
      res.status(403).render('not-authorized', { role });
    }
  };
};
