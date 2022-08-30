import { MongoClient } from 'mongodb';

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error('Missing MongoDB uri');
}

export const mongoClient = await MongoClient.connect(MONGO_URI);
