/* Removes any .mp3 in public/assets/audio that is no longer referenced by src/audioMap.js */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT, 'public', 'assets', 'audio');

const { AUDIO_MAP } = await import(pathToFileURL(path.join(ROOT, 'src', 'audioMap.js')).href);
const valid = new Set(Object.values(AUDIO_MAP).map((v) => path.basename(v.file)));

if (!fs.existsSync(AUDIO_DIR)) {
  console.log('No audio directory yet — nothing to clean.');
  process.exit(0);
}
let removed = 0;
for (const f of fs.readdirSync(AUDIO_DIR)) {
  if (f.endsWith('.mp3') && !valid.has(f)) {
    fs.unlinkSync(path.join(AUDIO_DIR, f));
    console.log('🗑  removed', f);
    removed++;
  }
}
console.log(`Done. Removed ${removed} orphaned file(s).`);
