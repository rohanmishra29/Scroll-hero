gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function playIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

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
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

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

  tl.to(lanes, { y: () => innerHeight * 1.2, duration: 1 }, 0);

  tl.fromTo(
    ".stat",
    { y: 0, opacity: 1 },
    { y: -30, opacity: 0.15, stagger: 0.04, duration: 0.5, immediateRender: false },
    0.45
  );
  tl.fromTo(
    "#headline",
    { y: 0, opacity: 1 },
    { y: -40, opacity: 0.2, duration: 0.5, immediateRender: false },
    0.55
  );
  tl.fromTo(
    "#hint",
    { opacity: 1 },
    { opacity: 0, duration: 0.1, immediateRender: false },
    0
  );
}

buildHeadline();

if (reduceMotion) {
  document.querySelectorAll("[data-count]").forEach((s) => (s.textContent = s.dataset.count));
} else {
  playIntro();
  initScroll();
}