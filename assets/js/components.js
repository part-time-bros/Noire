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
