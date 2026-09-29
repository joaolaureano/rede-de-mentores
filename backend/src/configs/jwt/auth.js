require('dotenv').config();

export default {
  secret: process.env.JWT_KEY,
  // o jsonwebtoken 9 recusa expiresIn indefinido
  expiresIn: process.env.EXPIRES_IN || '1d',
};
