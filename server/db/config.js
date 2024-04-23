import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  connectionLimit: 2,
  host: process.env.HOST,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const db  = mysql.createPool(
  dbConfig
);

export default db;
