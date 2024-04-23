import express from 'express';
import cors from 'cors';
import init from './db/config.js';
import dotenv from "dotenv";
import rateLimit from 'express-rate-limit';
import uR from './routers/userRouter.js';

dotenv.config();

const app = express();

// app.use(cors());
app.use(
    cors({
      origin: DOMAIN ? DOMAIN : "http://localhost:3000",
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
    }),
  );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

var requestCount = 0;

app.use((req, res, next) => {
    console.log(`${requestCount++} ${req.method} ${req.url} - ${req.ip} - ${new Date()}`);
    next();
});

// Limit each IP to 100 requests per windowMs
const limiter = rateLimit({
     // 1 minute
    windowMs: 60 * 1000,
    max: 100 
});
app.use(limiter);

app.get('/', (req, res) => {
    res.send('PeerShare v0.0.7');
});

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.use('/users', uR);

app.listen(PORT, () => {
    // init();
    console.clear();
    console.log(`Server @ http://localhost:${PORT}`);
})
