let currentScale = 1.0;

const increaseBtn = document.getElementById("increase-font");
const decreaseBtn = document.getElementById("decrease-font");
const display = document.getElementById("font-size-display");

// STEP 1: Create a wrapper for scalable content
const wrapper = document.createElement("div");
wrapper.id = "font-content-wrapper";

// STEP 2: Move only non-floating elements into the wrapper
[...document.body.children].forEach((child) => {
  const id = child.id || "";

  // List of IDs you want to **exclude** from being wrapped (floating buttons)
  const excludeIds = [
    "font-size-toggle",
    "vocalnav-buttons",
    "mic-button",
    "help-button",        // in case you use this in the future
  ];

  const isFloating = excludeIds.includes(id);
  if (!isFloating) {
    wrapper.appendChild(child);
  }
});

// STEP 3: Add wrapper at the top of the body
document.body.insertBefore(wrapper, document.body.firstChild);

// STEP 4: Apply scaling to only the wrapper
function applyFontSize(scale) {
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = "top left";
  wrapper.style.width = "100%";
  document.documentElement.style.overflowX = "auto";
  display.textContent = `${Math.round(scale * 100)}%`;
}

// STEP 5: Button events
increaseBtn?.addEventListener("click", () => {
  currentScale += 0.25;
  if (currentScale > 2) currentScale = 2;
  applyFontSize(currentScale);
});

decreaseBtn?.addEventListener("click", () => {
  currentScale -= 0.25;
  if (currentScale < 0.5) currentScale = 0.5;
  applyFontSize(currentScale);
});

applyFontSize(currentScale);
