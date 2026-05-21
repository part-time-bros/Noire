/* ============================================================
   NOIRE — Custom Cursor
   Desktop only. Degrades gracefully on touch devices.
   TwinWaves Digital
   ============================================================ */

'use strict';

(function () {

  // Only run on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  /* --- Create cursor DOM --- */
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  cursor.innerHTML = `
    <div class="cursor__ring"></div>
    <div class="cursor__dot"></div>
  `;
  document.body.appendChild(cursor);

  const ring = cursor.querySelector('.cursor__ring');
  const dot  = cursor.querySelector('.cursor__dot');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  /* --- Track mouse position --- */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot follows instantly
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  }, { passive: true });

  /* --- Ring lerps to mouse (smooth lag) --- */
  function animateRing() {
    const lerpFactor = 0.12;
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;

    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';

    requestAnimationFrame(animateRing);
  }

  animateRing();

  /* --- Hover states on interactive elements --- */
  const hoverTargets = [
    'a',
    'button',
    '.btn',
    '.nav__link',
    '.nav__cta',
    '.nav__logo',
    '.img-wrap',
    '.tag',
    '.footer__link',
    '[data-cursor-hover]',
  ];

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(hoverTargets.join(', '));
    if (target) {
      document.body.classList.add('cursor--hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(hoverTargets.join(', '));
    if (target) {
      document.body.classList.remove('cursor--hover');
    }
  }, { passive: true });

  /* --- Hide cursor when it leaves the window --- */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });

})();
