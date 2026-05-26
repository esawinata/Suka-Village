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



  /* ═══════ 9. BOOKING MODAL ═══════ */
  const WEEKEND_DISCOUNT = 0.25;

  let modalState = {
    room: '',
    basePrice: 0,
    maxGuests: 1,
    guests: 1,
  };

  window.openBookingModal = function(roomName, basePrice, maxGuests) {
    modalState = { room: roomName, basePrice, maxGuests, guests: 1 };

    // Reset UI
    show('modalStep1');
    hide('modalStep2');
    hide('modalStep3');
    document.getElementById('bookingSummary').classList.add('hidden');
    document.getElementById('formError').classList.add('hidden');
    document.getElementById('leadName').value = '';
    document.getElementById('guestCount').textContent = '1';
    document.getElementById('guestMax').textContent = `max ${maxGuests}`;
    document.getElementById('modalTitle').textContent = roomName;
    document.getElementById('modalBasePrice').textContent =
      `Rp ${basePrice.toLocaleString('id-ID')} / malam`;

    // Set date range: today → today+7
    const today = new Date();
    const plus7 = new Date(today);
    plus7.setDate(today.getDate() + 7);

    const fmtDate = d => d.toISOString().split('T')[0];
    const ciEl = document.getElementById('checkIn');
    const coEl = document.getElementById('checkOut');

    ciEl.value = fmtDate(today);
    ciEl.min   = fmtDate(today);
    ciEl.max   = fmtDate(plus7);

    coEl.value = fmtDate(plus7);
    coEl.min   = fmtDate(today);
    coEl.max   = fmtDate(plus7);

    updateSummary();

    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
  };

  // Close on backdrop click
  document.getElementById('bookingModal').addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
  });

  window.changeGuest = function(delta) {
    const next = modalState.guests + delta;
    if (next < 1 || next > modalState.maxGuests) return;
    modalState.guests = next;
    document.getElementById('guestCount').textContent = next;
    updateSummary();
  };

  window.updateSummary = function() {
    const ci = document.getElementById('checkIn').value;
    const co = document.getElementById('checkOut').value;
    if (!ci || !co) return;

    const ciDate = new Date(ci);
    const coDate = new Date(co);
    const nights = Math.round((coDate - ciDate) / 86400000);
    if (nights <= 0) return;

    // Check if any night falls on Sat/Sun → apply weekend promo
    let hasWeekend = false;
    for (let d = new Date(ciDate); d < coDate; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day === 0 || day === 5 || day === 6) { hasWeekend = true; break; }
    }

    const raw   = modalState.basePrice * nights;
    const total = hasWeekend ? Math.round(raw * (1 - WEEKEND_DISCOUNT)) : raw;

    const fmt    = n => 'Rp ' + n.toLocaleString('id-ID');
    const fmtDt  = s => new Date(s).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' });

    document.getElementById('sumRoom').textContent      = modalState.room;
    document.getElementById('sumCheckin').textContent   = fmtDt(ci);
    document.getElementById('sumCheckout').textContent  = fmtDt(co);
    document.getElementById('sumNights').textContent    = `${nights} malam`;
    document.getElementById('sumGuests').textContent    = `${modalState.guests} tamu`;
    document.getElementById('sumTotal').textContent     = fmt(total);

    const promoRow = document.getElementById('promoRow');
    hasWeekend ? promoRow.classList.remove('hidden') : promoRow.classList.add('hidden');

    document.getElementById('bookingSummary').classList.remove('hidden');

    // Store for confirm step
    modalState.nights     = nights;
    modalState.total      = total;
    modalState.hasWeekend = hasWeekend;
    modalState.ciStr      = fmtDt(ci);
    modalState.coStr      = fmtDt(co);
  };

  window.proceedToConfirm = function() {
    const name = document.getElementById('leadName').value.trim();
    const ci   = document.getElementById('checkIn').value;
    const co   = document.getElementById('checkOut').value;
    const errEl = document.getElementById('formError');

    if (!ci || !co) { showError('Pilih tanggal check-in dan check-out.'); return; }
    if (!name)      { showError('Masukkan nama tamu utama.'); return; }
    if (!modalState.nights || modalState.nights <= 0) { showError('Tanggal tidak valid.'); return; }

    errEl.classList.add('hidden');
    modalState.leadName = name;

    const fmt = n => 'Rp ' + n.toLocaleString('id-ID');
    document.getElementById('confRoom').textContent    = modalState.room;
    document.getElementById('confName').textContent    = name;
    document.getElementById('confCheckin').textContent = modalState.ciStr;
    document.getElementById('confCheckout').textContent= modalState.coStr;
    document.getElementById('confNights').textContent  = `${modalState.nights} malam`;
    document.getElementById('confGuests').textContent  = `${modalState.guests} tamu`;
    document.getElementById('confTotal').textContent   = fmt(modalState.total);

    const pr = document.getElementById('confPromoRow');
    modalState.hasWeekend ? pr.classList.remove('hidden') : pr.classList.add('hidden');

    hide('modalStep1');
    show('modalStep2');
  };

  window.backToForm = function() {
    hide('modalStep2');
    show('modalStep1');
  };

  window.confirmBooking = function() {
    // Generate simple ref code
    const ref = 'SV-' + Date.now().toString(36).toUpperCase().slice(-6);
    document.getElementById('successName').textContent = modalState.leadName;
    document.getElementById('successRef').textContent  = ref;
    hide('modalStep2');
    show('modalStep3');
  };

  function showError(msg) {
    const el = document.getElementById('formError');
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  function show(id) { document.getElementById(id).classList.remove('hidden'); }
  function hide(id) { document.getElementById(id).classList.add('hidden'); }

})();
