import 'dotenv/config';

import { query as queryPostgres } from './database/postgres.mjs';
import { mongoClient } from './database/mongo.mjs';
import { saveOnDisk } from './utils/storage.mjs';

console.log('Starting...');

const transactionsCollection = mongoClient
  .db('DB_VOUCHERS_HOM')
  .collection('transactions');

const mongoDataPromise = transactionsCollection.find().limit(5).toArray();
const postgresDataPromise = queryPostgres('SELECT * FROM store_transactions LIMIT 5');

const [mongoData, postgresData] = await Promise.all([
  mongoDataPromise,
  postgresDataPromise,
]);

console.log('- Saving data to disk...');

saveOnDisk(mongoData, `./results/dbs/mongo_transactions.json`);
saveOnDisk(postgresData, `./results/dbs/postgres_transactions.json`);

console.log('- Finished saving data to disk.');

const result = [];

console.log('- Comparing data...');

for (const { id } of postgresData) {
  const currentMongoData = mongoData.find(curr => curr._id === id);

  if (!currentMongoData) {
    result.push(id);
  }
}

console.log('- Finished comparing data.');

const currentDate = new Date().toLocaleString();
const formattedDate = currentDate.replace(/[/, :]/g, '-');

console.log('- Saving results to disk...');
saveOnDisk(result, `./results/${formattedDate}.json`);
console.log('✅ Finished saving results to disk.');

console.log('🔥 All processes finished, be happy.');
process.exit(0);
