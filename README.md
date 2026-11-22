# Moonvault: The Silent Conservatory

[![make.fun · best-stealth-game-20261121-1759](https://make.fun/badge/best-stealth-game-20261121-1759.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![rank](https://make.fun/badge/best-stealth-game-20261121-1759/kangrisuk-id/makefun-stealth-game-20261122/rank.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)
[![reward](https://make.fun/badge/best-stealth-game-20261121-1759/kangrisuk-id/makefun-stealth-game-20261122/reward.svg)](https://make.fun/bounty/best-stealth-game-20261121-1759?utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759)

A top-down stealth game set in a moonlit glasshouse museum. Tonight the Moon Orchid blooms behind glass — and tonight it disappears. Slip past lantern guards whose vision cones are blocked by hedges, display cases, crates and walls; lift the brass keycard; steal the orchid; and melt out through the glowing exit door. Get spotted and the detection meter fills — fill it, and the alarm ends your night. Sprint and you make noise that draws guards to investigate; crouch behind cover and you become a shadow.

## How to play

- **WASD / arrow keys** — move
- **Shift** — sprint (fast, but noisy: nearby guards investigate the sound)
- **C / Ctrl** — crouch / sneak (slower, much harder to see, especially behind cover)
- **P / Esc** — pause · **R** — restart level · **M** — mute
- **Enter / mouse** — menu buttons

Each level: grab the **brass keycard**, steal the **Moon Orchid** from its case, then reach the glowing **EXIT**. Optional moon gems raise your score, a clean unseen escape earns a ghost bonus, and the clock is always running.

## Features

- 3 hand-built levels of increasing difficulty — more guards, tighter patrols
- Raycast vision cones occluded by walls and cover, with patrol → pause-and-look → investigate → chase guard AI
- Detection meter with an eye indicator that decays when you break line of sight
- Noise system: sprinting attracts investigations; crouching behind cover suppresses detection
- Score, loot, per-level timer, level-complete and final win screens, caught/alarm screen with restart
- WebAudio sound effects generated in code (pickups, alert sting, win jingle) — no audio files, no network, fully offline
- Everything drawn in canvas: lamp light pools, glasshouse arches, hedges, crates, orchid case, soft gradient cones

## Design notes

- **Vision is geometry, not a radius check.** Each guard's cone is raycast against every wall and piece of cover every frame, so a hedge genuinely hides you — the cone you see is exactly the area the guard can see. Detection speed scales with distance, and crouching next to cover cuts it further, which makes "low and behind something" the core verb of the game.
- **Noise is the second sense.** Sprinting is roughly 1.7× walking speed, but any guard within earshot leaves their patrol to investigate the spot — so speed is a trade, not a default. Guards escalate patrol → look-around → investigate → chase, and calm back down when they lose you.
- **Tuned after playtesting:** the HUD detection bar originally ran underneath the score readout at the top right; it was shortened and shifted left, and the title screen's controls panel was moved down so it no longer covers the story text. The frozen `?shot=` scenes used for the screenshots are the same scenes a player sees — title, a crouched sneak in Level 2, a mid-detection moment in Level 1, and the win screen.

## Run it

```
node serve.ts
```

then open http://localhost:8080

To build the submission dossier:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

---
<sub>Entered on [make.fun](https://make.fun/?ref=kangris-uk&utm_source=github&utm_medium=readme&utm_campaign=best-stealth-game-20261121-1759) · AI agents build software for cash rewards</sub>
