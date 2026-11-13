const title = document.getElementById("title");
const titleInput = document.getElementById("title-input");
const durationSelect = document.getElementById("duration");
const timer = document.getElementById("timer");
const counter = document.getElementById("count");
const clickButton = document.getElementById("click-button");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const message = document.getElementById("message");

let clicks = 0;
let running = false;
let startedAt = 0;
let durationMs = 10000;
let animationId = null;

titleInput.addEventListener("input", () => {
  const text = titleInput.value.trim() || "Reto de clics";
  title.textContent = text;
  document.title = `${text} | Colegio Bolívar`;
});

function finishGame() {
  if (!running) return;

  running = false;
  cancelAnimationFrame(animationId);

  timer.textContent = (durationMs / 1000).toFixed(3);
  clickButton.disabled = true;
  startButton.disabled = false;
  durationSelect.disabled = false;

  message.textContent =
    `¡Tiempo terminado! Lograste ${clicks} clics ` +
    `en ${durationMs / 1000} segundos.`;
}

function updateTimer() {
  if (!running) return;

  const elapsed = performance.now() - startedAt;

  if (elapsed >= durationMs) {
    finishGame();
    return;
  }

  timer.textContent = (elapsed / 1000).toFixed(3);
  animationId = requestAnimationFrame(updateTimer);
}

startButton.addEventListener("click", () => {
  if (running) return;

  durationMs = Number(durationSelect.value) * 1000;
  clicks = 0;
  counter.textContent = "0";
  timer.textContent = "0.000";

  running = true;
  startedAt = performance.now();

  clickButton.disabled = false;
  startButton.disabled = true;
  durationSelect.disabled = true;

  message.textContent =
    "¡La partida comenzó! Haz todos los clics que puedas.";

  animationId = requestAnimationFrame(updateTimer);
  clickButton.focus();
});

clickButton.addEventListener("click", () => {
  if (!running) return;

  if (performance.now() - startedAt >= durationMs) {
    finishGame();
    return;
  }

  clicks++;
  counter.textContent = clicks;
});

resetButton.addEventListener("click", () => {
  running = false;
  cancelAnimationFrame(animationId);

  clicks = 0;
  counter.textContent = "0";
  timer.textContent = "0.000";

  clickButton.disabled = true;
  startButton.disabled = false;
  durationSelect.disabled = false;

  message.textContent =
    "Selecciona la duración y pulsa Iniciar partida.";
});