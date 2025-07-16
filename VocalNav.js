"use strict";

document.addEventListener("DOMContentLoaded", () =>
  { // Create outer wrapper (fixed positioning)
  const buttonWrapper = document.createElement("div");
  buttonWrapper.style.position = "fixed";
  buttonWrapper.style.bottom = "20px";
  buttonWrapper.style.right = "20px";
  buttonWrapper.style.zIndex = "9999";
  buttonWrapper.style.display = "flex";
  buttonWrapper.style.flexDirection = "column";
  buttonWrapper.style.alignItems = "flex-end"; // aligns the box above button

  // Create inner button container (row layout)
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

  // Add buttons to button container
  buttonContainer.appendChild(helpButton);
  buttonContainer.appendChild(micButton);

  // Create instructions box
  const instructionsBox = document.createElement("div");
  instructionsBox.id = "instructions-box";
  instructionsBox.innerHTML = 
  `<div class="instructions-title">Vocal Navigation Guide</div>
  Welcome to Bridge to Mandarin! This is a short guide to our Vocal Navigation feature. Press the microphone button to say a variety of commands for scrolling and navigation, such as:

  - "Scroll down", "scroll up", "scroll half down", etc.
  - "Go to the top/bottom"
  - "Home", "About", "Level 1", etc.

  Click the microphone button again to stop. It will automatically stop if no command is given after 10 seconds.
  
  Try it out now!`;

  // Add toggle logic
  helpButton.addEventListener("click", () =>
  {
    const isHidden = instructionsBox.style.display === "none";
    instructionsBox.style.display = isHidden ? "block" : "none";
    helpButton.classList.toggle("active", isHidden);
  });

  // Append everything
  buttonWrapper.appendChild(instructionsBox);
  buttonWrapper.appendChild(buttonContainer);
  document.body.appendChild(buttonWrapper);

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
    "how to use": () => helpButton.click(),
    "top": () => window.scrollTo({ top: 0, behavior: "smooth" }),
    "bottom": () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    "down full": () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }),
    "up full": () => window.scrollBy({ top: -window.innerHeight, behavior: "smooth" }),
    "down half": () => window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" }),
    "up half": () => window.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" }),
    "down quarter": () => window.scrollBy({ top: window.innerHeight / 4, behavior: "smooth" }),
    "up quarter": () => window.scrollBy({ top: -window.innerHeight / 4, behavior: "smooth" }),
    "home": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/",
    "about": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/about",
    "news and resources": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/news-resources",
    "contact": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/contact-us",
    "zoom": () => window.location.href = "https://calendly.com/bridgetomandarinus/30min",
    "level 1": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/level-1",
    "level 2": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/level-2",
    "level 3": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/level-3",
    "level 4": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/level-4"
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