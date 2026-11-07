const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Missing Authorization header.'
    });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Bearer token not provided.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_key_123';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Token is invalid or expired.'
    });
  }
};
