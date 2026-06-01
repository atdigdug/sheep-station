import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

import { requiredStaticFiles, validateStaticApp } from "../scripts/validate.js";

test("placeholder app files exist and are non-empty", async () => {
  await Promise.all(
    requiredStaticFiles.map(async (file) => {
      const contents = await readFile(file, "utf8");
      assert.ok(contents.length > 0, `${file} should not be empty`);
    })
  );
});

test("index page references the expected static assets", async () => {
  const html = await readFile("index.html", "utf8");

  assert.match(html, /<link rel="stylesheet" href="\.\/styles\.css" \/>/);
  assert.match(html, /<script type="module" src="\.\/game\.js"><\/script>/);
});

test("index page exposes the placeholder mini-game controls", async () => {
  const html = await readFile("index.html", "utf8");

  assert.match(html, /id="playfield"/);
  assert.match(html, /id="player"/);
  assert.match(html, /id="goal"/);
  assert.match(html, /id="restart-button"/);
  assert.match(html, /data-direction="up"/);
  assert.match(html, /data-direction="down"/);
  assert.match(html, /data-direction="left"/);
  assert.match(html, /data-direction="right"/);
});

test("game script keeps a simple placeholder state structure", async () => {
  const script = await readFile("game.js", "utf8");

  assert.match(script, /mode: "initial"/);
  assert.match(script, /"playing"/);
  assert.match(script, /"placeholder-win"/);
  assert.match(script, /window\.requestAnimationFrame\(gameLoop\)/);
});

test("static app validation passes without testing game mechanics", async () => {
  await assert.doesNotReject(validateStaticApp());
});
