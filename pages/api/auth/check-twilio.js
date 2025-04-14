import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { checkTwilioAccount } from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { hasTwilioAccount, isFirstLogin } = await checkTwilioAccount(session.user.email);
    
    res.status(200).json({
      hasTwilioAccount,
      isFirstLogin
    });
  } catch (error) {
    console.error('Check Twilio error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
