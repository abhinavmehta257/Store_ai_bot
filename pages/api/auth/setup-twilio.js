import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import { updateTwilioCredentials } from '../../../models/User';
import twilio from 'twilio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { accountSid, authToken } = req.body;

    if (!accountSid || !authToken) {
      return res.status(400).json({ 
        message: 'Missing required fields: accountSid and authToken'
      });
    }

    // Validate Twilio credentials before saving
    try {
      const client = twilio(accountSid, authToken);
      // Make a test API call to verify credentials
      await client.api.accounts(accountSid).fetch();
    } catch (error) {
      return res.status(400).json({ 
        message: 'Invalid Twilio credentials',
        error: error.message
      });
    }

    // Update user with validated Twilio credentials
    const updatedUser = await updateTwilioCredentials(session.user.email, {
      accountSid,
      authToken
    });

    res.status(200).json({
      message: 'Twilio account connected successfully',
      hasTwilioAccount: updatedUser.hasTwilioAccount
    });
  } catch (error) {
    console.error('Setup Twilio error:', error);
    res.status(500).json({ 
      message: 'Failed to setup Twilio account',
      error: error.message 
    });
  }
}
