export const STARTING_STATION_VALUE = 50000;
export const MORTGAGE_PAYMENT = 1000;
export const HOMESTEAD_VALUE = 10000;

export const initialStation = Object.freeze({
  year: 0,
  bank: 10000,
  land: 200,
  sheep: 1000,
  grain: 10000,
  landValue: 100,
  grainValue: 0.1,
  ended: false
});

const lowBirthRates = [0, 0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.15];
const lowDeathRates = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
const healthyBirthRates = [0.2, 0.4, 0.55, 0.65, 0.75, 0.8, 0.85, 0.9, 0.95, 1];
const healthyDeathRates = [0.05, 0.05, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03, 0.02, 0.01, 0];
const grainValues = [0.16, 0.14, 0.126, 0.115, 0.107, 0.1, 0.095, 0.09, 0.086, 0.083, 0.08];
const landValues = [90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110];

export const adviceText = [
  "Aim for 10 sheep per grazed acre.",
  "Feed about 10 kilos of grain per sheep.",
  "Sow about 10 kilos of grain per acre planted for a balanced market.",
  "The mortgage is paid before your yearly decisions, so keep cash in reserve.",
  "Trading sheep for grain can save a flock when feed is short; trading for money can fund land."
];

export function cloneInitialStation() {
  return { ...initialStation };
}

export function calculateStationValue(station) {
  return Math.floor(
    HOMESTEAD_VALUE +
      station.bank +
      station.land * station.landValue +
      station.sheep * station.grainValue * 90 +
      station.grain * station.grainValue
  );
}

export function calculateAdvicePlan(station) {
  const recommendedGrazingAcres = Math.max(1, Math.ceil(station.sheep / 10));
  const reserveToSowOneAcre = 10;
  const idealFeed = Math.ceil(station.sheep * 10);
  const recommendedFeed = Math.max(1, Math.min(idealFeed, station.grain - reserveToSowOneAcre));
  const availableAfterFeed = Math.max(0, station.grain - recommendedFeed);
  const recommendedSowAcres = Math.max(1, Math.min(station.land, Math.floor(availableAfterFeed / 10)));

  return {
    grazingAcres: Math.min(station.land, recommendedGrazingAcres),
    feedGrain: Math.min(station.grain, recommendedFeed),
    sowAcres: recommendedSowAcres,
    sowGrainPerAcre: 10
  };
}

export function normalizeDecisions(rawDecisions) {
  return {
    buyAcres: toWholeNumber(rawDecisions.buyAcres),
    sellAcres: toWholeNumber(rawDecisions.sellAcres),
    tradeSheep: toWholeNumber(rawDecisions.tradeSheep),
    tradeFor: rawDecisions.tradeFor === "grain" ? "grain" : "money",
    grazingAcres: toWholeNumber(rawDecisions.grazingAcres),
    feedGrain: toWholeNumber(rawDecisions.feedGrain),
    sowAcres: toWholeNumber(rawDecisions.sowAcres),
    sowGrainPerAcre: toWholeNumber(rawDecisions.sowGrainPerAcre)
  };
}

export function validateDecisions(station, rawDecisions) {
  const decisions = normalizeDecisions(rawDecisions);
  const errors = [];
  const command = Object.values(rawDecisions).find((value) => value === "666" || value === "999");

  if (command) {
    return { command, decisions, errors };
  }

  for (const [key, value] of Object.entries(decisions)) {
    if (key !== "tradeFor" && !Number.isFinite(value)) {
      errors.push("Every numbered decision needs a whole number. Enter 0 where trading is optional.");
      break;
    }
  }

  if (decisions.buyAcres > 0 && decisions.sellAcres > 0) {
    errors.push("Buy land or sell land in a year, not both.");
  }

  const bankAfterMortgage = station.bank - MORTGAGE_PAYMENT;
  if (decisions.buyAcres * station.landValue > bankAfterMortgage) {
    errors.push("You do not have enough post-mortgage cash to buy that much land.");
  }

  const landAfterTrade = station.land + decisions.buyAcres - decisions.sellAcres;
  if (decisions.sellAcres > station.land) {
    errors.push("You cannot sell more acres than you own.");
  }

  if (landAfterTrade < 1) {
    errors.push("The station must keep at least one acre.");
  }

  if (decisions.tradeSheep > station.sheep) {
    errors.push("You cannot trade more sheep than you own.");
  }

  const sheepAfterTrade = station.sheep - decisions.tradeSheep;
  if (sheepAfterTrade < 1) {
    errors.push("Keep at least one sheep on the station.");
  }

  const grainFromTrade = decisions.tradeFor === "grain" ? Math.floor(decisions.tradeSheep * station.grainValue * 900) : 0;
  const grainBeforeFeeding = station.grain + grainFromTrade;

  if (decisions.grazingAcres < 1 || decisions.grazingAcres > landAfterTrade) {
    errors.push("Graze at least one acre and no more than your available land.");
  }

  if (decisions.feedGrain < 1 || decisions.feedGrain > grainBeforeFeeding) {
    errors.push("Feed at least one kilo and no more grain than you have after trading.");
  }

  const grainBeforeSowing = grainBeforeFeeding - decisions.feedGrain;
  if (decisions.sowAcres < 1 || decisions.sowAcres > landAfterTrade) {
    errors.push("Sow at least one acre and no more than your available land.");
  }

  if (decisions.sowGrainPerAcre < 1 || decisions.sowGrainPerAcre > 15) {
    errors.push("Sow grain per acre must be between 1 and 15 kilos for the original market table.");
  }

  if (decisions.sowAcres * decisions.sowGrainPerAcre > grainBeforeSowing) {
    errors.push("You do not have enough grain left to sow that many acres.");
  }

  return { command: null, decisions, errors };
}

export function resolveYear(station, rawDecisions) {
  const validation = validateDecisions(station, rawDecisions);

  if (validation.command || validation.errors.length > 0) {
    return { station, report: null, ...validation };
  }

  const decisions = validation.decisions;
  const next = { ...station, year: station.year + 1 };
  next.bank -= MORTGAGE_PAYMENT;

  if (decisions.buyAcres > 0) {
    next.bank -= decisions.buyAcres * station.landValue;
    next.land += decisions.buyAcres;
  } else if (decisions.sellAcres > 0) {
    next.bank += decisions.sellAcres * station.landValue;
    next.land -= decisions.sellAcres;
  }

  if (decisions.tradeSheep > 0) {
    next.sheep -= decisions.tradeSheep;
    if (decisions.tradeFor === "grain") {
      next.grain += Math.floor(decisions.tradeSheep * station.grainValue * 900);
    } else {
      next.bank += Math.floor(decisions.tradeSheep * station.grainValue * 90);
    }
  }

  next.grain -= decisions.feedGrain;
  const flockRatio = (decisions.grazingAcres / next.sheep) * 10 * (decisions.feedGrain / next.sheep);
  const { birthRate, deathRate } = lookupFlockRates(flockRatio);
  const born = Math.floor(next.sheep * birthRate);
  const died = Math.floor(next.sheep * deathRate);
  next.sheep = next.sheep + born - died;

  next.grain -= decisions.sowAcres * decisions.sowGrainPerAcre;
  const grainHarvestedPerAcre = decisions.sowGrainPerAcre * 10;
  const grainHarvested = Math.floor(decisions.sowAcres * grainHarvestedPerAcre);
  next.grain += grainHarvested;

  const marketIndex = clamp(Math.floor(decisions.sowGrainPerAcre) - 5, 0, grainValues.length - 1);
  next.grainValue = grainValues[marketIndex];
  next.landValue = landValues[marketIndex];

  const report = {
    year: next.year,
    mortgage: MORTGAGE_PAYMENT,
    born,
    died,
    flockRatio,
    grainHarvested,
    grainHarvestedPerAcre,
    landValue: next.landValue,
    grainValue: next.grainValue,
    stationValue: calculateStationValue(next)
  };

  return { station: next, decisions, report, command: null, errors: [] };
}

function lookupFlockRates(flockRatio) {
  if (flockRatio < 1) {
    const index = clamp(Math.floor(flockRatio * 10), 0, lowBirthRates.length - 1);
    return {
      birthRate: lowBirthRates[index],
      deathRate: lowDeathRates[index]
    };
  }

  const index = clamp(Math.floor(flockRatio) - 1, 0, healthyBirthRates.length - 1);
  return {
    birthRate: healthyBirthRates[index],
    deathRate: healthyDeathRates[index]
  };
}

function toWholeNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return Number.NaN;
  }

  const number = Number(value);
  return Number.isFinite(number) ? Math.floor(number) : Number.NaN;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}
