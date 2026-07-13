import { readFile } from "node:fs/promises";
import { test } from "node:test";
import assert from "node:assert/strict";

import { requiredStaticFiles, validateStaticApp } from "../scripts/validate.js";
import {
  calculateStationValue,
  cloneInitialStation,
  resolveYear,
  validateDecisions
} from "../logic.js";

test("static app files exist and are non-empty", async () => {
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

test("index page exposes Sheep Station simulation controls", async () => {
  const html = await readFile("index.html", "utf8");

  assert.match(html, /id="decision-form"/);
  assert.match(html, /name="buyAcres"/);
  assert.match(html, /name="tradeSheep"/);
  assert.match(html, /name="grazingAcres"/);
  assert.match(html, /name="feedGrain"/);
  assert.match(html, /name="sowAcres"/);
  assert.match(html, /name="sowGrainPerAcre"/);
  assert.match(html, /id="report-output"/);
  assert.match(html, /Second Giant Book of Computer Games/);
});

test("initial station matches the original starting resources", () => {
  const station = cloneInitialStation();

  assert.equal(station.bank, 10000);
  assert.equal(station.land, 200);
  assert.equal(station.sheep, 1000);
  assert.equal(station.grain, 10000);
  assert.equal(calculateStationValue(station), 50000);
});

test("year resolution applies mortgage, flock, harvest, and market tables", () => {
  const result = resolveYear(cloneInitialStation(), {
    buyAcres: 0,
    sellAcres: 0,
    tradeSheep: 0,
    tradeFor: "money",
    grazingAcres: 100,
    feedGrain: 9000,
    sowAcres: 100,
    sowGrainPerAcre: 10
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.station.year, 1);
  assert.equal(result.station.bank, 9000);
  assert.equal(result.report.born, 950);
  assert.equal(result.report.died, 20);
  assert.equal(result.report.grainHarvested, 10000);
  assert.equal(result.station.grain, 10000);
  assert.equal(result.station.landValue, 100);
  assert.equal(result.station.grainValue, 0.1);
});

test("decision validation treats numeric entries as yearly orders", () => {
  const result = validateDecisions(cloneInitialStation(), {
    buyAcres: "666",
    sellAcres: 0,
    tradeSheep: 0,
    tradeFor: "money",
    grazingAcres: 100,
    feedGrain: 9000,
    sowAcres: 100,
    sowGrainPerAcre: 10
  });

  assert.equal(result.command, undefined);
  assert.ok(result.errors.includes("You do not have enough post-mortgage cash to buy that much land."));
});

test("static app validation passes", async () => {
  await assert.doesNotReject(validateStaticApp());
});
