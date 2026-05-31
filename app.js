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

  var gsap = window.gsap;
  if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);

  if (reduce) {
    /* Skip the looping demo; show a sensible static state */
    var ap = document.querySelector(".demo-approve");
    if (ap) ap.style.display = "none";
    return;
  }

  var EASE = "expo.out";

  /* ---- Hero chat demo: answers directly, then drafts-and-asks when unsure ---- */
  var chat = document.getElementById("demoChat");
  if (chat) {
    var u1 = chat.querySelector('.bubble--user[data-grp="1"]');
    var a1 = chat.querySelector('.bubble--sent[data-grp="1"]');
    var u2 = chat.querySelector('.bubble--user[data-grp="2"]');
    var draft = chat.querySelector('.demo-approve[data-grp="2"]');
    var sent2 = chat.querySelector('.bubble--sent[data-grp="2"]');
    var approveBtn = draft ? draft.querySelector(".chip--approve") : null;

    function resetDemo() {
      gsap.set([u1, a1, u2], { opacity: 0, y: 14, display: "block" });
      gsap.set(draft, { opacity: 0, y: 14, scale: 1, display: "block" });
      gsap.set(sent2, { opacity: 0, y: 14, display: "none" });
      if (approveBtn) gsap.set(approveBtn, { scale: 1 });
    }
    resetDemo();

    var tl = gsap.timeline({
      repeat: -1, repeatDelay: 1.8,
      scrollTrigger: { trigger: ".demo-card", start: "top 80%" },
      onRepeat: resetDemo
    });

    /* Exchange 1: confident -> answers the customer itself */
    tl.to(u1, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, 0.3)
      .to(a1, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, 1.1)
      /* clear exchange 1 so the card stays compact */
      .to([u1, a1], { opacity: 0, y: -10, duration: 0.4, ease: "power2.in" }, 2.9)
      .set([u1, a1], { display: "none" })
      /* Exchange 2: unsure -> draft for approval -> sent */
      .to(u2, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, 3.4)
      .to(draft, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, 4.1);

    if (approveBtn) {
      tl.to(approveBtn, { scale: 0.92, duration: 0.12, ease: "power2.out" }, 5.1)
        .to(approveBtn, { scale: 1, duration: 0.18, ease: "back.out(2)" }, 5.22);
    }

    tl.to(draft, { opacity: 0, y: -10, scale: 0.97, duration: 0.35, ease: "power2.in" }, 5.5)
      .set(draft, { display: "none" })
      .set(sent2, { display: "block" })
      .to(sent2, { opacity: 1, y: 0, duration: 0.5, ease: EASE }, ">-0.05");
  }
})();
