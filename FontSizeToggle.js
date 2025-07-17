let currentScale = 1.0;

const increaseBtn = document.getElementById("increase-font");
const decreaseBtn = document.getElementById("decrease-font");
const display = document.getElementById("font-size-display");

function applyFontSize(scale) {
  document.getElementById("content").style.transform = `scale(${scale})`;
  document.getElementById("content").style.transformOrigin = "top left";
  document.documentElement.style.overflowX = "auto"; 
  display.textContent = `${Math.round(scale * 100)}%`;
}

increaseBtn.addEventListener("click", () => {
  currentScale += 0.25;
  if (currentScale > 2) currentScale = 2; // upper limit
  applyFontSize(currentScale);
});

decreaseBtn.addEventListener("click", () => {
  currentScale -= 0.25;
  if (currentScale < 0.5) currentScale = 0.5; // lower limit
  applyFontSize(currentScale);
});

applyFontSize(currentScale);