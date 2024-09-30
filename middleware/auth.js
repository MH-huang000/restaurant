module.exports = function (req, res, next) {
  if (req.session.store) {
    return next();
  }

  if (isValid(req.originalUrl)) {
    return next();
  }

  res.status(401).end();
};

function isValid(url) {
  if (url.endsWith("login.html")) {
    return true;
  }

  if (url.endsWith("regstore.html")) {
    return true;
  }

  if (url.startsWith("/app")) {
    return !url.endsWith(".html");
  }

  return false;
}
