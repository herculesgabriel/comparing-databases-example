import { writeFileSync } from 'node:fs';

export function saveOnDisk(data, path) {
  try {
    writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data successfully saved to disk');
  } catch (error) {
    console.log('An error has occurred ', error);
  }
}
