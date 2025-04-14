import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createAgent, getAgentsByUserId } from '../../../models/Agent';
import { configureWebhook, verifyWebhookConfiguration } from '../../../lib/twilio';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        // Get all agents for the current user
        try {
          const agents = await getAgentsByUserId(session.user.id);
          // Ensure we always return an array
          return res.status(200).json(Array.isArray(agents) ? agents : []);
        } catch (error) {
          console.error('Error fetching agents:', error);
          return res.status(500).json({ 
            message: 'Failed to fetch agents',
            error: error.message
          });
        }

      case 'POST':
        // Create a new agent
        try {
          const { name, twilioPhoneNumber, greetingPhrase, systemMessage } = req.body;

          if (!name || !twilioPhoneNumber || !greetingPhrase) {
            return res.status(400).json({ 
              message: 'Missing required fields: name, twilioPhoneNumber, greetingPhrase' 
            });
          }

          // Create the agent first
          const newAgent = await createAgent({
            name,
            twilioPhoneNumber,
            greetingPhrase,
            systemMessage,
            userId: session.user.id
          });

          // Configure the webhook for the phone number
          const webhookResult = await configureWebhook({
            userEmail: session.user.email,
            phoneNumber: twilioPhoneNumber,
            agentId: newAgent.id
          });

          // Verify the webhook configuration
          const verificationResult = await verifyWebhookConfiguration({
            userEmail: session.user.email,
            phoneNumber: twilioPhoneNumber
          });

          return res.status(201).json({
            ...newAgent,
            webhook: {
              configured: webhookResult.success,
              url: webhookResult.webhookUrl,
              verified: verificationResult.success
            }
          });
        } catch (error) {
          console.error('Error creating agent:', error);
          return res.status(500).json({ 
            message: error.message,
            error: error.message
          });
        }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Agent operation error:', error);
    res.status(500).json({ 
      message: 'Failed to process agent operation',
      error: error.message 
    });
  }
}
