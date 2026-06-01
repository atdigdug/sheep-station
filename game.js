const playfield = document.querySelector("#playfield");
const playerToken = document.querySelector("#player");
const stationMarker = document.querySelector("#goal");
const statusMessage = document.querySelector("#status-message");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

const initialPlayerPosition = {
  x: 24,
  y: 24
};

const placeholderState = {
  mode: "initial",
  activeDirections: new Set(),
  lastFrameTime: 0,
  player: {
    ...initialPlayerPosition,
    size: 32,
    speed: 180
  },
  goal: {
    x: 0,
    y: 0,
    size: 40
  }
};

const keyDirections = new Map([
  ["ArrowUp", "up"],
  ["KeyW", "up"],
  ["ArrowDown", "down"],
  ["KeyS", "down"],
  ["ArrowLeft", "left"],
  ["KeyA", "left"],
  ["ArrowRight", "right"],
  ["KeyD", "right"]
]);

function getPlayfieldSize() {
  const bounds = playfield.getBoundingClientRect();

  return {
    width: bounds.width,
    height: bounds.height
  };
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function setStatus(text) {
  statusMessage.textContent = text;
}

function placeGoalNearFarCorner() {
  const bounds = getPlayfieldSize();

  placeholderState.goal.x = Math.max(16, bounds.width - placeholderState.goal.size - 24);
  placeholderState.goal.y = Math.max(16, bounds.height - placeholderState.goal.size - 24);
}

function renderPlaceholder() {
  playerToken.style.inlineSize = `${placeholderState.player.size}px`;
  playerToken.style.blockSize = `${placeholderState.player.size}px`;
  playerToken.style.transform = `translate(${placeholderState.player.x}px, ${placeholderState.player.y}px)`;

  stationMarker.style.inlineSize = `${placeholderState.goal.size}px`;
  stationMarker.style.blockSize = `${placeholderState.goal.size}px`;
  stationMarker.style.transform = `translate(${placeholderState.goal.x}px, ${placeholderState.goal.y}px)`;

  playfield.dataset.state = placeholderState.mode;
}

function resetPlaceholder() {
  placeholderState.mode = "initial";
  placeholderState.activeDirections.clear();
  placeholderState.lastFrameTime = 0;
  placeholderState.player.x = initialPlayerPosition.x;
  placeholderState.player.y = initialPlayerPosition.y;
  placeGoalNearFarCorner();
  setStatus("Guide the placeholder sheep to the station marker.");
  renderPlaceholder();
  playfield.focus({ preventScroll: true });
}

function hasReachedGoal() {
  return (
    placeholderState.player.x < placeholderState.goal.x + placeholderState.goal.size &&
    placeholderState.player.x + placeholderState.player.size > placeholderState.goal.x &&
    placeholderState.player.y < placeholderState.goal.y + placeholderState.goal.size &&
    placeholderState.player.y + placeholderState.player.size > placeholderState.goal.y
  );
}

function getMovementVector() {
  let horizontal = 0;
  let vertical = 0;

  if (placeholderState.activeDirections.has("left")) {
    horizontal -= 1;
  }

  if (placeholderState.activeDirections.has("right")) {
    horizontal += 1;
  }

  if (placeholderState.activeDirections.has("up")) {
    vertical -= 1;
  }

  if (placeholderState.activeDirections.has("down")) {
    vertical += 1;
  }

  if (horizontal !== 0 && vertical !== 0) {
    horizontal *= Math.SQRT1_2;
    vertical *= Math.SQRT1_2;
  }

  return { horizontal, vertical };
}

function updatePlaceholder(deltaSeconds) {
  if (placeholderState.activeDirections.size === 0 || placeholderState.mode === "placeholder-win") {
    return;
  }

  if (placeholderState.mode === "initial") {
    placeholderState.mode = "playing";
    setStatus("Playing placeholder slice. Reach the station marker!");
  }

  const { horizontal, vertical } = getMovementVector();
  const bounds = getPlayfieldSize();
  const distance = placeholderState.player.speed * deltaSeconds;

  placeholderState.player.x = clamp(
    placeholderState.player.x + horizontal * distance,
    0,
    bounds.width - placeholderState.player.size
  );
  placeholderState.player.y = clamp(
    placeholderState.player.y + vertical * distance,
    0,
    bounds.height - placeholderState.player.size
  );

  if (hasReachedGoal()) {
    placeholderState.mode = "placeholder-win";
    placeholderState.activeDirections.clear();
    setStatus("Goal reached — placeholder win!");
  }
}

function gameLoop(timestamp) {
  if (placeholderState.lastFrameTime === 0) {
    placeholderState.lastFrameTime = timestamp;
  }

  const deltaSeconds = Math.min((timestamp - placeholderState.lastFrameTime) / 1000, 0.05);
  placeholderState.lastFrameTime = timestamp;

  updatePlaceholder(deltaSeconds);
  renderPlaceholder();
  window.requestAnimationFrame(gameLoop);
}

function setDirection(direction, isPressed) {
  if (isPressed) {
    placeholderState.activeDirections.add(direction);
    playfield.focus({ preventScroll: true });
  } else {
    placeholderState.activeDirections.delete(direction);
  }
}

function handleKeyDown(event) {
  const direction = keyDirections.get(event.code);

  if (!direction) {
    return;
  }

  event.preventDefault();
  setDirection(direction, true);
}

function handleKeyUp(event) {
  const direction = keyDirections.get(event.code);

  if (!direction) {
    return;
  }

  event.preventDefault();
  setDirection(direction, false);
}

function bindTouchControls() {
  directionButtons.forEach((button) => {
    const direction = button.dataset.direction;

    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      setDirection(direction, true);
    });

    button.addEventListener("pointerup", () => {
      setDirection(direction, false);
    });

    button.addEventListener("pointercancel", () => {
      setDirection(direction, false);
    });

    button.addEventListener("lostpointercapture", () => {
      setDirection(direction, false);
    });
  });
}

function keepPiecesWithinPlayfield() {
  const bounds = getPlayfieldSize();

  placeGoalNearFarCorner();
  placeholderState.player.x = clamp(placeholderState.player.x, 0, bounds.width - placeholderState.player.size);
  placeholderState.player.y = clamp(placeholderState.player.y, 0, bounds.height - placeholderState.player.size);
  renderPlaceholder();
}

if (playfield && playerToken && stationMarker && statusMessage && restartButton) {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => placeholderState.activeDirections.clear());
  window.addEventListener("resize", keepPiecesWithinPlayfield);
  restartButton.addEventListener("click", resetPlaceholder);
  bindTouchControls();
  resetPlaceholder();
  window.requestAnimationFrame(gameLoop);
}
