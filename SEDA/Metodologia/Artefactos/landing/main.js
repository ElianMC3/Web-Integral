/**
 * SEDA — Landing Page · main.js
 * Sistema de Entrega y Distribución Alimentaria
 * Equipo 4 · UTCV · 2025
 *
 * Comportamientos interactivos de la landing:
 *  - Navbar: efecto de sombra al hacer scroll
 *  - Animaciones de entrada por intersección (IntersectionObserver)
 *  - Contador animado de las métricas del Hero
 *  - Menú mobile (hamburger toggle)
 *  - Scroll suave a secciones internas
 */

'use strict';

/* ============================================================
   1. NAVBAR — Sombra elevada al hacer scroll
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.querySelector('nav.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }, { passive: true });
})();

/* ============================================================
   2. MENÚ MOBILE — Toggle hamburger
   ============================================================ */
(function initMobileMenu() {
  const toggleBtn  = document.getElementById('nav-toggle');
  const navLinks   = document.querySelector('.navbar-links');
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
    '.ps-card, .module-card, .arch-layer, .role-card, .pwa-banner, .hero-stats'
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
    // Escalonar la animación según el índice dentro del mismo grupo
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
    observer.observe(el);
  });
})();

/* ============================================================
   4. CONTADOR ANIMADO — Métricas del Hero
   ============================================================ */
(function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.counter);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800; // ms
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOutQuart(progress) * target;

      el.textContent = prefix + (Number.isInteger(target)
        ? Math.round(value)
        : value.toFixed(1)) + suffix;

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Disparar cuando el hero-stats entra en vista
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection || !('IntersectionObserver' in window)) return;

  const once = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(animateCounter);
        once.disconnect();
      }
    });
  }, { threshold: 0.5 });

  once.observe(statsSection);
})();

/* ============================================================
   5. SCROLL SUAVE — Botones CTA internos
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
   6. AÑO DINÁMICO EN EL FOOTER
   ============================================================ */
(function setCurrentYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
