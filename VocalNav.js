"use strict";

document.addEventListener("DOMContentLoaded", () =>
{
  // Create the mic button
  const micButton = document.createElement("button");
  micButton.id = "mic-button";
  micButton.textContent = "🎤︎︎";
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
    "down": () => window.scrollBy({ top: 300, behavior: "smooth" }),
    "up": () => window.scrollBy({ top: -300, behavior: "smooth" }),
    "top": () => window.scrollTo({ top: 0, behavior: "smooth" }),
    "bottom": () => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),

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

  micButton.addEventListener("click", () =>
  {
    if (!isRecognizing)
    {
      recognition.start();
      micButton.classList.add("recording");
      isRecognizing = true;

      timeoutId = setTimeout(() =>
      {
        recognition.stop();
        console.log("Stopped due to inactivity.");
      }, 10000);
    } 
    else
    {
      recognition.stop();
      micButton.classList.remove("recording");
      isRecognizing = false;
      clearTimeout(timeoutId);
    }
  });

  recognition.addEventListener("result", ev =>
  {
    clearTimeout(timeoutId);
    const transcript = ev.results[0][0].transcript.toLowerCase();
    executeCommand(transcript);
  });

  recognition.addEventListener("end", () =>
  {
    micButton.classList.remove("recording");
    isRecognizing = false;
    clearTimeout(timeoutId);
  });

  recognition.addEventListener("error", ev =>
  {
    console.error("Speech error:", ev.error);
    micButton.classList.remove("recording");
    isRecognizing = false;
    clearTimeout(timeoutId);
  });
});