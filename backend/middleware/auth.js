const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Authorization header is missing',
        error: 'No token provided'
      });
    }

    // Check if it's Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Invalid token format',
        error: 'Token must be Bearer token'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.log('JWT Verification Error:', jwtError);
      return res.status(401).json({ 
        message: 'Token is not valid',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

module.exports = auth;
