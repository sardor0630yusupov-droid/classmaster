/**
 * ============================================================
 *  Classmaster O'quv Markazi — Premium Interactive Script
 * ============================================================
 *  Features:
 *    1.  Particle System (Canvas API)
 *    2.  Smooth Scroll Navigation
 *    3.  Mobile Menu Toggle
 *    4.  Scroll Reveal Animations
 *    5.  Animated Counters
 *    6.  Navbar Scroll Effect
 *    7.  Scroll Progress Bar
 *    8.  FAQ Accordion
 *    9.  Testimonials Slider
 *   10.  Contact Form Validation
 *   11.  Language Switcher
 *   12.  Dark / Light Mode Toggle
 *   13.  Floating CTA Button
 *   14.  Course Card 3D Tilt
 *   15.  Typing Effect (Hero)
 *   16.  DOMContentLoaded Initialization
 *
 *  Author:  Classmaster Dev Team
 *  Version: 1.0.0
 *  License: MIT
 * ============================================================
 */

;(function () {
  'use strict';

  /* --------------------------------------------------------
   *  1. PARTICLE SYSTEM (Canvas API)
   * ------------------------------------------------------ */
  const ParticleSystem = (() => {
    const PARTICLE_COUNT    = 80;
    const CONNECTION_DIST   = 150;
    const COLORS            = ['#00d4ff', '#7c3aed', '#10b981'];

    let canvas, ctx, particles, animationId;
    let width = 0;
    let height = 0;

    /** Create a single particle with random properties */
    const createParticle = () => ({
      x:       Math.random() * width,
      y:       Math.random() * height,
      size:    Math.random() * 2 + 1,                       // 1 – 3 px
      speedX:  (Math.random() - 0.5) * 0.6,
      speedY:  (Math.random() - 0.5) * 0.6,
      opacity: Math.random() * 0.5 + 0.3,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    /** Resize canvas to match its parent container */
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width  = parent.offsetWidth;
      height = parent.offsetHeight;
      canvas.width  = width;
      canvas.height = height;
    };

    /** Move a particle and bounce it off edges */
    const updateParticle = (p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > width)  p.speedX *= -1;
      if (p.y < 0 || p.y > height) p.speedY *= -1;

      // Clamp inside bounds
      p.x = Math.max(0, Math.min(width,  p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    };

    /** Draw a single particle with a soft glow */
    const drawParticle = (p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

      // Glow effect via shadow
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 15;
      ctx.fillStyle   = p.color;
      ctx.fill();
      ctx.restore();
    };

    /** Draw connection lines between nearby particles */
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const opacity = 1 - dist / CONNECTION_DIST;
            ctx.save();
            ctx.globalAlpha = opacity * 0.25;
            ctx.strokeStyle = particles[i].color;
            ctx.lineWidth   = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    /** Main animation loop */
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        updateParticle(p);
        drawParticle(p);
      });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    };

    /** Public: bootstrap the particle canvas */
    const init = () => {
      canvas = document.getElementById('particle-canvas');
      if (!canvas) return;
      ctx = canvas.getContext('2d');

      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, createParticle);

      window.addEventListener('resize', () => {
        resize();
        // Re-scatter particles that fell outside the new bounds
        particles.forEach((p) => {
          if (p.x > width)  p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        });
      });

      animate();
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  2. SMOOTH SCROLL NAVIGATION
   * ------------------------------------------------------ */
  const SmoothScroll = (() => {
    const OFFSET = 80; // fixed navbar height

    const init = () => {
      document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href');
          if (targetId === '#') return;

          const target = document.querySelector(targetId);
          if (!target) return;

          e.preventDefault();

          const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
          window.scrollTo({ top, behavior: 'smooth' });

          // Close mobile menu if open
          MobileMenu.close();
        });
      });

      // Update active nav link on scroll
      window.addEventListener('scroll', updateActiveLink, { passive: true });
    };

    const updateActiveLink = () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      let currentId  = '';

      sections.forEach((section) => {
        const top = section.offsetTop - OFFSET - 20;
        if (window.scrollY >= top) {
          currentId = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  3. MOBILE MENU TOGGLE
   * ------------------------------------------------------ */
  const MobileMenu = (() => {
    let isOpen = false;
    let toggleBtn, overlay;

    const open = () => {
      isOpen = true;
      document.body.classList.add('mobile-nav-active');
      document.body.style.overflow = 'hidden';
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      isOpen = false;
      document.body.classList.remove('mobile-nav-active');
      document.body.style.overflow = '';
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => (isOpen ? close() : open());

    const init = () => {
      toggleBtn = document.querySelector('.mobile-menu-toggle');
      overlay   = document.querySelector('.mobile-overlay');

      if (toggleBtn) {
        toggleBtn.addEventListener('click', toggle);
      }

      // Close on overlay click
      if (overlay) {
        overlay.addEventListener('click', close);
      }

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) close();
      });
    };

    return { init, close };
  })();

  /* --------------------------------------------------------
   *  4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   * ------------------------------------------------------ */
  const ScrollReveal = (() => {
    const init = () => {
      const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
      if (!elements.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              el.classList.add('active');

              // Stagger children that have .stagger-child class
              const children = el.querySelectorAll('.stagger-child');
              children.forEach((child, idx) => {
                child.style.transitionDelay = `${idx * 100}ms`;
                child.classList.add('active');
              });

              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach((el) => observer.observe(el));
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  5. ANIMATED COUNTERS
   * ------------------------------------------------------ */
  const AnimatedCounters = (() => {
    const DURATION = 2000;

    /** Ease-out cubic */
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      let start = null;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const elapsed  = timestamp - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const value    = Math.floor(easeOut(progress) * target);

        el.textContent = value.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString() + '+';
        }
      };

      requestAnimationFrame(step);
    };

    const init = () => {
      const counters = document.querySelectorAll('.counter-number[data-target]');
      if (!counters.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach((c) => observer.observe(c));
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  6. NAVBAR SCROLL EFFECT
   * ------------------------------------------------------ */
  const NavbarEffect = (() => {
    const init = () => {
      const navbar = document.querySelector('.navbar');
      if (!navbar) return;

      const handler = () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };

      window.addEventListener('scroll', handler, { passive: true });
      handler(); // set initial state
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  7. SCROLL PROGRESS BAR
   * ------------------------------------------------------ */
  const ScrollProgress = (() => {
    const init = () => {
      const bar = document.querySelector('.scroll-progress');
      if (!bar) return;

      const update = () => {
        const scrollTop    = window.scrollY;
        const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${scrollPercent}%`;
      };

      window.addEventListener('scroll', update, { passive: true });
      update();
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  8. FAQ ACCORDION
   * ------------------------------------------------------ */
  const FaqAccordion = (() => {
    const init = () => {
      const questions = document.querySelectorAll('.faq-question');
      if (!questions.length) return;

      questions.forEach((question) => {
        question.addEventListener('click', () => {
          const parentItem  = question.closest('.faq-item');
          const isActive    = parentItem.classList.contains('active');
          const allItems    = document.querySelectorAll('.faq-item');

          // Close every other item (accordion behavior)
          allItems.forEach((item) => {
            item.classList.remove('active');
            const answer = item.querySelector('.faq-answer');
            if (answer) {
              answer.style.maxHeight = null;
              answer.style.opacity   = '0';
            }
          });

          // Toggle clicked item
          if (!isActive) {
            parentItem.classList.add('active');
            const answer = parentItem.querySelector('.faq-answer');
            if (answer) {
              answer.style.maxHeight = answer.scrollHeight + 'px';
              answer.style.opacity   = '1';
            }
          }
        });
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  9. TESTIMONIALS SLIDER
   * ------------------------------------------------------ */
  const TestimonialsSlider = (() => {
    const INTERVAL = 5000;

    let slides, dots, track;
    let current   = 0;
    let timer     = null;
    let isPaused  = false;
    let touchStartX = 0;
    let touchEndX   = 0;

    const getCount = () => (slides ? slides.length : 0);

    /** Show a specific slide */
    const goTo = (index) => {
      const count = getCount();
      if (count === 0) return;

      current = ((index % count) + count) % count; // wrap around

      if (track) {
        track.style.transform = `translateX(-${current * 100}%)`;
      }

      // Update dots
      if (dots) {
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
      }
    };

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    const startAutoPlay = () => {
      stopAutoPlay();
      timer = setInterval(() => {
        if (!isPaused) next();
      }, INTERVAL);
    };

    const stopAutoPlay = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    /** Handle touch / swipe */
    const handleTouchStart = (e) => { touchStartX = e.changedTouches[0].screenX; };
    const handleTouchEnd   = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAutoPlay(); // reset timer after manual swipe
      }
    };

    const init = () => {
      track  = document.querySelector('.testimonial-track');
      slides = document.querySelectorAll('.testimonial-slide');
      dots   = document.querySelectorAll('.slider-dot');

      if (!track || !slides.length) return;

      // Dot click navigation
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goTo(i);
          startAutoPlay();
        });
      });

      // Pause on hover
      const container = track.closest('.testimonial-slider') || track.parentElement;
      if (container) {
        container.addEventListener('mouseenter', () => { isPaused = true; });
        container.addEventListener('mouseleave', () => { isPaused = false; });
      }

      // Touch support
      track.addEventListener('touchstart', handleTouchStart, { passive: true });
      track.addEventListener('touchend',   handleTouchEnd,   { passive: true });

      goTo(0);
      startAutoPlay();
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  10. CONTACT FORM → TELEGRAM BOT INTEGRATION
   * ------------------------------------------------------ */
  const ContactForm = (() => {
    /** O'zbek telefon regex: +998 XX XXX XX XX */
    const PHONE_REGEX = /^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/;

    const showError = (input, message) => {
      const group = input.closest('.form-group') || input.parentElement;
      group.classList.add('error');
      group.classList.remove('valid');
      let errEl = group.querySelector('.error-message');
      if (!errEl) {
        errEl = document.createElement('span');
        errEl.className = 'error-message';
        group.appendChild(errEl);
      }
      errEl.textContent = message;
    };

    const clearError = (input) => {
      const group = input.closest('.form-group') || input.parentElement;
      group.classList.remove('error');
      group.classList.add('valid');
      const errEl = group.querySelector('.error-message');
      if (errEl) errEl.remove();
    };

    const validateField = (input) => {
      const name = input.getAttribute('name') || input.id || '';
      const val  = input.value.trim();

      if (name.includes('name') || name === 'fullname') {
        if (val.length < 2) {
          showError(input, 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak');
          return false;
        }
      }

      if (name.includes('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) {
          showError(input, 'To\'g\'ri email manzil kiriting');
          return false;
        }
      }

      if (name.includes('phone') || name === 'tel') {
        // Telefon ixtiyoriy — agar kiritilgan bo'lsa tekshiradi
        if (val && !PHONE_REGEX.test(val)) {
          showError(input, 'Telefon formati: +998 XX XXX XX XX');
          return false;
        }
      }

      if (name.includes('message') || input.tagName === 'TEXTAREA') {
        if (val.length < 5) {
          showError(input, 'Xabar kamida 5 ta belgidan iborat bo\'lishi kerak');
          return false;
        }
      }

      clearError(input);
      return true;
    };

    /** Status xabarini ko'rsatish */
    const showStatus = (statusEl, msg, isError = false) => {
      statusEl.textContent = msg;
      statusEl.style.display = 'block';
      statusEl.style.marginTop = '1rem';
      statusEl.style.fontWeight = '600';
      statusEl.style.fontSize = '0.95rem';
      statusEl.style.textAlign = 'center';
      statusEl.style.padding = '0.75rem 1rem';
      statusEl.style.borderRadius = '0.75rem';

      if (isError) {
        statusEl.style.color = '#ef4444';
        statusEl.style.background = 'rgba(239,68,68,0.1)';
        statusEl.style.border = '1px solid rgba(239,68,68,0.2)';
      } else {
        statusEl.style.color = '#10b981';
        statusEl.style.background = 'rgba(16,185,129,0.1)';
        statusEl.style.border = '1px solid rgba(16,185,129,0.2)';
      }

      // 6 soniyadan keyin yashirish
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 6000);
    };

    const init = () => {
      const form = document.getElementById('contactForm');
      if (!form) return;

      const statusEl  = document.getElementById('formStatus');
      const submitBtn = document.getElementById('formSubmitBtn');
      const btnText   = submitBtn ? submitBtn.querySelector('.form-btn-text') : null;

      // Maydon o'zgarishida live validatsiya
      form.querySelectorAll('input, textarea').forEach((input) => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.closest('.form-group')?.classList.contains('error')) {
            validateField(input);
          }
        });
      });

      // Forma yuborilganda
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Barcha maydonlarni tekshirish
        const inputs = form.querySelectorAll('input, textarea');
        let isValid  = true;
        inputs.forEach((input) => {
          if (!validateField(input)) isValid = false;
        });
        if (!isValid) return;

        // Tugmani bloklash
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.textContent = 'Yuborilmoqda…';

        // Ma'lumotlarni yig'ish
        const payload = {
          name:    (form.querySelector('#formName')    || {}).value?.trim() || '',
          email:   (form.querySelector('#formEmail')   || {}).value?.trim() || '',
          phone:   (form.querySelector('#formPhone')   || {}).value?.trim() || '',
          message: (form.querySelector('#formMessage') || {}).value?.trim() || '',
        };

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          const data = await res.json();

          if (data.ok) {
            showStatus(statusEl, '✅ Xabaringiz muvaffaqiyatli yuborildi! Tez orada javob beramiz.', false);
            form.reset();
            // Barcha valid klasslarni tozalash
            form.querySelectorAll('.form-group').forEach(g => {
              g.classList.remove('valid', 'error');
            });
          } else {
            throw new Error(data.error || 'Noma\'lum xato');
          }
        } catch (err) {
          console.error('Contact form error:', err);
          showStatus(statusEl, '❌ Xatolik yuz berdi: ' + err.message, true);
        } finally {
          // Tugmani qayta yoqish
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.textContent = 'Xabar yuborish';
        }
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  11. LANGUAGE SWITCHER
   * ------------------------------------------------------ */
  const LanguageSwitcher = (() => {
    const STORAGE_KEY = 'classmaster-lang';

    const init = () => {
      const buttons = document.querySelectorAll('.lang-btn');
      if (!buttons.length) return;

      // Load saved preference
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        buttons.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.lang === saved);
        });
      }

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');
          const lang = btn.dataset.lang || btn.textContent.trim().toLowerCase();
          localStorage.setItem(STORAGE_KEY, lang);

          // Emit custom event so other parts of the app can react
          document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
        });
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  12. DARK / LIGHT MODE TOGGLE
   * ------------------------------------------------------ */
  const ThemeToggle = (() => {
    const STORAGE_KEY = 'classmaster-theme';

    const applyTheme = (mode) => {
      document.body.classList.toggle('light-mode', mode === 'light');

      // Update every toggle button icon
      document.querySelectorAll('.theme-toggle').forEach((btn) => {
        const icon = btn.querySelector('i, .icon, span');
        if (icon) {
          if (mode === 'light') {
            icon.className = icon.className.replace('moon', 'sun');
            icon.textContent = icon.textContent === '🌙' ? '☀️' : icon.textContent;
          } else {
            icon.className = icon.className.replace('sun', 'moon');
            icon.textContent = icon.textContent === '☀️' ? '🌙' : icon.textContent;
          }
        }
      });
    };

    const init = () => {
      const saved = localStorage.getItem(STORAGE_KEY) || 'dark';
      applyTheme(saved);

      document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
          const isLight = document.body.classList.contains('light-mode');
          const next    = isLight ? 'dark' : 'light';
          localStorage.setItem(STORAGE_KEY, next);
          applyTheme(next);
        });
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  13. FLOATING CTA BUTTON
   * ------------------------------------------------------ */
  const FloatingCTA = (() => {
    const init = () => {
      const btn = document.querySelector('.floating-cta');
      if (!btn) return;

      const handleScroll = () => {
        if (window.scrollY > 500) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector('#courses');
        if (target) {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  14. COURSE CARD 3D TILT EFFECT
   * ------------------------------------------------------ */
  const CardTilt = (() => {
    const MAX_TILT = 12; // degrees

    const init = () => {
      const cards = document.querySelectorAll('.course-card');
      if (!cards.length) return;

      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect   = card.getBoundingClientRect();
          const x      = e.clientX - rect.left;
          const y      = e.clientY - rect.top;
          const centerX = rect.width  / 2;
          const centerY = rect.height / 2;

          const rotateY = ((x - centerX) / centerX) * MAX_TILT;
          const rotateX = ((centerY - y) / centerY) * MAX_TILT;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
          card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform  = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
          card.style.transition = 'transform 0.5s ease';
        });
      });
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  15. TYPING EFFECT (Hero Section)
   * ------------------------------------------------------ */
  const TypingEffect = (() => {
    const STRINGS = [
      "O'quv Markazi",
      "Ta'lim Maskani",
      "Kelajak Kaliti",
      "Bilim Darvozasi",
    ];

    const TYPE_SPEED   = 100;  // ms per character
    const DELETE_SPEED = 50;
    const PAUSE_AFTER  = 2000; // pause before deleting
    const PAUSE_BEFORE = 500;  // pause before typing next

    let el, charIndex = 0, stringIndex = 0, isDeleting = false;

    const tick = () => {
      if (!el) return;

      const current = STRINGS[stringIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
      } else {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
      }

      let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

      if (!isDeleting && charIndex === current.length) {
        // Finished typing — pause then start deleting
        delay = PAUSE_AFTER;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting — move to next string
        isDeleting  = false;
        stringIndex = (stringIndex + 1) % STRINGS.length;
        delay = PAUSE_BEFORE;
      }

      setTimeout(tick, delay);
    };

    const init = () => {
      el = document.querySelector('.typing-text');
      if (!el) return;

      // Add blinking cursor via CSS class
      el.classList.add('typing-cursor');
      tick();
    };

    return { init };
  })();

  /* --------------------------------------------------------
   *  UTILITY: Throttle helper for scroll-heavy listeners
   * ------------------------------------------------------ */
  const throttle = (fn, wait = 100) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  };

  /* --------------------------------------------------------
   *  16. DOMCONTENTLOADED — BOOTSTRAP EVERYTHING
   * ------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    // Core UI
    ThemeToggle.init();       // load theme first to avoid flash
    NavbarEffect.init();
    ScrollProgress.init();
    MobileMenu.init();
    SmoothScroll.init();
    FloatingCTA.init();
    LanguageSwitcher.init();

    // Visual effects
    ParticleSystem.init();
    ScrollReveal.init();
    AnimatedCounters.init();
    CardTilt.init();
    TypingEffect.init();

    // Interactive sections
    FaqAccordion.init();
    TestimonialsSlider.init();
    ContactForm.init();

    // Inject a small <style> block for the typing cursor animation
    // so the script is fully self-contained.
    if (!document.getElementById('classmaster-dynamic-styles')) {
      const style = document.createElement('style');
      style.id = 'classmaster-dynamic-styles';
      style.textContent = `
        .typing-cursor::after {
          content: '|';
          display: inline-block;
          animation: blink-cursor 0.75s step-end infinite;
          margin-left: 2px;
          font-weight: 100;
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .form-success-message {
          animation: fadeInUp 0.5s ease forwards;
        }
        .form-success-message .success-icon {
          width: 56px; height: 56px;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: #10b981;
          color: #fff;
          font-size: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .floating-cta {
          opacity: 0;
          pointer-events: none;
          transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .floating-cta.visible {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
          animation: pulse-cta 2s ease-in-out infinite;
        }
        @keyframes pulse-cta {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.4); }
          50%      { box-shadow: 0 0 0 12px rgba(0, 212, 255, 0); }
        }
        .error-message {
          display: block;
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 4px;
        }
      `;
      document.head.appendChild(style);
    }

    console.log('%c✦ Classmaster O\'quv Markazi — All systems initialized.',
      'color:#00d4ff;font-weight:bold;font-size:14px;');
  });
})();
