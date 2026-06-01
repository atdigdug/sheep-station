# Sheep Station

Sheep Station is a mobile-friendly vanilla JavaScript browser adaptation of “Sheep Station” from *Second Giant Book of Computer Games* by Tim Hartnell. The original BASIC game was written by Philip Coates and asks the player to manage a sheep station by balancing land, sheep, grain, yearly mortgage pressure, and changing market values.

The project intentionally remains a simple static web artifact: root `index.html` loads root `styles.css`, `logic.js`, and `game.js` with relative paths, and no framework or build step is required to play.

## Source credit

Based on “Sheep Station” from Tim Hartnell’s *Second Giant Book of Computer Games*. A scanned copy is available from the Color Computer Archive:

<https://colorcomputerarchive.com/repo/Documents/Books/Second%20Giant%20Book%20of%20Computer%20Games%20(Tim%20Hartnells).pdf>

The repository-local source PDF is kept at `docs/source/SecondGiantBookOfComputerGames.pdf` for reference and must not be rewritten or removed.

## Play locally

Open `index.html` directly in a browser, or run the lightweight local static server:

```sh
npm run start
```

The server prints a local development URL that can be opened in a browser.

## Gameplay overview

- You begin with 1,000 sheep, 200 acres, $10,000 in the bank, and 10,000 kilos of grain.
- The station’s starting value is $50,000.
- Each year begins with an automatic $1,000 mortgage payment to the bank.
- You then choose whether to buy or sell land, whether to trade sheep for money or grain, how many acres to graze, how much grain to feed the flock, how many acres to sow, and how much grain to sow per acre.
- The yearly report shows sheep born, sheep deaths, grain harvested, land value, grain value, and total station value.
- Enter `666` in the command field or use the advice button for original-style management advice.
- Enter `999` in the command field or use the quit button to end the run and value the station.

## Implementation notes

- The browser version preserves the original management loop, starting resources, yearly mortgage, market tables, sheep birth/death table behavior, advice command, and quit command.
- The UI presents the yearly BASIC prompts as a mobile-first form with validation, resource cards, and a report panel instead of requiring only raw typed input.
- Logic is split into `logic.js` so the simulation rules can be checked independently from DOM rendering in `game.js`.
- The original book prose and BASIC listing are not copied into the interface; copy and layout are original for this adaptation.

## GitHub Pages

This repository is intended to be published directly from the static files at the repository root. Do not use a custom GitHub Actions Pages deployment workflow for the normal site.

In the GitHub repository settings, configure **Pages** with:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/root`

With that branch-based Pages setup, the playable site is served from the root `index.html` and its relative static asset references. GitHub Pages does not need to run Vite or any custom build step to publish the site.

When GitHub Pages is enabled for this repository, the site will be available at:

<https://YOUR_GITHUB_USERNAME.github.io/sheep-station/>

## Validate changes

```sh
npm ci
npm run lint
npm run test
npm run build
```

- `npm ci` installs from the committed lockfile. `npm install` is also acceptable when intentionally refreshing the lockfile.
- `npm run lint` runs dependency-free JavaScript syntax and formatting checks.
- `npm run test` runs lightweight smoke tests and deterministic simulation checks.
- `npm run build` validates the static app and writes the generated site to `dist/`.
