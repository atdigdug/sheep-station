import { mkdir, copyFile, rm } from "node:fs/promises";
import { join } from "node:path";

import { requiredStaticFiles, validateStaticApp } from "./validate.js";

const outputDirectory = "dist";

await validateStaticApp();
await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  requiredStaticFiles.map((file) => copyFile(file, join(outputDirectory, file)))
);

console.log(`Static app build written to ${outputDirectory}/.`);
