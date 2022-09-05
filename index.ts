import { resolve } from 'node:path';
import { compareData, saveOnDisk, getIds } from './utils/storage';

const POSTGRES_SOURCE_FILE_PATH = resolve('./results/dbs/transactionsPg');
const MONGO_SOURCE_FILE_PATH = resolve('./results/dbs/transactionsMongo');
const RESULT_FILE_PATH = resolve('./results/comparison');

(async () => {
  console.info('---> Starting');
  console.time('Comparison time');

  const result = await compareData(POSTGRES_SOURCE_FILE_PATH, MONGO_SOURCE_FILE_PATH);

  console.timeEnd('Comparison time');
  console.info(result);

  saveOnDisk(result, RESULT_FILE_PATH);

  console.info('---> Finished');
})();
