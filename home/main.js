/**
 * Next360 Website — main.js
 * Vanilla JS interactivity for all public pages.
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── 1. Navbar scroll effect ──────────────────────────────────────────
  var navbar = document.querySelector('.nx-navbar');
  if (navbar) {
    var onScroll = function () {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 2. Mobile nav auto-close ─────────────────────────────────────────
  var mainNav = document.getElementById('mainNav');
  if (mainNav) {
    mainNav.addEventListener('click', function (e) {
      if (e.target.classList.contains('nav-link') && mainNav.classList.contains('show')) {
        var instance = bootstrap.Collapse.getInstance(mainNav);
        if (instance) instance.hide();
      }
    });
  }

  // ── 3. Back-to-top button ────────────────────────────────────────────
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 4. Scroll-triggered fade-in animations ───────────────────────────
  var animatedEls = document.querySelectorAll('.animate-on-scroll');
  if (animatedEls.length && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animatedEls.forEach(function (el) { fadeObserver.observe(el); });
  }

  // ── 5. Smooth scroll for anchor links ────────────────────────────────
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var hash = link.getAttribute('href');
    if (!hash || hash === '#' || hash === '#search') return;
    var target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    var navHeight = navbar ? navbar.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
    window.scrollTo({ top: top, behavior: 'smooth' });
    if (history.pushState) history.pushState(null, null, hash);
  });

  // ── 6. Stats counter animation ───────────────────────────────────────
  var statsSection = document.querySelector('.nx-impact');
  if (statsSection && 'IntersectionObserver' in window) {
    var counters = statsSection.querySelectorAll('.nx-impact-number');
    var animated = false;

    function parseTarget(el) {
      var raw = el.textContent.trim();
      var match = raw.match(/^([\d,.]+)\s*(M\+|K\+|\+)?$/i);
      if (!match) return { value: 0, suffix: raw, isMillion: false };
      var val = parseFloat(match[1].replace(/,/g, ''));
      var suffix = match[2] || '';
      var isMillion = /M/i.test(suffix);
      if (isMillion) val = val;
      return { value: val, suffix: suffix, isMillion: isMillion };
    }

    function formatNumber(n, suffix, isMillion) {
      if (isMillion) {
        var mVal = Math.floor(n);
        return mVal + 'M+';
      }
      var display = n >= 1000 ? Math.floor(n).toLocaleString('en-IN') : Math.floor(n);
      return display + (suffix || '');
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          counters.forEach(function (el) {
            var info = parseTarget(el);
            if (info.value === 0) return;
            var start = 0;
            var end = info.value;
            var duration = 2000;
            var startTime = null;

            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = start + (end - start) * eased;
              el.textContent = formatNumber(current, info.suffix, info.isMillion);
              if (progress < 1) {
                requestAnimationFrame(step);
              }
            }
            requestAnimationFrame(step);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterObserver.observe(statsSection);
  }

  // ── 7. Timeline step animation ───────────────────────────────────────
  var steps = document.querySelectorAll('.nx-step');
  if (steps.length && 'IntersectionObserver' in window) {
    var stepObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    steps.forEach(function (s) { stepObserver.observe(s); });
  }

  // ── 8. Typing effect for hero ────────────────────────────────────────
  var typewriter = document.querySelector('.typewriter');
  if (typewriter) {
    var fullText = typewriter.getAttribute('data-text') || typewriter.textContent;
    typewriter.textContent = '';
    var idx = 0;
    (function typeChar() {
      if (idx < fullText.length) {
        typewriter.textContent += fullText.charAt(idx);
        idx++;
        setTimeout(typeChar, 65);
      }
    })();
  }

  // ── 9. Dynamic copyright year ────────────────────────────────────────
  var year = new Date().getFullYear();
  document.querySelectorAll('.nx-footer p, .nx-footer span, footer p, footer span').forEach(function (el) {
    if (/\u00a9\s*\d{4}/.test(el.textContent)) {
      el.textContent = el.textContent.replace(/\u00a9\s*\d{4}/, '\u00a9 ' + year);
    }
  });

  // ── 10. Active nav link highlight ────────────────────────────────────
  var filename = window.location.pathname.split('/').pop() || 'about.html';
  document.querySelectorAll('.nx-navbar .nav-link').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href === filename) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
