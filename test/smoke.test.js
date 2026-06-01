import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

const requiredFiles = ["index.html", "styles.css", "game.js"];

test("placeholder app files exist", async () => {
  await Promise.all(
    requiredFiles.map(async (file) => {
      const contents = await readFile(file, "utf8");
      assert.ok(contents.length > 0, `${file} should not be empty`);
    })
  );
});

test("index page identifies the placeholder game", async () => {
  const html = await readFile("index.html", "utf8");

  assert.match(html, /<h1[^>]*>Sheep Station<\/h1>/);
  assert.match(html, /game\.js/);
  assert.match(html, /styles\.css/);
});
