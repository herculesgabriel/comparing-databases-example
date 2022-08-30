import { writeFileSync } from 'node:fs';

export function saveOnDisk(data, path) {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), {
      encoding: 'utf-8',
    });

    const fileName = path.split('/').pop();

    console.log(`- Saved ${fileName} to disk.`);
  } catch (error) {
    console.log('An error has occurred ', error);
  }
}
