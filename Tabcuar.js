// LOADER
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader').classList.add('hidden');
    }, 2000);
  });

  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect
  document.querySelectorAll('a, button, .gallery-item, .division-card, .game-card, .store-card, .blog-card, .aqua-card, .lab-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '50px';
      ring.style.height = '50px';
      ring.style.borderColor = 'rgba(200,169,110,0.6)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(200,169,110,0.4)';
    });
  });

  // SCROLL REVEAL
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // GALLERY FILTER
  function filterGallery(cat, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.gallery-item').forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.style.filter = 'none';
      } else {
        item.style.opacity = '0.2';
        item.style.transform = 'scale(0.98)';
        item.style.filter = 'grayscale(100%)';
      }
      item.style.transition = 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  }

  // FORM
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target;
    btn.textContent = 'Enviado ?';
    btn.style.color = 'var(--accent-aqua)';
    btn.style.borderColor = 'var(--accent-aqua)';
    setTimeout(() => {
      btn.textContent = 'Enviar mensaje';
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 3000);
  }

  // PARALLAX subtle
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    document.querySelectorAll('.bg-text').forEach(el => {
      el.style.transform = `translateY(calc(-50% + ${y * 0.03}px))`;
    });
  });