import dotenv from 'dotenv';
import pg from 'pg';
const { Pool } = pg;

dotenv.config();

const {
 POSTGRES_HOST,
 POSTGRES_DB,
 POSTGRES_USER,
 POSTGRES_PASSWORD,
 POSTGRES_TEST_DB,
 ENV,
} = process.env;

let client;

if (ENV == 'dev') {
 client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
 });
} else {
 client = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
 });
}

export default client;