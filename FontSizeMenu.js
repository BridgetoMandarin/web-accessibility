document.addEventListener("DOMContentLoaded", () => {
  // Wrap body content inside a scalable container
  const wrapper = document.createElement("div");
  wrapper.id = "content-wrapper";

  // Move all children of body into the wrapper
  while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
  }
  document.body.appendChild(wrapper);

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

  window.setZoomLevel = function (percent) {
    const clamped = Math.max(50, Math.min(300, percent));
    button.textContent = `${clamped}%`;
  
    // Remove previous scale-based zoom
    wrapper.style.transform = '';
    wrapper.style.transformOrigin = '';
  
    // Use zoom instead
    wrapper.style.zoom = `${clamped}%`;
  
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