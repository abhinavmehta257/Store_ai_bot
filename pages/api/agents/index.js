import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { createAgent, getAgentsByUserId, isPhoneNumberAvailable } from '../../../models/Agent';
import { configureWebhook, verifyWebhookConfiguration } from '../../../lib/twilio';
import { checkUserHasTwilio } from '../../../models/User';

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
          // First check if user has Twilio configured
          const hasTwilio = await checkUserHasTwilio(session.user.id);
          if (!hasTwilio) {
            return res.status(400).json({
              code: 'TWILIO_NOT_CONFIGURED',
              message: 'Twilio configuration required to create agents. Please configure your Twilio account first.'
            });
          }

          const { name, twilioPhoneNumber, greetingPhrase, systemMessage } = req.body;

          if (!name || !twilioPhoneNumber || !greetingPhrase) {
            return res.status(400).json({ 
              code: 'MISSING_FIELDS',
              message: 'Missing required fields: name, twilioPhoneNumber, greetingPhrase' 
            });
          }

          // Check if phone number is already assigned to an agent
          const isAvailable = await isPhoneNumberAvailable(twilioPhoneNumber);
          if (!isAvailable) {
            return res.status(400).json({
              code: 'PHONE_NUMBER_TAKEN',
              message: 'This phone number is already assigned to another agent'
            });
          }

          // Try to configure the webhook first
          let webhookResult;
          try {
            webhookResult = await configureWebhook({
              userEmail: session.user.email,
              phoneNumber: twilioPhoneNumber,
              // Pass temporary ID since we don't have agent yet
              agentId: `agent_${Date.now()}`
            });

            if (!webhookResult.success) {
              return res.status(400).json({
                code: 'WEBHOOK_CONFIG_FAILED',
                message: 'Failed to configure Twilio webhook for this phone number'
              });
            }
          } catch (error) {
            return res.status(400).json({
              code: 'WEBHOOK_CONFIG_FAILED',
              message: 'Failed to configure Twilio webhook: ' + error.message
            });
          }

          // Verify webhook configuration
          let verificationResult;
          try {
            verificationResult = await verifyWebhookConfiguration({
              userEmail: session.user.email,
              phoneNumber: twilioPhoneNumber
            });

            if (!verificationResult.success) {
              return res.status(400).json({
                code: 'WEBHOOK_VERIFY_FAILED',
                message: 'Failed to verify Twilio webhook configuration'
              });
            }
          } catch (error) {
            return res.status(400).json({
              code: 'WEBHOOK_VERIFY_FAILED',
              message: 'Failed to verify Twilio webhook: ' + error.message
            });
          }

          // Only create the agent if webhook configuration succeeds
          try {
            const newAgent = await createAgent({
              name,
              twilioPhoneNumber,
              greetingPhrase,
              systemMessage,
              userId: session.user.id
            });

            // Update webhook with actual agent ID
            await configureWebhook({
              userEmail: session.user.email,
              phoneNumber: twilioPhoneNumber,
              agentId: newAgent.id
            });

            return res.status(201).json({
              ...newAgent,
              webhook: {
                configured: true,
                url: webhookResult.webhookUrl,
                verified: true
              }
            });
          } catch (error) {
            // If agent creation fails, return specific error
            if (error.message.includes('already assigned')) {
              return res.status(400).json({
                code: 'PHONE_NUMBER_TAKEN',
                message: error.message
              });
            }
            throw error; // Re-throw other errors to be caught by outer catch
          }
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
