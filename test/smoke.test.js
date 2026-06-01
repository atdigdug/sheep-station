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

  assert.match(html, /<link rel="stylesheet" href="\/styles\.css" \/>/);
  assert.match(html, /<script type="module" src="\/game\.js"><\/script>/);
});

test("static app validation passes without testing game mechanics", async () => {
  await assert.doesNotReject(validateStaticApp());
});
