let currentZoom = 1.0;
const minZoom = 0.5;
const maxZoom = 3.0;
const zoomStep = 0.25;

const increaseBtn = document.getElementById("increase-font");
const decreaseBtn = document.getElementById("decrease-font");
const display = document.getElementById("font-size-display");
const toggleBox = document.getElementById("font-size-toggle");

function applyZoom()
{
  document.body.style.zoom = currentZoom;

  if (display)
  {
    display.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  // Font Toggle scale and position
  if (toggleBox)
  {
    const scale = 1 / currentZoom;
    toggleBox.style.transform = `scale(${scale})`;
    toggleBox.style.bottom = `${20 * scale}px`;
    toggleBox.style.left = `${20 * scale}px`;
  }

  // VocalNav button scale and position
  const vocalNav = document.getElementById("vocalnav-buttons");
  if (vocalNav)
  {
    const scale = 1 / currentZoom;
    vocalNav.style.transform = `scale(${scale})`;
    vocalNav.style.bottom = `${20 * scale}px`;
    vocalNav.style.right = `${20 * scale}px`;
  }

  // Set zoom scale CSS variable
  document.documentElement.style.setProperty('--zoom-scale', currentZoom);

  // Scale and position the Instructions box
  const instructionsBox = document.getElementById("instructions-box");
  if (instructionsBox)
  {
    const scale = 1 / currentZoom;
    //instructionsBox.style.transform = `scale(${scale})`;
    instructionsBox.style.bottom = `${100 * scale}px`;  // Same as in CSS
    instructionsBox.style.right = `${20 * scale}px`;    // Match Help button
  }
}

// Handle + button
increaseBtn?.addEventListener("click", () =>
{
  if (currentZoom < maxZoom)
  {
    currentZoom += zoomStep;
    if (currentZoom > maxZoom) currentZoom = maxZoom;
    applyZoom();
  }
});

// Handle – button
decreaseBtn?.addEventListener("click", () =>
{
  if (currentZoom > minZoom)
  {
    currentZoom -= zoomStep;
    if (currentZoom < minZoom) currentZoom = minZoom;
    applyZoom();
  }
});

// Handle reset when clicking the percentage
display?.addEventListener("click", () =>
{
  currentZoom = 1.0;
  applyZoom();
});

// Apply zoom on page load
document.addEventListener("DOMContentLoaded", () =>
{
  applyZoom();
});

window.setZoomLevel = function (percent) {
  let newZoom = percent / 100;
  const minZoom = 0.5;
  const maxZoom = 3.0;

  if (newZoom < minZoom) newZoom = minZoom;
  if (newZoom > maxZoom) newZoom = maxZoom;

  currentZoom = newZoom;
  applyZoom();
};