/* ═══════════════════════════════════════════════════════════
   SUKA VILLAGE — script.js
   Features: Navbar scroll, fade-in on scroll, countdown,
             smooth scroll, gallery hover, hamburger menu
═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ═══════ 1. NAVBAR — blur / compact on scroll ═══════ */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load


  /* ═══════ 2. HAMBURGER MENU ═══════ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  hamburger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    // Animate hamburger → X
    const spans = hamburger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu when a link is tapped
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileMenu.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
    /* ═══════ 3. SMOOTH SCROLLING ═══════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ═══════ 4. SCROLL REVEAL (IntersectionObserver) ═══════ */
  // Activate hero fade-ups on load
  window.addEventListener('load', () => {
    document.querySelectorAll('.fade-up').forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + i * 150);
    });
  });
})();