/* ============================================================
   PHỞ BÒ HÀ NỘI — Interactive JavaScript
   Features: Navbar scroll, mobile menu, scroll reveal, form
   ============================================================ */

'use strict';

// ---- NAVBAR SCROLL BEHAVIOR ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 60) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();


// ---- HERO BG PARALLAX & IMAGE LOAD ----
(function initHero() {
  const heroBgImg = document.querySelector('.hero-bg-img');
  if (!heroBgImg) return;

  heroBgImg.addEventListener('load', () => {
    heroBgImg.classList.add('loaded');
  });

  // If already cached/loaded
  if (heroBgImg.complete) {
    heroBgImg.classList.add('loaded');
  }

  // Subtle parallax on scroll
  window.addEventListener('scroll', () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const scrolled = window.scrollY;
    const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    if (scrolled < heroHeight) {
      heroBgImg.style.transform = `scale(1) translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
})();


// ---- MOBILE HAMBURGER MENU ----
(function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navbarLinks = document.getElementById('navbar-links');
  if (!hamburgerBtn || !navbarLinks) return;

  let isOpen = false;

  function openMenu() {
    isOpen = true;
    hamburgerBtn.classList.add('open');
    navbarLinks.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    hamburgerBtn.setAttribute('aria-label', 'Đóng menu');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    isOpen = false;
    hamburgerBtn.classList.remove('open');
    navbarLinks.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    hamburgerBtn.setAttribute('aria-label', 'Mở menu');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  navbarLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) closeMenu();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });
})();


// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
})();


// ---- SCROLL REVEAL (Intersection Observer) ----
(function initScrollReveal() {
  // Add reveal classes to elements
  const revealTargets = [
    { selector: '.story-grid > *', delayStep: 100 },
    { selector: '.menu-card', delayStep: 80 },
    { selector: '.spice-card', delayStep: 80 },
    { selector: '.gallery-item', delayStep: 80 },
    { selector: '.testimonial-card', delayStep: 100 },
    { selector: '.contact-grid > *', delayStep: 150 },
    { selector: '.section-header', delayStep: 0 },
  ];

  revealTargets.forEach(({ selector, delayStep }) => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('reveal');
      if (delayStep > 0) {
        el.style.transitionDelay = `${index * delayStep}ms`;
      }
    });
  });

  // Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ---- ACTIVE NAV LINK (Scroll Spy) ----
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
})();


// ---- RESERVATION FORM ----
(function initReservationForm() {
  const form = document.getElementById('reservation-form');
  const submitBtn = document.getElementById('submit-reservation-btn');
  if (!form || !submitBtn) return;

  // Set min date to today
  const dateInput = document.getElementById('res-date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById('res-name')?.value.trim();
    const phone = document.getElementById('res-phone')?.value.trim();
    const date = document.getElementById('res-date')?.value;
    const time = document.getElementById('res-time')?.value;
    const guests = document.getElementById('res-guests')?.value;

    if (!name || !phone || !date || !time || !guests) {
      showFormMessage('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xử lý...';

    setTimeout(() => {
      showFormMessage(
        `✓ Cảm ơn ${name}! Đặt bàn của bạn đã được xác nhận. Chúng tôi sẽ gọi lại trong vòng 30 phút.`,
        'success'
      );
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Xác Nhận Đặt Bàn';
    }, 1500);
  });

  function showFormMessage(msg, type) {
    // Remove existing message
    const existing = form.querySelector('.form-message');
    if (existing) existing.remove();

    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message--${type}`;
    msgEl.setAttribute('role', 'alert');
    msgEl.textContent = msg;

    // Inline styles for the message
    Object.assign(msgEl.style, {
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      marginTop: '12px',
      background: type === 'success'
        ? 'rgba(145, 200, 80, 0.12)'
        : 'rgba(200, 60, 60, 0.12)',
      color: type === 'success' ? '#a8d870' : '#e07070',
      border: `1px solid ${type === 'success' ? 'rgba(145, 200, 80, 0.3)' : 'rgba(200, 60, 60, 0.3)'}`,
    });

    form.appendChild(msgEl);

    if (type === 'success') {
      setTimeout(() => {
        msgEl.style.opacity = '0';
        msgEl.style.transition = 'opacity 0.5s';
        setTimeout(() => msgEl.remove(), 500);
      }, 5000);
    }
  }
})();


// ---- ACTIVE NAV STYLE ----
(function addNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .navbar-links a.active {
      color: var(--sys-color-primary) !important;
    }
    .navbar-links a.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
})();


// ---- STAT COUNTER ANIMATION ----
(function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent;

          // Only animate pure numbers
          if (/^\d+$/.test(text)) {
            const target = parseInt(text, 10);
            let current = 0;
            const duration = 1200;
            const step = target / (duration / 16);

            const timer = setInterval(() => {
              current = Math.min(current + step, target);
              el.textContent = Math.floor(current);
              if (current >= target) {
                clearInterval(timer);
                el.textContent = target;
              }
            }, 16);
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach(el => observer.observe(el));
})();
