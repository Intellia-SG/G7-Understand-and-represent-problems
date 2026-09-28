/* =========================================================================
   OFFLINE AUDIO GENERATION  (ElevenLabs "Alice" pipeline)
   -------------------------------------------------------------------------
   Usage:
     node scripts/generate_audio.js             -> generate missing .mp3 files + write src/audioMap.js
     node scripts/generate_audio.js --force     -> regenerate every .mp3
     node scripts/generate_audio.js --map-only  -> only rewrite src/audioMap.js (no API calls)

   RULE: only paragraph text and questions are narrated. NEVER add titles.
   The text here MUST match the on-screen text (the UI reads text from audioMap.js).
   ========================================================================= */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'assets', 'audio');
const MAP_FILE = path.join(ROOT, 'src', 'audioMap.js');

const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice — Clear, Engaging Educator
const MODEL_ID = 'eleven_multilingual_v2';

const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true }
};

/* ------------------------------ PHRASES ------------------------------ */
export const phrases = [
  // Wonder
  { key: 'wonder_1', style: 'statement', text: "Zara and Leo's class is running a book sale. A book and a bookmark cost $11 together, and the book costs exactly $10 more than the bookmark. Most people blurt out that the bookmark costs $1, but a quick sketch reveals something surprising!" },
  { key: 'wonder_2', style: 'question', text: "How can we turn a wordy problem into a picture or an equation that gives the right answer every time?" },

  // Story
  { key: 'story_1', style: 'statement', text: "Word problems are little stories with numbers hiding inside. Imagine a book and a bookmark cost $11 together, and the book costs $10 more than the bookmark. How much is the bookmark? Before we calculate anything, we must understand the story." },
  { key: 'story_2', style: 'emphasis', text: "Ask three detective questions. What is given? What am I asked to find? And how are the quantities related? Underline the facts, circle the question, and ignore details that do not change the answer." },
  { key: 'story_3', style: 'statement', text: "Every problem has a mystery quantity, so give it a letter! Let b stand for the price of the bookmark in dollars. Then the book costs b + 10, because it is $10 more. Always say what your letter means, and include its unit." },
  { key: 'story_4', style: 'emphasis', text: "Draw one bar for each quantity. The bookmark is a short bar, b. The book is the same bar plus an extra piece worth $10. Together, the two bars make $11. Now the whole relationship is visible at a glance!" },
  { key: 'story_5', style: 'statement', text: "Tables help when something changes step by step. A taxi charges $3 to start, plus $2 for every kilometre. List 1, 2, 3 and 4 kilometres, and the fare goes up by 2 each time. Spot the pattern, and you can write the rule." },
  { key: 'story_6', style: 'emphasis', text: "Now translate words into symbols. Three more than twice a number is 17 becomes 2n + 3 = 17. More than means add, twice means multiply by 2, and is means equals. Read your equation back in words to check that it tells the same story." },
  { key: 'story_7', style: 'encouragement', text: "Time to solve. The bar model gives b + b + 10 = 11, so 2b = 1 and b = 0.5. The bookmark costs 50 cents and the book costs $10.50. Check it: 0.50 + 10.50 = 11, and the book is exactly $10 more. It fits the story, so the answer makes sense!" },
  { key: 'story_8', style: 'celebration', text: "Awesome job! You can now understand a problem, name the unknown, and represent it with a bar model, a table, or an equation. Step into the lab to highlight clues, build models, and solve puzzles!" },

  // Simulation — Station 1: Story Decoder
  { key: 'sim_1_1', style: 'encouragement', text: "Zara's class runs a fun fair. Pick a highlighter and tap the clues: blue for given, red for asked, and gold for related." },
  { key: 'sim_1_2', style: 'encouragement', text: "Leo and Mia collect cans. Highlight the clues again, and watch out for details that do not help!" },
  { key: 'sim_1_3', style: 'encouragement', text: "Phone plans hide a pattern. Find the fixed fee, the price per message, and the question asked." },

  // Simulation — Station 2: Model Maker
  { key: 'sim_2_1', style: 'statement', text: "Build a bar model! Give Mia and Sam the right number of equal boxes, then reveal the value of one box." },
  { key: 'sim_2_2', style: 'statement', text: "Complete the missing heights for the sunflower, then choose the rule that matches the pattern." },
  { key: 'sim_2_3', style: 'statement', text: "Translate words into symbols! Tap the tiles in order to build an equation that tells the same story." },

  // Simulation — Station 3: Solve & Check
  { key: 'sim_3_1', style: 'question', text: "Kai and his dad have ages that fit a bar model. Use the model to work out Kai's age." },
  { key: 'sim_3_2', style: 'question', text: "A taxi fare follows the rule: 3 plus 2 times the kilometres. The fare was $25. How far did the taxi go?" },
  { key: 'sim_3_3', style: 'question', text: "Ravi made a mistake while solving. Find the error, then work out the correct value of x." },

  // Feedback lines
  { key: 'fb_correct', style: 'celebration', text: "Correct! Excellent problem solving!" },
  { key: 'fb_wrong', style: 'encouragement', text: "Not quite! Look at the story again." },
  { key: 'sim_success', style: 'celebration', text: "Awesome! You cracked it!" },
  { key: 'sim_retry', style: 'encouragement', text: "Almost there! Check the clues again." },

  // Reflect
  { key: 'reflect_1', style: 'thinking', text: "What did you learn about understanding and representing problems? Explain it to Robo with an example!" },
  { key: 'reflect_done', style: 'celebration', text: "Outstanding reflection! Lesson complete!" }
];

/* ------------------------------ HELPERS ------------------------------ */
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 6).join('_');
const fileNameFor = (p) => `${p.key}_${slug(p.text)}.mp3`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

function writeAudioMap() {
  const body = phrases.map((p) => `  ${JSON.stringify(p.key)}: {
    text: ${JSON.stringify(p.text)},
    style: ${JSON.stringify(p.style)},
    file: ${JSON.stringify('/assets/audio/' + fileNameFor(p))}
  }`).join(',\n');
  const out = `/* =========================================================================
   AUDIO MAP — AUTO-GENERATED by scripts/generate_audio.js (do not edit by hand)
   Key -> { text spoken (== text shown on screen), style, static mp3 path }
   ========================================================================= */
export const AUDIO_MAP = {
${body}
};
`;
  fs.writeFileSync(MAP_FILE, out);
  console.log(`✓ Wrote ${path.relative(ROOT, MAP_FILE)} (${phrases.length} phrases)`);
}

async function generateOne(p, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'xi-api-key': apiKey, Accept: 'audio/mpeg' },
    body: JSON.stringify({
      text: p.text,
      model_id: MODEL_ID,
      voice_settings: STYLE_SETTINGS[p.style] || STYLE_SETTINGS.statement
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const mapOnly = args.includes('--map-only');

  writeAudioMap();
  if (mapOnly) return;

  loadEnv();
  const apiKey = process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error('✗ VITE_ELEVENLABS_API_KEY not found in .env.local');
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let made = 0, skipped = 0, failed = 0;
  for (const p of phrases) {
    const file = path.join(OUT_DIR, fileNameFor(p));
    if (!force && fs.existsSync(file)) { skipped++; continue; }
    try {
      process.stdout.write(`… ${p.key} `);
      fs.writeFileSync(file, await generateOne(p, apiKey));
      console.log('✓');
      made++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
      failed++;
    }
    await sleep(500); // rate limit: 500 ms between API calls
  }
  console.log(`\nDone. Generated: ${made} · Skipped (already exist): ${skipped} · Failed: ${failed}`);
  if (failed) process.exit(1);
}

main();
