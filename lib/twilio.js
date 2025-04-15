import twilio from 'twilio';
import { getCollection } from './astradb';

// Function to initialize Twilio client with user credentials
export const getTwilioClient = async (userEmail) => {
  const collection = await getCollection('users');
  const user = await collection.findOne({ email: userEmail });

  if (!user?.twilioAccountSid || !user?.twilioAuthToken) {
    throw new Error('Twilio credentials not found');
  }

  return twilio(user.twilioAccountSid, user.twilioAuthToken);
};

// Function to configure webhook for a phone number
export const configureWebhook = async ({ userEmail, phoneNumber, agentId }) => {
  try {
    const client = await getTwilioClient(userEmail);
    const baseUrl = process.env.CALL_SERVER_URL;
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_CALL_SERVER_URL environment variable is not configured');
    }

    // Find the phone number resource
    const numbers = await client.incomingPhoneNumbers.list({ phoneNumber });
    const numberResource = numbers.find(n => n.phoneNumber === phoneNumber);

    if (!numberResource) {
      throw new Error('Phone number not found in Twilio account');
    }

    // Update the webhook URL
    const webhookUrl = `${baseUrl}/inbound/${agentId}`;
    await client.incomingPhoneNumbers(numberResource.sid).update({
      voiceUrl: webhookUrl,
      voiceMethod: 'POST'
    });

    return {
      success: true,
      webhookUrl
    };
  } catch (error) {
    console.error('Error configuring webhook:', error);
    throw new Error(`Failed to configure webhook: ${error.message}`);
  }
};

// Function to verify webhook configuration
export const verifyWebhookConfiguration = async ({ userEmail, phoneNumber }) => {
  try {
    const client = await getTwilioClient(userEmail);
    const numbers = await client.incomingPhoneNumbers.list({ phoneNumber });
    const numberResource = numbers.find(n => n.phoneNumber === phoneNumber);

    if (!numberResource) {
      throw new Error('Phone number not found in Twilio account');
    }

    return {
      success: true,
      currentWebhook: numberResource.voiceUrl
    };
  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw new Error(`Failed to verify webhook: ${error.message}`);
  }
};
