import { createUser } from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await createUser({ name, email, password });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
