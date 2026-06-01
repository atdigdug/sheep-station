# Sheep Station

Sheep Station is a vanilla JavaScript browser adaptation of the Sheep Station game from *Second Giant Book of Computer Games* by Tim Hartnell.

This repository currently contains a tiny playable browser-game vertical slice. It includes a retro-styled play area, a movable placeholder sheep token, keyboard and touch controls, a goal marker, a placeholder win state, and a restart button. This is not the final Sheep Station gameplay implementation; real Sheep Station rules and mechanics will come later.

## Source credit

The original game appears in *Second Giant Book of Computer Games* by Tim Hartnell. A scanned copy is available from the Color Computer Archive:

<https://colorcomputerarchive.com/repo/Documents/Books/Second%20Giant%20Book%20of%20Computer%20Games%20(Tim%20Hartnells).pdf>

## Requirements

- Node.js LTS
- npm

## Setup

```sh
npm install
```

## Run locally

```sh
npm run start
```

The included lightweight Node.js server prints a local development URL that can be opened in a browser.

## GitHub Pages

This repository is intended to be published directly from the static files at the repository root. Do not use a custom GitHub Actions Pages deployment workflow for the normal site.

In the GitHub repository settings, configure **Pages** with:

- **Source:** Deploy from a branch
- **Branch:** `main`
- **Folder:** `/root`

With that branch-based Pages setup, the playable placeholder site is served from the root `index.html` and its relative `styles.css` and `game.js` references. GitHub Pages does not need to run Vite or any custom build step to publish the site.

When GitHub Pages is enabled for this repository, the site will be available at:

<https://YOUR_GITHUB_USERNAME.github.io/sheep-station/>

## Placeholder controls

- Move the placeholder sheep with Arrow keys or WASD.
- Use the on-screen direction buttons on touch devices.
- Reach the station marker to trigger the placeholder win message.
- Use **Restart** to reset the placeholder state.

## Validate changes

```sh
npm run lint
npm run test
npm run build
```

- `npm run lint` runs dependency-free JavaScript syntax and formatting checks.
- `npm run test` runs lightweight smoke tests for the placeholder static app wiring and expected mini-game markup.
- `npm run build` validates the static app and writes the generated site to `dist/`.

These checks keep the placeholder vertical slice healthy while the project remains a simple vanilla JavaScript browser game. They do not test or claim to test final Sheep Station gameplay mechanics.
