/* ============================================================
   NOIRE — Utility Functions
   Shared helpers across all pages
   TwinWaves Digital
   ============================================================ */

'use strict';

/* --- Debounce --- */
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* --- Throttle --- */
function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/* --- Show Toast Notification ---
   Usage: showToast('Title', 'Message text', 3000)
   ------------------------------------------ */
function showToast(title, message, duration = 4000) {
  // Remove any existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div class="toast__title">${title}</div>
    <div class="toast__msg">${message}</div>
  `;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });
  });

  // Animate out
  setTimeout(() => {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

/* --- Validate Email --- */
function isValidEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email.trim());
}

/* --- Validate Phone (Indian format) --- */
function isValidPhone(phone) {
  const cleaned = phone.replace(/\s+/g, '');
  const pattern = /^(\+91|91|0)?[6-9]\d{9}$/;
  return pattern.test(cleaned);
}

/* --- Format Date Display ---
   Usage: formatDate(new Date()) => "Tuesday, 21 May 2026"
   ------------------------------------------ */
function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* --- Get element offset from top --- */
function getOffsetTop(el) {
  let top = 0;
  while (el) {
    top += el.offsetTop;
    el = el.offsetParent;
  }
  return top;
}

/* --- Smooth scroll to element --- */
function scrollToEl(selector, offset = 80) {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = getOffsetTop(el) - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/* --- Lock / unlock body scroll --- */
function lockScroll() {
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  document.body.style.overflow = '';
}

/* --- Expose to global scope --- */
window.NoireUtils = {
  debounce,
  throttle,
  showToast,
  isValidEmail,
  isValidPhone,
  formatDate,
  scrollToEl,
  lockScroll,
  unlockScroll,
};
