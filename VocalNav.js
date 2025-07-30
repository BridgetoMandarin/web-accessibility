"use strict";

// Global zoom setter (used by VocalNav and Drop-Up Menu)
window.setZoomLevel = function (percent)
{
  const clamped = Math.max(50, Math.min(300, percent));
  document.body.style.zoom = `${clamped}%`;
  
  const zoomDisplay = document.getElementById("font-size-button");
  if (zoomDisplay) zoomDisplay.textContent = `${clamped}%`;
};

document.addEventListener("DOMContentLoaded", () =>
  { // Outer wrapper (fixed positioning)
  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.position = "fixed";
  buttonWrapper.style.bottom = "20px";
  buttonWrapper.style.right = "20px";
  buttonWrapper.style.zIndex = "9999";
  buttonWrapper.style.display = "flex";
  buttonWrapper.style.flexDirection = "column";
  buttonWrapper.style.alignItems = "flex-end";

  // Inner button container (row layout)
  const buttonContainer = document.createElement("div");
  buttonContainer.id = "vocalnav-buttons";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "10px";

  // Help button
  const helpButton = document.createElement("button");
  helpButton.id = "help-button";
  helpButton.innerText = "How to Use";
  helpButton.title = "Click for instructions";

  // Mic button
  const micButton = document.createElement("button");
  micButton.id = "mic-button";
  micButton.textContent = "🎤︎";
  micButton.title = "Click to speak";

  // Adds buttons to button container
  buttonContainer.appendChild(helpButton);
  buttonContainer.appendChild(micButton);

  // Creates instructions box
  const instructionsBox = document.createElement("div");
  instructionsBox.id = "instructions-box";
  instructionsBox.innerHTML = 
  `<div class="instructions-title">Vocal Navigation Guide</div>
  Welcome to JaxConnect! This is a short guide to our Vocal Navigation feature. Press the microphone button to say a variety of commands for scrolling and navigation, such as:

  - "Scroll down", "scroll up", "scroll half down", etc.
  - "Go to the top/bottom"
  - "Zoom in/out, 50%, 150%, etc."
  - "Home", "About", "Products", etc.
  - "All Products", "Day-to-Day Life", etc.

  To stop, say "stop" or click the microphone button again. It will automatically stop if no command is given after 10 seconds.
  
  Try it out now!`;

  // Adds toggle logic
  helpButton.addEventListener("click", () =>
  {
    const isHidden = instructionsBox.style.display === "none";
    instructionsBox.style.display = isHidden ? "block" : "none";
    helpButton.classList.toggle("active", isHidden);
  });

  // Appends everything
  buttonWrapper.appendChild(instructionsBox);
  buttonWrapper.appendChild(buttonContainer);
  document.documentElement.appendChild(buttonWrapper);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition)
  {
    alert("Sorry, your browser doesn’t support speech recognition.");
    micButton.disabled = true;
    return;
  }

  let isRecognizing = false;
  let timeoutId = null;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const commands =
  {
    /* 
    Scrolling
    */
    
    "zoom in": () =>
    {
      const zoomLevels = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];
      const current = parseInt(document.body.style.zoom) || 100;
      const currentIndex = zoomLevels.findIndex(z => z === current);
      const nextIndex = Math.min(currentIndex + 1, zoomLevels.length - 1);
      const nextZoom = zoomLevels[nextIndex];
      window.setZoomLevel(nextZoom);
    },

    "zoom out": () =>
    {
      const zoomLevels = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300];
      const current = parseInt(document.body.style.zoom) || 100;
      const currentIndex = zoomLevels.findIndex(z => z === current);
      const prevIndex = Math.max(currentIndex - 1, 0);
      const prevZoom = zoomLevels[prevIndex];
      window.setZoomLevel(prevZoom);
    },

    "how to use": () => helpButton.click(),
    "stop": () => stopListening(),
  
    "top": () => window.scrollTo({ top: 0, behavior: "smooth" }),
    "bottom": () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    "down full": () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }),
    "up full": () => window.scrollBy({ top: -window.innerHeight, behavior: "smooth" }),
    "down half": () => window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" }),
    "up half": () => window.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" }),
    "down quarter": () => window.scrollBy({ top: window.innerHeight / 4, behavior: "smooth" }),
    "up quarter": () => window.scrollBy({ top: -window.innerHeight / 4, behavior: "smooth" }),
    
    /* 
    Navigation
    */

    /* 
    "menu": () => click or something
    */

    "home": () => window.location.href = "https://www.jaxconnect.org/",
    "about": () => window.location.href = "https://www.jaxconnect.org/about",
    "products": () => window.location.href = "https://www.jaxconnect.org/products?category=all+products",
    "join us": () => window.location.href = "https://www.jaxconnect.org/join-our-mission",
    "resources": () => window.location.href = "https://www.jaxconnect.org/resources",

    /* 
    Products
    */

    "all products": () => window.location.href = "https://www.jaxconnect.org/products?category=all+products",
    "day to day life": () => window.location.href = "https://www.jaxconnect.org/products?category=Day-to-day+life",
    "college": () => window.location.href = "https://www.jaxconnect.org/products?category=college",
    "mobility": () => window.location.href = "https://www.jaxconnect.org/products?category=mobility",
    "other": () => window.location.href = "https://www.jaxconnect.org/products?category=other",
  };

  function normalizeNumbers(text)
  {
    return text
      .replace(/\bone\b/g, "1")
      .replace(/\btwo\b/g, "2")
      .replace(/\bthree\b/g, "3")
      .replace(/\bfour\b/g, "4");
  }

  function executeCommand(text)
  {
    const normalized = normalizeNumbers(text.toLowerCase());
    console.log("Heard:", text);
    console.log("Normalized:", normalized);

    for (const keyword in commands)
    {
      if (normalized.includes(keyword))
      {
        console.log("Matched keyword:", keyword);
        commands[keyword]();
        return;
      }
    }

    const isDown = normalized.includes("down");
    const isUp = normalized.includes("up");
    const isScroll = normalized.includes("scroll") || isDown || isUp;

    if (isScroll && (isDown || isUp))
    {
      let amount;

      if (normalized.includes("full"))
      {
        amount = window.innerHeight;
      }
      else if (normalized.includes("half"))
      {
        amount = window.innerHeight / 2;
      }
      else if (normalized.includes("quarter"))
      {
        amount = window.innerHeight / 4;
      }
      else
      {
        amount = 500;
      }

      if (isUp)
      {
        amount *= -1;
      }

      console.log(`Scrolling by ${amount}px`);
      window.scrollBy({ top: amount, behavior: "smooth" });
      return;
    }

    console.log("No matching command found.");

    const matchZoom = normalized.match(/(\d{2,3})\s*%/);
    if (matchZoom) {
      const zoomValue = parseInt(matchZoom[1]);
      if (!isNaN(zoomValue)) {
        console.log(`Setting zoom to ${zoomValue}%`);
        window.setZoomLevel?.(zoomValue);
        return;
      }
    }

  }

  function resetInactivityTimer()
  {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() =>
    {
      console.log("Stopped due to 10 seconds of inactivity.");
      stopListening();
    }, 10000);
  }

  function startListening()
  {
    recognition.start();
    micButton.classList.add("recording");
    isRecognizing = true;
    resetInactivityTimer();
  }

  function stopListening()
  {
    recognition.stop();
    micButton.classList.remove("recording");
    isRecognizing = false;
    clearTimeout(timeoutId);
  }

  micButton.addEventListener("click", () =>
  {
    if (!isRecognizing)
    {
      startListening();
    }
    else
    {
      stopListening();
      console.log("Stopped manually.");
    }
  });

  recognition.addEventListener("result", ev =>
  {
    const transcript = ev.results[0][0].transcript.toLowerCase();
    executeCommand(transcript);
    resetInactivityTimer();
  });

  recognition.addEventListener("end", () =>
  {
    if (isRecognizing)
    {
      recognition.start();
    }
  });

  recognition.addEventListener("error", ev =>
  {
    console.error("Speech error:", ev.error);
    stopListening();
  });
});