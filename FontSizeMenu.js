document.addEventListener("DOMContentLoaded", () => {
  // Create landmark elements
  const main = document.createElement("main");
  main.id = "main-content";

  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Font Size Navigation");

  // Wrap existing body content inside <main>
  while (document.body.firstChild) {
    main.appendChild(document.body.firstChild);
  }
  document.body.appendChild(main);

  // Create Font Size Menu structure inside <nav>
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

  // Append Font Size Menu to <nav>
  menu.appendChild(button);
  menu.appendChild(options);
  nav.appendChild(menu);
  document.body.appendChild(nav);

  // Define zoom function
  window.setZoomLevel = function (percent) {
    const clamped = Math.max(50, Math.min(300, percent));
    button.textContent = `${clamped}%`;

    // Remove previous scale-based zoom
    main.style.transform = '';
    main.style.transformOrigin = '';

    // Use zoom instead
    main.style.zoom = `${clamped}%`;

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

  // Initialize zoom level
  window.setZoomLevel(100);
});