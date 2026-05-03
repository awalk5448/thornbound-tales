const characters = [
  {
    id: "seraphine-dusk",
    name: "Seraphine Dusk",
    image: "images/seraphine-dusk.png",
    hover: "A dream merchant who trades in nightmares \u2014 except the one she refuses to sell.",
    page: "pages/seraphine-dusk.html"
  },
  {
    id: "luelle",
    name: "Luelle",
    image: "images/luelle.png",
    hover: "She is drawn to every flame, and every flame she touches surrenders to the dark.",
    page: "pages/luelle.html"
  },
  {
    id: "oren-vael",
    name: "Oren Vael",
    image: "images/oren-vael.png",
    hover: "The last prince of a kingdom erased from memory, carrying a crown no one else can see.",
    page: "pages/oren-vael.html"
  },
  {
    id: "jasper-wren",
    name: "Jasper Wren",
    image: "images/jasper-wren.png",
    hover: "A cartographer whose maps become real \u2014 and the city he wrote into existence craves more than he is willing to give.",
    page: "pages/jasper-wren.html"
  },
  {
    id: "penvelyn",
    name: "Penvelyn",
    image: "images/penvelyn.png",
    hover: "An exiled fairy knight with gold-mended wings, deciding whether speaking the truth again will finally land with purpose.",
    page: "pages/penvelyn.html"
  },
  {
    id: "thessivane",
    name: "Thessivane",
    image: "images/thessivane.png",
    hover: "A creature woven from a love that was stitched too tight, gently unweaving the world.",
    page: "pages/thessivane.html"
  }
];

const gallery = document.querySelector("#character-gallery");

function createCharacterCard(character, index) {
  const card = document.createElement("a");
  card.className = "character-card";
  card.href = character.page;
  card.setAttribute("aria-label", `Open ${character.name}'s tale`);
  card.style.transitionDelay = `${index * 100}ms, 0ms, 0ms, 0ms`;

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "card-image-wrapper";

  const image = document.createElement("img");
  image.src = character.image;
  image.alt = `${character.name} portrait`;
  image.loading = index < 3 ? "eager" : "lazy";

  const hoverText = document.createElement("div");
  hoverText.className = "card-hover-text";
  hoverText.textContent = character.hover;

  const name = document.createElement("div");
  name.className = "card-name";
  name.textContent = character.name;

  imageWrapper.append(image, hoverText);
  card.append(imageWrapper, name);

  return card;
}

function renderGallery() {
  if (!gallery) return;

  const fragment = document.createDocumentFragment();
  characters.forEach((character, index) => {
    fragment.appendChild(createCharacterCard(character, index));
  });

  gallery.appendChild(fragment);

  requestAnimationFrame(() => {
    document.querySelectorAll(".character-card").forEach((card) => {
      card.classList.add("is-visible");
    });
  });
}

renderGallery();

function initAudioPlayer() {
  const audio = document.getElementById("story-audio");
  const playBtn = document.getElementById("play-btn");
  const progressTrack = document.querySelector(".progress-track");
  const progressFill = document.querySelector(".progress-fill");
  const timeDisplay = document.querySelector(".audio-time");

  if (!audio || !playBtn || !progressTrack || !progressFill || !timeDisplay) return;

  function updateTimeDisplay() {
    const cur = formatTime(audio.currentTime);
    const dur = formatTime(audio.duration);
    timeDisplay.textContent = `${cur} / ${dur}`;
  }

  playBtn.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        playBtn.disabled = true;
        await audio.play();
        playBtn.classList.add("playing");
        playBtn.setAttribute("aria-label", "Pause narration");
      } catch (error) {
        playBtn.classList.remove("playing");
        playBtn.setAttribute("aria-label", "Play narration");
      } finally {
        playBtn.disabled = false;
      }
    } else {
      audio.pause();
      playBtn.classList.remove("playing");
      playBtn.setAttribute("aria-label", "Play narration");
    }
  });

  audio.addEventListener("loadedmetadata", updateTimeDisplay);

  audio.addEventListener("timeupdate", () => {
    const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progressFill.style.width = `${percent}%`;
    updateTimeDisplay();
  });

  progressTrack.addEventListener("click", (event) => {
    if (!audio.duration) return;

    const rect = progressTrack.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    audio.currentTime = Math.max(0, Math.min(percent, 1)) * audio.duration;
  });

  audio.addEventListener("ended", () => {
    playBtn.classList.remove("playing");
    playBtn.setAttribute("aria-label", "Play narration");
    progressFill.style.width = "0%";
    audio.currentTime = 0;
    updateTimeDisplay();
  });
}

function formatTime(seconds) {
  if (Number.isNaN(seconds) || !Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

document.addEventListener("DOMContentLoaded", initAudioPlayer);
