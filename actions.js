let clicks = 0;

const contador = document.getElementById("contador");
const botonSumar = document.getElementById("sumar");
const botonReiniciar = document.getElementById("reiniciar");
const titulo = document.getElementById("titulo");
const nuevoTitulo = document.getElementById("nuevo-titulo");

botonSumar.addEventListener("click", function () {
  clicks++;
  contador.textContent = clicks;
});

botonReiniciar.addEventListener("click", function () {
  clicks = 0;
  contador.textContent = clicks;
});

nuevoTitulo.addEventListener("input", function () {
  const nombre = nuevoTitulo.value.trim();

  titulo.textContent = nombre || "Eventos del Colegio Bolívar";
  document.title = titulo.textContent + " | Contador";
});