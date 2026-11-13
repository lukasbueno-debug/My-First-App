const title = document.getElementById("title");
const titleInput = document.getElementById("title-input");
const playerInput = document.getElementById("player-name");
const durationSelect = document.getElementById("duration");
const timer = document.getElementById("timer");
const counter = document.getElementById("count");
const clickButton = document.getElementById("click-button");
const startButton = document.getElementById("start-button");
const resetButton = document.getElementById("reset-button");
const message = document.getElementById("message");

const rankingButton = document.getElementById("ranking-button");
const rankingSection = document.getElementById("ranking");
const rankingDuration = document.getElementById("ranking-duration");
const rankingBody = document.getElementById("ranking-body");
const rankingTable = document.getElementById("ranking-table");
const rankingEmpty = document.getElementById("ranking-empty");

const storageKey = "bolivar-click-records-v1";

let clicks = 0;
let running = false;
let startedAt = 0;
let durationMs = 10000;
let animationId = null;
let playerName = "";

function loadRecords() {
  try {
    const records = JSON.parse(localStorage.getItem(storageKey));

    if (!Array.isArray(records)) return [];

    return records.filter(record =>
      record &&
      typeof record.name === "string" &&
      record.name.trim().length > 0 &&
      [10, 20, 30].includes(record.duration) &&
      Number.isSafeInteger(record.clicks) &&
      record.clicks >= 0
    );
  } catch {
    return [];
  }
}

function saveRecord() {
  try {
    const records = loadRecords();
    const duration = durationMs / 1000;
    const normalizedName = playerName.toLocaleLowerCase("es");

    const previous = records.find(record =>
      record.duration === duration &&
      record.name.toLocaleLowerCase("es") === normalizedName
    );

    const isNewRecord = !previous || clicks > previous.clicks;

    if (isNewRecord) {
      if (previous) {
        previous.name = playerName;
        previous.clicks = clicks;
      } else {
        records.push({
          name: playerName,
          duration,
          clicks
        });
      }

      localStorage.setItem(storageKey, JSON.stringify(records));
    }

    return isNewRecord
      ? " ¡Nuevo récord personal guardado!"
      : " Tu mejor récord se mantiene.";
  } catch {
    return " No se pudo guardar el récord en este navegador.";
  }
}

function renderRanking() {
  const duration = Number(rankingDuration.value);

  const records = loadRecords()
    .filter(record => record.duration === duration)
    .sort((a, b) =>
      b.clicks - a.clicks ||
      a.name.localeCompare(b.name, "es")
    );

  rankingBody.replaceChildren();
  rankingEmpty.hidden = records.length > 0;
  rankingTable.hidden = records.length === 0;

  records.forEach((record, index) => {
    const row = document.createElement("tr");

    [index + 1, record.name, record.clicks].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    rankingBody.appendChild(row);
  });
}

function showRanking() {
  rankingSection.hidden = false;
  rankingButton.textContent = "Ocultar ranking";
  rankingButton.setAttribute("aria-expanded", "true");
  renderRanking();
}

function enableSettings() {
  startButton.disabled = false;
  durationSelect.disabled = false;
  playerInput.disabled = false;
}

function finishGame() {
  if (!running) return;

  running = false;
  cancelAnimationFrame(animationId);

  timer.textContent = (durationMs / 1000).toFixed(3);
  clickButton.disabled = true;
  enableSettings();

  const recordMessage = saveRecord();

  message.textContent =
    `¡Tiempo terminado, ${playerName}! Lograste ${clicks} clics ` +
    `en ${durationMs / 1000} segundos.` +
    recordMessage;

  rankingDuration.value = String(durationMs / 1000);
  showRanking();
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

titleInput.addEventListener("input", () => {
  const text = titleInput.value.trim() || "Reto de clics";
  title.textContent = text;
  document.title = `${text} | Colegio Bolívar`;
});

startButton.addEventListener("click", () => {
  if (running) return;

  playerName = playerInput.value.trim();

  if (!playerName) {
    message.textContent = "Escribe tu nombre antes de iniciar.";
    playerInput.focus();
    return;
  }

  durationMs = Number(durationSelect.value) * 1000;
  clicks = 0;
  counter.textContent = "0";
  timer.textContent = "0.000";

  running = true;
  startedAt = performance.now();

  clickButton.disabled = false;
  startButton.disabled = true;
  durationSelect.disabled = true;
  playerInput.disabled = true;

  message.textContent = `¡Vamos, ${playerName}! Haz todos los clics que puedas.`;

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
  enableSettings();

  message.textContent =
    "Escribe tu nombre, selecciona la duración e inicia la partida.";
});

rankingButton.addEventListener("click", () => {
  if (rankingSection.hidden) {
    showRanking();
  } else {
    rankingSection.hidden = true;
    rankingButton.textContent = "Ver ranking";
    rankingButton.setAttribute("aria-expanded", "false");
  }
});

rankingDuration.addEventListener("change", renderRanking);

window.addEventListener("storage", event => {
  if (event.key === storageKey || event.key === null) {
    renderRanking();
  }
});

renderRanking();