// Moonvault: The Silent Conservatory — the program that hands the game in.
// The playable work sits in game/ beside this file: a top-down stealth game
// set in a moonlit glasshouse museum, where the player slips past lantern
// guards, lifts a brass keycard, steals the Moon Orchid and escapes before
// the detection meter fills and the alarm sounds. It is a self-contained
// static page, so a desktop browser can run it offline with no downloads.
// My job in this file is delivery, not gameplay. Before anything moves, I
// sanity-check the bundle (see checkBundleBeforeCopy below); then I mirror
// game/ and screenshots/ into the chosen output folder and let the vendored
// helper in vendor/makefun-game.ts summarise that folder as dossier.json,
// which is the summary the judges read for the entry.
// To try the game locally, run `node serve.ts` and open the address it
// prints (http://localhost:8080). To produce a hand-in outside the grading
// sandbox, point MAKEFUN_OUTPUT_DIR at a scratch folder and run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// With no such variable set, the output folder falls back to /output.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

function checkBundleBeforeCopy(root) {
  const playPage = join(root, 'game', 'index.html');
  if (!existsSync(playPage)) {
    throw new Error('Moonvault hand-in stopped: game/index.html is missing, so there is no game to submit.');
  }
  let shotList;
  try {
    shotList = JSON.parse(readFileSync(join(root, 'shots.json'), 'utf8'));
  } catch (cause) {
    throw new Error(`Moonvault hand-in stopped: shots.json could not be parsed as JSON (${cause.message}).`);
  }
  if (!Array.isArray(shotList)) {
    throw new Error('Moonvault hand-in stopped: shots.json must contain a JSON array of screenshot entries.');
  }
  const stillsFolder = join(root, 'screenshots');
  const stills = existsSync(stillsFolder)
    ? readdirSync(stillsFolder).filter((name) => /\.(?:png|jpe?g)$/i.test(name))
    : [];
  if (stills.length < 3 || stills.length > 4) {
    throw new Error(`Moonvault hand-in stopped: screenshots/ should hold 3 or 4 image files, but ${stills.length} were found.`);
  }
}

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

checkBundleBeforeCopy(here);
mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

const deliveredGameFiles = readdirSync(join(out, 'game'), { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile()).length;
const deliveredShots = readdirSync(join(out, 'screenshots'))
  .filter((name) => /\.(?:png|jpe?g)$/i.test(name)).length;
console.log(`Moonvault hand-in ready: ${deliveredGameFiles} game file(s) and ${deliveredShots} screenshot(s) delivered to ${out}`);
