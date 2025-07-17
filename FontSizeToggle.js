let currentZoom = 1.0;

const increaseBtn = document.getElementById("increase-font");
const decreaseBtn = document.getElementById("decrease-font");
const display = document.getElementById("font-size-display");

function applyZoom(scale) {
  document.documentElement.style.zoom = scale;
  display.textContent = `${Math.round(scale * 100)}%`;
}

increaseBtn?.addEventListener("click", () => {
  currentZoom += 0.1;
  if (currentZoom > 2) currentZoom = 2;
  applyZoom(currentZoom);
});

decreaseBtn?.addEventListener("click", () => {
  currentZoom -= 0.1;
  if (currentZoom < 0.5) currentZoom = 0.5;
  applyZoom(currentZoom);
});

display?.addEventListener("click", () => {
  currentZoom = 1.0;
  applyZoom(currentZoom);
});

applyZoom(currentZoom);