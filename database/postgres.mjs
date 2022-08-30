import pkg from 'pg';

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

if (
  !POSTGRES_HOST ||
  !POSTGRES_PORT ||
  !POSTGRES_USER ||
  !POSTGRES_PASSWORD ||
  !POSTGRES_DATABASE
) {
  throw new Error('Missing Postgres connection info');
}

const { Pool } = pkg;
const pool = new Pool({
  host: POSTGRES_HOST,
  port: Number(POSTGRES_PORT),
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DATABASE,
});

export async function query(text) {
  console.log('[Postgres] Querying postgres...');

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    console.log('[Postgres] Finished.');
    return result.rows.map(row => row);
  } finally {
    client.release();
  }
}
