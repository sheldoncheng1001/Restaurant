/* ============================
   PHỞ BÒ HÀ NỘI — script.js
   ============================ */

(function () {
  'use strict';

  // ---- Navbar scroll effect ----
  const header = document.getElementById('site-header');

  function updateNavbar() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Apply immediately so navbar is visible on page load
  header.classList.add('scrolled');
  window.addEventListener('scroll', updateNavbar, { passive: true });

  // ---- Hamburger menu ----
  const hamburger = document.getElementById('hamburger-btn');
  const navLinks = document.getElementById('navbar-links');

  hamburger.addEventListener('click', function () {
    const isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!isOpen));
    this.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.navbar-links a');

  var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 76;

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navItems.forEach(function (item) { item.classList.remove('active'); });
        var active = document.querySelector('.navbar-links a[href="#' + entry.target.id + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, {
    root: null,
    rootMargin: '-' + navH + 'px 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(function (section) { sectionObserver.observe(section); });

  // ---- Fade-in on scroll ----
  var fadeEls = document.querySelectorAll(
    '.menu-card, .spice-card, .testimonial-card, .gallery-item, .contact-item'
  );

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
  });

  // ---- Reservation form ----
  var form = document.getElementById('reservation-form');
  var submitBtn = document.getElementById('submit-reservation-btn');

  if (form && submitBtn) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var originalText = submitBtn.textContent;
      submitBtn.textContent = 'Đang xử lý...';
      submitBtn.disabled = true;

      setTimeout(function () {
        submitBtn.textContent = '✓ Đặt bàn thành công!';
        submitBtn.style.background = '#2D7A3A';
        submitBtn.style.borderColor = '#2D7A3A';

        setTimeout(function () {
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.borderColor = '';
        }, 3000);
      }, 1200);
    });
  }
})();
