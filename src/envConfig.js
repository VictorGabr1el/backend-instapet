import * as dotenv from "dotenv";

dotenv.config();

const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_PORT = process.env.DB_PORT;

const SECRET = process.env.SECRET;
const SERVER_PORT = process.env.SERVER_PORT;

export { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_USER, SECRET, SERVER_PORT };
