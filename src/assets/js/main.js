// Mobile menu
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
document.querySelectorAll(".sub-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const li = btn.parentElement;
    const open = li.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open);
  });
});

// Testimonials: one quote at a time, auto-advancing
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel__slide")];
  if (slides.length < 2) return;
  let i = 0;
  const show = (n) => {
    slides[i].classList.remove("is-active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
  };
  let timer = setInterval(() => show(i + 1), 9000);
  const restart = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 9000); };
  carousel.querySelector(".carousel__btn--prev").addEventListener("click", () => { show(i - 1); restart(); });
  carousel.querySelector(".carousel__btn--next").addEventListener("click", () => { show(i + 1); restart(); });
});

// Psychotherapy interests slider with dots
document.querySelectorAll("[data-slider]").forEach((slider) => {
  const track = slider.querySelector(".interest-slider__track");
  const cards = [...track.children];
  const dotsWrap = slider.querySelector(".interest-slider__dots");
  let index = 0;
  const perView = () => (window.innerWidth <= 640 ? 1 : window.innerWidth <= 1150 ? 2 : 4);
  const maxIndex = () => Math.max(0, cards.length - perView());
  const go = (n) => {
    index = Math.min(Math.max(n, 0), maxIndex());
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.transform = `translateX(-${index * (cards[0].offsetWidth + gap)}px)`;
    dotsWrap.querySelectorAll("button").forEach((d, k) => d.setAttribute("aria-selected", k === index));
  };
  const buildDots = () => {
    dotsWrap.innerHTML = "";
    for (let k = 0; k <= maxIndex(); k++) {
      const b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", `Go to slide ${k + 1}`);
      b.addEventListener("click", () => go(k));
      dotsWrap.appendChild(b);
    }
    go(index);
  };
  buildDots();
  window.addEventListener("resize", buildDots);
  setInterval(() => go(index >= maxIndex() ? 0 : index + 1), 6000);
});

// Forms: until a form service is connected (see README), open the visitor's
// email app with their message filled in, addressed to the practice.
document.querySelectorAll('form[data-mailto-fallback="true"]').forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const lines = [];
    new FormData(form).forEach((value, key) => { if (value) lines.push(`${key}: ${value}`); });
    const to = form.getAttribute("action").replace(/^mailto:/, "").split("?")[0];
    const subject = encodeURIComponent(form.dataset.subject || "Website message");
    window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(lines.join("\n"))}`;
    let status = form.querySelector(".form-status");
    if (!status) { status = document.createElement("p"); status.className = "form-status"; form.appendChild(status); }
    status.textContent = "Your email app should open with your message ready to send. If it doesn't, please call or text us.";
  });
});
