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

  // Reveal sections on scroll
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children with delay class
          entry.target.querySelectorAll('.delay-1').forEach(el => {
            el.style.transitionDelay = '0.15s';
          });
          entry.target.querySelectorAll('.delay-2').forEach(el => {
            el.style.transitionDelay = '0.30s';
          });
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ═══════ 5. PROMO COUNTDOWN ═══════ */
  // Target: next Saturday midnight
  function getNextSaturday() {
    const now = new Date();
    const day = now.getDay(); // 0=Sun … 6=Sat
    const daysUntilSat = (6 - day + 7) % 7 || 7;
    const target = new Date(now);
    target.setDate(now.getDate() + daysUntilSat);
    target.setHours(23, 59, 59, 0);
    return target;
  }

  const countdownEnd = getNextSaturday();

  const cdD = document.getElementById('cd-d');
  const cdH = document.getElementById('cd-h');
  const cdM = document.getElementById('cd-m');
  const cdS = document.getElementById('cd-s');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateCountdown() {
    const now   = new Date();
    const diff  = countdownEnd - now;

    if (diff <= 0) {
      cdD.textContent = cdH.textContent = cdM.textContent = cdS.textContent = '00';
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    cdD.textContent = pad(days);
    cdH.textContent = pad(hours);
    cdM.textContent = pad(mins);
    cdS.textContent = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ═══════ 6. GALLERY — tilt on hover (desktop) ═══════ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.g-item').forEach(item => {
      item.addEventListener('mousemove', (e) => {
        const rect   = item.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        item.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
      });
      item.addEventListener('mouseleave', () => {
        item.style.transform = '';
        item.style.transition = 'transform 0.5s ease';
      });
      item.addEventListener('mouseenter', () => {
        item.style.transition = 'transform 0.1s ease';
      });
    });
  }


  /* ═══════ 7. ROOM CARDS — staggered reveal ═══════ */
  const roomObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cards = document.querySelectorAll('.room-card');
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), i * 140);
          });
          roomObserver.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );

  const roomsSection = document.querySelector('.rooms-grid');
  if (roomsSection) roomObserver.observe(roomsSection);


  /* ═══════ 8. HERO — parallax on scroll ═══════ */
  const heroBg = document.querySelector('.hero-bg img');

  function heroParallax() {
    if (!heroBg) return;
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${scrollY * 0.25}px)`;
  }

  window.addEventListener('scroll', heroParallax, { passive: true });

})();
