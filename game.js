import {
  STARTING_STATION_VALUE,
  adviceText,
  calculateAdvicePlan,
  calculateStationValue,
  cloneInitialStation,
  resolveYear
} from "./logic.js";

const form = document.querySelector("#decision-form");
const validationMessage = document.querySelector("#validation-message");
const reportOutput = document.querySelector("#report-output");
const restartButton = document.querySelector("#restart-button");
const adviceButton = document.querySelector("#advice-button");
const quitButton = document.querySelector("#quit-button");

const resourceElements = {
  year: document.querySelector("#year-value"),
  bank: document.querySelector("#bank-value"),
  land: document.querySelector("#land-value"),
  sheep: document.querySelector("#sheep-value"),
  grain: document.querySelector("#grain-value"),
  landValue: document.querySelector("#land-price-value"),
  grainValue: document.querySelector("#grain-price-value"),
  stationValue: document.querySelector("#station-value")
};

let station = cloneInitialStation();

function readDecisions() {
  const data = new FormData(form);

  return {
    buyAcres: data.get("buyAcres"),
    sellAcres: data.get("sellAcres"),
    tradeSheep: data.get("tradeSheep"),
    tradeFor: data.get("tradeFor"),
    grazingAcres: data.get("grazingAcres"),
    feedGrain: data.get("feedGrain"),
    sowAcres: data.get("sowAcres"),
    sowGrainPerAcre: data.get("sowGrainPerAcre")
  };
}

function renderResources() {
  resourceElements.year.textContent = String(station.year);
  resourceElements.bank.textContent = formatMoney(station.bank);
  resourceElements.land.textContent = `${formatNumber(station.land)} acres`;
  resourceElements.sheep.textContent = formatNumber(station.sheep);
  resourceElements.grain.textContent = `${formatNumber(station.grain)} kg`;
  resourceElements.landValue.textContent = `${formatMoney(station.landValue)}/ac`;
  resourceElements.grainValue.textContent = `${formatMoney(station.grainValue, 3)}/kg`;
  resourceElements.stationValue.textContent = formatMoney(calculateStationValue(station));
}

function renderReport(report) {
  reportOutput.innerHTML = "";

  if (!report) {
    appendReportLine("Welcome to Sheep Station.");
    appendReportLine("The station was worth $50,000 before you became manager.");
    appendReportLine("Use the yearly orders to begin, or press Advice for hints.");
    return;
  }

  appendReportLine(`Year ${report.year} report`);
  appendReportLine(`Mortgage paid: ${formatMoney(report.mortgage)}.`);
  appendReportLine(`Sheep born: ${formatNumber(report.born)}. Sheep died: ${formatNumber(report.died)}.`);
  appendReportLine(`Grain harvested: ${formatNumber(report.grainHarvested)} kg (${formatNumber(report.grainHarvestedPerAcre)} kg per acre sown).`);
  appendReportLine(`Land is now ${formatMoney(report.landValue)} per acre; grain is ${formatMoney(report.grainValue, 3)} per kilo.`);
  appendReportLine(`Station value: ${formatMoney(report.stationValue)}.`);

  if (report.flockRatio < 8) {
    appendReportLine("The flock looked thin this year. More grazing room or feed may help.", "warning-line");
  } else if (report.flockRatio > 10) {
    appendReportLine("The flock thrived on generous feed and pasture.", "success-line");
  }
}

function appendReportLine(text, className = "") {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  if (className) {
    paragraph.className = className;
  }
  reportOutput.append(paragraph);
}

function showValidation(messages) {
  validationMessage.textContent = messages.join(" ");
  validationMessage.classList.toggle("is-visible", messages.length > 0);
}

function showAdvice() {
  const plan = calculateAdvicePlan(station);
  reportOutput.innerHTML = "";
  appendReportLine("ADVICE");
  adviceText.forEach((line) => appendReportLine(line));
  appendReportLine(`For your current station, try about ${formatNumber(plan.grazingAcres)} grazing acres, ${formatNumber(plan.feedGrain)} kg of feed, ${formatNumber(plan.sowAcres)} sowing acres, and 10 kg sown per acre.`);
  showValidation([]);
}

function quitGame() {
  station.ended = true;
  form.querySelectorAll("input, select, button[type='submit']").forEach((control) => {
    control.disabled = true;
  });
  reportOutput.innerHTML = "";
  appendReportLine(`This sheep station was worth ${formatMoney(STARTING_STATION_VALUE)} before you became the manager.`);
  appendReportLine(`It is now worth ${formatMoney(calculateStationValue(station))} after ${formatNumber(station.year)} years.`);
  appendReportLine("Press New game to manage another station.");
  showValidation([]);
}

function restartGame() {
  station = cloneInitialStation();
  form.reset();
  form.querySelectorAll("input, select, button[type='submit']").forEach((control) => {
    control.disabled = false;
  });
  setRecommendedInputs();
  renderResources();
  renderReport(null);
  showValidation([]);
}

function setRecommendedInputs() {
  const plan = calculateAdvicePlan(station);
  form.elements.grazingAcres.value = plan.grazingAcres;
  form.elements.feedGrain.value = plan.feedGrain;
  form.elements.sowAcres.value = plan.sowAcres;
  form.elements.sowGrainPerAcre.value = plan.sowGrainPerAcre;
  form.elements.buyAcres.value = 0;
  form.elements.sellAcres.value = 0;
  form.elements.tradeSheep.value = 0;
}

function handleSubmit(event) {
  event.preventDefault();

  if (station.ended) {
    return;
  }

  const decisions = readDecisions();

  const result = resolveYear(station, decisions);

  if (result.errors.length > 0) {
    showValidation(result.errors);
    return;
  }

  station = result.station;
  renderResources();
  renderReport(result.report);
  setRecommendedInputs();
  showValidation([]);
}

function formatMoney(value, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : maximumFractionDigits
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

form.addEventListener("submit", handleSubmit);
adviceButton.addEventListener("click", showAdvice);
quitButton.addEventListener("click", quitGame);
restartButton.addEventListener("click", restartGame);

restartGame();
