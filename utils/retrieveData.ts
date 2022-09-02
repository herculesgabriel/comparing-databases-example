import { readFile, saveOnDisk } from './storage';
import { queryPostgres } from '../database/postgres';
import { queryMongo } from '../database/mongo';

function retrieveDataFromDisk() {
  return [
    readFile('./results/dbs/postgres_transactions.json'),
    readFile('./results/dbs/mongo_transactions.json'),
  ];
}

async function retrieveDataFromDatabase() {
  const mongoDataPromise = queryMongo();
  const postgresDataPromise = queryPostgres('SELECT * FROM store_transactions LIMIT 5');

  console.info('- Retrieving data from database...');
  const [postgresData, mongoData] = await Promise.all([
    postgresDataPromise,
    mongoDataPromise,
  ]);

  saveOnDisk(postgresData, `../results/dbs/postgres_transactions.json`);
  saveOnDisk(mongoData, `../results/dbs/mongo_transactions.json`);

  return [postgresData, mongoData];
}

export function retrieveData(from: 'database' | 'disk') {
  if (from in ['database', 'disk'] === false) {
    throw new Error('Param must be either "database" or "disk"');
  }
  return {
    database: retrieveDataFromDatabase,
    disk: retrieveDataFromDisk,
  }[from]();
}
