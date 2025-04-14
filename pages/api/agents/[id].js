import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getAgentById, updateAgent, deleteAgent } from '../../../models/Agent';

export default async function handler(req, res) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: 'Agent ID is required' });
    }

    // Get the agent to verify ownership
    const agent = await getAgentById(id);
    
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Verify ownership
    if (agent.userId !== session.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    switch (req.method) {
      case 'GET':
        return res.status(200).json(agent);

      case 'PUT':
        try {
          const { name, greetingPhrase, systemMessage } = req.body;

          if (!name || !greetingPhrase) {
            return res.status(400).json({ 
              message: 'Missing required fields: name, greetingPhrase' 
            });
          }

          // // Don't allow phone number updates
          // if (req.body.twilioPhoneNumber) {
          //   return res.status(400).json({
          //     message: 'Phone number cannot be updated after agent creation'
          //   });
          // }

          const updatedAgent = await updateAgent(id, {
            name,
            greetingPhrase,
            systemMessage
          });

          return res.status(200).json(updatedAgent);
        } catch (error) {
          console.error('Error updating agent:', error);
          return res.status(500).json({ 
            message: 'Failed to update agent',
            error: error.message
          });
        }

      case 'DELETE':
        try {
          await deleteAgent(id);
          return res.status(200).json({ message: 'Agent deleted successfully' });
        } catch (error) {
          console.error('Error deleting agent:', error);
          return res.status(500).json({ 
            message: 'Failed to delete agent',
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
