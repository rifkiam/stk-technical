import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import * as fs from "fs";

interface Body {
  from: string;
  message: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const data: Body = req.body;

    const filePath = path.join(process.cwd(), 'public', 'response', 'response.json');

    try {
      let existingData: Body[] = [];

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        existingData = JSON.parse(fileContent) as Body[];
      }

      existingData.push(data);

      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), 'utf8');

      res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ error: 'Failed to save data.' });
    }
  } else {
   
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}