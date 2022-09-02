import { resolve } from 'node:path';
import { compareData, saveOnDisk, getIds } from './utils/storage';

const POSTGRES_SOURCE_FILE_PATH = resolve('./results/dbs/testingPg.json');
const MONGO_SOURCE_FILE_PATH = resolve('./results/dbs/mongo_transactions.json');
const RESULT_FILE_PATH = resolve('./results/testingThings.json');

(async () => {
  console.log('---> Starting');
  // const result = await compareData(POSTGRES_SOURCE_FILE_PATH, MONGO_SOURCE_FILE_PATH);
  const result = await getIds(POSTGRES_SOURCE_FILE_PATH, MONGO_SOURCE_FILE_PATH);
  saveOnDisk(result, RESULT_FILE_PATH);
  console.log('---> Finished');
})();
