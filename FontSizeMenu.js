document.addEventListener("DOMContentLoaded", () => {
  // Create HTML structure
  const menu = document.createElement("div");
  menu.id = "font-size-menu";

  const button = document.createElement("button");
  button.id = "font-size-button";
  button.textContent = "100%"; // default value

  const options = document.createElement("ul");
  options.id = "font-size-options";

  const zoomLevels = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];

  zoomLevels.forEach(size => {
    const li = document.createElement("li");
    li.setAttribute("data-size", size);
    li.innerHTML = `${size}% <span class="checkmark hidden">✓</span>`;
    options.appendChild(li);
  });

  // Toggle menu visibility
  button.addEventListener("click", () => {
    options.classList.toggle("show");
  });

  // Handle zoom selection
  options.addEventListener("click", e => {
    const target = e.target.closest("li");
    if (!target) return;

    const newSize = parseInt(target.getAttribute("data-size"));
    if (!isNaN(newSize)) {
      window.setZoomLevel(newSize);
    }

    options.classList.remove("show");
  });

  // Append to DOM
  menu.appendChild(button);
  menu.appendChild(options);
  document.documentElement.appendChild(menu);

  // Define zoom logic
  window.setZoomLevel = function (percent) {
    const clamped = Math.max(50, Math.min(300, percent));
    button.textContent = `${clamped}%`;

    // Apply transform scaling
    document.body.style.transform = `scale(${clamped / 100})`;
    document.body.style.transformOrigin = 'top left';

    // Adjust layout for scroll
    document.documentElement.style.width = `${100 / (clamped / 100)}%`;
    document.documentElement.style.overflowX = 'auto';

    // Update checkmarks
    document.querySelectorAll("#font-size-options li").forEach(li => {
      const checkmark = li.querySelector(".checkmark");
      if (parseInt(li.getAttribute("data-size")) === clamped) {
        checkmark.classList.remove("hidden");
      } else {
        checkmark.classList.add("hidden");
      }
    });
  };

  // Initialize
  window.setZoomLevel(100);
});