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

The deployment workflow publishes the static `dist/` build with GitHub Actions. In the repository settings, configure **Pages** to use **GitHub Actions** as the source. If Pages has not been enabled yet and you want the workflow to enable it automatically, add a `PAGES_TOKEN` repository secret with permission to manage Pages settings.

When GitHub Pages is enabled for this repository, the deployed site will be available at:

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
