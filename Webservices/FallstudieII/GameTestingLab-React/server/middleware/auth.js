import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// BUG: JWT secret is hardcoded and not in environment variables
// This is an intentional security bug for students to find
const JWT_SECRET = 'thisissecret';

export const protect = async (req, res, next) => {
  let token;
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ msg: 'User not found' });
    }
    
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// BUG: Admin check is vulnerable to type juggling
// This is an intentional security bug for students to find
export const isAdmin = (req, res, next) => {
  if (req.user.role == 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied, admin only' });
  }
};