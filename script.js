gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------
   1. Build headline: letter-spaced, split into chars
-------------------------------------------------- */
function buildHeadline() {
  const el = document.getElementById("headline");
  "WELCOME ITZFIZZ".split(" ").forEach((word) => {
    const w = document.createElement("span");
    w.className = "word";
    w.setAttribute("aria-hidden", "true");
    [...word].forEach((ch) => {
      const c = document.createElement("span");
      c.className = "char";
      c.textContent = ch;
      w.appendChild(c);
    });
    el.appendChild(w);
  });
}

/* -------------------------------------------------
   2. Load animation: headline stagger + stats one by one
-------------------------------------------------- */
function playIntro() {
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: initScroll, // set up scroll tweens after intro so start values are final
  });

  tl.from(".char", {
    yPercent: 110,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
  })
    .from(
      ".stat",
      { y: 40, opacity: 0, duration: 0.9, stagger: 0.18 },
      "-=0.4"
    )
    .from("#hint", { opacity: 0, duration: 0.8 }, "-=0.4");

  // Count numbers up as each stat appears
  document.querySelectorAll("[data-count]").forEach((span, i) => {
    const target = +span.dataset.count;
    const state = { v: 0 };
    tl.to(
      state,
      {
        v: target,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => (span.textContent = Math.round(state.v)),
      },
      0.9 + i * 0.18
    );
  });

  return tl;
}

/* -------------------------------------------------
   3. Scroll animation: tied to scroll progress (scrub)
   Only transforms + opacity are animated.
-------------------------------------------------- */
function initScroll() {
  const car = document.getElementById("car");
  const lanes = document.getElementById("lanes");

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=250%",
      pin: true,
      scrub: 1.2, // smoothing: lags the scrollbar by ~1.2s for a fluid feel
      invalidateOnRefresh: true,
    },
  });

  // Car drives up the screen, weaving gently, growing as it nears the "camera"
  tl.to(car, {
    keyframes: {
      x: [() => innerWidth * 0.12, () => -innerWidth * 0.12, 0],
      rotation: [6, -6, 0],
      easeEach: "sine.inOut",
    },
    y: () => -(innerHeight + car.offsetHeight * 1.4),
    scale: 1.35,
    duration: 1,
  }, 0);

  // Lane markings rush past (parallax: faster than the car)
  tl.to(lanes, { y: () => innerHeight * 1.2, duration: 1 }, 0);

  // Stats drift away + fade as the car passes
  tl.to(".stat", { y: -30, opacity: 0.15, stagger: 0.04, duration: 0.5 }, 0.45);
  tl.to("#headline", { y: -40, opacity: 0.2, duration: 0.5 }, 0.55);
  tl.to("#hint", { opacity: 0, duration: 0.1 }, 0);
}

/* ------------------------------------------------- */
buildHeadline();

if (reduceMotion) {
  document.querySelectorAll("[data-count]").forEach((s) => (s.textContent = s.dataset.count));
} else {
  playIntro();
}