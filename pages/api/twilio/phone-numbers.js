import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import twilio from 'twilio';
import { getCollection } from '../../../lib/astradb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Get user's Twilio credentials
    const collection = await getCollection('users');
    const user = await collection.findOne({ email: session.user.email });

    if (!user?.twilioAccountSid || !user?.twilioAuthToken) {
      return res.status(400).json({ message: 'Twilio credentials not found' });
    }

    // Initialize Twilio client
    const client = twilio(user.twilioAccountSid, user.twilioAuthToken);

    // Fetch incoming phone numbers
    const numbers = await client.incomingPhoneNumbers.list();

    if (!Array.isArray(numbers)) {
      throw new Error('Failed to fetch phone numbers from Twilio');
    }

    // Format the response
    const formattedNumbers = numbers.map(number => ({
      phoneNumber: number.phoneNumber,
      friendlyName: number.friendlyName || number.phoneNumber,
      sid: number.sid
    }));

    res.status(200).json(formattedNumbers || []);
  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    res.status(500).json({ 
      message: 'Failed to fetch phone numbers',
      error: error.message 
    });
  }
}
