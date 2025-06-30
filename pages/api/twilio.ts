import type { NextApiRequest, NextApiResponse } from 'next';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as fs from 'fs';
import * as util from 'util';
import { twiml } from 'twilio';

const client = new TextToSpeechClient({
  keyFilename: 'google-service-account.json',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { SpeechResult } = req.body;

  const response = new twiml.VoiceResponse();
  const message = `שלום, קיבלתי את ההודעה שלך: ${SpeechResult || 'לא נשמע כלום'}`;

  const [ttsResponse] = await client.synthesizeSpeech({
    input: { text: message },
    voice: { languageCode: 'he-IL', ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  });

  const writeFile = util.promisify(fs.writeFile);
  await writeFile('/tmp/output.mp3', ttsResponse.audioContent!, 'binary');

  response.play({}, 'https://twilio-webhook-vercel.vercel.app/api/audio');
  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(response.toString());
}
