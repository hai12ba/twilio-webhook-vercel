// pages/api/call.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { twiml } from 'twilio';
import { textToSpeech } from '../../lib/audio';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text } = req.query;

  if (!text || typeof text !== 'string') {
    return res.status(400).send('Missing or invalid "text" parameter');
  }

  try {
    const audioUrl = await textToSpeech(text);

    const response = new twiml.VoiceResponse();
    response.play(audioUrl);

    res.setHeader('Content-Type', 'text/xml');
    res.status(200).send(response.toString());
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating audio');
  }
}
