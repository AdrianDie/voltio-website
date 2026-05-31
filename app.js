/* Voltio landing — motion & interactions
   Progressive enhancement: if GSAP is unavailable, the page stays
   fully visible and usable. Motion respects prefers-reduced-motion. */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");

  /* ---- Nav: burger toggle (works without GSAP) ---- */
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Nav: stuck shadow on scroll ---- */
  function onScroll() {
    if (nav) nav.classList.toggle("is-stuck", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var hasGSAP = typeof window.gsap !== "undefined";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!hasGSAP) return;               // page already visible, nothing to enhance
  document.documentElement.classList.add("js");

  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  if (reduce) {
    /* Reveal everything, skip cycling, show only the first scenario */
    gsap.set("[data-reveal]", { opacity: 1, y: 0 });
    document.querySelectorAll("#heroScenes .scene").forEach(function (s, i) {
      if (i > 0) s.style.display = "none";
    });
    return;
  }

  var EASE = "expo.out";

  /* ---- Scroll reveals ---- */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.fromTo(
      el,
      { opacity: 0, y: 26 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: EASE,
        scrollTrigger: { trigger: el, start: "top 86%", once: true }
      }
    );
  });

  /* ---- Floating shapes: gentle parallax on scroll + idle drift ---- */
  gsap.utils.toArray(".hero .floater, .finalcta .floater").forEach(function (f, i) {
    var depth = (i % 3) + 1;
    gsap.to(f, {
      yPercent: (i % 2 ? -1 : 1) * depth * 14,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to(f, {
      y: "+=12", duration: 3 + i * 0.4, ease: "sine.inOut",
      repeat: -1, yoyo: true, delay: i * 0.2
    });
  });

  /* ---- Hero scenarios: cycle the agent-in-action examples ---- */
  var scenes = gsap.utils.toArray("#heroScenes .scene");
  if (scenes.length) {
    function showScene(active) {
      scenes.forEach(function (s, i) {
        gsap.set(s, { display: i === active ? "flex" : "none" });
      });
      var s = scenes[active];
      gsap.fromTo(s, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: EASE });
      gsap.fromTo(
        s.querySelectorAll(".action"),
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.12, ease: EASE, delay: 0.15 }
      );
    }
    showScene(0);
    var sceneIdx = 0;
    setInterval(function () {
      sceneIdx = (sceneIdx + 1) % scenes.length;
      showScene(sceneIdx);
    }, 7000);
  }
})();
