import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  // This endpoint is deprecated - authentication is now handled by NextAuth.js
  return res.status(308).json({ 
    message: 'This endpoint is deprecated. Please use NextAuth.js endpoints for authentication.',
    redirectTo: '/api/auth/signin'
  });
}
