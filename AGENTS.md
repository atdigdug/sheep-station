# Agent Instructions

- This repository is a vanilla JavaScript browser game.
- Preserve the simple static-web architecture for future changes.
- Avoid adding React, Vue, TypeScript, large frameworks, build layers, or heavy dependencies unless explicitly requested.
- Do not implement Sheep Station mechanics unless the task explicitly asks for gameplay work.
- Keep files small, readable, and easy to understand.
- Use the lightweight scripts in `package.json` for local validation; the smoke tests only verify static app wiring and do not claim to test gameplay mechanics.
- Run the available validation commands before finishing:
  - `npm install`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- GitHub Pages deployment is branch-based from `main` with the `/root` folder selected in repository settings.
- Do not reintroduce custom GitHub Pages deployment workflows or Pages Actions unless explicitly requested.
- Preserve the vanilla JavaScript/static root publishing model: root `index.html` should load root `styles.css` and `game.js` via relative paths.
