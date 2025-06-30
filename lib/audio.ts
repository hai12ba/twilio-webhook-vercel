// lib/audio.ts
import fs from 'fs/promises';
import path from 'path';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { v4 as uuid } from 'uuid';

const client = new TextToSpeechClient({
  keyFilename: 'google-service-account.json', // תשים את הקובץ הזה בשורש
});

export async function textToSpeech(text: string): Promise<string> {
  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);

  const filename = `${uuid()}.mp3`;
  const filePath = path.join('/tmp', filename);
  await fs.writeFile(filePath, response.audioContent as Buffer, 'binary');

  return `https://your-domain.com/api/audio?file=${filename}`;
}
