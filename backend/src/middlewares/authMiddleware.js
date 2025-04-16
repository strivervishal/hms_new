const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded token payload to req.user
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
