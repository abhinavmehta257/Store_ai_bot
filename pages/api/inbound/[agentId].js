import { getAgentById } from '../../../models/Agent';
import { VoiceResponse } from 'twilio/lib/twiml/VoiceResponse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { agentId } = req.query;

  try {
    // Get the agent details
    const agent = await getAgentById(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Create TwiML response
    const twiml = new VoiceResponse();
    
    // Add the agent's greeting
    if (agent.greetingPhrase) {
      twiml.say(agent.greetingPhrase);
    }

    // Set response headers
    res.setHeader('Content-Type', 'text/xml');
    
    // Send TwiML response
    return res.send(twiml.toString());

  } catch (error) {
    console.error('Error handling inbound call:', error);
    
    // Create error response in TwiML
    const twiml = new VoiceResponse();
    twiml.say('We apologize, but there was an error processing your call.');
    
    res.setHeader('Content-Type', 'text/xml');
    return res.send(twiml.toString());
  }
}
