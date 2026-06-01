# Agent Instructions

- This repository is a vanilla JavaScript browser game.
- Preserve the simple static-web architecture for future changes.
- Avoid adding React, Vue, TypeScript, large frameworks, build layers, or heavy dependencies unless explicitly requested.
- Do not implement Sheep Station mechanics unless the task explicitly asks for gameplay work.
- Do not copy source-book text, code, tables, or prose verbatim; implement gameplay with original code and original presentation.
- Keep files small, readable, and easy to understand.
- Use the lightweight scripts in `package.json` for local validation; the smoke tests only verify static app wiring and do not claim to test gameplay mechanics.
- Run the available validation commands before finishing:
  - `npm install` or `npm ci`
  - `npm run lint`
  - `npm run test`
  - `npm run build`

## Intended next step

- Implement a browser adaptation of Sheep Station from pages 368–377 of *Second Giant Book of Computer Games*.
- Preserve the gameplay rules and spirit while using original code, UI, and assets.
- Credit the book and source link in project documentation.
- Do not implement this future gameplay unless the task explicitly asks for it.
