/* ============================================================
   NOIRE — Shared Web Components
   <noire-nav> and <noire-footer> custom elements
   Edit once, updates all 6 pages.
   TwinWaves Digital
   ============================================================ */

'use strict';

/* =====================
   NAVIGATION COMPONENT
   ===================== */
class NoireNav extends HTMLElement {
  constructor() {
    super();
    this._scrollHandler = this._onScroll.bind(this);
    this._currentPage = '';
  }

  connectedCallback() {
    this._currentPage = this.getAttribute('page') || '';
    this.render();
    this._bindEvents();
    window.addEventListener('scroll', this._scrollHandler, { passive: true });
    this._onScroll(); // Set initial state
  }

  disconnectedCallback() {
    window.removeEventListener('scroll', this._scrollHandler);
  }

  _onScroll() {
    const nav = this.querySelector('.nav');
    if (!nav) return;
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  _bindEvents() {
    const hamburger = this.querySelector('.nav__hamburger');
    const mobileMenu = this.querySelector('.nav__mobile-menu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileMenu.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close menu on mobile link click
    const mobileLinks = mobileMenu.querySelectorAll('.nav__mobile-link, .nav__mobile-cta');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  _isActive(page) {
    return this._currentPage === page ? 'active' : '';
  }

  render() {
    const links = [
      { href: 'index.html',    label: 'Home',        page: 'home' },
      { href: 'services.html', label: 'Services',    page: 'services' },
      { href: 'team.html',     label: 'Our Artists', page: 'team' },
      { href: 'gallery.html',  label: 'Gallery',     page: 'gallery' },
      { href: 'about.html',    label: 'About',       page: 'about' },
    ];

    const desktopLinks = links.map(l =>
      `<a href="${l.href}" class="nav__link ${this._isActive(l.page)}">${l.label}</a>`
    ).join('');

    const mobileLinks = links.map(l =>
      `<a href="${l.href}" class="nav__mobile-link ${this._isActive(l.page)}">${l.label}</a>`
    ).join('');

    this.innerHTML = `
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <div class="nav__inner">
          <a href="index.html" class="nav__logo" aria-label="NOIRE — Home">NOIRE</a>

          <div class="nav__links" role="list">
            ${desktopLinks}
          </div>

          <a href="contact.html" class="nav__cta">Book Now</a>

          <button class="nav__hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <div class="nav__mobile-menu" role="dialog" aria-label="Mobile navigation menu">
        ${mobileLinks}
        <a href="contact.html" class="nav__mobile-cta">Book an Appointment →</a>
      </div>
    `;
  }
}

/* =====================
   FOOTER COMPONENT
   ===================== */
class NoireFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="footer" role="contentinfo">
        <div class="container">
          <div class="footer__grid">

            <!-- Brand Column -->
            <div class="footer__brand">
              <div class="footer__brand-name">NOIRE</div>
              <p class="footer__brand-tagline">"Where craft meets ritual."</p>
              <p class="body-sm" style="max-width:280px; color: var(--color-text-dim);">
                A premium unisex salon experience. Expert stylists, curated treatments, and a space designed for you.
              </p>
            </div>

            <!-- Navigation Column -->
            <div>
              <div class="footer__col-title">Navigate</div>
              <ul class="footer__links">
                <li><a href="index.html" class="footer__link hover-line">Home</a></li>
                <li><a href="services.html" class="footer__link hover-line">Services</a></li>
                <li><a href="team.html" class="footer__link hover-line">Our Artists</a></li>
                <li><a href="gallery.html" class="footer__link hover-line">Gallery</a></li>
                <li><a href="about.html" class="footer__link hover-line">About</a></li>
                <li><a href="contact.html" class="footer__link hover-line">Contact</a></li>
              </ul>
            </div>

            <!-- Services Column -->
            <div>
              <div class="footer__col-title">Services</div>
              <ul class="footer__links">
                <li><span class="footer__link">Hair &amp; Colour</span></li>
                <li><span class="footer__link">Skincare</span></li>
                <li><span class="footer__link">Nail Care</span></li>
                <li><span class="footer__link">Bridal</span></li>
                <li><span class="footer__link">Men's Grooming</span></li>
                <li><span class="footer__link">Wellness</span></li>
              </ul>
            </div>

            <!-- Contact Column -->
            <div>
              <div class="footer__col-title">Find Us</div>
              <address class="footer__address">
                <strong>Mumbai, Maharashtra</strong>
                42 Pali Hill, Bandra West<br>
                Mumbai 400 050
              </address>
              <div style="margin-top: var(--space-lg);">
                <div class="footer__col-title" style="margin-top: var(--space-lg); margin-bottom: var(--space-sm);">Hours</div>
                <p class="body-sm">Tue – Sun: 10am – 8pm</p>
                <p class="body-sm">Monday: Closed</p>
              </div>
              <div style="margin-top: var(--space-lg);">
                <div class="footer__col-title" style="margin-bottom: var(--space-sm);">Contact</div>
                <a href="tel:+912234567890" class="footer__link body-sm hover-line">+91 22 3456 7890</a><br>
                <a href="mailto:hello@noire.in" class="footer__link body-sm hover-line" style="margin-top: var(--space-xs); display:inline-block;">hello@noire.in</a>
              </div>
            </div>

          </div>

          <div class="footer__bottom">
            <p class="footer__copy">
              © ${year} <span>NOIRE</span>. All rights reserved.
            </p>
            <p class="footer__made-by">
              Crafted by <a href="https://twinwaves.in" target="_blank" rel="noopener">TwinWaves Digital</a>
            </p>
          </div>
        </div>
      </footer>
    `;
  }
}

/* =====================
   REGISTER COMPONENTS
   ===================== */
customElements.define('noire-nav', NoireNav);
customElements.define('noire-footer', NoireFooter);

/* =====================
   WHATSAPP BUTTON
   Injected on every page automatically
   ===================== */
function initWhatsApp() {
  // Don't add if already exists
  if (document.querySelector('.wa-btn')) return;

  var btn = document.createElement('a');
  btn.className = 'wa-btn';
  btn.href = 'https://wa.me/912234567890?text=Hi%20NOIRE!%20I%27d%20like%20to%20book%20an%20appointment.';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.innerHTML = `
    <span class="wa-btn__label">Chat with us</span>
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  `;

  document.body.appendChild(btn);
}

/* =====================
   PRELOADER
   Shows NOIRE wordmark on first session visit only
   ===================== */
function initPreloader() {
  // Only show once per session
  if (sessionStorage.getItem('noire_visited')) return;
  sessionStorage.setItem('noire_visited', '1');

  // Don't show if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var preloader = document.createElement('div');
  preloader.className = 'preloader';
  preloader.setAttribute('aria-hidden', 'true');
  preloader.innerHTML = `
    <div class="preloader__wordmark">NOIRE</div>
    <div class="preloader__line"></div>
  `;

  document.body.appendChild(preloader);
  document.body.style.overflow = 'hidden';

  // Trigger entry animation
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      preloader.classList.add('ready');
    });
  });

  // Exit after 1.6s
  setTimeout(function () {
    preloader.classList.add('exit');

    // Wait for exit animation, then apply final clip-path
    setTimeout(function () {
      preloader.classList.add('exit-done');
    }, 200);

    // Remove from DOM after animation completes
    setTimeout(function () {
      if (preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
      document.body.style.overflow = '';
    }, 900);
  }, 1600);
}

/* =====================
   PAGE TRANSITIONS
   Black curtain wipes in on link click, page loads, curtain exits.

   BFCACHE FIX: Browser back/forward gestures restore pages from memory
   (bfcache) without firing DOMContentLoaded. The pageshow event with
   event.persisted=true is the only reliable hook for this case.
   ===================== */
function initPageTransitions() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var curtain = document.createElement('div');
  curtain.className = 'page-curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);

  /* ── BFCACHE RESTORE (back/forward gesture) ──────────────────────────
     When the user swipes back, the browser restores the page from memory.
     DOMContentLoaded does NOT fire. The curtain may be stuck in `.in`
     state from when the user last left this page. Reset it instantly.
  ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      // Kill transition so reset is instant — no animation
      curtain.style.transition = 'none';
      curtain.classList.remove('in');
      curtain.style.transform = '';
      document.body.style.overflow = '';
      sessionStorage.removeItem('noire_transitioning');
      // Force reflow, then restore transition property for future use
      void curtain.offsetHeight;
      curtain.style.transition = '';
    }
  });

  /* ── ARRIVING via forward link transition ────────────────────────────
     Standard page load after a link click. Curtain comes in from bottom
     on previous page, then exits upward on new page.
  ─────────────────────────────────────────────────────────────────────── */
  if (sessionStorage.getItem('noire_transitioning')) {
    sessionStorage.removeItem('noire_transitioning');
    curtain.classList.add('in');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        curtain.style.transition = 'transform 480ms var(--ease-out-expo)';
        curtain.style.transform = 'translateY(-100%)';
      });
    });
    setTimeout(function () {
      curtain.style.transform = '';
      curtain.style.transition = '';
      curtain.classList.remove('in');
      document.body.style.overflow = '';
    }, 520);
  }

  /* ── LEAVING via link click ──────────────────────────────────────────
     Intercept internal anchor clicks, animate curtain in, then navigate.
  ─────────────────────────────────────────────────────────────────────── */
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href) return;

    var isInternal = !href.startsWith('http') &&
                     !href.startsWith('//') &&
                     !href.startsWith('mailto') &&
                     !href.startsWith('tel') &&
                     !href.startsWith('#') &&
                     !href.startsWith('wa.me') &&
                     (href.endsWith('.html') || href === '/');

    if (!isInternal) return;
    if (link.target === '_blank') return;

    e.preventDefault();
    curtain.classList.add('in');
    sessionStorage.setItem('noire_transitioning', '1');

    setTimeout(function () {
      window.location.href = href;
    }, 420);
  });

  /* ── CLEANUP on pagehide ─────────────────────────────────────────────
     Clear the transitioning flag if the user navigates away by any means
     other than our link intercept (e.g. address bar). Prevents orphaned
     flags causing curtain to show on unrelated page loads.
  ─────────────────────────────────────────────────────────────────────── */
  window.addEventListener('pagehide', function (event) {
    // Only clear if NOT entering bfcache (i.e. a real unload)
    if (!event.persisted) {
      sessionStorage.removeItem('noire_transitioning');
    }
  });
}

/* =====================
   GLOBAL INIT
   Runs on every page after DOM is ready
   ===================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () {
    initWhatsApp();
    initPreloader();
    initPageTransitions();
  });
} else {
  initWhatsApp();
  initPreloader();
  initPageTransitions();
}
