import { getAgentById } from '../../../../models/Agent';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { agentId } = req.query;
  const { to, from } = req.body;

  if (!to || !from) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    // Get the agent details
    const agent = await getAgentById(agentId);
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    // Verify the from number matches the agent's number
    if (from !== agent.twilioPhoneNumber) {
      return res.status(400).json({ message: 'Invalid from number' });
    }

    // Forward the request to call server
    const response = await fetch(`${process.env.CALL_SERVER_URL}/outbound/${agentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, from })
    });

    if (!response.ok) {
      throw new Error(`Call server error: ${response.statusText}`);
    }

    return res.status(200).json({ message: 'Test call initiated successfully' });
  } catch (error) {
    console.error('Error initiating test call:', error);
    return res.status(500).json({ 
      message: 'Failed to initiate test call',
      error: error.message 
    });
  }
}
