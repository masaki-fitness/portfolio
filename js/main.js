/* ========================================
   MASAKI Portfolio — JavaScript
   Scroll Animations & Micro-interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- CURSOR GLOW FOLLOW ---------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      cursorGlow.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
    lastScroll = scrollY;
  }

  /* ---------- INTERSECTION OBSERVER — REVEAL ---------- */
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- COUNTER ANIMATION ---------- */
  const counters = document.querySelectorAll('.stat__number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCount(el, 0, target, 1200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCount(el, start, end, duration) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quint
      const eased = 1 - Math.pow(1 - progress, 5);
      el.textContent = Math.round(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ---------- PHONE MOCKUP TILT ON MOUSE ---------- */
  const showcases = document.querySelectorAll('.app-showcase');

  showcases.forEach(showcase => {
    const frame = showcase.querySelector('.phone-mockup__frame');
    if (!frame || !window.matchMedia('(pointer: fine)').matches) return;

    showcase.addEventListener('mousemove', (e) => {
      const rect = showcase.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      frame.style.transform = `
        translateY(-10px)
        rotateY(${x * 8}deg)
        rotateX(${-y * 6}deg)
      `;
    });

    showcase.addEventListener('mouseleave', () => {
      frame.style.transform = '';
    });
  });

  /* ---------- SCREEN CAROUSEL ---------- */
  document.querySelectorAll('.phone-carousel').forEach(carousel => {
    const screenCarousel = carousel.querySelector('.screen-carousel');
    const slides = carousel.querySelectorAll('.screen-carousel__slide');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    const placeholder = carousel.querySelector('.phone-mockup__placeholder');

    // If no slides (empty data-images), keep placeholder
    if (slides.length === 0) return;

    // Hide placeholder once first image loads
    let placeholderHidden = false;
    function hidePlaceholder() {
      if (!placeholderHidden && placeholder) {
        placeholder.style.display = 'none';
        placeholderHidden = true;
      }
    }

    slides.forEach(slide => {
      slide.addEventListener('load', hidePlaceholder);
      if (slide.complete && slide.naturalWidth > 0) hidePlaceholder();
      slide.addEventListener('error', () => { slide.style.display = 'none'; });
    });

    // For single image, no dots needed
    if (slides.length <= 1) return;

    // Create dots
    let currentIndex = 0;
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' carousel-dot--active' : '');
      dot.setAttribute('aria-label', `Image ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goTo(index) {
      slides[currentIndex].classList.remove('screen-carousel__slide--active');
      dots[currentIndex].classList.remove('carousel-dot--active');
      currentIndex = index;
      slides[currentIndex].classList.add('screen-carousel__slide--active');
      dots[currentIndex].classList.add('carousel-dot--active');
    }

    // Auto-advance every 3.5s
    let autoTimer = setInterval(() => {
      goTo((currentIndex + 1) % slides.length);
    }, 3500);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoTimer));
    carousel.addEventListener('mouseleave', () => {
      autoTimer = setInterval(() => {
        goTo((currentIndex + 1) % slides.length);
      }, 3500);
    });
  });

  /* ---------- STAGGERED TAG ANIMATION ---------- */
  const tagObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.tag');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(10px)';
          setTimeout(() => {
            tag.style.transition = 'opacity .4s ease, transform .4s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, 100 + i * 80);
        });
        tagObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.app-showcase__tags').forEach(el => tagObserver.observe(el));

  /* ---------- SCROLL PROGRESS BAR ---------- */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
    background: linear-gradient(90deg, var(--blue-600), var(--blue-400));
    transform-origin: left; transform: scaleX(0);
    transition: transform .15s linear; width: 100%;
  `;
  document.body.appendChild(progressBar);

  function updateProgressBar() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- PARALLAX SCROLL EFFECT ---------- */
  function handleParallax() {
    const scrollY = window.scrollY;

    // Hero parallax
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
      const opacity = Math.max(0, 1 - scrollY / 600);
      const translateY = scrollY * 0.3;
      heroContent.style.opacity = opacity;
      heroContent.style.transform = `translateY(${translateY}px)`;
    }

    // Background grid parallax
    const bgGrid = document.querySelector('.hero__bg-grid');
    if (bgGrid) {
      bgGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }

  /* ---------- SCROLL EVENT ---------- */
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        handleParallax();
        updateProgressBar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('nav__link--active',
            link.getAttribute('href') === `#${id}`
          );
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(s => sectionObserver.observe(s));
});
