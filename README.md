# Understand & Represent Problems — Grade 7 (MOE)

Same architecture as the previous module: Intro → Wonder → Story (8 slides) → Simulate (3 stations × 3 activities) → Practice (10 worlds × 10 questions) → Reflect.

## Run
    npm install      # only if node_modules is missing / not for your OS
    npm run dev

## Audio (ElevenLabs "Alice", eleven_multilingual_v2)
API key is in `.env.local` (`VITE_ELEVENLABS_API_KEY`).

    npm run generate-audio      # creates public/assets/audio/*.mp3 + rewrites src/audioMap.js
    npm run clean-audio         # deletes orphaned mp3 files

Playback order: static mp3 → live ElevenLabs request → browser speech fallback.
To change narration: edit the `phrases` array in `scripts/generate_audio.js`, run `generate-audio`
(on-screen text is read from `audioMap.js`, so text and voice always match). Never narrate titles.
