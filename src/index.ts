import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

const readDatabase = (): any => {
  const data = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(data);
};


const writeDatabase = (data: any): void => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};


app.get('/ping', (req: Request, res: Response) => {
  res.json({ success: true });
});


app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const db = readDatabase();
  db.submissions.push({ name, email, phone, github_link, stopwatch_time });
  writeDatabase(db);

  res.status(201).json({ success: true });
});


app.get('/read', (req: Request, res: Response) => {
  const { index } = req.query;

  if (index === undefined || isNaN(Number(index))) {
    return res.status(400).json({ error: 'Invalid index' });
  }

  const db = readDatabase();
  const idx = Number(index);

  if (idx < 0 || idx >= db.submissions.length) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  res.json(db.submissions[idx]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
