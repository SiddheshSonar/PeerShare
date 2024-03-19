import express from 'express';
import Process from './process.js';

const app = express();
const port = 3000;

app.use(express.json());

const serverProcess = new Process('server');

app.post('/message', (req, res) => {
  const message = req.body;
  serverProcess.receiveMessage(message);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server process listening at http://localhost:${port}`);
});