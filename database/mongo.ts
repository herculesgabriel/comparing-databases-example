import { MongoClient } from 'mongodb';

import { mongoConfig } from '../config/environment.js';

const mongoClient = new MongoClient(mongoConfig.MONGO_URI);

export async function queryMongo() {
  console.info('[MongoDB] Querying...');

  try {
    await mongoClient.connect();

    const transactionsCollection = mongoClient
      .db('DB_VOUCHERS_HOM')
      .collection('transactions');

    const result = await transactionsCollection.find().limit(5).toArray();
    console.info('[MongoDB] Finished.');
    return result;
  } finally {
    mongoClient.close();
  }
}
