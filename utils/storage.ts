import { createReadStream, writeFileSync, readFileSync } from 'node:fs';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';
import { parser } from 'stream-json';

export function readFile(path: string) {
  const file = readFileSync(path, 'utf-8');
  return JSON.parse(file);
}

export function saveOnDisk(data: unknown, path: string) {
  console.info('- Saving results to disk...');

  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8');
  const fileName = path.split('/').pop();

  console.info(`- Saved ${fileName} to disk.`);
}

const readSecondFile = async (mongoPath: string, postgresId: string) =>
  new Promise(resolve => {
    const parserChain = chain([createReadStream(mongoPath), parser(), streamArray()]);

    let found = false;

    parserChain.on('data', async data => {
      parserChain.pause();

      if (data.key % 100000 === 0) {
        console.info('Mongo:', data.key);
      }

      const mongoId = data.value._id;
      if (mongoId === postgresId) {
        found = true;
        parserChain.emit('end');
      } else {
        parserChain.resume();
      }
    });

    parserChain.on('end', () => resolve(found));
  });

export const compareData = async (postgresPath: string, mongoPath: string) =>
  new Promise(resolve => {
    const result: string[] = [];

    const parserChain = chain([
      createReadStream(postgresPath),
      parser(),
      streamArray(),
      async data => {
        parserChain.pause();

        console.info('PG:', data.key);

        const postgresId = data.value.id;
        const exists = await readSecondFile(mongoPath, postgresId);
        if (!exists) {
          result.push(postgresId);
        }

        parserChain.resume();
      },
    ]);

    parserChain.on('end', () => resolve(result));
  });

export const getIds = async (path: string) =>
  new Promise(resolve => {
    const result: string[] = [];

    const parserChain = chain([
      createReadStream(path),
      parser(),
      streamArray(),
      data => {
        if (data.key % 100000 === 0) {
          console.info('Current ID:', data.key);
        }
        result.push(data.value.id);
      },
    ]);

    parserChain.on('end', () => resolve(result));
  });
