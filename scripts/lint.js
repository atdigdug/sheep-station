import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const ignoredDirectories = new Set([".git", "dist", "node_modules"]);
const failures = [];

async function collectJavaScriptFiles(directory = ".") {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...await collectJavaScriptFiles(path));
      }
    } else if (entry.isFile() && path.endsWith(".js")) {
      files.push(path);
    }
  }

  return files;
}

const files = await collectJavaScriptFiles();

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

  const syntaxCheck = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8"
  });

  if (syntaxCheck.status !== 0) {
    failures.push(`${file}: JavaScript syntax check failed`);
    failures.push(syntaxCheck.stderr.trim());
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Lightweight lint passed for ${files.length} JavaScript files.`);
}
