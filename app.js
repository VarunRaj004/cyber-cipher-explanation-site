const progress = document.querySelector("#reading-progress");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index * 35, 210)}ms`);
  observer.observe(element);
});

const coverArt = document.querySelector(".cover-art");
const scrollScenes = [...document.querySelectorAll(".manifesto, .contents, .chapter, .demo-doors")];
const parallaxLayers = [...document.querySelectorAll(".cover-copy, .issue-stamp, .chapter-head, .privacy-equation, .verdict-final, .zone-note")];
const tiltCards = [...document.querySelectorAll(".contents a, .mechanic-card, .role-card, .protocol-strip article, .verdict-vote, .verdict-handler, .zone-flow article, .recovery-flow div, .limits-grid article, .door-grid a")];

scrollScenes.forEach((scene) => scene.classList.add("scroll-scene"));
parallaxLayers.forEach((layer, index) => {
  layer.classList.add("parallax-layer");
  layer.dataset.depth = String((index % 4) + 1);
});
tiltCards.forEach((card) => card.classList.add("tilt-card"));

let frameRequested = false;
const renderMotion = () => {
  frameRequested = false;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pageProgress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
  if (progress) progress.style.width = `${pageProgress * 100}%`;
  document.documentElement.style.setProperty("--page-progress", pageProgress.toFixed(4));

  if (reducedMotion.matches) return;
  if (coverArt) {
    const coverProgress = clamp(window.scrollY / Math.max(window.innerHeight, 1));
    coverArt.style.setProperty("--scroll-rx", `${coverProgress * 10}deg`);
    coverArt.style.setProperty("--scroll-ry", `${coverProgress * -8}deg`);
    coverArt.style.setProperty("--scroll-y", `${coverProgress * 74}px`);
  }

  for (const scene of scrollScenes) {
    const rect = scene.getBoundingClientRect();
    const centerDistance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    const proximity = clamp(1 - Math.abs(centerDistance), 0, 1);
    scene.style.setProperty("--scene-y", `${centerDistance * -18}px`);
    scene.style.setProperty("--scene-rx", `${centerDistance * -2.4}deg`);
    scene.style.setProperty("--scene-depth", `${proximity * 28}px`);
  }

  for (const layer of parallaxLayers) {
    const rect = layer.getBoundingClientRect();
    const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
    const depth = Number(layer.dataset.depth ?? 1);
    layer.style.setProperty("--parallax-y", `${clamp(distance, -1.5, 1.5) * depth * -7}px`);
  }
};

const requestMotionFrame = () => {
  if (!frameRequested) {
    frameRequested = true;
    requestAnimationFrame(renderMotion);
  }
};
window.addEventListener("scroll", requestMotionFrame, { passive: true });
window.addEventListener("resize", requestMotionFrame, { passive: true });
reducedMotion.addEventListener("change", requestMotionFrame);
requestMotionFrame();

if (!reducedMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const applyTilt = (element, event, strength) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--pointer-rx", `${y * -strength}deg`);
    element.style.setProperty("--pointer-ry", `${x * strength}deg`);
    element.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    element.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };
  const clearTilt = (element) => {
    element.style.setProperty("--pointer-rx", "0deg");
    element.style.setProperty("--pointer-ry", "0deg");
  };
  if (coverArt) {
    coverArt.addEventListener("pointermove", (event) => applyTilt(coverArt, event, 16));
    coverArt.addEventListener("pointerleave", () => clearTilt(coverArt));
  }
  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => applyTilt(card, event, 7));
    card.addEventListener("pointerleave", () => clearTilt(card));
  });
}

const portals = window.CYBER_CIPHER_PORTALS ?? {};
let missingPortal = false;
document.querySelectorAll("[data-portal]").forEach((link) => {
  const portal = link.dataset.portal;
  const url = portal ? portals[portal] : undefined;
  if (typeof url === "string" && /^https?:\/\//i.test(url)) {
    link.href = url;
    link.rel = "noopener noreferrer";
    return;
  }
  missingPortal = true;
  link.removeAttribute("href");
  link.setAttribute("aria-disabled", "true");
  link.classList.add("portal-disabled");
  link.title = "Configure this portal URL in config.js";
});
const configNote = document.querySelector("#portal-config-note");
if (configNote && missingPortal) configNote.hidden = false;
