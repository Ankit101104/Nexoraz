const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Auth headers:', req.headers);
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    console.log('No Authorization header found');
    return res.status(401).send({ error: 'No Authorization header' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token.substring(0, 20) + '...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Auth error:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;