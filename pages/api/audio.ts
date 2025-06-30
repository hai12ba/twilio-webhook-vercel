// pages/api/audio.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).send('Missing or invalid file parameter');
  }

  const filePath = path.join('/tmp', file);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const audioStream = fs.createReadStream(filePath);
  res.setHeader('Content-Type', 'audio/mpeg');
  audioStream.pipe(res);
}
