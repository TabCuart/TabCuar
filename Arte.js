/**
 * TABCUART — main.js  v3.0
 *
 * MÓDULOS
 *  1. Cursor personalizado
 *  2. Modal narrativo (portafolio destacado)
 *  3. Modal portafolio expandido
 *  4. Lightbox simple (técnicas + proceso)
 *  5. Teclado global
 *  6. Tabs de categoría
 *  7. "Mostrar más" por técnica  ← independiente por panel
 *  8. "Ver más" por etapa de proceso
 *  9. Scroll reveal
 */

'use strict';

/* ============================================================
   CONFIG — cambia estos valores sin tocar más código
   ============================================================ */
const TECH_LIMIT = 3;   // Imágenes visibles por defecto en cada técnica
const PROC_LIMIT = 3;   // Imágenes visibles por defecto en cada etapa de proceso


/* ============================================================
   1. CURSOR PERSONALIZADO
   ============================================================ */
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

(function animateCursor() {
  cx += (mx - cx) * 0.18;
  cy += (my - cy) * 0.18;
  cursor.style.left = cx + 'px';
  cursor.style.top  = cy + 'px';
  requestAnimationFrame(animateCursor);
})();

document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

/**
 * Registra el efecto hover del cursor sobre los elementos interactivos.
 * Se llama también después de revelar nuevos ítems (show more),
 * usando data-hover-bound para no duplicar listeners.
 */
function bindHoverTargets() {
  document.querySelectorAll(
    'a, button, .p-cell, .tech-item, .proc-img-item, .em-cell'
  ).forEach(el => {
    if (el.dataset.hoverBound) return;
    el.dataset.hoverBound = '1';
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}
bindHoverTargets();


/* ============================================================
   2. MODAL NARRATIVO — portafolio destacado
   ============================================================ */
const portfolioModal = document.getElementById('portfolio-modal');
const pmImg          = document.getElementById('pm-img');
const pmSeries       = document.getElementById('pm-series');
const pmTitle        = document.getElementById('pm-title');
const pmYearTech     = document.getElementById('pm-year-tech');
const pmDesc         = document.getElementById('pm-desc');
const pmMeta         = document.getElementById('pm-meta-row');
const pmCounter      = document.getElementById('pm-counter');
const heroCells      = [...document.querySelectorAll('.portfolio-grid .p-cell')];
let pmCurrentIdx     = 0;

function openPortfolioModal(idx) {
  const cell = heroCells[idx];
  if (!cell) return;
  const img = cell.querySelector('img');
  if (!img)  return;

  pmCurrentIdx = idx;

  const catStr  = cell.dataset.cat || '';
  const parts   = catStr.split('·').map(s => s.trim());
  const tecnica = parts[0] || '';
  const anio    = parts[1] || '';
  const series  = cell.dataset.series || '';

  // Última palabra del título en cursiva
  const name  = cell.dataset.name || '';
  const words = name.split(' ');
  const last  = words.pop();
  const titleHTML = (words.join(' ') + (words.length ? ' ' : '')) + `<em>${last}</em>`;

  pmImg.src   = img.src;
  pmImg.alt   = img.alt;
  pmSeries.textContent    = series;
  pmSeries.style.display  = series ? 'block' : 'none';
  pmTitle.innerHTML       = titleHTML;
  pmYearTech.textContent  = [tecnica, anio].filter(Boolean).join(' · ');
  pmDesc.textContent      = cell.dataset.desc || '';

  pmMeta.innerHTML = [
    tecnica ? `<div class="pm-meta-item"><div class="pm-meta-label">Técnica</div><div class="pm-meta-val">${tecnica}</div></div>` : '',
    anio    ? `<div class="pm-meta-item"><div class="pm-meta-label">Año</div><div class="pm-meta-val">${anio}</div></div>` : '',
    series  ? `<div class="pm-meta-item"><div class="pm-meta-label">Serie</div><div class="pm-meta-val">${series.replace('Serie: ', '')}</div></div>` : '',
  ].join('');

  pmCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(heroCells.length).padStart(2, '0')}`;

  portfolioModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Doble rAF para que la transición CSS de opacidad funcione
  requestAnimationFrame(() => requestAnimationFrame(() =>
    portfolioModal.classList.add('open', 'visible')
  ));
}

function closePortfolioModal() {
  portfolioModal.classList.remove('visible');
  setTimeout(() => {
    portfolioModal.classList.remove('open');
    portfolioModal.style.display = 'none';
    document.body.style.overflow = '';
  }, 350);
}

function navPortfolioModal(dir) {
  portfolioModal.classList.remove('visible');
  setTimeout(() => {
    openPortfolioModal((pmCurrentIdx + dir + heroCells.length) % heroCells.length);
  }, 200);
}

// Eventos
heroCells.forEach((cell, i) => cell.addEventListener('click', () => openPortfolioModal(i)));
document.getElementById('pm-close').addEventListener('click', closePortfolioModal);
document.getElementById('pm-prev').addEventListener('click', () => navPortfolioModal(-1));
document.getElementById('pm-next').addEventListener('click', () => navPortfolioModal(1));
portfolioModal.addEventListener('click', e => { if (e.target === portfolioModal) closePortfolioModal(); });


/* ============================================================
   3. MODAL PORTAFOLIO EXPANDIDO — "Ver portafolio completo"
   ============================================================ */
const expandModal = document.getElementById('expand-modal');

function openExpandModal() {
  expandModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() =>
    expandModal.classList.add('open', 'visible')
  ));
}

function closeExpandModal() {
  expandModal.classList.remove('visible');
  setTimeout(() => {
    expandModal.classList.remove('open');
    expandModal.style.display = 'none';
    document.body.style.overflow = '';
  }, 350);
}

document.getElementById('btn-ver-portafolio').addEventListener('click', openExpandModal);
document.getElementById('em-close').addEventListener('click', closeExpandModal);
expandModal.addEventListener('click', e => { if (e.target === expandModal) closeExpandModal(); });


/* ============================================================
   4. LIGHTBOX SIMPLE — técnicas + proceso
   ============================================================ */
const lb          = document.getElementById('lightbox');
const lbImg       = document.getElementById('lb-img');
const lbTitleEl   = document.getElementById('lb-title');
const lbSubEl     = document.getElementById('lb-sub');
const lbDescEl    = document.getElementById('lb-desc');
let lbItems       = [];
let lbCurrentIdx  = 0;

function openLightbox(items, idx) {
  lbItems      = items;
  lbCurrentIdx = idx;
  renderLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const item = lbItems[lbCurrentIdx];
  if (!item) return;
  const img = item.querySelector('img');
  lbImg.src          = img ? img.src : '';
  lbImg.alt          = img ? img.alt : '';
  lbTitleEl.textContent = item.dataset.name || '';
  lbSubEl.textContent   = item.dataset.cat  || '';
  lbDescEl.textContent  = item.dataset.desc || '';
}

function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  lbCurrentIdx = (lbCurrentIdx + dir + lbItems.length) % lbItems.length;
  renderLightbox();
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click',  () => navLightbox(-1));
document.getElementById('lb-next').addEventListener('click',  () => navLightbox(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });


/* ============================================================
   5. TECLADO GLOBAL
   ============================================================ */
document.addEventListener('keydown', e => {
  if (portfolioModal.classList.contains('open')) {
    if (e.key === 'Escape')      closePortfolioModal();
    if (e.key === 'ArrowLeft')   navPortfolioModal(-1);
    if (e.key === 'ArrowRight')  navPortfolioModal(1);
    return;
  }
  if (expandModal.classList.contains('open')) {
    if (e.key === 'Escape') closeExpandModal();
    return;
  }
  if (lb.classList.contains('open')) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navLightbox(-1);
    if (e.key === 'ArrowRight')  navLightbox(1);
  }
});


/* ============================================================
   6. TABS DE CATEGORÍA
   ============================================================ */
document.querySelectorAll('.cat-tabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Desactivar todos
    document.querySelectorAll('.cat-tabs .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tech-panel').forEach(p => p.classList.remove('active'));
    // Activar el seleccionado
    tab.classList.add('active');
    const panel = document.getElementById('panel-' + tab.dataset.cat);
    if (panel) panel.classList.add('active');
  });
});


/* ============================================================
   7. "MOSTRAR MÁS" POR TÉCNICA
   ─────────────────────────────────────────────────────────────
   Cada .tech-panel es 100% independiente.

   Flujo de inicialización por panel:
     a) Tomar todos los .tech-item del panel
     b) Ocultar los que superan TECH_LIMIT con .tc-hidden
     c) Si no hay ocultos → esconder el footer del panel
     d) Si hay ocultos    → enlazar el botón solo a ESE panel

   El lightbox navega solo entre los ítems VISIBLES en ese momento.
   ============================================================ */
document.querySelectorAll('.tech-panel').forEach(panel => {
  const items  = [...panel.querySelectorAll('.tech-item')];
  const footer = panel.querySelector('.tech-footer');
  const btn    = panel.querySelector('.btn-show-more');

  // a) Ocultar extras desde el inicio
  items.forEach((item, i) => {
    if (i >= TECH_LIMIT) item.classList.add('tc-hidden');
  });

  // b) Enlazar lightbox — navega entre visibles del panel
  items.forEach(item => {
    item.addEventListener('click', () => {
      const visible = items.filter(it => !it.classList.contains('tc-hidden'));
      const vIdx    = visible.indexOf(item);
      openLightbox(visible, vIdx >= 0 ? vIdx : 0);
    });
  });

  // c) Ocultar footer si no hay extras
  if (!footer || !btn) return;
  if (items.length <= TECH_LIMIT) { footer.classList.add('no-more'); return; }

  // d) Botón del panel
  btn.addEventListener('click', () => {
    const isExpanded  = btn.classList.contains('expanded');
    const hiddenItems = items.filter(it => it.classList.contains('tc-hidden'));

    if (!isExpanded) {
      // Revelar con animación escalonada
      hiddenItems.forEach((item, delay) => {
        item.style.animationDelay = (delay * 55) + 'ms';
        item.classList.remove('tc-hidden');
        item.classList.add('tc-visible');
      });
      btn.classList.add('expanded');
      btn.querySelector('.btn-label').textContent = 'Mostrar menos';
    } else {
      // Volver al estado inicial
      items.forEach((item, i) => {
        item.classList.remove('tc-visible');
        item.style.animationDelay = '';
        if (i >= TECH_LIMIT) item.classList.add('tc-hidden');
      });
      btn.classList.remove('expanded');
      btn.querySelector('.btn-label').textContent = 'Mostrar más';
    }

    // Re-registrar hover en los nuevos ítems visibles
    bindHoverTargets();
  });
});


/* ============================================================
   8. "VER MÁS" POR ETAPA DE PROCESO
   ─────────────────────────────────────────────────────────────
   Mismo principio que técnicas: cada .proc-stage es independiente.
   ============================================================ */
document.querySelectorAll('.proc-stage').forEach(stage => {
  const items   = [...stage.querySelectorAll('.proc-img-item')];
  const btnWrap = stage.querySelector('.proc-expand-wrap');
  const btn     = stage.querySelector('.btn-proc-expand');

  // Ocultar extras
  items.forEach((item, i) => {
    if (i >= PROC_LIMIT) item.classList.add('pc-hidden');
  });

  // Enlazar lightbox — navega entre visibles de esta etapa
  items.forEach(item => {
    item.addEventListener('click', () => {
      const visible = items.filter(it => !it.classList.contains('pc-hidden'));
      const vIdx    = visible.indexOf(item);
      openLightbox(visible, vIdx >= 0 ? vIdx : 0);
    });
  });

  // Ocultar botón si no hay extras
  if (!btnWrap || !btn) return;
  if (items.length <= PROC_LIMIT) { btnWrap.style.display = 'none'; return; }

  btn.addEventListener('click', () => {
    const isExpanded  = btn.classList.contains('expanded');
    const hiddenItems = items.filter(it => it.classList.contains('pc-hidden'));

    if (!isExpanded) {
      hiddenItems.forEach((item, delay) => {
        item.style.animationDelay = (delay * 55) + 'ms';
        item.classList.remove('pc-hidden');
        item.classList.add('pc-visible');
      });
      btn.classList.add('expanded');
      btn.querySelector('.btn-label').textContent = 'Ver menos';
    } else {
      items.forEach((item, i) => {
        item.classList.remove('pc-visible');
        item.style.animationDelay = '';
        if (i >= PROC_LIMIT) item.classList.add('pc-hidden');
      });
      btn.classList.remove('expanded');
      btn.querySelector('.btn-label').textContent = 'Ver más';
    }

    bindHoverTargets();
  });
});


/* ============================================================
   9. SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
