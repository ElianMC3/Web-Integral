/**
 * SEDA — Landing Page · main.js
 * Comportamientos interactivos orientados al usuario final.
 *
 *  1. Navbar — sombra al hacer scroll
 *  2. Menú mobile — hamburger toggle
 *  3. Animaciones de entrada — IntersectionObserver
 *  4. Contadores animados — métricas del Hero e Impacto
 *  5. Scroll suave — navegación interna
 *  6. Año dinámico — footer
 */

'use strict';

/* ============================================================
   1. NAVBAR — Sombra al hacer scroll
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.querySelector('nav.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* ============================================================
   2. MENÚ MOBILE — Toggle hamburger
   ============================================================ */
(function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('navbar-links--open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.classList.toggle('is-active', isOpen);
  });

  // Cerrar al hacer clic en un link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('navbar-links--open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.classList.remove('is-active');
    });
  });
})();

/* ============================================================
   3. ANIMACIONES DE ENTRADA — IntersectionObserver
   ============================================================ */
(function initRevealAnimations() {
  const targets = document.querySelectorAll(
    '.ps-card, .step-card, .benefit-card, .impact-card, .cta-box, .hero-stats'
  );

  if (!('IntersectionObserver' in window) || targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
})();

/* ============================================================
   4. CONTADORES ANIMADOS — Métricas
   ============================================================ */
(function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.counter);
    const suffix   = el.dataset.suffix || '';
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOutQuart(progress) * target;

      el.textContent = (Number.isInteger(target)
        ? Math.round(value)
        : value.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Observar cada grupo de contadores por separado
  const counterSections = document.querySelectorAll('.hero-stats, .impact-grid');
  counterSections.forEach(section => {
    const sectionCounters = section.querySelectorAll('[data-counter]');
    if (!sectionCounters.length) return;

    const once = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionCounters.forEach(animateCounter);
          once.disconnect();
        }
      });
    }, { threshold: 0.4 });

    once.observe(section);
  });
})();

/* ============================================================
   5. SCROLL SUAVE — Navegación interna
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = document.querySelector('nav.navbar')?.offsetHeight ?? 68;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   6. AÑO DINÁMICO — Footer
   ============================================================ */
(function setCurrentYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
