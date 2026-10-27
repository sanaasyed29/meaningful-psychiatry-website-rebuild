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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Testimonials: one quote at a time, auto-advancing unless the visitor prefers reduced motion
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel__slide")];
  if (slides.length < 2) return;
  let i = 0;
  const count = carousel.querySelector(".carousel__count");
  const show = (n) => {
    slides[i].classList.remove("is-active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
    if (count) count.textContent = `${i + 1} / ${slides.length}`;
  };
  const start = () => (reduceMotion ? null : setInterval(() => show(i + 1), 9000));
  let timer = start();
  const restart = () => { clearInterval(timer); timer = start(); };
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
  if (!reduceMotion) setInterval(() => go(index >= maxIndex() ? 0 : index + 1), 6000);
});

// Forms: submitted to Netlify Forms in the background so visitors stay on the page.
// Without JavaScript the form still posts normally and lands on /thank-you/.
document.querySelectorAll("form[data-ajax-form]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('button[type="submit"]');
    let status = form.querySelector(".form-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      status.setAttribute("role", "status");
      form.appendChild(status);
    }
    button.disabled = true;
    status.classList.remove("form-status--ok", "form-status--error");
    status.textContent = "Sending…";
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      status.textContent = form.name === "newsletter"
        ? "Thank you for subscribing!"
        : "Thank you! Your message has been sent. We'll get back to you within one business day.";
      status.classList.add("form-status--ok");
    } catch (err) {
      status.textContent = "Sorry, something went wrong. Please call or text us at 425-272-5931.";
      status.classList.add("form-status--error");
    } finally {
      button.disabled = false;
    }
  });
});

// Washington map: name the pin being hovered or tapped (helps on small screens)
document.querySelectorAll(".wa-map").forEach((map) => {
  const status = map.querySelector(".wa-map__status");
  if (!status) return;
  const show = (pin) => {
    if (active) { active.classList.remove("is-active"); active = null; }
    const name = pin.getAttribute("aria-label");
    status.innerHTML = `<i class="fa-solid fa-location-dot" aria-hidden="true"></i> <strong>${name}</strong>: we see patients here by secure video.`;
  };
  map.querySelectorAll(".wa-pin").forEach((pin) => {
    pin.addEventListener("mouseenter", () => show(pin));
    pin.addEventListener("focus", () => show(pin));
  });
  let active = null;
  map.querySelectorAll(".wa-map__main .wa-county").forEach((county) => {
    const pick = () => {
      if (active) active.classList.remove("is-active");
      active = county;
      county.classList.add("is-active");
      status.innerHTML = `<i class="fa-solid fa-map" aria-hidden="true"></i> <strong>${county.dataset.county}</strong>: we see patients here by secure video.`;
    };
    county.addEventListener("mouseenter", pick);
    county.addEventListener("click", pick);
  });
});
