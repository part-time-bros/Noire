/* ============================================================
   NOIRE — Scroll Animation System
   IntersectionObserver-based reveal engine
   TwinWaves Digital
   ============================================================ */

'use strict';

(function () {

  /* =====================
     SCROLL REVEAL ENGINE
     Observes elements with reveal classes and adds .visible
     ===================== */
  function initScrollReveals() {
    const revealSelectors = [
      '.reveal',
      '.reveal-wipe',
      '.reveal-scale',
      '.reveal-left',
      '.reveal-right',
    ];

    const elements = document.querySelectorAll(revealSelectors.join(', '));

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Fire once
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /* =====================
     STAGGER REVEAL GROUP
     Observes .reveal-group containers and staggers child reveals
     ===================== */
  function initStaggerGroups() {
    const groups = document.querySelectorAll('.reveal-group');

    if (!groups.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, i) => {
              setTimeout(() => {
                child.classList.add('visible');
              }, i * 80);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    groups.forEach((group) => {
      // Give children the base reveal class if they don't have one
      Array.from(group.children).forEach((child) => {
        if (!child.classList.contains('reveal') &&
            !child.classList.contains('reveal-scale') &&
            !child.classList.contains('reveal-left') &&
            !child.classList.contains('reveal-right')) {
          child.classList.add('reveal');
        }
      });
      observer.observe(group);
    });
  }

  /* =====================
     COUNTER ANIMATION
     Animates .counter elements from 0 to their data-target
     ===================== */
  function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');

    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-counter'), 10);
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1600;
            const startTime = performance.now();

            function tick(now) {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              el.textContent = Math.round(eased * target) + suffix;

              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            }

            requestAnimationFrame(tick);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  /* =====================
     PARALLAX (subtle, perf-safe)
     Elements with data-parallax="speed" shift on scroll
     ===================== */
  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    // Use rAF for smooth performance
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          elements.forEach((el) => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
            const rect = el.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const offset = (center - window.innerHeight / 2) * speed;
            el.style.transform = `translateY(${offset}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* =====================
     ACTIVE NAV LINK
     Sets active class on current page's nav link
     ===================== */
  function initActiveNav() {
    // The nav component handles this via the `page` attribute
    // This is a fallback for direct URL matching
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentFile) {
        link.classList.add('active');
      }
    });
  }

  /* =====================
     INIT
     ===================== */
  function init() {
    initScrollReveals();
    initStaggerGroups();
    initCounters();
    initParallax();
    initActiveNav();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
