import { Pool } from 'pg';

import { postgresConfig } from '../config/environment';

const pool = new Pool({
  host: postgresConfig.POSTGRES_HOST,
  port: Number(postgresConfig.POSTGRES_PORT),
  user: postgresConfig.POSTGRES_USER,
  password: postgresConfig.POSTGRES_PASSWORD,
  database: postgresConfig.POSTGRES_DATABASE,
});

export async function queryPostgres(text: string) {
  console.info('[Postgres] Querying...');

  const client = await pool.connect();

  try {
    const result = await client.query(text);
    console.info('[Postgres] Finished.');
    return result.rows.map(row => row);
  } finally {
    client.release();
  }
}
