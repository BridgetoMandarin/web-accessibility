
"use strict";

document.addEventListener("DOMContentLoaded", () =>
{
  // Create the mic button
  const micButton = document.createElement("button");
  micButton.id = "mic-button";
  micButton.textContent = "🎤︎";
  micButton.title = "Click to speak";

  document.body.appendChild(micButton); 

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
    // Scrolling

    "top": () => window.scrollTo({ top: 0, behavior: "smooth" }),
    "bottom": () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    
  // Scroll full page
    "down full": () => window.scrollBy({ top: window.innerHeight, behavior: "smooth" }),
    "up full": () => window.scrollBy({ top: -window.innerHeight, behavior: "smooth" }),

  // Scroll half page
    "down half": () => window.scrollBy({ top: window.innerHeight / 2, behavior: "smooth" }),
    "up half": () => window.scrollBy({ top: -window.innerHeight / 2, behavior: "smooth" }),

  // Scroll quarter page
    "down quarter": () => window.scrollBy({ top: window.innerHeight / 4, behavior: "smooth" }),
    "up quarter": () => window.scrollBy({ top: -window.innerHeight / 4, behavior: "smooth" }),

    // Navigation
    "home": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/",
    "about": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/about",
    "news and resources": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/news-resources",
    "contact": () => window.location.href = "https://bridge-to-mandarin-6f6c1c.webflow.io/contact-us",
    "zoom": () => window.location.href = "https://calendly.com/bridgetomandarinus/30min",

    // LEVEL options
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
    console.log("No matching keyword found.");
  }

function resetInactivityTimer() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      console.log("Stopped due to 10 seconds of inactivity.");
      stopListening();
    }, 10000); // 10 seconds
  }

  function startListening() {
    recognition.start();
    micButton.classList.add("recording");
    isRecognizing = true;
    resetInactivityTimer();
  }

  function stopListening() {
    recognition.stop();
    micButton.classList.remove("recording");
    isRecognizing = false;
    clearTimeout(timeoutId);
  }

  micButton.addEventListener("click", () => {
    if (!isRecognizing) {
      startListening();
    } else {
      stopListening();
      console.log("Stopped manually.");
    }
  });

  recognition.addEventListener("result", ev => {
    const transcript = ev.results[0][0].transcript.toLowerCase();
    executeCommand(transcript);
    resetInactivityTimer(); // Continue listening after command
  });

  recognition.addEventListener("end", () => {
    if (isRecognizing) {
      recognition.start(); // Restart listening
    }
  });

  recognition.addEventListener("error", ev => {
    console.error("Speech error:", ev.error);
    stopListening();
  });
});
