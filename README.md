# Sheep Station

Sheep Station is a vanilla JavaScript browser adaptation of the Sheep Station game from *Second Giant Book of Computer Games* by Tim Hartnell.

This repository currently contains only a small static-web skeleton and placeholder app. The real Sheep Station gameplay implementation is not part of this initial skeleton task and will come later.

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

## Validate changes

```sh
npm run lint
npm run test
npm run build
```

- `npm run lint` runs dependency-free JavaScript syntax and formatting checks.
- `npm run test` runs lightweight smoke tests for the placeholder static app wiring.
- `npm run build` validates the static app and writes the generated site to `dist/`.

These checks keep the placeholder app healthy while the project remains a simple vanilla JavaScript browser game.
