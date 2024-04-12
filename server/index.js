import express from 'express';
import cors from 'cors';
import init from './db/config.js';
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

var requestCount = 0;

app.use((req, res, next) => {
    console.log(`${requestCount++} ${req.method} ${req.url} - ${req.ip} - ${new Date()}`);
    next();
});

// Implement rate limiting
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    init();
    console.clear();
    console.log(`Server is running on port ${PORT}`);
})
