let currentScale = 1.0;

const increaseBtn = document.getElementById("increase-font");
const decreaseBtn = document.getElementById("decrease-font");
const display = document.getElementById("font-size-display");

const wrapper = document.createElement("div");
wrapper.id = "font-content-wrapper";

[...document.body.children].forEach((child) =>
{
  const id = child.id || "";

  const excludeIds =
  [
    "font-size-toggle",
    "vocalnav-buttons",
    "mic-button",
    "help-button",
  ];

  const isFloating = excludeIds.includes(id);
  if (!isFloating)
  {
    wrapper.appendChild(child);
  }
});

document.body.insertBefore(wrapper, document.body.firstChild);

function applyFontSize(scale)
{
  wrapper.style.transform = `scale(${scale})`;
  wrapper.style.transformOrigin = "top left";
  wrapper.style.width = "100%";
  document.documentElement.style.overflowX = "auto";
  display.textContent = `${Math.round(scale * 100)}%`;
}

increaseBtn?.addEventListener("click", () =>
{
  currentScale += 0.25;
  if (currentScale > 2) currentScale = 2;
  applyFontSize(currentScale);
});

decreaseBtn?.addEventListener("click", () =>
{
  currentScale -= 0.25;
  if (currentScale < 0.5) currentScale = 0.5;
  applyFontSize(currentScale);
});

applyFontSize(currentScale);
