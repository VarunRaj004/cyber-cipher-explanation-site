const progress = document.querySelector("#reading-progress");
const updateProgress = () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${height > 0 ? (window.scrollY / height) * 100 : 0}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

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
