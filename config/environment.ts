import 'dotenv/config';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error('Missing MongoDB uri');
}
export const mongoConfig = { MONGO_URI };

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

export const postgresConfig = {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
};
