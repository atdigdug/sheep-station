import { access, readFile } from "node:fs/promises";

export const requiredStaticFiles = ["index.html", "styles.css", "logic.js", "game.js"];

export async function validateStaticApp() {
  await Promise.all(requiredStaticFiles.map((file) => access(file)));

  const html = await readFile("index.html", "utf8");
  const checks = [
    [/<title>Sheep Station<\/title>/, "index.html should set the Sheep Station page title"],
    [/<h1[^>]*>Sheep Station<\/h1>/, "index.html should show the Sheep Station heading"],
    [/href="\.\/styles\.css"/, "index.html should load styles.css"],
    [/src="\.\/game\.js"/, "index.html should load game.js"],
    [/1980s BASIC management simulation/i, "index.html should describe the playable simulation"],
    [/id="decision-form"/, "index.html should include the yearly decision form"],
    [/id="report-output"/, "index.html should include the yearly report panel"],
    [/Second Giant Book of Computer Games/, "index.html should credit the source book"],
    [/id="advice-button"/, "index.html should expose the advice button"],
    [/id="quit-button"/, "index.html should expose the quit button"]
  ];

  for (const [pattern, message] of checks) {
    if (!pattern.test(html)) {
      throw new Error(message);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await validateStaticApp();
  console.log("Static app validation passed.");
}
