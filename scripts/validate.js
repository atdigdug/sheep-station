import { access, readFile } from "node:fs/promises";

export const requiredStaticFiles = ["index.html", "styles.css", "game.js"];

export async function validateStaticApp() {
  await Promise.all(requiredStaticFiles.map((file) => access(file)));

  const html = await readFile("index.html", "utf8");
  const checks = [
    [/<title>Sheep Station<\/title>/, "index.html should set the Sheep Station page title"],
    [/<h1[^>]*>Sheep Station<\/h1>/, "index.html should show the Sheep Station heading"],
    [/href="\.\/styles\.css"/, "index.html should load styles.css"],
    [/src="\.\/game\.js"/, "index.html should load game.js"],
    [/real Sheep Station gameplay implementation will come later/i, "index.html should describe the placeholder status"],
    [/id="playfield"/, "index.html should include the placeholder playfield"],
    [/id="restart-button"/, "index.html should include a restart button"]
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
