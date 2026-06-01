const playfield = document.querySelector("#playfield");
const player = document.querySelector("#player");
const goal = document.querySelector("#goal");
const statusMessage = document.querySelector("#status-message");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

const gameState = {
  mode: "initial",
  keys: new Set(),
  lastFrameTime: 0,
  player: {
    x: 24,
    y: 24,
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

function positionGoal() {
  const bounds = getPlayfieldSize();
  gameState.goal.x = Math.max(16, bounds.width - gameState.goal.size - 24);
  gameState.goal.y = Math.max(16, bounds.height - gameState.goal.size - 24);
}

function render() {
  player.style.inlineSize = `${gameState.player.size}px`;
  player.style.blockSize = `${gameState.player.size}px`;
  player.style.transform = `translate(${gameState.player.x}px, ${gameState.player.y}px)`;

  goal.style.inlineSize = `${gameState.goal.size}px`;
  goal.style.blockSize = `${gameState.goal.size}px`;
  goal.style.transform = `translate(${gameState.goal.x}px, ${gameState.goal.y}px)`;

  playfield.dataset.state = gameState.mode;
}

function resetGame() {
  gameState.mode = "initial";
  gameState.keys.clear();
  gameState.lastFrameTime = 0;
  gameState.player.x = 24;
  gameState.player.y = 24;
  positionGoal();
  setStatus("Guide the placeholder sheep to the station marker.");
  render();
  playfield.focus({ preventScroll: true });
}

function hasReachedGoal() {
  return (
    gameState.player.x < gameState.goal.x + gameState.goal.size &&
    gameState.player.x + gameState.player.size > gameState.goal.x &&
    gameState.player.y < gameState.goal.y + gameState.goal.size &&
    gameState.player.y + gameState.player.size > gameState.goal.y
  );
}

function updatePlayer(deltaSeconds) {
  if (gameState.keys.size === 0 || gameState.mode === "placeholder-win") {
    return;
  }

  if (gameState.mode === "initial") {
    gameState.mode = "playing";
    setStatus("Playing placeholder slice. Reach the station marker!");
  }

  let horizontal = 0;
  let vertical = 0;

  if (gameState.keys.has("left")) {
    horizontal -= 1;
  }

  if (gameState.keys.has("right")) {
    horizontal += 1;
  }

  if (gameState.keys.has("up")) {
    vertical -= 1;
  }

  if (gameState.keys.has("down")) {
    vertical += 1;
  }

  if (horizontal !== 0 && vertical !== 0) {
    horizontal *= Math.SQRT1_2;
    vertical *= Math.SQRT1_2;
  }

  const bounds = getPlayfieldSize();
  const distance = gameState.player.speed * deltaSeconds;
  gameState.player.x = clamp(gameState.player.x + horizontal * distance, 0, bounds.width - gameState.player.size);
  gameState.player.y = clamp(gameState.player.y + vertical * distance, 0, bounds.height - gameState.player.size);

  if (hasReachedGoal()) {
    gameState.mode = "placeholder-win";
    gameState.keys.clear();
    setStatus("Goal reached — placeholder win!");
  }
}

function gameLoop(timestamp) {
  if (gameState.lastFrameTime === 0) {
    gameState.lastFrameTime = timestamp;
  }

  const deltaSeconds = Math.min((timestamp - gameState.lastFrameTime) / 1000, 0.05);
  gameState.lastFrameTime = timestamp;

  updatePlayer(deltaSeconds);
  render();
  window.requestAnimationFrame(gameLoop);
}

function setDirection(direction, isPressed) {
  if (isPressed) {
    gameState.keys.add(direction);
    playfield.focus({ preventScroll: true });
  } else {
    gameState.keys.delete(direction);
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

if (playfield && player && goal && statusMessage && restartButton) {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("blur", () => gameState.keys.clear());
  window.addEventListener("resize", () => {
    const bounds = getPlayfieldSize();
    positionGoal();
    gameState.player.x = clamp(gameState.player.x, 0, bounds.width - gameState.player.size);
    gameState.player.y = clamp(gameState.player.y, 0, bounds.height - gameState.player.size);
    render();
  });
  restartButton.addEventListener("click", resetGame);
  bindTouchControls();
  resetGame();
  window.requestAnimationFrame(gameLoop);
}
