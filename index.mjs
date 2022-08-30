import 'dotenv/config';

import { query as queryPostgres } from './database/postgres.mjs';
import { mongoClient } from './database/mongo.mjs';
import { saveOnDisk } from './utils/storage.mjs';

const transactionsCollection = mongoClient
  .db('DB_VOUCHERS_HOM')
  .collection('transactions');

const mongoDataPromise = transactionsCollection.find().limit(5).toArray();
const postgresDataPromise = queryPostgres('SELECT * FROM store_transactions LIMIT 5');

const [mongoData, postgresData] = await Promise.all([
  mongoDataPromise,
  postgresDataPromise,
]);

console.log(mongoData.length);
console.log(postgresData.length);
saveOnDisk(mongoData, './results/mongoData.json');
saveOnDisk(postgresData, './results/postgresData.json');

const result = [];

for (const { id } of postgresData) {
  const currentMongoData = mongoData.find(curr => curr._id === id);

  if (!currentMongoData) {
    result.push(id);
  }
}

console.log(result);
