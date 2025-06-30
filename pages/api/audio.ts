import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join('/tmp', 'output.mp3');
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': 'audio/mpeg',
    'Content-Length': stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
}
