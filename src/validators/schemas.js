const { z } = require('zod');

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

const messageSchema = z.object({
  text: z.string().trim().min(1, 'Text is required').max(2000),
});

module.exports = { signupSchema, loginSchema, messageSchema };