const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader); // Debug log

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header found' });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;
    
    console.log('Extracted token:', token); // Debug log

    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // Debug log
      req.user = decoded;
      next();
    } catch (error) {
      console.log('Token verification error:', error);
      return res.status(401).json({ message: 'Token is invalid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = auth;
