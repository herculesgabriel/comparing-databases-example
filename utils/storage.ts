import { createReadStream, readFileSync, createWriteStream } from 'node:fs';
import { chain } from 'stream-chain';

export function readFile(path: string) {
  const file = readFileSync(path, 'utf-8');
  return JSON.parse(file);
}

export function saveOnDisk(data: string[], path: string) {
  console.info('- Saving results to disk...');

  const writable = createWriteStream(path, 'utf-8');
  for (const id of data) {
    writable.write(`${id}\n`);
  }
  writable.close();

  const fileName = path.split('/').pop();
  console.info(`- Saved ${fileName} to disk.`);
}

const readSecondFile = async (mongoPath: string, postgresId: string) =>
  new Promise(resolve => {
    const parserChain = chain([createReadStream(mongoPath)]);

    let found = false;

    parserChain.on('data', async data => {
      parserChain.pause();

      const parsedData = data.toString();
      const mongoIds = parsedData.split('\n');

      for (const mongoId of mongoIds) {
        if (mongoId === postgresId) {
          found = true;
          parserChain.emit('end');
        }
      }

      parserChain.resume();
    });

    parserChain.on('end', () => resolve(found));
  });

export const compareData = async (
  postgresPath: string,
  mongoPath: string,
): Promise<string[]> =>
  new Promise(resolve => {
    const result: string[] = [];
    let count = 0;

    const parserChain = chain([
      createReadStream(postgresPath),
      async (data: Buffer) => {
        parserChain.pause();

        const parsedData = data.toString();
        const postgresIds = parsedData
          .split('\n')
          .map((each: string) => each.replace('\r', ''));

        for (const postgresId of postgresIds) {
          console.info('PG ID:', count);
          count++;

          const exists = await readSecondFile(mongoPath, postgresId);
          if (!exists) {
            result.push(postgresId);
          }
        }

        parserChain.resume();
      },
    ]);

    parserChain.on('end', () => resolve(result));
  });
