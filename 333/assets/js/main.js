/* ============================================================
   3/33 — Computer Club · interactions
   ============================================================ */
(function () {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ----------------------------------------------------------
     1. Custom cursor — follows the mouse AND stays glued to the
        page while scrolling (re-evaluates what's under it).
     ---------------------------------------------------------- */
  function initCursor() {
    if (!finePointer || reduced) return;

    const cursor = doc.querySelector(".cursor");
    const dot = doc.querySelector(".cursor__dot");
    const ring = doc.querySelector(".cursor__ring");
    if (!cursor || !dot || !ring) return;

    doc.body.classList.add("cursor-on");

    // last known pointer position in viewport (client) coords
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    // smoothed ring position
    let rx = mx;
    let ry = my;
    let hasMoved = false;

    const interactiveSel = "a, button, input, textarea, select, label, [data-cursor]";

    // Update hover/interactive state from whatever sits under the pointer.
    // Called on mousemove *and* on scroll, so the cursor reacts to content
    // sliding beneath it as the page scrolls.
    function syncHoverState() {
      const el = doc.elementFromPoint(mx, my);
      const hot = el && el.closest(interactiveSel);
      cursor.classList.toggle("is-hover", !!hot);
    }

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!hasMoved) {
          hasMoved = true;
          rx = mx;
          ry = my;
          cursor.classList.remove("is-hidden");
        }
        // dot is instant, ring trails in the rAF loop
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        syncHoverState();
      },
      { passive: true }
    );

    // The core of "cursor follows scroll": the pointer's client position
    // doesn't change on scroll, but the element beneath it does — so we
    // re-sync the hover state and nudge the visuals to stay locked on.
    window.addEventListener(
      "scroll",
      () => {
        if (!hasMoved) return;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        syncHoverState();
      },
      { passive: true }
    );

    doc.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    doc.addEventListener("mouseup", () => cursor.classList.remove("is-down"));
    doc.addEventListener("mouseleave", () => cursor.classList.add("is-hidden"));
    doc.addEventListener("mouseenter", () => cursor.classList.remove("is-hidden"));

    (function loop() {
      rx = lerp(rx, mx, 0.18);
      ry = lerp(ry, my, 0.18);
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ----------------------------------------------------------
     2. Magnetic elements (buttons / links pull toward cursor)
     ---------------------------------------------------------- */
  function initMagnetic() {
    if (!finePointer || reduced) return;
    doc.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------
     3. Tilt cards (subtle 3D on hover)
     ---------------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduced) return;
    doc.querySelectorAll("[data-tilt]").forEach((el) => {
      const max = 6;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-6px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ----------------------------------------------------------
     4. Reveal on scroll
     ---------------------------------------------------------- */
  function initReveal() {
    const items = doc.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en, i) => {
          if (en.isIntersecting) {
            const el = en.target;
            // tiny stagger for siblings entering together
            const delay = Math.min(i * 60, 240);
            setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    items.forEach((i) => io.observe(i));
  }

  /* ----------------------------------------------------------
     5. Animated stat counters
     ---------------------------------------------------------- */
  function initCounters() {
    const nums = doc.querySelectorAll("[data-count]");
    if (!nums.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      nums.forEach((n) => {
        n.textContent = n.dataset.count + (n.dataset.suffix || "");
      });
      return;
    }
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400;
      const start = performance.now();
      const step = (now) => {
        const p = clamp((now - start) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            run(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ----------------------------------------------------------
     6. Header state + scroll-spy active nav
     ---------------------------------------------------------- */
  function initHeader() {
    const header = doc.querySelector(".header");
    const navLinks = Array.from(doc.querySelectorAll(".nav a"));
    const sections = navLinks
      .map((a) => doc.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const onScroll = () => {
      if (header) header.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if ("IntersectionObserver" in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              const id = "#" + en.target.id;
              navLinks.forEach((a) =>
                a.classList.toggle("is-active", a.getAttribute("href") === id)
              );
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ----------------------------------------------------------
     7. Mobile menu
     ---------------------------------------------------------- */
  function initMenu() {
    const burger = doc.getElementById("burger");
    const menu = doc.getElementById("mobileMenu");
    if (!burger || !menu) return;
    const close = () => {
      burger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      doc.body.style.overflow = "";
    };
    burger.addEventListener("click", () => {
      const open = burger.getAttribute("aria-expanded") === "true";
      if (open) return close();
      burger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      doc.body.style.overflow = "hidden";
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  /* ----------------------------------------------------------
     8. Parallax on background glows + hero visual
     ---------------------------------------------------------- */
  function initParallax() {
    if (reduced) return;
    const glows = doc.querySelectorAll(".bg__glow");
    const visual = doc.querySelector("[data-parallax]");
    let ticking = false;
    const apply = () => {
      const y = window.scrollY;
      glows.forEach((g, i) => {
        const speed = (i + 1) * 0.04;
        g.style.transform = `translateY(${y * speed}px)`;
      });
      if (visual && window.innerWidth > 1024) {
        visual.style.transform = `translateY(${y * -0.05}px)`;
      }
      ticking = false;
    };
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(apply);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------
     9. Loader + misc
     ---------------------------------------------------------- */
  function initMisc() {
    const year = doc.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const loader = doc.getElementById("loader");
    if (loader) {
      window.addEventListener("load", () => {
        setTimeout(() => loader.classList.add("is-done"), 600);
      });
      // safety: never let the loader trap the page
      setTimeout(() => loader.classList.add("is-done"), 2600);
    }
  }

  /* ---------------------------------------------------------- */
  function init() {
    initCursor();
    initMagnetic();
    initTilt();
    initReveal();
    initCounters();
    initHeader();
    initMenu();
    initParallax();
    initMisc();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
