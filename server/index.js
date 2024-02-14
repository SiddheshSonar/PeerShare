import express from 'express';
import cors from 'cors';
import init from './db/config.js';
import dotenv from "dotenv";

dotenv.config();


const app = express();

app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    init();
    console.log(`Server is running on port ${PORT}`);
})