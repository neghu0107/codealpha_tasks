// DOM ELEMENTS
const sourceText = document.getElementById("source-text");
const resultText = document.getElementById("result-text");
const sourceLang = document.getElementById("source-lang");
const targetLang = document.getElementById("target-lang");
const statusEl = document.getElementById("status");
const loader = document.getElementById("loader");

const translateBtn = document.getElementById("translate-btn");
const copyBtn = document.getElementById("copy-btn");
const speakBtn = document.getElementById("speak-btn");
const swapBtn = document.getElementById("swap-btn");
const clearBtn = document.getElementById("clear-btn");
const downloadBtn = document.getElementById("download-btn");
const themeToggle = document.getElementById("themeToggle");

/* ---------------------------
   THEME TOGGLE
----------------------------*/

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

/* ---------------------------
        TRANSLATION
----------------------------*/

async function translateText() {
  const text = sourceText.value.trim();
  if (!text) return;

  translateBtn.disabled = true;
  loader.style.display = "block";
  statusEl.textContent = "Translating...";

  let fromLang = sourceLang.value;
  let toLang = targetLang.value;

  try {
    const response = await fetch("https://translate.astian.org/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        q: text,
        source: fromLang,
        target: toLang,
        format: "text"
      })
    });

    const data = await response.json();

    resultText.value = data.translatedText || "";
    statusEl.textContent = "Translation complete";

  } catch (err) {
    console.error("Network or parsing error:", err);
    statusEl.textContent = "Translation failed. Try again.";
  } finally {
    loader.style.display = "none";
    translateBtn.disabled = false;
  }
}

/* ---------------------------
        COPY
----------------------------*/

copyBtn.addEventListener("click", () => {
  if (!resultText.value) return;
  navigator.clipboard.writeText(resultText.value);
  statusEl.textContent = "Copied";
});

/* ---------------------------
        CLEAR
----------------------------*/

clearBtn.addEventListener("click", () => {
  sourceText.value = "";
  resultText.value = "";
  statusEl.textContent = "Cleared";
});

/* ---------------------------
        DOWNLOAD
----------------------------*/

downloadBtn.addEventListener("click", () => {
  if (!resultText.value.trim()) return;

  const blob = new Blob([resultText.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "translation.txt";
  a.click();

  URL.revokeObjectURL(url);
  statusEl.textContent = "Downloaded";
});

/* ---------------------------
        SPEAK
----------------------------*/

speakBtn.addEventListener("click", () => {
  if (!resultText.value) return;
  const msg = new SpeechSynthesisUtterance(resultText.value);
  speechSynthesis.speak(msg);
});

/* ---------------------------
        SWAP
----------------------------*/

swapBtn.addEventListener("click", () => {
  const tempLang = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tempLang;

  const tempText = sourceText.value;
  sourceText.value = resultText.value;
  resultText.value = tempText;
});

/* ---------------------------
        ENTER SHORTCUT
----------------------------*/

sourceText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
    translateText();
  }
});

translateBtn.addEventListener("click", translateText);
