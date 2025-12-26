import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../src/models/users/user.schema';

export const createTestUser = async (email: string = 'test@example.com', password: string = 'password123') => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  return user;
};

export const generateTestToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '1d' }
  );
};

export const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
