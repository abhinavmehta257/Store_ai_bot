import { validateUser } from '../../../models/User';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Should be in environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await validateUser({ email, password });

    // Create JWT token
    const token = sign(
      { 
        userId: user.id,
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Set HTTP-only cookie with the token
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);
    
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
