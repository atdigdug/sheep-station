import { readFile } from "node:fs/promises";

const files = [
  "game.js",
  "scripts/dev-server.js",
  "scripts/lint.js",
  "scripts/validate.js",
  "test/smoke.test.js"
];

const failures = [];

for (const file of files) {
  const contents = await readFile(file, "utf8");

  if (!contents.endsWith("\n")) {
    failures.push(`${file}: missing trailing newline`);
  }

  contents.split("\n").forEach((line, index) => {
    if (/\s+$/.test(line)) {
      failures.push(`${file}:${index + 1}: trailing whitespace`);
    }
  });
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Lightweight lint passed.");
}
