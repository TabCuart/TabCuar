/* ==========================================================
   TABCUAR — script.js

   ÍNDICE
   1. REFERENCIAS
   2. VARIABLES
   2B. OBRAS — INFORMACIÓN DEL VISOR AMPLIADO  (EDITA AQUÍ)
   3. CORAZÓN
   4. NAVEGACIÓN
   5. FILTROS
   6. PESTAÑAS
   8. SUBIDA DE IMÁGENES  (AUXILIAR LOCAL)
   10. LOADER + SECUENCIA DE ENTRADA
   11. CURSOR
   12. REVEAL
   13. BRASAS
   14. WORKS WHEEL
   15. HOTSPOTS
   16. CORAZÓN SOBRE MÍ
   17. ESCAPE
   18. VISOR DE IMÁGENES Y VIDEOS / OBRA AMPLIADA
   19. INICIAR
   20. INICIAR RUEDA AL CARGAR
   21. LÍNEAS ANATÓMICAS DEL CORAZÓN
   22. ANIMACIÓN DE LA CABECERA (TabCuart)
   23. LIBROS Y CÓMICS — CARRUSEL + VISOR DE LIBRO PDF
   24. CONTACTO — COPIAR CORREO
   25. INICIAR COMPONENTES NUEVOS

   Notas:
   · Las secciones 7 (Proyectos) y 9 (Formulario) se retiraron: no tenían elementos
     que las usaran. La numeración NO se reasignó porque otros archivos hacen
     referencia a ella (p. ej. "script.js §10", "sección 18").
   · Hay además bloques sin número intercalados (partículas, PDF.js, visor de libros,
     Observador, Proceso explorable, Gehenna, cartas de Sobre mí); cada uno lleva su título.
========================================================== */


/* =========================================================
   1. REFERENCIAS
========================================================= */

const loader = document.getElementById('loader');

const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');

const heartAnim = document.getElementById('heartAnim');
const heartFrame = document.getElementById('heartFrame');

const heartVideo = document.getElementById('heartVideo');
const heartFallback = document.getElementById('heartFallback');


/* =========================================================
   2. VARIABLES
========================================================= */

let mx = 0;
let my = 0;

let rx = 0;
let ry = 0;

const isTouch =
  window.matchMedia('(hover:none), (pointer:coarse)').matches;

/* Preferencia de movimiento reducido (compartida por todas las secciones) */
const reduceMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Limita v al rango [a, b] (compartida por todas las secciones) */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

let currentZone = null;

/* =========================================================
   2B. OBRAS — INFORMACIÓN DEL VISOR AMPLIADO  (EDITA AQUÍ)
========================================================= */

/*
  Al hacer clic en una obra de TabCuart se abre el visor con su ficha.
  La ficha se arma así (de mayor a menor prioridad):

    1. WORKS_INFO[nombre-del-archivo]   → datos propios de cada obra
    2. WORKS_DEFAULTS[categoría]        → datos comunes de la técnica
    3. data-title y data-year del .gallery-item en index.html

  Campos disponibles para cada obra (todos opcionales):

    title        → título de la obra
    technique    → técnica
    year         → año
    description  → descripción
    extra        → otros datos técnicos: [['Etiqueta', 'Valor'], ...]

  Si un campo queda vacío ('' o []), se usa el valor por defecto.
  La clave es el nombre del archivo de la imagen (ej. 'Dj1.png').
*/

const WORKS_DEFAULTS = {

  digital: {
    technique: 'Ilustración digital',
    description: 'Ilustración desarrollada en medio digital, con composición, color y detalle trabajados por capas.',
    extra: []
  },

  tradicional: {
    technique: 'Ilustración análoga',
    description: 'Obra realizada con medios tradicionales, donde el gesto y la textura de los materiales hacen parte del resultado.',
    extra: []
  },

  lino: {
    technique: 'Linograbado',
    description: 'Imagen tallada a mano sobre linóleo y estampada: cada línea nace del corte y de la tinta.',
    extra: []
  },

  escultura: {
    technique: 'Escultura',
    description: 'Pieza tridimensional donde la forma, el volumen y la textura se trabajan con las manos.',
    extra: []
  },

  animacion: {
    technique: 'Animación',
    description: 'Pieza en movimiento que da vida a la ilustración a través del ritmo, la secuencia y el tiempo.',
    extra: []
  },

  '3d': {
    technique: 'Modelado 3D',
    description: 'Escena tridimensional construida para explorar volumen, luz y textura.',
    extra: [['Software', 'Blender']]
  },

  tattoo: {
    technique: 'Diseño para tattoo',
    description: 'Propuesta pensada para el cuerpo: composición, línea y equilibrio adaptados al espacio de la piel.',
    extra: []
  }

};

const WORKS_INFO = {

  /* ----- Ilustración Digital ----- */
  'Dj1.png': {
  title: 'Desprendimiento',
  technique: 'Ilustración digital',
  year: '2026',
  description: 'Esta ilustración la realicé para un trabajo, pensando en quién soy yo como artista. Me sirve para recordar que no soy el mejor ni alguien completo, y que lo poco que sé todavía está lejos de lo que realmente es el arte.',
  extra: [
    ['Software', 'Photoshop']
  ]
},

 'Dj2.png': {
  title: 'Melancolía',
  technique: 'Ilustración digital',
  year: '2024',
  description: 'Soy Melancolía, el eco constante de lo que nunca volverá. Vivo en los rincones más oscuros de tu memoria, recordándote que el tiempo siempre deja heridas que no sanan. Estoy en esos momentos donde te pierdes en pensamientos del pasado, atrapado entre lo que fue y lo que nunca será.',
  extra: [
    ['Software', 'Photoshop']
  ]
},

  'Dj3.png':        { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- Ilustración Análoga ----- */
  'Pt1.jpg':        { title: '', technique: '', year: '', description: '', extra: [] },
  'Pt2.jpg':        { title: '', technique: '', year: '', description: '', extra: [] },
  'Pt3.jpg':        { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- Grabado ----- */
  'lino1.jpg':      { title: '', technique: '', year: '', description: '', extra: [] },
  'lino2.jpg':      { title: '', technique: '', year: '', description: '', extra: [] },
  'lino3.jpg':      { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- Escultura ----- */
  'escultura1.jpg': { title: '', technique: '', year: '', description: '', extra: [] },
  'escultura2.jpg': { title: '', technique: '', year: '', description: '', extra: [] },
  'escultura3.jpg': { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- Animación ----- */
  'animacion1.jpg': { title: '', technique: '', year: '', description: '', extra: [] },
  'animacion2.jpg': { title: '', technique: '', year: '', description: '', extra: [] },
  'animacion3.jpg': { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- 3D ----- */
  'blender1.jpg':   { title: '', technique: '', year: '', description: '', extra: [] },
  'blender2.jpg':   { title: '', technique: '', year: '', description: '', extra: [] },
  'blender3.jpg':   { title: '', technique: '', year: '', description: '', extra: [] },

  /* ----- Tattoo ----- */
  'concept1.jpg':   { title: '', technique: '', year: '', description: '', extra: [] },
  'concept2.jpg':   { title: '', technique: '', year: '', description: '', extra: [] },
  'concept3.jpg':   { title: '', technique: '', year: '', description: '', extra: [] }

  /* EJEMPLO de una obra completa:

  'Dj1.png': {
    title: 'La Corte del Juicio',
    technique: 'Pintura digital',
    year: '2026',
    description: 'Texto que se muestra junto a la imagen.',
    extra: [
      ['Formato', '3000 × 4000 px'],
      ['Software', 'Adobe Photoshop']
    ]
  }

  */

};



/* =========================================================
   3. CORAZÓN
========================================================= */

const HEART_STATES = {

  inicio:
    './assets/heart/S1.png',

  proyectos:
    './assets/heart/S2.png',

  TabCuart:
    './assets/heart/S3.png',

  estudios:
    './assets/heart/S4.png',

  contacto:
    './assets/heart/S5.png',

  sobre:
    './assets/heart/S6.png'

};


const heartLayers = {};

/* Todos los estados del corazón se cargan al iniciar y se apilan: cambiar de estado = alternar opacidad
   (antes se cambiaba el src al pasar el cursor y la imagen tardaba en cargar → respuesta retrasada). */
function buildHeartLayers() {

  if (!heartFrame || heartLayers.inicio) return;

  heartFrame.classList.add('heart-layer', 'on');
  heartLayers.inicio = heartFrame;

  Object.keys(HEART_STATES).forEach(key => {

    if (key === 'inicio') return;

    const img = new Image();
    img.className = 'heart-frame-img heart-layer';
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    img.src = HEART_STATES[key];

    heartFrame.parentNode.insertBefore(img, heartFrame.nextSibling);
    heartLayers[key] = img;

  });
}


function initHeart() {

  if (!heartFrame) return;

  if (heartFallback) {
    heartFallback.style.display = 'none';
  }

  if (heartVideo) {
    heartVideo.style.display = 'none';
  }

  heartFrame.style.display = 'block';

  heartFrame.src =
    HEART_STATES.inicio;

  buildHeartLayers();

  /* Conecta las etiquetas con el corazón (sección 21) */
  layoutAnatomy();
}


function setHeartState(zone) {

  const target = heartLayers[zone];

  if (!target) return;

  /* Si esa imagen aún no cargó, se conserva la actual (nunca queda en blanco) */
  if (zone !== 'inicio' && (!target.complete || !target.naturalWidth)) return;

  Object.keys(heartLayers).forEach(key =>
    heartLayers[key].classList.toggle('on', heartLayers[key] === target)
  );
}


function resetHeartState() {

  setHeartState('inicio');
}


function clearAnatomyHighlights() {

  document
    .querySelectorAll('.hotspot')
    .forEach(h =>
      h.classList.remove('armed')
    );

  document
    .querySelectorAll('.anatomy-lines line, .anatomy-lines path')
    .forEach(l =>
      l.classList.remove('line-active')
    );

  document
    .querySelectorAll('.anatomy-lines circle')
    .forEach(n =>
      n.classList.remove('node-active')
    );

  if (heartAnim) {
    heartAnim.classList.remove(
      'beating-fast'
    );
  }

  resetHeartState();
}


function armZone(zone, hotspotEl) {

  clearAnatomyHighlights();

  setHeartState(zone);

  if (heartAnim) {
    heartAnim.classList.add(
      'beating-fast'
    );
  }

  if (hotspotEl) {
    hotspotEl.classList.add('armed');
  }

  const line =
    document.getElementById(
      'line-' + zone
    );

  const node =
    document.getElementById(
      'node-' + zone
    );

  if (line) {
    line.classList.add('line-active');
  }

  if (node) {
    node.classList.add('node-active');
  }
}


/* =========================================================
   4. NAVEGACIÓN
========================================================= */

function triggerEnter(zone, sourceEl) {

  armZone(
    zone,
    sourceEl
  );

  if (!heartAnim) {

    openLayer(zone);

    return;
  }

  heartAnim.classList.add(
    'pulse-strong'
  );

  setTimeout(() => {

    heartAnim.classList.remove(
      'pulse-strong'
    );

    openLayer(zone);

  }, 240);
}


function openLayer(zone) {

  const layer =
    document.getElementById(
      'layer-' + zone
    );

  if (!layer) return;

  document
    .querySelectorAll('.layer')
    .forEach(l => {

      l.classList.remove(
        'active'
      );

      l.setAttribute(
        'aria-hidden',
        'true'
      );

    });

  layer.classList.add(
    'active'
  );

  layer.setAttribute(
    'aria-hidden',
    'false'
  );

  document.body.classList.add(
    'layer-open'
  );

  currentZone = zone;

  layer.scrollTop = 0;

  const heading =
    layer.querySelector(
      'h1,h2'
    );

  if (heading) {

    heading.setAttribute(
      'tabindex',
      '-1'
    );

    heading.focus({
      preventScroll:
        true
    });

  }

  /* ========================================
     REACTIVAR LA RUEDA
  ======================================== */

  if (zone === 'TabCuart') {

    requestAnimationFrame(() => {

      initWorksWheel();

      layoutWorksWheel();

    });

  }
}


function closeLayer() {

  if (!currentZone) return;

  const zone =
    currentZone;

  const layer =
    document.getElementById(
      'layer-' + zone
    );

  if (layer) {

    layer.classList.remove(
      'active'
    );

    layer.setAttribute(
      'aria-hidden',
      'true'
    );

  }

  document.body.classList.remove(
    'layer-open'
  );

  currentZone = null;

  clearAnatomyHighlights();

  const origin =
    zone === 'sobre'
      ? heartAnim
      : document.querySelector(
          '.hotspot[data-zone="' +
          zone +
          '"]'
        );

  if (origin) {
    origin.focus({
      preventScroll:
        true
    });
  }
}


/*
  CONTACTO ahora vive dentro de "Sobre mí" (apartado 02 / Contacto, #sobreContacto).
  Todos los botones que antes abrían la capa "contacto" llaman a esta función.
*/
function openContact() {

  const alreadyThere =
    currentZone === 'sobre';

  if (!alreadyThere) {
    openLayer('sobre');
  }

  const layer =
    document.getElementById(
      'layer-sobre'
    );

  const target =
    document.getElementById(
      'sobreContacto'
    );

  if (!layer || !target) return;

  setTimeout(() => {

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

  }, alreadyThere ? 0 : 160);
}


/* =========================================================
   5. FILTROS
========================================================= */

function filterGallery(
  category,
  button
) {

  const gallery =
    document.getElementById(
      'gallery'
    );

  if (!gallery) return;

  const items =
    gallery.querySelectorAll(
      '.gallery-item'
    );

  document
    .querySelectorAll(
      '.gallery-filter .filter-btn'
    )
    .forEach(btn =>
      btn.classList.remove(
        'active'
      )
    );

  if (button) {
    button.classList.add(
      'active'
    );
  }

  /* ========================================
     TODAS
     Solo primera obra de cada categoría
  ======================================== */

  if (category === 'all') {

    const shownCategories =
      new Set();

    items.forEach(item => {

      const itemCategory =
        (
          item.dataset.cat ||
          ''
        ).toLowerCase();

      if (
        !shownCategories.has(
          itemCategory
        )
      ) {

        item.style.display = '';

        shownCategories.add(
          itemCategory
        );

      } else {

        item.style.display =
          'none';

      }

    });

  }


  /* ========================================
     CATEGORÍA
  ======================================== */

  else {

    items.forEach(item => {

      const itemCategory =
        (
          item.dataset.cat ||
          ''
        ).toLowerCase();

      item.style.display =
        itemCategory ===
        category.toLowerCase()
          ? ''
          : 'none';

    });

  }


  /* ========================================
     ANIMACIÓN
  ======================================== */

  const intro =
    document.getElementById(
      'techniqueIntro'
    );

  const process =
    document.getElementById(
      'techniqueProcess'
    );

  if (intro) {
    intro.classList.add(
      'changing'
    );
  }

  if (process) {
    process.classList.add(
      'changing'
    );
  }

  setTimeout(() => {

    if (intro) {
      intro.classList.remove(
        'changing'
      );
    }

    if (process) {
      process.classList.remove(
        'changing'
      );
    }

  }, 350);


  
  /* ========================================
     ACTUALIZAR RUEDA
  ======================================== */

  wheelRotation = 0;
  wheelTargetRotation = 0;
  wheelAnimating = false;

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (wheel) {

    wheel.classList.remove(
      'wheel-expanding'
    );

    requestAnimationFrame(() => {

      layoutWorksWheel();

    });

  }

}


/* =========================================================
   6. PESTAÑAS
========================================================= */

function switchLocalTab(
  id,
  btn,
  panelClass,
  idPrefix
) {

  if (!btn) return;

  const group =
    btn.parentElement;

  group
    .querySelectorAll(
      'button'
    )
    .forEach(
      b =>
        b.classList.remove(
          'active'
        )
    );

  btn.classList.add(
    'active'
  );

  const scope =
    group.parentElement;

  scope
    .querySelectorAll(
      '.' + panelClass
    )
    .forEach(
      p =>
        p.classList.remove(
          'active'
        )
    );

  const target =
    document.getElementById(
      idPrefix + id
    );

  if (target) {
    target.classList.add(
      'active'
    );
  }
}


/* =========================================================
   8. SUBIDA DE IMÁGENES  (AUXILIAR LOCAL)
========================================================= */

/*
  NOTA: ya NO hay controles de carga visibles en el sitio: las imágenes del portafolio
  se cambian directamente en index.html (atributo src).
  Estas funciones se CONSERVAN a propósito como auxiliares de administración local
  (llamables desde la consola o conectables a un <input type="file">). Ningún elemento
  del HTML actual las invoca, y los contenedores que buscan (.store-img, .about-portrait,
  .upload-placeholder, .fish-up-icon, .pup-icon) ya no existen: antes de reutilizarlas
  hay que reconectarlas a elementos vigentes.
*/

function previewUploadedImage(
  input,
  containerSelector,
  hideSelector
) {

  if (
    !input.files ||
    !input.files[0]
  ) return;

  const reader =
    new FileReader();

  reader.onload = e => {

    const container =
      input.closest(
        containerSelector
      );

    if (!container) return;

    let img =
      container.querySelector(
        'img.uploaded'
      );

    if (!img) {

      img =
        document.createElement(
          'img'
        );

      img.className =
        'uploaded';

      container.appendChild(
        img
      );

    }

    img.src =
      e.target.result;

    container
      .querySelectorAll(
        hideSelector
      )
      .forEach(
        el =>
          el.style.display =
            'none'
      );

  };

  reader.readAsDataURL(
    input.files[0]
  );
}


function loadFishImg(input) {

  previewUploadedImage(
    input,
    '.fish-slot',
    '.fish-up-icon,.fish-lbl'
  );

}


function loadPlantImg(input) {

  previewUploadedImage(
    input,
    '.plant-img',
    '.pup-icon'
  );

}


function loadStoreImg(input) {

  previewUploadedImage(
    input,
    '.store-img',
    '.upload-placeholder'
  );

}


function loadPortraitImg(input) {

  previewUploadedImage(
    input,
    '.about-portrait',
    '.upload-placeholder'
  );

}


/* =========================================================
   10. LOADER + SECUENCIA DE ENTRADA
========================================================= */

/*
  Antes: el loader se ocultaba 2 s después de "load" y las animaciones de la cabecera corrían
  detrás de él, así que al desaparecer ya habían terminado y el inicio "no se animaba".
  Ahora:
    1. La barra (--load) avanza según lo que de verdad ya cargó: fuentes + corazón (S1) + DOM.
    2. Cuando todo está listo (y pasó el tiempo mínimo) el loader se desvanece.
    3. Mientras se desvanece arranca la secuencia (clase html.intro-play, ver styles.css §7B).
    4. A los 3 s se limpia (intro-done), se recalculan las líneas del corazón y se avisa con
       el evento "intro:done" (el Observador espera ese evento para aparecer).
  Con prefers-reduced-motion: sin secuencia, todo aparece de una vez.
*/
(function initIntro() {

  const root = document.documentElement;


  const MIN_MS = reduceMotion ? 0 : 1300;   /* tiempo mínimo de pantalla de carga   */
  const MAX_MS = 6500;                /* nunca esperar más que esto           */
  const PLAY_MS = 3000;               /* duración total de la secuencia       */

  const t0 = performance.now();

  const ready = { dom: false, fonts: false, heart: false };

  let shown = 0;
  let started = false;
  let timer = null;


  function setBar(p) {

    shown = Math.max(shown, Math.min(1, p));

    if (loader) {
      loader.style.setProperty('--load', shown.toFixed(3));
    }

  }


  /* ---------- 1. Qué ya está listo ---------- */

  if (document.readyState !== 'loading') {
    ready.dom = true;
  } else {
    document.addEventListener('DOMContentLoaded', () => { ready.dom = true; });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { ready.fonts = true; });
  } else {
    ready.fonts = true;
  }

  (function watchHeart() {

    if (!heartFrame) { ready.heart = true; return; }

    const ok = () => { ready.heart = true; };

    if (heartFrame.complete && heartFrame.naturalWidth) {
      (heartFrame.decode ? heartFrame.decode() : Promise.resolve()).then(ok, ok);
    } else {
      heartFrame.addEventListener('load', () => {
        (heartFrame.decode ? heartFrame.decode() : Promise.resolve()).then(ok, ok);
      }, { once: true });
      heartFrame.addEventListener('error', ok, { once: true });
    }

  })();


  /* ---------- 2. Avance de la barra y salida del loader ---------- */

  function check() {

    const elapsed = performance.now() - t0;

    const done =
      (ready.dom ? 1 : 0) + (ready.fonts ? 1 : 0) + (ready.heart ? 1 : 0);

    /* La barra nunca se adelanta al tiempo mínimo ni a lo realmente cargado */
    const byTime = MIN_MS ? elapsed / MIN_MS : 1;
    const byWork = (done / 3) * 0.94;

    setBar(Math.min(byTime, byWork));

    const allReady = done === 3 && elapsed >= MIN_MS;

    if (allReady || elapsed >= MAX_MS) {
      finish();
    }

  }

  function finish() {

    if (started) return;
    started = true;

    clearInterval(timer);

    setBar(1);

    /* deja ver la barra completa un instante, luego desvanece */
    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
    }, reduceMotion ? 0 : 280);

    /* la secuencia arranca cuando el loader ya se está yendo */
    setTimeout(play, reduceMotion ? 0 : 560);

  }


  /* ---------- 3. Secuencia y limpieza ---------- */

  function play() {

    root.classList.remove('intro-pending');

    if (reduceMotion) {
      root.classList.add('intro-done');
      settle();
      return;
    }

    root.classList.add('intro-play');

    setTimeout(() => {
      root.classList.remove('intro-play');
      root.classList.add('intro-done');
      settle();
    }, PLAY_MS);

  }

  function settle() {

    if (typeof layoutAnatomy === 'function') layoutAnatomy();

    document.dispatchEvent(new Event('intro:done'));

  }


  timer = setInterval(check, 80);
  check();

})();


/* =========================================================
   11. CURSOR
========================================================= */

document.addEventListener(
  'mousemove',
  e => {

    mx = e.clientX;
    my = e.clientY;

    if (cur) {

      cur.style.transform =
        'translate3d(' + mx + 'px,' + my + 'px,0) translate(-50%,-50%)';

    }

  }
);


(function animateRing() {

  rx +=
    (mx - rx) * .12;

  ry +=
    (my - ry) * .12;

  if (ring) {

    ring.style.transform =
      'translate3d(' + rx + 'px,' + ry + 'px,0) translate(-50%,-50%)';

  }

  requestAnimationFrame(
    animateRing
  );

})();


document
  .querySelectorAll(
    'a,button,.gallery-item,' +
    '.lab-big-card,.playing-card,.sin-card,' +
    '.fish-slot,.plant-card,' +
    '.curioso-card,.aqua-tab,.hotspot,.heart-anim,' +
    '.fish-card,.book-stage,.video-slot,' +
    '.pv-viewport,.pv-frame--video,.pv-slider,.ab-card,' +
    '.works-wheel'
  )
  .forEach(el => {

    el.addEventListener(
      'mouseenter',
      () => {

        if (!ring) return;

        ring.style.width =
          '50px';

        ring.style.height =
          '50px';

        ring.style.borderColor =
          'rgba(227,38,46,.65)';

      }
    );

    el.addEventListener(
      'mouseleave',
      () => {

        if (!ring) return;

        ring.style.width =
          '32px';

        ring.style.height =
          '32px';

        ring.style.borderColor =
          'rgba(181,22,32,.4)';

      }
    );

  });


/* =========================================================
   12. REVEAL
========================================================= */

const obs =
  new IntersectionObserver(
    entries => {

      entries.forEach(e => {

        if (
          e.isIntersecting
        ) {

          e.target.classList.add(
            'visible'
          );

          obs.unobserve(
            e.target
          );

        }

      });

    },
    {
      threshold: .07,
      rootMargin:
        '0px 0px -40px 0px'
    }
  );


document
  .querySelectorAll(
    '.reveal'
  )
  .forEach(
    el =>
      obs.observe(el)
  );


/* =========================================================
   13. BRASAS
========================================================= */

(function createEmbers() {

  const container =
    document.getElementById(
      'embers'
    );

  if (!container) return;

  const colors = [
    'rgba(220,80,20,',
    'rgba(200,50,10,',
    'rgba(240,120,40,',
    'rgba(180,40,10,'
  ];

  for (
    let i = 0;
    i < 30;
    i++
  ) {

    const e =
      document.createElement(
        'div'
      );

    e.className =
      'ember';

    const size =
      Math.random() * 3 + 1;

    const color =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    const dur =
      Math.random() * 15 + 8;

    const delay =
      Math.random() * 20;

    const x =
      Math.random() * 100;

    const dx =
      (Math.random() - .5) *
      200;

    e.style.cssText =
      `width:${size}px;` +
      `height:${size}px;` +
      `left:${x}%;` +
      `bottom:0;` +
      `background:${color}0.8);` +
      `box-shadow:0 0 ${size * 3}px ${color}0.5);` +
      `animation-duration:${dur}s;` +
      `animation-delay:${delay}s;` +
      `--dx:${dx}px;`;

    container.appendChild(
      e
    );

  }

})();


/* =========================================================
   14. WORKS WHEEL
========================================================= */

let wheelRotation = 0;

let wheelTargetRotation = 0;

let wheelAnimating = false;

let wheelDragging = false;

let wheelStartX = 0;

let wheelLastX = 0;

let wheelMoved = false;

let wheelInitialized = false;

let wheelCaptured = false;

let wheelPointerId = null;

let wheelSuppressClick = false;


/* ---------------------------------------------------------
   INICIALIZAR
--------------------------------------------------------- */

function initWorksWheel() {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return;

  const items =
    wheel.querySelectorAll(
      '.gallery-item'
    );

  if (!items.length) return;

  wheelInitialized = true;

  wheel.classList.add(
    'wheel-ready'
  );

  layoutWorksWheel();

}


/* ---------------------------------------------------------
   OBTENER ITEMS VISIBLES
--------------------------------------------------------- */

function getVisibleWheelItems() {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return [];

  return [
    ...wheel.querySelectorAll(
      '.gallery-item'
    )
  ].filter(item =>
    getComputedStyle(
      item
    ).display !== 'none'
  );

}


/* ---------------------------------------------------------
   RADIO
--------------------------------------------------------- */

function getWheelRadius() {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return 300;

  const width =
    wheel.clientWidth;

  const height =
    wheel.clientHeight;

  let radius =
    Math.min(
      width * .48,
      height * .46
    );

  if (window.innerWidth <= 600) {

    radius =
      Math.min(
        width * .42,
        height * .35
      );

  }

  return Math.max(
    170,
    radius
  );

}


/* ---------------------------------------------------------
   POSICIONAR RUEDA
--------------------------------------------------------- */

function layoutWorksWheel() {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return;

  const items =
    getVisibleWheelItems();

  if (!items.length) return;

  const count =
    items.length;

  const step =
    360 / count;

  const radius =
    getWheelRadius();

  const centerTitle =
    document.getElementById(
      'wheelCenterTitle'
    );

  const centerCount =
    document.getElementById(
      'wheelCenterCount'
    );

  if (centerCount) {

    centerCount.textContent =
      String(count).padStart(
        2,
        '0'
      ) +
      ' OBRAS';

  }


  items.forEach(
    (item, index) => {

      const angle =
        wheelRotation +
        index * step;

      const normalized =
        ((angle % 360) + 360) % 360;

      const radians =
        normalized *
        Math.PI /
        180;

      const depth =
        Math.cos(
          radians
        );

      const front =
        Math.max(
          0,
          depth
        );

      const scale =
        .70 +
        front * .45;

      const opacity =
        .22 +
        front * .78;

      const blur =
        (1 - front) * 2.5;

      const z =
        Math.round(
          depth * 1000
        );

      item.style.setProperty(
        '--item-opacity',
        opacity
      );

      item.style.zIndex =
        String(
          z + 100
        );

      item.style.transform =
        `
        translate3d(-50%, -50%, 0)
        rotateY(${-angle}deg)
        translateZ(${radius}px)
        scale(${scale})
        `;

      item.style.filter =
        `brightness(${.48 + front * .52})
         blur(${blur}px)`;


      item.classList.toggle(
        'is-front',
        depth > .96
      );

    }
  );


  /* -------------------------------------------------------
     DETERMINAR OBRA FRONTAL
  ------------------------------------------------------- */

  let closest =
    null;

  let closestDistance =
    Infinity;

  items.forEach(
    (item, index) => {

      const angle =
        (
          wheelRotation +
          index * step
        ) % 360;

      const normalized =
        ((angle + 540) % 360) - 180;

      const distance =
        Math.abs(
          normalized
        );

      if (
        distance <
        closestDistance
      ) {

        closestDistance =
          distance;

        closest =
          item;

      }

    }
  );


  if (
    closest &&
    centerTitle
  ) {

    /*
      Solo cambia el centro cuando
      el usuario ya está explorando.
    */

    if (
      wheelInitialized &&
      wheelMoved
    ) {

      centerTitle.textContent =
        (
          closest.dataset.title ||
          'TABCUART'
        ).toUpperCase();

    }

  }

}


/* ---------------------------------------------------------
   ANIMACIÓN SUAVE
--------------------------------------------------------- */

function animateWheel() {

  if (!wheelAnimating) return;

  wheelRotation +=
    (
      wheelTargetRotation -
      wheelRotation
    ) * .14;

  layoutWorksWheel();

  if (
    Math.abs(
      wheelTargetRotation -
      wheelRotation
    ) < .08
  ) {

    wheelRotation =
      wheelTargetRotation;

    wheelAnimating =
      false;

  }

  requestAnimationFrame(
    animateWheel
  );

}


/* ---------------------------------------------------------
   ROTAR
--------------------------------------------------------- */

function rotateWheel(
  amount
) {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return;

  wheelMoved = true;

  wheel.classList.add(
    'wheel-expanding'
  );

  wheelTargetRotation +=
    amount;

  if (!wheelAnimating) {

    wheelAnimating =
      true;

    requestAnimationFrame(
      animateWheel
    );

  }

}


/* ---------------------------------------------------------
   ENCAJAR EN UNA OBRA
--------------------------------------------------------- */

function snapWheel() {

  const items =
    getVisibleWheelItems();

  if (!items.length) return;

  const step =
    360 / items.length;

  const target =
    Math.round(
      wheelRotation / step
    ) * step;

  wheelTargetRotation =
    target;

  wheelAnimating =
    true;

  requestAnimationFrame(
    animateWheel
  );

}


/* ---------------------------------------------------------
   MOUSE WHEEL
--------------------------------------------------------- */

function handleWheel(
  e
) {

  const wheel =
    e.currentTarget;

  if (!wheel) return;

  e.preventDefault();

  wheelMoved = true;

  wheel.classList.add(
    'wheel-expanding'
  );

  const amount =
    e.deltaY * .25;

  rotateWheel(
    amount
  );

}


/* ---------------------------------------------------------
   POINTER DOWN
--------------------------------------------------------- */

function wheelPointerDown(
  e
) {

  const wheel =
    e.currentTarget;

  wheelDragging =
    true;

  wheelMoved =
    false;

  wheelStartX =
    e.clientX;

  wheelLastX =
    e.clientX;

  /*
    El puntero ya NO se captura aquí: si se capturara en cada clic,
    el evento "click" dejaría de llegar a la imagen y no abriría
    el visor. Se captura en wheelPointerMove, solo si hay arrastre.
  */
  wheelCaptured = false;

  wheelPointerId =
    e.pointerId;

  wheel.classList.add(
    'wheel-expanding'
  );
 wheel.style.cursor = 'grabbing';
}


/* ---------------------------------------------------------
   POINTER MOVE
--------------------------------------------------------- */

function wheelPointerMove(
  e
) {

  if (!wheelDragging) return;

  const dx =
    e.clientX -
    wheelStartX;

  const delta =
    e.clientX -
    wheelLastX;

  if (
    Math.abs(dx) > 4
  ) {

    e.preventDefault();

    wheelMoved =
      true;

    if (!wheelCaptured) {

      try {

        e.currentTarget
          .setPointerCapture(
            wheelPointerId
          );

        wheelCaptured = true;

      } catch (error) {}

    }

  }

  wheelLastX =
    e.clientX;

  const items =
    getVisibleWheelItems();

  if (!items.length) return;

  const degrees =
  delta * -.25;

  wheelRotation +=
    degrees;

  wheelTargetRotation =
    wheelRotation;

  layoutWorksWheel();

}


/* ---------------------------------------------------------
   POINTER UP
--------------------------------------------------------- */

function wheelPointerUp(
  e
) {

  const wheel =
    e.currentTarget;

  if (!wheelDragging) return;

  wheel.style.cursor =
  'grab';

  wheelDragging =
    false;

  /* Un arrastre no debe contar como clic sobre una obra */
  wheelSuppressClick =
    wheelMoved;

  setTimeout(() => {

    wheelSuppressClick =
      false;

  }, 80);

  if (wheelCaptured) {

    try {

      wheel.releasePointerCapture(
        e.pointerId
      );

    } catch (error) {}

  }

  wheelCaptured = false;

  snapWheel();

}


/* ---------------------------------------------------------
   TECLADO
--------------------------------------------------------- */

function wheelKeyboard(
  e
) {

  if (
    e.key === 'ArrowRight' ||
    e.key === 'ArrowDown'
  ) {

    e.preventDefault();

    rotateWheel(
      30
    );

    snapWheel();

  }

  if (
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowUp'
  ) {

    e.preventDefault();

    rotateWheel(
      -30
    );

    snapWheel();

  }

}


/* ---------------------------------------------------------
   CONECTAR EVENTOS
--------------------------------------------------------- */

function setupWorksWheel() {

  const wheel =
    document.getElementById(
      'gallery'
    );

  if (!wheel) return;

  wheel.addEventListener(
    'wheel',
    handleWheel,
    {
      passive: false
    }
  );

  wheel.addEventListener(
    'pointerdown',
    wheelPointerDown
  );

  wheel.addEventListener(
    'pointermove',
    wheelPointerMove
  );

  wheel.addEventListener(
    'pointerup',
    wheelPointerUp
  );

  wheel.addEventListener(
    'pointercancel',
    wheelPointerUp
  );

  wheel.addEventListener(
    'keydown',
    wheelKeyboard
  );

}


/* =========================================================
   15. HOTSPOTS
========================================================= */

document
  .querySelectorAll(
    '.hotspot'
  )
  .forEach(h => {

    const zone =
      h.dataset.zone;

    h.addEventListener(
      'mouseenter',
      () => {

        if (!isTouch) {
          armZone(
            zone,
            h
          );
        }

      }
    );

    h.addEventListener(
      'mouseleave',
      () => {

        if (!isTouch) {
          clearAnatomyHighlights();
        }

      }
    );

    h.addEventListener(
      'focus',
      () =>
        armZone(
          zone,
          h
        )
    );

    h.addEventListener(
      'blur',
      () => {

        if (
          document.activeElement !==
          h
        ) {

          clearAnatomyHighlights();

        }

      }
    );


    h.addEventListener(
      'click',
      e => {

        e.preventDefault();

        if (
          isTouch &&
          !h.classList.contains(
            'armed'
          )
        ) {

          armZone(
            zone,
            h
          );

          return;

        }

        triggerEnter(
          zone,
          h
        );

      }
    );


    h.addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Enter' ||
          e.key === ' '
        ) {

          e.preventDefault();

          triggerEnter(
            zone,
            h
          );

        }

      }
    );

  });


/* =========================================================
   16. CORAZÓN SOBRE MÍ
========================================================= */

if (heartAnim) {

  heartAnim.addEventListener(
    'mouseenter',
    () => {

      if (!isTouch) {
        setHeartState(
          'sobre'
        );
      }

    }
  );


  heartAnim.addEventListener(
    'mouseleave',
    () => {

      if (!isTouch) {
        resetHeartState();
      }

    }
  );


  heartAnim.addEventListener(
    'click',
    e => {

      e.preventDefault();

      triggerEnter(
        'sobre',
        heartAnim
      );

    }
  );


  heartAnim.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {

        e.preventDefault();

        triggerEnter(
          'sobre',
          heartAnim
        );

      }

    }
  );

}


/* =========================================================
   17. ESCAPE
========================================================= */

document.addEventListener(
  'keydown',
  e => {

    if (e.key !== 'Escape') return;

    /* Si el visor de obras está abierto, ESC solo lo cierra a él */
    if (isImageViewerOpen()) {

      e.preventDefault();

      closeImageViewer();

      return;

    }

    if (currentZone) {

      closeLayer();

    }

  }
);


/* =========================================================
   18. VISOR DE IMÁGENES Y VIDEOS / OBRA AMPLIADA
========================================================= */

let viewerLastFocus = null;
let viewerClearTimer = null;
let viewerSet = [];     /* obras navegables dentro del visor (galería visible) */
let viewerIdx = -1;

function isImageViewerOpen() {

  const modal =
    document.getElementById('imgModal');

  return !!modal &&
    modal.classList.contains('is-open');
}


/* =========================================================
   PROCESOS POR TRABAJO (datos)
   Clave = nombre del archivo de la obra (la misma de WORKS_DEFAULTS).
   Cada proceso es una etapa:  { src, title, text, alt?, fallback? }
   · fallback: imagen alternativa si src aún no existe (se muestra ampliada como detalle).
   Para AGREGAR procesos basta con escribirlos aquí o llamar a:
        ProcessSystem.add('0001_1.mp4', { src: 'Img/Etp4.png', title: 'Color', text: '…' });
   Un trabajo sin entrada muestra el estado vacío. No hay que tocar el HTML.
========================================================= */
const PROCESS_DATA = {
  /* Obra 1 actual: Video/0001_1.mp4 */
  '0001_1.mp4': [
    {"src": "Img/Etp1.png", "title": "Boceto", "text": "Primeras ideas, pruebas de composición y exploración visual.", "alt": "Boceto: primeras ideas de la obra"},
    {"src": "Img/Etp2.png", "title": "Desarrollo", "text": "Construcción de formas, texturas, color y detalles.", "alt": "Desarrollo: construcción de formas, texturas y color"},
    {"src": "Img/Etp3.png", "title": "Proceso", "text": "Los detalles se acumulan hasta que la pieza se sostiene sola.", "alt": "Proceso: refinamiento de los detalles", "fallback": "Img/Etp2.png"}
  ],

  /* Ilustración digital 03: el PROCESO es un video (1 etapa) y el FINAL es la imagen Dj3.png */
  'Dj3.png': [
    { "type": "video", "src": "Video/0002_1.mp4", "title": "Proceso", "text": "Así se construye la ilustración, de principio a fin.", "alt": "Video del proceso de la ilustración" }
  ],

  /* Escultura / Cuadro de botones */
  'escultura1.jpg': [
    { "src": "Img/Esc1.jpg", "title": "Boceto y Soporte", "text": "Preparación de la superficie, trazado de líneas guía y estructura inicial.", "alt": "Preparación de la base de la escultura" },
    { "src": "Img/Esc2.jpg", "title": "Ensamblaje", "text": "Fijación y distribución de botones creando volúmenes, texturas y capas de relieve.", "alt": "Proceso de ensamblaje con botones" },
    { "src": "Img/Esc3.png", "title": "Detalles y Sellado", "text": "Ajuste fino de contrastes, fijación de piezas sueltas y acabado final.", "alt": "Detalles finales y acabado de la escultura" }
  ]
};

/* RESULTADO FINAL por trabajo (bloque derecho).
   type: 'image' o 'video'. Un trabajo sin entrada usa el video por defecto del HTML (Video/0001_1.mp4). */
const FINAL_DATA = {
  'Dj3.png': { type: 'image', src: 'Img/Dj3.png', title: 'Resultado final', text: 'La ilustración terminada.', alt: 'Ilustración digital terminada' },
  
  /* Resultado final de la escultura */
  'escultura1.jpg': { type: 'image', src: 'Img/escultura1.jpg', title: 'Resultado final', text: 'Escultura de pared terminada.', alt: 'Fotografía de la escultura de pared terminada' }
};
/* =========================================================
   INFORMACIÓN DE LA OBRA
========================================================= */

function resolveWorkInfo(item, media) {

  const category =
    (item?.dataset.cat || '').toLowerCase();

  const defaults =
    WORKS_DEFAULTS[category] || {};

  const src =
    media?.getAttribute('src') || '';

  const file =
    src
      .split('?')[0]
      .split('/')
      .pop();

  const own =
    WORKS_INFO[src] ||
    WORKS_INFO[file] ||
    {};

  const numberEl =
    item?.querySelector('.gallery-number');

  const number =
    numberEl
      ? numberEl.textContent.trim()
      : '';

  const baseTitle =
    item?.dataset.title ||
    media?.alt ||
    'Obra';

  return {

    key: file,
    kicker:
      number
        ? 'Obra ' + number
        : 'Obra',

    title:
      own.title ||
      (
        number
          ? baseTitle + ' ' + number
          : baseTitle
      ),

    technique:
      own.technique ||
      defaults.technique ||
      baseTitle,

    year:
      own.year ||
      item?.dataset.year ||
      '',

    description:
      own.description ||
      defaults.description ||
      '',

    extra:
      own.extra?.length
        ? own.extra
        : (defaults.extra || [])

  };

}


/* =========================================================
   RENDER DE LA INFORMACIÓN
========================================================= */

function renderWorkInfo(info) {

  const kicker =
    document.getElementById('imgModalKicker');

  const title =
    document.getElementById('imgModalTitle');

  const meta =
    document.getElementById('imgModalMeta');

  const desc =
    document.getElementById('imgModalDesc');


  if (kicker) {
    kicker.textContent =
      info.kicker;
  }


  if (title) {
    title.textContent =
      info.title;
  }


  if (meta) {

    meta.textContent = '';

    const rows = [
      ['Técnica', info.technique],
      ['Año', info.year]
    ].concat(info.extra);


    rows.forEach(row => {

      if (!row || !row[1]) return;

      const wrap =
        document.createElement('div');

      wrap.className =
        'img-modal-meta-row';


      const dt =
        document.createElement('dt');

      dt.textContent =
        row[0];


      const dd =
        document.createElement('dd');

      dd.textContent =
        row[1];


      wrap.appendChild(dt);
      wrap.appendChild(dd);

      meta.appendChild(wrap);

    });

  }


  if (desc) {

    desc.textContent =
      info.description;

    desc.hidden =
      !info.description;

  }

}


/* =========================================================
   CARTA: contador, navegación entre obras y acceso al proceso
========================================================= */
function viewerCollect() {
  const g = document.getElementById('gallery');
  if (!g) return [];
  return [].slice.call(g.querySelectorAll('.gallery-item')).filter(it =>
    !it.hidden && getComputedStyle(it).display !== 'none');
}

function syncViewerCard(item, info) {
  if (!viewerSet.includes(item)) viewerSet = viewerCollect();
  if (!viewerSet.includes(item)) viewerSet.push(item);
  viewerIdx = viewerSet.indexOf(item);

  const no = document.getElementById('imgCardNo');
  const foot = document.getElementById('imgCardFoot');
  const proc = document.getElementById('imgProcessBtn');
  const many = viewerSet.length > 1;

  if (no) {
    no.textContent = String(viewerIdx + 1).padStart(2, '0') + ' / ' + String(viewerSet.length).padStart(2, '0');
  }

  if (window.ProcessSystem && info) window.ProcessSystem.setWork(info.key);   /* el proceso mostrado es el del trabajo que se visualiza */
  const hasProcess = !!(window.ProcessSystem && info && window.ProcessSystem.has(info.key));
  if (proc) {
    proc.hidden = !hasProcess;
    proc.dataset.work = info ? info.key : '';
  }
  if (foot) {
    foot.classList.toggle('is-single', !many);
    foot.classList.toggle('is-empty', !many && !hasProcess);
  }
}

/* Pasa a la obra anterior (-1) o siguiente (+1) sin cerrar el visor */
function stepImageViewer(dir) {
  if (viewerSet.length < 2 || !isImageViewerOpen()) return;
  viewerIdx = (viewerIdx + dir + viewerSet.length) % viewerSet.length;
  const media = viewerSet[viewerIdx].querySelector('.click-img, .click-video');
  if (!media) return;
  const dialog = document.querySelector('#imgModal .img-modal-dialog');
  if (dialog) {
    dialog.classList.remove('is-flip');
    void dialog.offsetWidth;
    dialog.classList.add('is-flip');
  }
  openImageViewer(media);
}

/* =========================================================
   ABRIR VISOR
========================================================= */

function openImageViewer(media) {

  const modal =
    document.getElementById('imgModal');

  const modalImg =
    document.getElementById('imgExpanded');

  const modalVideo =
    document.getElementById('videoExpanded');

  const closeBtn =
    document.getElementById('imgClose');


  if (!modal || !media) return;


  clearTimeout(viewerClearTimer);


  const item =
    media.closest('.gallery-item');


  /*
    Modo "solo imagen" (.is-solo): las piezas que no están en la galería
    (Gehenna, Tabcuario) no tienen ficha técnica. Sin esto el panel de
    información mostraba los datos de la última obra abierta.
  */
  modal.classList.toggle(
    'is-solo',
    !item
  );


  const isVideo =
    media.tagName.toLowerCase() === 'video';


  /* =====================================================
     MOSTRAR IMAGEN O VIDEO
  ===================================================== */

  if (modalImg) {

    modalImg.style.display =
      isVideo
        ? 'none'
        : 'block';

  }


  if (modalVideo) {

    modalVideo.pause();

    modalVideo.removeAttribute('src');

    modalVideo.style.display =
      isVideo
        ? 'block'
        : 'none';

  }


  /* =====================================================
     INFORMACIÓN
  ===================================================== */

  if (item) {

    const info =
      resolveWorkInfo(
        item,
        media
      );

    renderWorkInfo(info);
    syncViewerCard(item, info);

    if (modalImg) {
      modalImg.alt =
        info.title;
    }

  } else {

    /* Sin ficha: el nombre accesible del diálogo sale del alt de la imagen. */
    const soloTitle =
      document.getElementById('imgModalTitle');

    const soloAlt =
      media.getAttribute('alt') || '';

    if (soloTitle) {
      soloTitle.textContent =
        soloAlt;
    }

    if (modalImg) {
      modalImg.alt =
        soloAlt;
    }

  }


  /* =====================================================
     CARGAR VIDEO
  ===================================================== */

  if (isVideo && modalVideo) {

    const src =
      media.currentSrc ||
      media.getAttribute('src') ||
      media.src;


    if (src) {

      modalVideo.src =
        src;

      modalVideo.loop = true;
modalVideo.autoplay = true;
modalVideo.muted = true;

modalVideo.load();

modalVideo.play()
        .catch(() => {});

    }

  }


  /* =====================================================
     CARGAR IMAGEN
  ===================================================== */

  if (!isVideo && modalImg) {

    modalImg.src =
      media.currentSrc ||
      media.src;

  }


  /* =====================================================
     ABRIR MODAL
  ===================================================== */

  viewerLastFocus =
    document.activeElement;


  modal.classList.add(
    'is-open'
  );


  modal.setAttribute(
    'aria-hidden',
    'false'
  );


  document.body.classList.add(
    'viewer-open'
  );


  const dialog =
    modal.querySelector(
      '.img-modal-dialog'
    );

  const info =
    document.getElementById(
      'imgInfo'
    );


  if (dialog) {
    dialog.scrollTop = 0;
  }


  if (info) {
    info.scrollTop = 0;
  }


  if (closeBtn) {

    closeBtn.focus({
      preventScroll: true
    });

  }

}


/* =========================================================
   CERRAR VISOR
========================================================= */

function closeImageViewer() {

  const modal =
    document.getElementById('imgModal');

  const modalImg =
    document.getElementById('imgExpanded');

  const modalVideo =
    document.getElementById('videoExpanded');


  if (!modal) return;


  modal.classList.remove(
    'is-open'
  );


  modal.setAttribute(
    'aria-hidden',
    'true'
  );


  document.body.classList.remove(
    'viewer-open'
  );


  clearTimeout(
    viewerClearTimer
  );


  /* Detener video */
  if (modalVideo) {

    modalVideo.pause();

    modalVideo.removeAttribute(
      'src'
    );

    modalVideo.load();

  }


  /* Limpiar imagen */
  viewerClearTimer =
    setTimeout(() => {

      if (modalImg) {

        modalImg.removeAttribute(
          'src'
        );

      }

    }, 400);


  /* Devolver foco */
  if (
    viewerLastFocus &&
    typeof viewerLastFocus.focus === 'function'
  ) {

    viewerLastFocus.focus({
      preventScroll: true
    });

  }


  viewerLastFocus = null;

}


/* =========================================================
   EVENTOS DEL VISOR
========================================================= */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    const modal =
      document.getElementById(
        'imgModal'
      );

    const closeBtn =
      document.getElementById(
        'imgClose'
      );


    if (!modal) return;


    /* =====================================================
       IMÁGENES
    ===================================================== */

    document
      .querySelectorAll('.click-img')
      .forEach(img => {

        img.addEventListener(
          'click',
          function(e) {

            e.stopPropagation();

            if (
              typeof wheelSuppressClick !== 'undefined' &&
              wheelSuppressClick
            ) {
              return;
            }

            openImageViewer(this);

          }
        );

      });


    /* =====================================================
       VIDEOS
    ===================================================== */

    document
      .querySelectorAll('.click-video')
      .forEach(video => {

        video.addEventListener(
          'click',
          function(e) {

            e.stopPropagation();

            if (
              typeof wheelSuppressClick !== 'undefined' &&
              wheelSuppressClick
            ) {
              return;
            }

            openImageViewer(this);

          }
        );

      });


    /* =====================================================
       BOTÓN CERRAR
    ===================================================== */

    if (closeBtn) {

      closeBtn.addEventListener(
        'click',
        closeImageViewer
      );

    }


    /* =====================================================
       CLIC FUERA
    ===================================================== */

    modal.addEventListener(
      'click',
      e => {

        if (
          e.target === modal
        ) {

          closeImageViewer();

        }

      }
    );


    /* =====================================================
       ESC
    ===================================================== */

    document.addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Escape' &&
          isImageViewerOpen()
        ) {

          closeImageViewer();

        }

      }
    );


    /* =====================================================
       NAVEGACIÓN ENTRE OBRAS (botones, flechas y deslizar)
    ===================================================== */
    const prevB = document.getElementById('imgPrev');
    const nextB = document.getElementById('imgNext');
    const procB = document.getElementById('imgProcessBtn');
    if (prevB) prevB.addEventListener('click', () => stepImageViewer(-1));
    if (nextB) nextB.addEventListener('click', () => stepImageViewer(1));
    if (procB) procB.addEventListener('click', () => {
      const key = procB.dataset.work;
      closeImageViewer();
      if (window.ProcessSystem) window.ProcessSystem.show(key, { scroll: true });
    });
    document.addEventListener('keydown', e => {
      if (!isImageViewerOpen() || modal.classList.contains('is-solo')) return;
      if (e.key === 'ArrowRight') stepImageViewer(1);
      else if (e.key === 'ArrowLeft') stepImageViewer(-1);
    });
    const figure = document.getElementById('imgFigure');
    if (figure) {
      let sx = null;
      figure.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sx = e.clientX; });
      figure.addEventListener('pointerup', e => {
        if (sx === null) return;
        const dx = e.clientX - sx; sx = null;
        if (Math.abs(dx) > 60) stepImageViewer(dx < 0 ? 1 : -1);
      });
      figure.addEventListener('pointercancel', () => { sx = null; });
    }
    /* brillo "foil" que sigue al cursor (solo ratón; una actualización por fotograma) */
    const dlg = modal.querySelector('.img-modal-dialog');
    if (dlg) {
      let raf = 0, px = 0, py = 0;
      dlg.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        px = e.clientX; py = e.clientY;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const r = dlg.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (px - r.left) / r.width));
          const y = Math.max(0, Math.min(1, (py - r.top) / r.height));
          dlg.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
          dlg.style.setProperty('--my', (y * 100).toFixed(1) + '%');
          dlg.style.setProperty('--fx', (20 + x * 60).toFixed(1) + '%');
          dlg.style.setProperty('--fy', (20 + y * 60).toFixed(1) + '%');
        });
      }, { passive: true });
    }

    /* =====================================================
       TAB
    ===================================================== */

    modal.addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Tab' &&
          closeBtn
        ) {

          e.preventDefault();

          closeBtn.focus();

        }

      }
    );

  }
);

/* =========================================================
   19. INICIAR
========================================================= */

initHeart();

setupWorksWheel();

window.addEventListener(
  'resize',
  () => {

    if (
      wheelInitialized
    ) {

      layoutWorksWheel();

    }

  }
);


/* =========================================================
   20. INICIAR RUEDA AL CARGAR
========================================================= */

window.addEventListener(
  'load',
  () => {

    setTimeout(() => {

      initWorksWheel();

    }, 100);

  }
);
/* =========================================================
   TABCUART — PARTÍCULAS / AGUJERO NEGRO
========================================================= */

(function initBlackHoleParticles() {

  const wheel = document.getElementById("gallery");
  const canvas = document.getElementById("wheelParticles");

  if (!wheel || !canvas) return;

  const ctx = canvas.getContext("2d");

  let particles = [];

  let width = 0;
  let height = 0;

  let centerX = 0;
  let centerY = 0;

  const PARTICLE_COUNT = 170;

  /* -----------------------------------------
     REDIMENSIONAR CANVAS
  ----------------------------------------- */

  function resizeCanvas() {

    const rect = wheel.getBoundingClientRect();

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    width = rect.width;
    height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    centerX = width / 2;
    centerY = height * 0.42;   /* mismo punto que las tarjetas y el texto central (top: 42%) */
  }


  /* -----------------------------------------
     CREAR PARTÍCULA
  ----------------------------------------- */

  function createParticle(randomStart = true) {

    const angle =
      Math.random() * Math.PI * 2;

    /*
      Distancia inicial.

      Algunas partículas nacen muy lejos,
      otras ya están entrando al agujero.
    */

    const radius =
      randomStart
        ? 120 + Math.random() * 480
        : 420 + Math.random() * 260;

    return {

      angle: angle,

      radius: radius,

      size:
        .5 + Math.random() * 1.8,

      speed:
        .0015 + Math.random() * .004,

      fallSpeed:
        .25 + Math.random() * .55,

      opacity:
        .15 + Math.random() * .65,

      orbit:

        .65 +
        Math.random() * .7,

      /* pequeña variación */
      offset:
        Math.random() * 1000
    };
  }


  /* -----------------------------------------
     CREAR TODAS LAS PARTÍCULAS
  ----------------------------------------- */

  function createParticles() {

    particles = [];

    for (
      let i = 0;
      i < PARTICLE_COUNT;
      i++
    ) {

      particles.push(
        createParticle(true)
      );

    }
  }


  /* -----------------------------------------
     ANIMACIÓN
  ----------------------------------------- */

  function animate(time) {

    ctx.clearRect(
      0,
      0,
      width,
      height
    );


    /*
      Cada partícula gira mientras
      lentamente cae hacia el centro.
    */

    for (const particle of particles) {

      /*
        Velocidad angular:
        cuanto más cerca del centro,
        más rápido gira.
      */

      const angularSpeed =
        particle.speed *
        (1 +
          (500 / Math.max(particle.radius, 60))
        );


      particle.angle += angularSpeed;


      /*
        Succión hacia el agujero negro
      */

      particle.radius -=
        particle.fallSpeed;


      /*
        Si llega demasiado cerca,
        reaparece en el exterior.
      */

      if (particle.radius < 35) {

        Object.assign(
          particle,
          createParticle(false)
        );

        continue;
      }


      /*
        Pequeña deformación orbital.

        Esto evita que todas las partículas
        formen una circunferencia perfecta.
      */

      const wave =
        Math.sin(
          time * .0008 +
          particle.offset
        ) * 8;


      const radius =
        particle.radius + wave;


      /*
        Posición final
      */

      const x =
        centerX +
        Math.cos(particle.angle) *
        radius *
        particle.orbit;


      const y =
        centerY +
        Math.sin(particle.angle) *
        radius;


      /*
        Las partículas se vuelven
        ligeramente más brillantes
        cuando se acercan al centro.
      */

      const proximity =
        Math.max(
          0,
          1 -
          particle.radius / 500
        );


      const alpha =
        particle.opacity *
        (.35 + proximity * .8);


      /*
        Tamaño aparente
      */

      const size =
        particle.size *
        (1 + proximity * .8);


      /*
        COLOR ROJO MUY SUTIL
      */

      ctx.beginPath();

      ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(230, 40, 50, ${alpha})`;

      ctx.fill();


      /*
        PEQUEÑA ESTELA

        Calculamos dónde estaba
        ligeramente antes.
      */

      const trailRadius =
        radius + 7;

      const trailAngle =
        particle.angle - .08;


      const trailX =
        centerX +
        Math.cos(trailAngle) *
        trailRadius *
        particle.orbit;


      const trailY =
        centerY +
        Math.sin(trailAngle) *
        trailRadius;


      const gradient =
        ctx.createLinearGradient(
          trailX,
          trailY,
          x,
          y
        );


      gradient.addColorStop(
        0,
        "rgba(181, 22, 32, 0)"
      );

      gradient.addColorStop(
        1,
        `rgba(181, 22, 32, ${alpha * .45})`
      );


      ctx.beginPath();

      ctx.moveTo(
        trailX,
        trailY
      );

      ctx.lineTo(
        x,
        y
      );

      ctx.strokeStyle =
        gradient;

      ctx.lineWidth =
        Math.max(.4, size * .5);

      ctx.stroke();
    }


    /*
      Halo muy sutil alrededor
      del agujero negro.
    */

    const halo =
      ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        260
      );

    halo.addColorStop(
      0,
      "rgba(0,0,0,.95)"
    );

    halo.addColorStop(
      .25,
      "rgba(0,0,0,.55)"
    );

    halo.addColorStop(
      .55,
      "rgba(181,22,32,.025)"
    );

    halo.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );


    ctx.beginPath();

    ctx.arc(
      centerX,
      centerY,
      260,
      0,
      Math.PI * 2
    );

    ctx.fillStyle = halo;

    ctx.fill();


    requestAnimationFrame(animate);
  }


  /* -----------------------------------------
     INICIAR
  ----------------------------------------- */

  resizeCanvas();

  createParticles();

  window.addEventListener(
    "resize",
    resizeCanvas
  );

  requestAnimationFrame(animate);

})();
document
  .querySelectorAll('#gallery img')
  .forEach(img => {

    img.setAttribute(
      'draggable',
      'false'
    );

    img.addEventListener(
      'dragstart',
      e => e.preventDefault()
    );

  });


/* =========================================================
   21. LÍNEAS ANATÓMICAS DEL CORAZÓN
========================================================= */

/*
  Dibuja una curva orgánica desde el centro del corazón hasta el punto
  (.hotspot-dot) de cada etiqueta. Se calcula con las posiciones reales,
  así las conexiones nunca se salen de pantalla en escritorio, tablet o móvil.
  HTML: <svg id="anatomyLines"> con <path id="line-ZONA"> y <circle id="node-ZONA">.
  armZone() (sección 3) activa las clases line-active / node-active.
*/
function layoutAnatomy() {
  const wrap = document.querySelector('.heart-wrap');
  const svg = document.getElementById('anatomyLines');
  if (!wrap || !svg) return;

  const w = wrap.clientWidth;
  const h = wrap.clientHeight;
  if (!w || !h) return;

  const box = wrap.getBoundingClientRect();
  const cx = w / 2;
  const cy = h / 2;

  svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svg.setAttribute('preserveAspectRatio', 'none');

  document.querySelectorAll('.hotspot').forEach((hs, i) => {
    const zone = hs.dataset.zone;
    const dot = hs.querySelector('.hotspot-dot');
    const line = document.getElementById('line-' + zone);
    const node = document.getElementById('node-' + zone);
    if (!dot || !line) return;

    const r = dot.getBoundingClientRect();
    const x = r.left + r.width / 2 - box.left;
    const y = r.top + r.height / 2 - box.top;

    const dx = x - cx;
    const dy = y - cy;
    const len = Math.hypot(dx, dy) || 1;
    const bend = (i % 2 ? 1 : -1) * len * 0.14;
    const mx = (cx + x) / 2 + (-dy / len) * bend;
    const my = (cy + y) / 2 + (dx / len) * bend;

    line.setAttribute('d', 'M' + cx + ' ' + cy + ' Q' + mx + ' ' + my + ' ' + x + ' ' + y);

    if (node) {
      node.setAttribute('cx', x);
      node.setAttribute('cy', y);
    }
  });
}

window.addEventListener('resize', layoutAnatomy);
window.addEventListener('load', layoutAnatomy);
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(layoutAnatomy);
}


/* =========================================================
   22. ANIMACIÓN DE LA CABECERA (TabCuart)
========================================================= */

/*
  HTML: <figure class="video-slot" data-video-slot data-src="">.
  - CAMBIAR AQUÍ LA ANIMACIÓN: escribe la ruta en data-src del HTML.
      Video:  data-src="Video/animacion-tabcuart.mp4"  (o .webm)
      GIF / WebP / imagen:  data-src="Video/animacion-tabcuart.gif"
  - No hay botones de carga: la animación se cambia solo desde el código.
  - Si data-src está vacío o el archivo no existe, se ve la composición editorial.
*/

function initVideoSlots() {

  document.querySelectorAll('[data-video-slot]').forEach(slot => {

    const video = slot.querySelector('video');
    const picture = slot.querySelector('img.video-slot-img');
    const src = (slot.dataset.src || '').trim();

    if (!src) return;

    const isImage = /\.(gif|webp|png|jpe?g|svg|avif)(\?.*)?$/i.test(src);

    if (isImage && picture) {

      if (video) video.hidden = true;

      picture.addEventListener('load', () => {
        picture.hidden = false;
        slot.classList.add('has-video');
      });

      picture.addEventListener('error', () => {
        picture.hidden = true;
        slot.classList.remove('has-video');
      });

      picture.src = src;
      return;
    }

    if (!video) return;

    video.addEventListener('error', () => {
      if (video.getAttribute('src')) slot.classList.remove('has-video');
    });

    video.addEventListener('loadeddata', () => {
      slot.classList.add('has-video');
    });

    video.src = src;
    video.load();

    const p = video.play();
    if (p && p.catch) p.catch(() => {});

  });

}


/* =========================================================
   23. LIBROS Y CÓMICS — CARRUSEL + VISOR DE LIBRO PDF
   (TabCuart y TabCuario)
========================================================= */

/*
  ╔═══════════════════════════════════════════════════════════╗
  ║  BIBLIOTECA DE LIBROS  —  EDITA AQUÍ                      ║
  ╚═══════════════════════════════════════════════════════════╝

  Cada libro es un bloque { ... } dentro de su lista.

    kicker → etiqueta pequeña (ej. "Libro 01", "Cómic")
    title  → título que se muestra
    desc   → descripción breve
    meta   → dato opcional (ej. "Cómic · 2026 · 48 páginas")
    cover  → CAMBIAR AQUÍ LA PORTADA  (ej. "Libros/portada-01.jpg")
    pdf    → CAMBIAR AQUÍ EL PDF      (ej. "Libros/libro-01.pdf")

  Si cover está vacío ('') se dibuja una portada editorial con el título.
  Si pdf está vacío ('') el visor muestra "Próximamente".
  Guarda tus archivos en la carpeta Libros/ junto a index.html.
*/

const BOOK_LIBRARY = {

  /* ---------- TABCUART · Libros y Cómics ---------- */
  tabcuart: [

    {
      kicker: 'Libro 01',
      title: 'Gehenna, La corte del Juicio',
      desc: 'Escribe aquí una descripción breve: de qué trata, el año y la técnica con la que lo realizaste.',
      meta: '',
      cover: '',   /* CAMBIAR AQUÍ LA PORTADA  → 'Libros/portada-01.jpg' */
      pdf:'Libros/Gehenna.pdf' 
    },

    {
      kicker: 'Libro 02',
      title: 'Segundo libro o cómic',
      desc: 'Descripción breve del segundo título.',
      meta: '',
      cover: '',   /* CAMBIAR AQUÍ LA PORTADA */
      pdf: ''      /* CAMBIAR AQUÍ EL PDF */
    },

    {
      kicker: 'Libro 03',
      title: 'Tercer libro o cómic',
      desc: 'Descripción breve del tercer título.',
      meta: '',
      cover: '',   /* CAMBIAR AQUÍ LA PORTADA */
      pdf: ''      /* CAMBIAR AQUÍ EL PDF */
    }

    /* AGREGAR AQUÍ OTRO LIBRO: copia un bloque { ... } completo,
       ponle una coma al anterior y cambia sus datos. */

  ],

  /* ---------- TABCUARIO · Libros ---------- */
  tabcuario: [

    {
      kicker: 'Libro 01',
      title: 'Mi Primer BETTA',
      desc: 'Guia de como cuidar a tu pez betta',
      meta: '',
      cover: '',   /* CAMBIAR AQUÍ LA PORTADA  → 'Libros/acuario-portada-01.jpg' */
      pdf: 'Libros/Betta.pdf'
    },

    {
      kicker: 'Libro 02',
      title: 'Segundo libro',
      desc: 'Descripción breve del segundo libro.',
      meta: '',
      cover: '',   /* CAMBIAR AQUÍ LA PORTADA */
      pdf: ''      /* CAMBIAR AQUÍ EL PDF */
    }

    /* AGREGAR AQUÍ OTRO LIBRO */

  ]

};

/*
  HTML: <div class="book-carousel" data-book-library="tabcuart"> con el carrusel de portadas
  y un <article class="book-viewer" data-book> (el visor).
  - En pantallas anchas el libro se ve abierto (doble página); en móvil, una página.
  - Controles: botones, flechas del teclado y deslizar con el dedo.
  - pdf.js se descarga solo cuando se abre un PDF, así que no afecta al resto de la página.
*/

/* =========================================================
   PDF.JS · VISOR DE LIBROS Y CÓMICS
========================================================= */

const PDFJS_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';

const PDFJS_WORKER =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfJsPromise = null;


/* =========================================================
   CARGAR PDF.JS
========================================================= */

function loadPdfJs() {

  if (window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }

  if (!pdfJsPromise) {

    pdfJsPromise = new Promise((resolve, reject) => {

      const script = document.createElement('script');

      script.src = PDFJS_URL;

      script.onload = () => {

        if (
          window.pdfjsLib &&
          window.pdfjsLib.GlobalWorkerOptions
        ) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            PDFJS_WORKER;
        }

        resolve(window.pdfjsLib);
      };

      script.onerror = () => {

        pdfJsPromise = null;

        reject(
          new Error('No se pudo cargar pdf.js')
        );
      };

      document.head.appendChild(script);
    });
  }

  return pdfJsPromise;
}


/* =========================================================
   CREAR VISOR
========================================================= */

function createBookViewer(root) {

  const q = selector => root.querySelector(selector);

  const stage = q('[data-book-stage]');
  const spread = q('[data-book-spread]');
  const left = q('[data-book-left]');
  const right = q('[data-book-right]');
  const empty = q('[data-book-empty]');

  const info = q('[data-book-info]');
  const prev = q('[data-book-prev]');
  const next = q('[data-book-next]');
  const full = q('[data-book-full]');


  /* -------------------------------------------------------
     COMPROBAR ESTRUCTURA
  ------------------------------------------------------- */

  if (!stage || !spread || !left || !right) {
    return;
  }


  /* -------------------------------------------------------
     ESTADO DEL VISOR
  ------------------------------------------------------- */

  let pdf = null;

  let page = 1;

  let aspect = 0.7;

  let renderToken = 0;

  let resizeTimer = null;

  const emptyDefault = empty
    ? empty.innerHTML
    : '';


  /* =======================================================
     DOBLE PÁGINA
  ======================================================= */

  function isTwoPages() {

    return (
      !!pdf &&
      pdf.numPages > 1 &&
      stage.clientWidth >= 600
    );
  }


  /* =======================================================
     CALCULAR INICIO DEL PLIEGO
     
     1
     2–3
     4–5
     6–7
     ...
  ======================================================= */

  function getSpreadStart(number) {

    if (!isTwoPages()) {
      return number;
    }

    if (number === 1) {
      return 1;
    }

    return number % 2 === 0
      ? number
      : number - 1;
  }


  /* =======================================================
     DIBUJAR UNA PÁGINA
  ======================================================= */

  const pageCache = new Map();

  /* ---- CACHÉ DE PÁGINAS (corrige la lentitud): cada página se renderiza
         una sola vez por tamaño; después solo se copia al canvas visible ---- */
  async function getBitmap(number, width) {
    if (pageCache.owner !== pdf) { pageCache.clear(); pageCache.owner = pdf; }
    const key = number + '@' + Math.round(width);
    let src = pageCache.get(key);
    if (src) { pageCache.delete(key); pageCache.set(key, src); return src; }
    src = document.createElement('canvas');
    await paintRaw(src, number, width);
    pageCache.set(key, src);
    if (pageCache.size > 12) pageCache.delete(pageCache.keys().next().value);
    return src;
  }

  async function paint(canvas, number, width, token) {
    if (!pdf || number < 1 || number > pdf.numPages) { canvas.style.display = 'none'; return; }
    const src = await getBitmap(number, width);
    /* Si mientras se dibujaba empezó otro render (p. ej. al entrar/salir de
       pantalla completa), este resultado ya es viejo: no pisar el canvas. */
    if (token !== undefined && token !== renderToken) return;
    if (canvas.width !== src.width || canvas.height !== src.height) {
      canvas.width = src.width;
      canvas.height = src.height;
    }
    canvas.style.width = src.style.width;
    canvas.style.height = src.style.height;
    canvas.style.display = 'block';
    canvas.getContext('2d', { alpha: false }).drawImage(src, 0, 0);
  }

  /* Precarga del siguiente pliego cuando el navegador está libre */
  function prefetch(width, two) {
    const n = two ? (page === 1 ? 2 : page + 2) : page + 1;
    const idle = window.requestIdleCallback || (f => setTimeout(f, 250));
    const doc = pdf;
    idle(() => {
      [n, two ? n + 1 : 0].forEach(p => {
        if (p && doc === pdf && p <= pdf.numPages) getBitmap(p, width).catch(() => {});
      });
    });
  }

  async function paintRaw(canvas, number, width) {

    if (
      !pdf ||
      number < 1 ||
      number > pdf.numPages
    ) {
      canvas.style.display = 'none';
      return;
    }


    const pdfPage = await pdf.getPage(number);


    /* Tamaño original */

    const baseViewport =
      pdfPage.getViewport({
        scale: 1
      });


    /*
      Limitamos la resolución para evitar que
      PDFs pesados congelen el navegador.
    */

    const safeWidth = Math.min(
      Math.max(width, 120),
      900
    );


    const scale =
      safeWidth / baseViewport.width;


    const viewport =
      pdfPage.getViewport({
        scale
      });


    canvas.width = Math.ceil(viewport.width);

    canvas.height = Math.ceil(viewport.height);


    canvas.style.width =
      Math.ceil(viewport.width) + 'px';

    canvas.style.height =
      Math.ceil(viewport.height) + 'px';

    canvas.style.display = 'block';


    const context =
      canvas.getContext('2d', {
        alpha: false
      });


    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    await pdfPage.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
  }


  /* =======================================================
     RENDERIZAR VISOR
  ======================================================= */

  async function render() {

    if (
      !pdf ||
      !stage.clientWidth
    ) {
      return;
    }


    const currentToken =
      ++renderToken;


    const twoPages =
      isTwoPages();


    page =
      getSpreadStart(page);


    /*
      Espacio disponible
    */

    const availableWidth =
      Math.max(
        240,
        stage.clientWidth - 32
      );


    const inFullscreen =
      document.fullscreenElement === root;

    const availableHeight =
      inFullscreen
        ? Math.max(280, window.innerHeight - 130)
        : Math.max(
            280,
            Math.min(
              window.innerHeight * 0.8,
              820
            )
          );


    /*
      Ancho de cada página.
      
      En escritorio:
      mitad del espacio disponible.
    */

    let pageWidth;

    if (twoPages) {

      pageWidth =
        Math.min(
          availableWidth / 2,
          availableHeight * aspect
        );

    } else {

      pageWidth =
        Math.min(
          availableWidth,
          availableHeight * aspect
        );
    }


    pageWidth =
      Math.max(
        120,
        Math.min(
          pageWidth,
          900
        )
      );


    /* =====================================================
       DOBLE PÁGINA
    ===================================================== */

    if (twoPages) {

      /*
        PORTADA
        Página 1 sola
      */

      if (page === 1) {

        left.style.display = 'none';

        await paint(
          right,
          1,
          pageWidth,
          currentToken
        );

      }

      /*
        RESTO DEL LIBRO
        2–3
        4–5
        6–7
      */

      else {

        await Promise.all([
          paint(left, page, pageWidth, currentToken),
          paint(right, page + 1, pageWidth, currentToken)
        ]);
      }

    }


    /* =====================================================
       UNA SOLA PÁGINA
    ===================================================== */

    else {

      right.style.display = 'none';

      await paint(
        left,
        page,
        pageWidth,
        currentToken
      );
    }


    /*
      Si mientras renderizábamos comenzó
      otro render, ignoramos este.
    */

    if (
      currentToken !== renderToken
    ) {
      return;
    }


    /* =====================================================
       INFORMACIÓN DE PÁGINA
    ===================================================== */

    const lastPage =
      twoPages &&
      page > 1 &&
      page + 1 <= pdf.numPages
        ? page + 1
        : page;


    if (info) {

      info.textContent =
        lastPage !== page
          ? `${page}–${lastPage} / ${pdf.numPages}`
          : `${page} / ${pdf.numPages}`;
    }


    /* =====================================================
       BOTONES
    ===================================================== */

    if (prev) {
      prev.disabled =
        page <= 1;
    }


    if (next) {
      next.disabled =
        lastPage >= pdf.numPages;
    }


    /*
      Quitar animación cuando terminó
    */

    spread.classList.remove(
      'turning',
      'dir-next',
      'dir-prev'
    );

    prefetch(pageWidth, twoPages);
  }


  /* =======================================================
     CAMBIAR DE PÁGINA
  ======================================================= */

  function go(direction) {

    if (!pdf) {
      return;
    }


    const twoPages =
      isTwoPages();


    let target;


    if (twoPages) {

      if (direction > 0) {

        target =
          page === 1
            ? 2
            : page + 2;

      } else {

        target =
          page <= 2
            ? 1
            : page - 2;
      }

    } else {

      target =
        page + direction;
    }


    /*
      Evitar páginas inválidas
    */

    if (
      target < 1 ||
      target > pdf.numPages ||
      target === page
    ) {
      return;
    }


    /*
      Animación
    */

    spread.classList.remove(
      'turning',
      'dir-next',
      'dir-prev'
    );


    spread.classList.add(
      'turning',
      direction > 0
        ? 'dir-next'
        : 'dir-prev'
    );


    setTimeout(() => {

      page = target;

      render();

    }, 90);
  }


  /* =======================================================
     MOSTRAR MENSAJE
  ======================================================= */

  function showMessage(html) {

    renderToken++;

    pdf = null;

    page = 1;


    root.classList.remove(
      'is-loaded'
    );


    left.style.display = 'none';

    right.style.display = 'none';


    if (empty) {
      empty.innerHTML = html;
    }


    if (info) {
      info.textContent = '— / —';
    }


    if (prev) {
      prev.disabled = true;
    }


    if (next) {
      next.disabled = true;
    }
  }


  /* =======================================================
     ABRIR PDF
  ======================================================= */

  async function openDoc(src) {

    if (!src) {

      showMessage(
        '<strong>Próximamente</strong>' +
        '<span>Este libro estará disponible muy pronto.</span>'
      );

      return;
    }


    /*
      Invalidar render anterior
    */

    renderToken++;


    root.classList.remove(
      'is-loaded'
    );


    if (empty) {

      empty.innerHTML =
        '<strong>Abriendo libro…</strong>';
    }


    try {

      /* Cargar PDF.js */

      const lib =
        await loadPdfJs();


      /*
        Cargar documento
      */

      const loadingTask =
        lib.getDocument({
          url: src
        });


      pdf =
        await loadingTask.promise;


      /*
        Obtener primera página
        para calcular proporción
      */

      const firstPage =
        await pdf.getPage(1);


      const viewport =
        firstPage.getViewport({
          scale: 1
        });


      aspect =
        viewport.width /
        viewport.height;


      page = 1;


      root.classList.add(
        'is-loaded'
      );


      /*
        Render inicial
      */

      await render();

    }

    catch (error) {

      console.error(
        'Error al abrir el PDF:',
        error
      );


      showMessage(
        '<strong>No se pudo abrir el libro</strong>' +
        '<span>Revisa que el archivo PDF exista y que la ruta sea correcta.</span>'
      );
    }
  }


  /* =======================================================
     API PÚBLICA
  ======================================================= */

  root.bookApi = {
    open: openDoc,
    message: showMessage
  };


  /* =======================================================
     BOTONES
  ======================================================= */

  if (prev) {

    prev.addEventListener(
      'click',
      () => go(-1)
    );
  }


  if (next) {

    next.addEventListener(
      'click',
      () => go(1)
    );
  }


  /* =======================================================
     PANTALLA COMPLETA
  ======================================================= */

  if (full) {

    full.addEventListener(
      'click',
      () => {

        if (document.fullscreenElement) {

          document.exitFullscreen();

        } else if (
          root.requestFullscreen
        ) {

          root.requestFullscreen();
        }
      }
    );
  }


  /* =======================================================
     TECLADO
  ======================================================= */

  stage.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'ArrowRight' ||
        e.key === 'PageDown'
      ) {

        e.preventDefault();

        go(1);
      }


      if (
        e.key === 'ArrowLeft' ||
        e.key === 'PageUp'
      ) {

        e.preventDefault();

        go(-1);
      }
    }
  );


  /* =======================================================
     DESLIZAR EN CELULAR
  ======================================================= */

  let touchStartX = null;

  let touchStartY = null;


  stage.addEventListener(
    'touchstart',
    e => {

      if (!e.touches.length) {
        return;
      }


      touchStartX =
        e.touches[0].clientX;

      touchStartY =
        e.touches[0].clientY;
    },
    {
      passive: true
    }
  );


  stage.addEventListener(
    'touchend',
    e => {

      if (
        touchStartX === null ||
        !e.changedTouches.length
      ) {
        return;
      }


      const touchEndX =
        e.changedTouches[0].clientX;


      const touchEndY =
        e.changedTouches[0].clientY;


      const dx =
        touchEndX - touchStartX;


      const dy =
        touchEndY - touchStartY;


      touchStartX = null;

      touchStartY = null;


      /*
        Si fue principalmente vertical,
        no cambiamos de página.
      */

      if (
        Math.abs(dy) >
        Math.abs(dx)
      ) {
        return;
      }


      /*
        Movimiento mínimo
      */

      if (
        Math.abs(dx) < 50
      ) {
        return;
      }


      if (dx < 0) {

        go(1);

      } else {

        go(-1);
      }
    },
    {
      passive: true
    }
  );


  /* =======================================================
     ARRASTRAR CON MOUSE
  ======================================================= */

  let mouseDown = false;

  let mouseStartX = 0;

  let mouseStartY = 0;


  stage.addEventListener(
    'mousedown',
    e => {

      if (e.button !== 0) {
        return;
      }


      mouseDown = true;

      mouseStartX =
        e.clientX;

      mouseStartY =
        e.clientY;


      stage.classList.add(
        'is-dragging'
      );
    }
  );


  stage.addEventListener(
    'mouseup',
    e => {

      if (!mouseDown) {
        return;
      }


      mouseDown = false;


      stage.classList.remove(
        'is-dragging'
      );


      const dx =
        e.clientX - mouseStartX;


      const dy =
        e.clientY - mouseStartY;


      /*
        Ignorar movimiento vertical
      */

      if (
        Math.abs(dy) >
        Math.abs(dx)
      ) {
        return;
      }


      /*
        Movimiento mínimo
      */

      if (
        Math.abs(dx) < 50
      ) {
        return;
      }


      if (dx < 0) {

        go(1);

      } else {

        go(-1);
      }
    }
  );


  stage.addEventListener(
    'mouseleave',
    () => {

      mouseDown = false;

      stage.classList.remove(
        'is-dragging'
      );
    }
  );


  /* =======================================================
     REDIBUJAR AL CAMBIAR TAMAÑO
  ======================================================= */

  if (window.ResizeObserver) {

    new ResizeObserver(
      () => {

        clearTimeout(
          resizeTimer
        );


        resizeTimer =
          setTimeout(
            () => {

              if (pdf) {
                render();
              }

            },
            150
          );
      }
    ).observe(stage);
  }


  /* =======================================================
     VISOR SUELTO
  ======================================================= */

  if (
    root.dataset.pdf &&
    !root.closest('[data-book-library]')
  ) {

    openDoc(
      root.dataset.pdf
    );

  } else if (empty) {

    empty.innerHTML =
      emptyDefault;
  }
}


/* =========================================================
   INICIALIZAR TODOS LOS VISORES
========================================================= */

function initBookViewers() {

  document
    .querySelectorAll('[data-book]')
    .forEach(createBookViewer);
}


/* =========================================================
   CARRUSEL DE LIBROS
========================================================= */

function createBookCarousel(root) {

  const key =
    root.dataset.bookLibrary;


  const books =
    BOOK_LIBRARY[key] || [];


  const track =
    root.querySelector(
      '[data-shelf-track]'
    );


  const prevBtn =
    root.querySelector(
      '[data-shelf-prev]'
    );


  const nextBtn =
    root.querySelector(
      '[data-shelf-next]'
    );


  const viewer =
    root.querySelector(
      '[data-book]'
    );


  if (
    !track ||
    !viewer ||
    !books.length
  ) {

    if (
      root.querySelector('.book-shelf') &&
      !books.length
    ) {

      root.querySelector(
        '.book-shelf'
      ).style.display = 'none';
    }

    return;
  }


  /* =======================================================
     INFORMACIÓN DEL LIBRO
  ======================================================= */

  const kickerEl =
    viewer.querySelector(
      '[data-book-kicker]'
    );


  const titleEl =
    viewer.querySelector(
      '[data-book-title]'
    );


  const descEl =
    viewer.querySelector(
      '[data-book-desc]'
    );


  const metaEl =
    viewer.querySelector(
      '[data-book-meta]'
    );


  let current = -1;

  let started = false;


  /* =======================================================
     ESCAPAR HTML
  ======================================================= */

  const esc = text => {

    return String(
      text == null
        ? ''
        : text
    )
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      );
  };


  /* =======================================================
     CREAR PORTADAS
  ======================================================= */

  track.innerHTML =
    books.map(
      (book, index) => {

        const number =
          String(index + 1)
            .padStart(2, '0');


        const art =
          book.cover
            ? (
              '<img src="' +
              esc(book.cover) +
              '" alt="Portada de ' +
              esc(book.title) +
              '" loading="lazy">'
            )
            : '';


        return (

          '<button type="button" ' +

          'class="book-card' +
          (book.cover
            ? ''
            : ' is-nocover') +
          '" ' +

          'role="tab" ' +

          'aria-selected="false" ' +

          'data-book-index="' +
          index +
          '" ' +

          'aria-label="Abrir: ' +
          esc(book.title) +
          '">' +

            '<span class="book-card-cover">' +

              art +

              '<span class="book-card-fallback" aria-hidden="true">' +

                '<b>' +
                number +
                '</b>' +

                '<i>' +
                esc(book.title) +
                '</i>' +

              '</span>' +

            '</span>' +

            '<span class="book-card-kicker">' +
              esc(
                book.kicker ||
                ('Libro ' + number)
              ) +
            '</span>' +

            '<span class="book-card-title">' +
              esc(book.title) +
            '</span>' +

          '</button>'
        );
      }
    ).join('');


  /* =======================================================
     ERROR DE PORTADA
  ======================================================= */

  track
    .querySelectorAll(
      '.book-card-cover img'
    )
    .forEach(img => {

      img.addEventListener(
        'error',
        () => {

          const card =
            img.closest(
              '.book-card'
            );


          img.remove();


          if (card) {
            card.classList.add(
              'is-nocover'
            );
          }
        }
      );
    });


  const cards =
    Array.from(
      track.querySelectorAll(
        '.book-card'
      )
    );


  /* =======================================================
     FLECHAS DEL CARRUSEL
  ======================================================= */

  function updateArrows() {

    const max =
      track.scrollWidth -
      track.clientWidth -
      2;


    if (prevBtn) {

      prevBtn.disabled =
        track.scrollLeft <= 2;
    }


    if (nextBtn) {

      nextBtn.disabled =
        track.scrollLeft >= max;
    }


    root.classList.toggle(
      'shelf-static',
      max <= 0
    );
  }


  /* =======================================================
     SELECCIONAR LIBRO
  ======================================================= */

  function select(index, openNow) {

    if (
      index < 0 ||
      index >= books.length
    ) {
      return;
    }


    const book =
      books[index];


    current = index;


    /* Estado visual */

    cards.forEach(
      (card, number) => {

        card.classList.toggle(
          'is-active',
          number === index
        );


        card.setAttribute(
          'aria-selected',
          number === index
            ? 'true'
            : 'false'
        );
      }
    );


    /* Información */

    if (kickerEl) {

      kickerEl.textContent =
        book.kicker ||
        (
          'Libro ' +
          String(index + 1)
            .padStart(2, '0')
        );
    }


    if (titleEl) {

      titleEl.textContent =
        book.title || '';
    }


    if (descEl) {

      descEl.textContent =
        book.desc || '';
    }


    if (metaEl) {

      metaEl.textContent =
        book.meta || '';


      metaEl.style.display =
        book.meta
          ? ''
          : 'none';
    }


    /* API del visor */

    const api =
      viewer.bookApi;


    if (!api) {
      return;
    }


    if (openNow) {

      started = true;

      api.open(
        book.pdf
      );

    } else {

      api.message(
        '<strong>' +
        esc(book.title) +
        '</strong>' +

        '<span>Toca la portada para abrir el libro.</span>'
      );
    }
  }


  /* =======================================================
     CLICK EN PORTADAS
  ======================================================= */

  cards.forEach(
    (card, index) => {

      card.addEventListener(
        'click',
        () => {

          select(
            index,
            true
          );


          card.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }
      );
    }
  );


  /* =======================================================
     FLECHAS DEL CARRUSEL
  ======================================================= */

  const step =
    () =>
      Math.max(
        160,
        track.clientWidth * 0.8
      );


  if (prevBtn) {

    prevBtn.addEventListener(
      'click',
      () => {

        track.scrollBy({
          left: -step(),
          behavior: 'smooth'
        });
      }
    );
  }


  if (nextBtn) {

    nextBtn.addEventListener(
      'click',
      () => {

        track.scrollBy({
          left: step(),
          behavior: 'smooth'
        });
      }
    );
  }


  /* =======================================================
     SCROLL DEL CARRUSEL
  ======================================================= */

  track.addEventListener(
    'scroll',
    () => {

      requestAnimationFrame(
        updateArrows
      );
    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'resize',
    updateArrows
  );


  if (window.ResizeObserver) {

    new ResizeObserver(
      updateArrows
    ).observe(track);
  }


  /* =======================================================
     PRIMER LIBRO
  ======================================================= */

  select(
    0,
    false
  );


  updateArrows();


  /* =======================================================
     ABRIR EL PDF AL ACTIVAR LA CAPA
  ======================================================= */

  const layer =
    root.closest('.layer');


  const openFirst = () => {

    if (
      !started &&
      current === 0
    ) {

      select(
        0,
        true
      );
    }


    updateArrows();
  };


  if (
    !layer ||
    layer.classList.contains('active')
  ) {

    openFirst();

  } else if (
    window.MutationObserver
  ) {

    const observer =
      new MutationObserver(
        () => {

          if (
            layer.classList.contains(
              'active'
            )
          ) {

            observer.disconnect();


            setTimeout(
              openFirst,
              650
            );
          }
        }
      );


    observer.observe(
      layer,
      {
        attributes: true,
        attributeFilter: [
          'class'
        ]
      }
    );
  }
}


/* =========================================================
   INICIALIZAR LIBRERÍAS
========================================================= */

function initBookLibraries() {

  document
    .querySelectorAll(
      '[data-book-library]'
    )
    .forEach(
      createBookCarousel
    );
}

/* =========================================================
   24. CONTACTO — COPIAR CORREO
========================================================= */
function copyContactEmail(btn) {
  const link = document.getElementById('contactEmail');
  if (!link || !btn) return;
  const email = link.dataset.email || link.textContent.trim();
  const done = () => {
    const original = btn.textContent;
    btn.textContent = 'Copiado ✓';
    setTimeout(() => { btn.textContent = original; }, 2000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).then(done).catch(() => {});
  } else {
    const t = document.createElement('textarea');
    t.value = email;
    document.body.appendChild(t);
    t.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(t);
  }
}


/* =========================================================
   25. INICIAR COMPONENTES NUEVOS
========================================================= */
initVideoSlots();
initBookViewers();
initBookLibraries();
layoutAnatomy();

/* =========================================================
   VIDEOS DE ANIMACIÓN — REPRODUCCIÓN AL PASAR EL CURSOR
========================================================= */

document.querySelectorAll('.gallery-item video').forEach(video => {

  const item = video.closest('.gallery-item');

  item.addEventListener('mouseenter', () => {
    video.play().catch(() => {});
  });

  item.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });

});

/* =========================================================
   FASE 2 · 1/3 — EL OBSERVADOR
   Sin librerías. Un único bucle rAF que SOLO corre mientras hay
   movimiento pendiente. Solo transform/opacity.
   API: Obs.say(txt,{look,expr,ms,force}) · Obs.look(el) · Obs.expr(nombre,ms)
        Obs.hint(tipo,el) · Obs.watch(el,txt) · Obs.act(nombre)
========================================================= */
(function () {
  'use strict';
  var coarse = matchMedia('(hover:none), (pointer:coarse)').matches;
  var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };

  /* ---- TEXTOS Y CARÁCTER POR ZONA (EDITA AQUÍ) ----
     expr = expresión base · follow = cuánto sigue al cursor · tail = segundos del vaivén de la cola */
  var ZONES = {
    home:      { mood: 'home', expr: 'idle',    follow: .8,  tail: 5,   idle: 1 },
    TabCuart:  { mood: 'art',  expr: 'curious', follow: 1,   tail: 4,   idle: 1,
                 hover: 'Aquí vive la mayor parte de mi trabajo visual.', enter: 'Observa con calma.', tip: 'Elige una técnica, gira la rueda o abre una obra.' },
    proyectos: { mood: 'dark', expr: 'sly',     follow: .9,  tail: 2.6, idle: .7,
                 hover: 'Aquí comienza Gehenna: La Corte del Juicio.', enter: 'Cuidado: la Corte también mira.', tip: 'Recorre los pecados: cada uno cambia el mundo de Gehenna.' },
    estudios:  { mood: 'lab',  expr: 'curious', follow: 1.1, tail: 4.5, idle: 1,
                 hover: 'Un espacio dedicado al aprendizaje y experimentación.', enter: 'Aquí se prueba, se falla y se aprende.', tip: 'Aquí se investiga. Mira con calma.' },
    contacto:  { mood: 'aqua', expr: 'calm',    follow: .5,  tail: 8,   idle: 1.7,
                 hover: 'Un ecosistema dedicado al mundo acuático.', enter: 'Silencio… algo se mueve bajo el agua.', tip: 'Cambia de pestaña y explora despacio.' },
    sobre:     { mood: 'me',   expr: 'happy',   follow: .9,  tail: 3.5, idle: 1,
                 hover: 'Aquí puedes conocer quién está detrás de todo esto.', enter: 'Me gusta que alguien se detenga aquí.', tip: 'Aquí te cuento quién soy.' }
  };
  /* Frases por filtro: la primera describe, las siguientes son más personales (rotan) */
  var FILTERS = {
    all:        ['Una obra de cada técnica, para empezar.'],
    digital:    ['Trabajo realizado principalmente mediante herramientas digitales.', 'Aquí es donde las ideas empiezan a tomar forma.'],
    tradicional:['El gesto y la textura del material quedan en el resultado.'],
    lino:       ['Aquí el error también puede convertirse en parte de la obra.', 'Una técnica donde el error también es resultado.'],
    escultura:  ['Forma y volumen, trabajados con las manos.'],
    animacion:  ['Una imagen empieza a moverse cuando le das tiempo.', 'Aquí las imágenes empiezan a moverse.'],
    '3d':       ['Aquí las ideas dejan de tener una sola cara.', 'Luz y volumen construidos en Blender.'],
    tattoo:     ['Diseño pensado para vivir en la piel.']
  };
  /* Pistas según TIPO de interacción */
  var TYPES = {
    click:  ['Haz clic para descubrir.', 'Haz clic.', 'Psst… puedes interactuar con esto.', 'Aquí hay algo…'],
    drag:   ['Arrástralo.', 'Puedes mover esto.', 'Desliza para descubrirlo.'],
    scroll: ['Desliza para continuar.'],
    card:   ['¿Qué habrá detrás?', 'Toca para descubrir.', '¿Ves esto? Pruébalo.'],
    image:  ['Puedes observarla más de cerca.', 'Ábrela. Merece verse de cerca.'],
    work:   ['Hay algo más aquí.', 'Puedes explorar aquí.', 'No te quedes mirando…'],
    secret: ['Creo que encontraste algo…', 'Esto no está aquí por casualidad.']
  };
  /* [selector, tipo] — el primero que coincida gana. Gehenna gestiona sus propias pistas. */
  var MAP = [
    ['[data-obs="secret"]', 'secret'],
    ['.playing-card, .book-card, .sin-card, .ab-card', 'card'],
    ['.gallery-item', 'work'],
    ['.works-wheel', 'drag'],
    ['.pv-viewport', 'drag'],
    ['.about-photo, .click-img', 'image'],
    ['.aqua-tab, .tool-ico', 'click']
  ];

  /* ---- DOM ---- */
  /* PERSONAJE: tu ilustración optimizada (recortada, 640 px, fondo transparente). Si el archivo no está en esa ruta, vuelve al ojo dibujado. */
  var CHAR = 'Img/observador.webp';
  var root = document.createElement('div');
  root.id = 'obs'; root.className = 'has-char'; root.dataset.zone = 'home'; root.dataset.mood = 'home'; root.dataset.expr = 'idle'; root.dataset.state = 'idle'; root.dataset.side = 'l';
  root.innerHTML =
    '<div class="obs-pos"><div class="obs-say" id="obsSay" role="status" aria-live="polite"><span class="obs-say-t"></span><div class="obs-choices" role="group" aria-label="Respuestas"></div></div>' +
    '<div class="obs-lean"><div class="obs-breathe">' +
    '<div class="obs-char" aria-hidden="true">' +
      '<img class="obs-body" src="' + CHAR + '" alt="" decoding="async" draggable="false">' +
      '<img class="obs-tent" src="' + CHAR + '" alt="" decoding="async" draggable="false">' +
      '<i class="obs-pp obs-pp--l"><b></b></i><i class="obs-pp obs-pp--r"><b></b></i>' +
      '<i class="obs-hit"></i><i class="obs-grab" tabindex="0" role="button" aria-pressed="false" aria-label="El Observador: haz clic para seleccionarlo y arrástralo"></i></div>' +
    '<svg class="obs-svg" viewBox="0 0 200 150" role="img" aria-label="El Observador" focusable="false">' +
      '<defs><radialGradient id="obsG" cx="50%" cy="45%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".4"/>' +
      '<stop offset=".42" style="stop-color:var(--iris)"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>' +
      '<clipPath id="obsClip"><path d="M30 70 Q110 -6 190 70 Q110 146 30 70Z"/></clipPath></defs>' +
      '<g class="obs-tail"><path d="M64 104 C38 112 40 136 18 132"/><g class="obs-tip"><path d="M18 132 C8 130 6 118 16 116"/></g></g>' +
      '<path class="obs-brow" d="M48 26 Q110 -10 172 26"/>' +
      '<g class="obs-eye">' +
        '<path class="obs-sclera" d="M30 70 Q110 -6 190 70 Q110 146 30 70Z"/>' +
        '<path class="obs-vein" d="M44 70 q12 -5 22 -2 M176 72 q-14 -6 -24 -1 M62 92 q10 5 20 3 M150 50 q-8 -3 -16 0"/>' +
        '<g clip-path="url(#obsClip)"><g class="obs-iris-g">' +
          '<circle class="obs-iris" cx="110" cy="70" r="28" fill="url(#obsG)"/><circle class="obs-ring" cx="110" cy="70" r="28"/>' +
          '<ellipse class="obs-pupil" cx="110" cy="70" rx="9" ry="19"/>' +
          '<circle class="obs-glint" cx="119" cy="58" r="4.2"/><circle class="obs-glint" cx="101" cy="82" r="2"/>' +
        '</g></g>' +
        '<path class="obs-lid" d="M30 70 Q110 -6 190 70"/>' +
        '<path class="obs-lash" d="M58 44 l-6 -9 M80 33 l-3 -10 M110 29 l0 -10 M140 33 l3 -10 M162 44 l6 -9"/>' +
      '</g></svg></div></div></div>';
  root.querySelector('.obs-body').addEventListener('error', function () { root.classList.remove('has-char'); var c = root.querySelector('.obs-char'); if (c) c.remove(); pp = []; });
  document.body.appendChild(root);

  var say = root.querySelector('#obsSay'), sayT = root.querySelector('.obs-say-t'), pos = root.querySelector('.obs-pos'), grabEl = root.querySelector('.obs-grab'), lean = root.querySelector('.obs-lean'), iris = root.querySelector('.obs-iris-g'), pp = [].slice.call(root.querySelectorAll('.obs-pp')), choicesEl = root.querySelector('.obs-choices');
  var zone = 'home', base = 'idle', F = .8, PULL = .3, sv = 0, hasChar = true;
  var PULLS = { home: .3, TabCuart: .42, proyectos: .25, estudios: .35, contacto: .15, sobre: .38 };   /* cuánto se aleja de su rincón para acompañar al cursor */
  var MSG = { home: 'Explora mi trabajo', TabCuart: 'Explora el proceso.', proyectos: 'Aquí comienza Gehenna.', estudios: 'Descubre mi formación.', contacto: 'Un ecosistema dedicado al mundo acuático.', sobre: '¿Quieres conocerme?' };
  var rect = { left: 0, top: 0, width: 0, height: 0 }, mx = innerWidth * .6, my = innerHeight * .5, wander = null, roam = null, tgtEl = null, last = 0;
  var g = { x: 0, y: 0, bx: 0, by: 0, r: 0, s: 1 }, queued = false;
  /* Estados: libre → hover → seleccionado → arrastrando → (suelto) */
  var sel = false, dragging = false, drop = null, dropT = 0, grab = { dx: 0, dy: 0 }, vel = { x: 0, y: 0, px: 0, py: 0, t: 0 }, lastP = { x: 0, y: 0 }, selT = 0;

  function measure() { rect = root.getBoundingClientRect(); hasChar = root.classList.contains('has-char'); }

  /* ---- Un solo bucle rAF, solo corre mientras algo se mueve. Suavizado por tiempo (no por frame). ---- */
  function frame(now) {
    queued = false;
    if (!rect.width) measure();
    var dt = Math.min(.05, ((now || 0) - last) / 1000) || .016; last = now || 0;
    var kg = reduceMotion ? 1 : 1 - Math.exp(-dt * 24), kp = reduceMotion ? 1 : 1 - Math.exp(-dt * 6.5);
    var X = mx, Y = my, pull = conv ? 0 : PULL;                  /* en conversación no persigue el cursor: los botones del globo no se escapan */
    if (wander) { X = wander.x; Y = wander.y; }
    if (tgtEl) { var t = tgtEl.getBoundingClientRect(); X = t.left + t.width / 2; Y = t.top + t.height / 2; pull = Math.max(pull, .5); }
    var hx = rect.left + rect.width / 2, hy = rect.top + rect.height / 2, px, py;
    var minX = rect.width * .5, maxX = innerWidth - rect.width * .5, minY = rect.height * .5, maxY = innerHeight - rect.height * .42;
    if (dragging) {                                   /* sigue directamente al cursor (un poco de inercia) */
      px = mx - grab.dx; py = my - grab.dy; kp = reduceMotion ? 1 : 1 - Math.exp(-dt * 16);
      vel.x *= Math.exp(-dt * 7); vel.y *= Math.exp(-dt * 7);
    } else if (drop && (sel || now < dropT)) { px = drop.x; py = drop.y; }
    else {
      drop = null;
      if (roam) { px = roam.x; py = roam.y; }
      else { px = hx + (X - hx) * pull; py = hy + (Y - hy) * pull; }
    }
    px = clamp(px, minX, maxX); py = clamp(py, minY, maxY); lastP.x = px; lastP.y = py;
    var tx = px - hx, ty = py - hy + (dragging || sel ? 0 : sv);
    /* mirada */
    var ex = hx + g.bx, ey = rect.top + rect.height * (hasChar ? .2 : .47) + g.by;
    var dx = X - ex, dy = Y - ey, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 240) * F;
    var gx = dragging ? clamp(vel.x * .012, -26, 26) : dx / d * 26 * k, gy = dragging ? clamp(vel.y * .01, -10, 10) : dy / d * 10 * k;
    g.x += (gx - g.x) * kg; g.y += (gy - g.y) * kg;
    /* cuerpo: se desplaza, se inclina hacia donde va, cambia de escala */
    var vx = tx - g.bx;
    g.bx += vx * kp; g.by += (ty - g.by) * kp;
    var tr = dragging ? clamp(vel.x * .012 + vx * .03, -18, 18) : clamp(vx * .05 + dx * .004, -12, 12) * F + sv * .15;
    g.r += (tr - g.r) * Math.min(1, kp * 1.4);
    /* ESCALA DEL PERSONAJE: reducción exclusiva en TabCuart */
var zoneScale = zone === 'TabCuart' ? 0.70 : 1;

var ts = zoneScale * (
    dragging ? 1.1 - Math.min(.05, Math.hypot(vel.x, vel.y) * .00002)
    : sel ? 1.08
    : (hov ? 1.06 : (!tgtEl && !coarse && d < 260 ? 1.04 : 1))
);
    g.s += (ts - g.s) * kp;
    iris.style.transform = 'translate(' + g.x.toFixed(1) + 'px,' + g.y.toFixed(1) + 'px)';
    if (pp.length) {
      var rx = rect.width * .024, ry = rect.width * .04, qx = (g.x / 26) * rx, qy = (g.y / 10) * ry, qm = Math.hypot(qx / rx, qy / ry);
      if (qm > 1) { qx /= qm; qy /= qm; }                                   /* recorrido elíptico: en diagonal la pupila ya no se sale de la cuenca */
      for (var i = 0; i < pp.length; i++) pp[i].style.transform = 'translate(' + qx.toFixed(1) + 'px,' + qy.toFixed(1) + 'px)';
    }
    pos.style.transform = 'translate3d(' + g.bx.toFixed(1) + 'px,' + g.by.toFixed(1) + 'px,0)';
    lean.style.transform = 'rotate(' + g.r.toFixed(2) + 'deg) scale(' + g.s.toFixed(3) + ')';
    /* Globo: a un costado de la silueta, nunca sobre la cara (ver placeBubble) */
    if (root.classList.contains('is-talking') || BUB.dirty) placeBubble();
    if (dragging || Math.abs(gx - g.x) > .03 || Math.abs(gy - g.y) > .03 || Math.abs(tx - g.bx) > .25 || Math.abs(ty - g.by) > .25 || Math.abs(tr - g.r) > .05 || Math.abs(ts - g.s) > .001) schedule();
  }
  /* ---- GLOBO: siempre a un costado, NUNCA encima de la cara ----
     Se calcula la "zona segura" del personaje (su silueta completa + lo que se corre la cabeza al inclinarse/escalar)
     y el globo se coloca FUERA de ella, a la altura de la cabeza, con la cola apuntando a la cabeza.
     Lado: el que tenga más espacio (izquierda/derecha). Solo si a los lados no cabe, arriba o debajo.
     Con histéresis: no salta de lado por unos pocos píxeles. Sigue al personaje porque vive dentro de .obs-pos. */
  var BUB = { side: 'l', w: 0, h: 0, mw: 0, T: -1, dirty: true };
  var GAPB = 16, EDGEB = 10, MINW = 150, MAXW = 260, SAFE = .06;
  function setBubbleText(t) { sayT.textContent = t; BUB.dirty = true; }
  function placeBubble() {
    var rr = rect || (measure(), rect), W = rr.width, H = rr.height; if (!W || !H) return;
    var s = g.s, rad = g.r * Math.PI / 180, HF = hasChar ? .8 : .53;           /* HF: altura de la cabeza medida desde la base */
    var left = rr.left + g.bx, top = rr.top + g.by;                             /* caja del personaje en pantalla (origen de .obs-pos) */
    var pcx = left + W / 2, pby = top + H;                                      /* pivote: centro de la base */
    var hw = W * (.5 - SAFE) * s, shift = Math.sin(rad) * H * HF * s;           /* shift: cuánto se desplaza la cabeza al inclinarse */
    var zl = pcx - hw + Math.min(0, shift), zr = pcx + hw + Math.max(0, shift), zt = pby - H * s, zb = pby;
    var hx = pcx + shift, hy = pby - H * HF * s * Math.cos(rad);                /* centro aproximado de la cabeza */
    var room = { l: zl - EDGEB - GAPB, r: innerWidth - zr - EDGEB - GAPB, t: zt - EDGEB - GAPB, b: innerHeight - zb - EDGEB - GAPB };

    if (BUB.dirty) {                                                            /* texto nuevo: medir su tamaño natural */
      BUB.mw = Math.min(MAXW, innerWidth - 2 * EDGEB); say.style.maxWidth = BUB.mw + 'px';
      BUB.w = say.offsetWidth; BUB.h = say.offsetHeight; BUB.dirty = false;
    }
    var minw = conv ? 200 : MINW;                                               /* con respuestas el globo necesita más ancho para no apretarse */
    var cur = BUB.side, lat = room.l >= room.r ? 'l' : 'r', side;
    if (cur === 'l' || cur === 'r') side = (room[cur] >= minw && room[lat] - room[cur] < 90) ? cur : (room[lat] >= minw ? lat : null);
    else side = room[lat] >= minw ? lat : null;                                 /* si estaba arriba/abajo, vuelve a un lado en cuanto cabe */
    if (!side) {                                                                /* sin sitio a los lados: arriba (si cabe) o debajo */
      var need = BUB.h + 6;
      side = (cur === 't' && room.t >= need) ? 't' : (cur === 'b' && room.b >= need) ? 'b' : (room.t >= need && room.t >= room.b) ? 't' : room.b >= need ? 'b' : lat;
    }
    var mw = (side === 'l' || side === 'r') ? clamp(Math.floor(room[side] / 20) * 20, 100, MAXW) : Math.min(MAXW, innerWidth - 2 * EDGEB);
    if (mw !== BUB.mw) { BUB.mw = mw; say.style.maxWidth = mw + 'px'; BUB.w = say.offsetWidth; BUB.h = say.offsetHeight; }

    var bx, by, T;
    if (side === 'l' || side === 'r') {
      bx = side === 'l' ? zl - GAPB - BUB.w : zr + GAPB;
      bx = clamp(bx, EDGEB, Math.max(EDGEB, innerWidth - BUB.w - EDGEB));   /* jamás fuera de pantalla */
      by = clamp(hy - BUB.h / 2, EDGEB, Math.max(EDGEB, innerHeight - BUB.h - EDGEB));
      T = clamp(hy - by, 20, Math.max(20, BUB.h - 20));                         /* la cola apunta a la altura de la cabeza */
    } else {
      bx = clamp(hx - BUB.w / 2, EDGEB, Math.max(EDGEB, innerWidth - BUB.w - EDGEB));
      by = side === 't' ? zt - GAPB - BUB.h : zb + GAPB;
      by = clamp(by, EDGEB, Math.max(EDGEB, innerHeight - BUB.h - EDGEB));  /* jamás fuera de pantalla */
      T = clamp(hx - bx, 22, Math.max(22, BUB.w - 22));
    }
    if (side !== BUB.side) {
      BUB.side = side; root.dataset.side = side;
      if (root.classList.contains('is-talking') && !reduceMotion && say.animate) { try { say.animate([{ opacity: 0, scale: '.9' }, { opacity: 1, scale: '1' }], { duration: 240, easing: 'ease-out' }); } catch (e) {} }
    }
    if (Math.abs(T - BUB.T) > .5) { BUB.T = T; say.style.setProperty('--t', T.toFixed(1) + 'px'); }
    say.style.transform = 'translate3d(' + (bx - left).toFixed(1) + 'px,' + (by - top).toFixed(1) + 'px,0)';
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(frame); } }
  function look(el) { tgtEl = el || null; schedule(); }

  if (!coarse) addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; schedule(); }, { passive: true });
  addEventListener('resize', function () { measure(); BUB.dirty = true; schedule(); });

  /* ---- Expresiones, voz y estados ---- */
  var hideT = 0, exprT = 0, lastSay = 0;
  function expr(name, ms) {
    clearTimeout(exprT); root.dataset.expr = name || base;
    if (ms) exprT = setTimeout(function () { root.dataset.expr = base; }, ms);
  }
  function speak(text, o) {
    o = o || {};
    if (conv && !o.conv) return;                                      /* durante una conversación no se pisa el globo */
    var now = Date.now();
    if (!o.force && now - lastSay < 1200) return;
    lastSay = now; clearTimeout(hideT);
    setBubbleText(text); root.classList.add('is-talking'); root.dataset.state = 'talk';
    expr(o.expr || (o.look ? 'curious' : null), o.ms || 3000);
    look(o.look || null);
    if (o.keep) return;                                               /* conversación: el globo se queda hasta que termine */
    hideT = setTimeout(function () {
      look(null);
      if (sel) { setBubbleText(MSG[zone] || ''); schedule(); return; }      /* seleccionado: el globo se queda */
      root.classList.remove('is-talking'); root.dataset.state = 'idle';
    }, o.ms || Math.min(6500, 2200 + text.length * 48));
  }
  function shush() { if (conv) return; if (sel) { look(null); return; } clearTimeout(hideT); root.classList.remove('is-talking'); root.dataset.state = 'idle'; look(null); }

  /* ---- Microcomportamientos (idle impredecible) ---- */
  function pulse(c, ms) { root.classList.add(c); setTimeout(function () { root.classList.remove(c); }, ms); }
  function blink(n) {
    root.classList.add('is-blink');
    setTimeout(function () { root.classList.remove('is-blink'); if (n > 1) setTimeout(function () { blink(n - 1); }, 110); }, 190);
  }
  function act(n) {
    if (reduceMotion) return;
    if (conv && (n === 'glance' || n === 'roam')) return;             /* hablando no se va de paseo */
    if (n === 'glance') {
      wander = { x: Math.random() * innerWidth, y: Math.random() * innerHeight * .8 }; schedule();
      setTimeout(function () { wander = null; schedule(); }, 900 + Math.random() * 900);
    }
    else if (n === 'blink') blink(Math.random() < .3 ? 2 : 1);
    else if (n === 'tilt') pulse('is-tilt', 1500);
    else if (n === 'wag') pulse('is-wag', 1500);
    else if (n === 'near') pulse('is-near', 1700);
    else if (n === 'yawn') expr('sleepy', 1300);
    else if (n === 'roam') {   /* pasea libremente por la pantalla y vuelve */
      roam = { x: rect.width * .5 + Math.random() * Math.max(1, innerWidth - rect.width), y: rect.height * .5 + Math.random() * Math.max(1, innerHeight - rect.height * .9) };
      schedule(); setTimeout(function () { roam = null; schedule(); }, 1800 + Math.random() * 1600);
    }
  }
  var idleT = 0;
  function idleLoop() {
    clearTimeout(idleT);
    idleT = setTimeout(function () {
      if (!document.hidden && root.dataset.state === 'idle') act(rnd(['blink', 'blink', 'glance', 'glance', 'roam', 'roam', 'tilt', 'wag', 'near', 'yawn']));
      idleLoop();
    }, (2400 + Math.random() * 4200) * ZONES[zone].idle);
  }
  if (!reduceMotion) idleLoop();

  /* ---- Pistas de interacción ---- */
  var lastT = {}, lastHint = 0, rot = {}, candT = 0;
  function hint(type, el, force) {
    var now = Date.now(), a = TYPES[type]; if (!a || sel || dragging) return;
    if (!force && (now - lastHint < 5000 || now - (lastT[type] || 0) < 22000)) return;
    lastHint = lastT[type] = now;
    rot[type] = rot[type] === undefined ? Math.floor(Math.random() * a.length) : (rot[type] + 1) % a.length;
    speak(a[rot[type]], { look: el, ms: 3200, expr: type === 'secret' ? 'alert' : 'curious', force: true });
  }
  function typeOf(el) {
    if (!el || !el.closest) return null;
    for (var i = 0; i < MAP.length; i++) { var m = el.closest(MAP[i][0]); if (m) return [MAP[i][1], m]; }
    return null;
  }
  document.addEventListener('pointerover', function (e) {
    if (e.pointerType === 'touch') return;
    clearTimeout(candT);
    var h = typeOf(e.target); if (h) candT = setTimeout(function () { hint(h[0], h[1]); }, 380);
  }, { passive: true });
  document.addEventListener('pointerout', function () { clearTimeout(candT); }, { passive: true });
  document.addEventListener('focusin', function (e) { var h = typeOf(e.target); if (h) hint(h[0], h[1]); });
  /* Móvil: no hay hover → un toque sobre algo interactivo dispara la pista; tocar al Observador da una guía de la sección */
  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType !== 'touch') return;
    mx = e.clientX; my = e.clientY; schedule();      /* en táctil acompaña al último toque */
    var h = typeOf(e.target); if (h) hint(h[0], h[1]);
  }, { passive: true });
  /* (el clic sobre el Observador ahora lo gestiona la selección) */

  /* ---- SELECCIÓN Y ARRASTRE: el propio personaje es el control (sin botones externos) ---- */
  var hov = false, wasSel = false, downAt = null;
  function hideNow() { if (conv) return; clearTimeout(hideT); root.classList.remove('is-talking'); root.dataset.state = 'idle'; look(null); }
  function select(on) {
    if (sel === on) return; sel = on; root.classList.toggle('is-selected', on); grabEl.setAttribute('aria-pressed', String(on)); clearTimeout(selT);
    if (on) {
      measure(); drop = { x: rect.left + rect.width / 2 + g.bx, y: rect.top + rect.height / 2 + g.by };   /* se queda donde está */
      pulse('is-pop', 480);
      if (!conv) convStart(MENU[zone] || 'menu', true);                /* en cualquier sección: menú de su categoría (ramificaciones) */
      selT = setTimeout(function () { select(false); }, 16000);
    } else { dropT = performance.now() + 5000; hideNow(); expr(null); }       /* vuelve poco a poco a acompañarte */
    schedule();
  }
  if (grabEl) {
    grabEl.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') return;
      hov = true; root.classList.add('is-hover'); schedule();
      if (!sel && !dragging) { speak('¿Quieres explorar?', { expr: 'curious', ms: 2400, force: true }); pulse('is-near', 1200); }
    });
    grabEl.addEventListener('pointerleave', function () { hov = false; root.classList.remove('is-hover'); schedule(); });
    grabEl.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault(); try { grabEl.setPointerCapture(e.pointerId); } catch (x) {}
      measure(); mx = e.clientX; my = e.clientY;
      grab.dx = mx - (rect.left + rect.width / 2 + g.bx); grab.dy = my - (rect.top + rect.height / 2 + g.by);
      wasSel = sel; downAt = { x: e.clientX, y: e.clientY }; vel.px = e.clientX; vel.py = e.clientY; vel.t = performance.now(); vel.x = vel.y = 0;
      if (!sel) select(true);
    });
    grabEl.addEventListener('pointermove', function (e) {
      if (!downAt) return; mx = e.clientX; my = e.clientY;
      if (!dragging && Math.hypot(mx - downAt.x, my - downAt.y) > 4) {
        dragging = true; root.classList.add('is-dragging'); clearTimeout(selT);
        speak(rnd(['¿A dónde vamos?', 'Vamos…']), { expr: 'curious', force: true, ms: 2200 });
      }
      if (dragging) {
        var now = performance.now(), dt = Math.max(8, now - vel.t);
        vel.x += ((e.clientX - vel.px) / dt * 1000 - vel.x) * .4; vel.y += ((e.clientY - vel.py) / dt * 1000 - vel.y) * .4;
        vel.px = e.clientX; vel.py = e.clientY; vel.t = now;
        if (Math.hypot(vel.x, vel.y) > 2600 && Date.now() - lastSay > 1500) speak('¡Más despacio!', { expr: 'scared', force: true, ms: 1400 });
        schedule();
      }
    });
    var end = function () {
      if (!downAt) return; downAt = null;
      if (dragging) {
        dragging = false; root.classList.remove('is-dragging');
        var th = reduceMotion ? 0 : .12;      /* un empujón de inercia al soltar */
        drop = { x: clamp(lastP.x + vel.x * th, rect.width * .5, innerWidth - rect.width * .5), y: clamp(lastP.y + vel.y * th, rect.height * .5, innerHeight - rect.height * .42) };
        speak(rnd(['Aquí está bien.', 'Mmm… buen lugar.']), { expr: 'happy', force: true, ms: 2600 });
        selT = setTimeout(function () { select(false); }, 12000);
      } else if (wasSel) select(false);              /* un clic sobre el personaje ya seleccionado lo suelta */
      schedule();
    };
    grabEl.addEventListener('pointerup', end); grabEl.addEventListener('pointercancel', end);
    grabEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(!sel); }
      else if (sel && /^Arrow/.test(e.key)) {
        e.preventDefault(); var st = 40;
        drop.x = clamp(drop.x + (e.key === 'ArrowRight' ? st : e.key === 'ArrowLeft' ? -st : 0), rect.width * .5, innerWidth - rect.width * .5);
        drop.y = clamp(drop.y + (e.key === 'ArrowDown' ? st : e.key === 'ArrowUp' ? -st : 0), rect.height * .5, innerHeight - rect.height * .42); schedule();
      }
    });
  }
  document.addEventListener('pointerdown', function (e) { if (sel && !dragging && !e.target.closest('#obs')) select(false); }, { passive: true });
  document.addEventListener('keydown', function (e) { if (e.key !== 'Escape') return; if (conv) convEnd(); else if (sel) select(false); });

  /* ---- Reacción al scroll (las capas hacen scroll por su cuenta → captura) ---- */
  var lastTop = 0, sq = 0, sEl = null, svT = 0;
  document.addEventListener('scroll', function (e) {
    sEl = e.target;
    if (sq) return; sq = 1;
    requestAnimationFrame(function () {
      sq = 0;
      var top = (sEl === document || !sEl) ? scrollY : sEl.scrollTop, v = top - lastTop; lastTop = top;
      sv = clamp(-v * .8, -45, 45); schedule();
      clearTimeout(svT); svT = setTimeout(function () { sv = 0; schedule(); }, 160);
      if (Math.abs(v) > 90 && !reduceMotion) expr('alert', 700);
    });
  }, { capture: true, passive: true });

  /* ---- Entrar en una sección (se dice una vez) ---- */
  var io = null;
  function watch(el, text) {
    if (!el || !('IntersectionObserver' in window)) return;
    io = io || new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting || !x.target.closest('.layer.active')) return;
        io.unobserve(x.target); speak(x.target.__obs, { expr: 'curious', ms: 3600 });
      });
    }, { threshold: .45 });
    el.__obs = text; io.observe(el);
  }
  [['#techniqueProcess .process-heading', 'Así nace una pieza, paso a paso.'], ['#tabcuartBooks', 'Historias en papel. Pasa las páginas.'], ['#sobreContacto', 'Aquí puedes escribirme.']]
    .forEach(function (p) { watch(document.querySelector(p[0]), p[1]); });

  /* ---- Zonas: se engancha a openLayer/closeLayer sin modificarlas ---- */

  /* =========================================================
     CONVERSACIONES DEL OBSERVADOR — un solo sistema para todas las secciones
     ---------------------------------------------------------
     DATOS (CONV): un nodo por "pantalla" de diálogo.
        t  texto (o function(ctx) → texto)          x  expresión (curious · happy · sly · calm)
        c  respuestas [{ l, n | go | act, arg?, say? }]  (o function(ctx) → respuestas)
           n    → continúa en otro nodo              go  → navega YA a una sección (home · TabCuart · estudios · proyectos · contacto · sobre)
           act  → acción (ver ACT)                    say → frase breve tras ejecutar la acción
        exit:false → no añade "Seguir explorando" (para preguntas Sí / No: cada opción ya tiene consecuencia)
        Sin respuestas = cierre natural (el globo se retira solo). Nadie queda atrapado: todo nodo con respuestas
        incluye una salida, y Esc cierra la charla.
     SECCIÓN: INTRO[zona] se dice la primera vez que se entra · MENU[zona] al hacer clic en el personaje.
     ctx = { zone, prev }  (sección actual y anterior según el historial real).
     Para agregar diálogos: añade nodos aquí, enlázalos desde otra respuesta y, si es una sección, regístralos en INTRO / MENU.
  ========================================================= */
  var ZN = { home: 'el inicio', TabCuart: 'Portafolio', estudios: 'TabLab', proyectos: 'TabGame', contacto: 'TabCuario', sobre: 'Sobre mí' };
  var INTRO = { TabCuart: 'tc_intro', estudios: 'es_intro', proyectos: 'pr_intro', contacto: 'tq_intro', sobre: 'so_intro' };
  var MENU = { home: 'menu', TabCuart: 'tc_menu', estudios: 'es_menu', proyectos: 'pr_menu', contacto: 'tq_menu', sobre: 'so_menu' };
  var YES = 'Sí', NO = 'No';

  /* respuestas de navegación comunes: volver · inicio · otra categoría (según el historial real) */
  function navTail(ctx) {
    var r = [];
    if (ctx.prev && ctx.prev !== ctx.zone) r.push({ l: ctx.prev === 'home' ? 'Volver al inicio' : 'Volver a ' + ZN[ctx.prev], act: 'back' });
    if (ctx.zone !== 'home' && ctx.prev !== 'home') r.push({ l: 'Ir al inicio', go: 'home' });
    r.push({ l: 'Explorar otra categoría', n: 'explorar' });
    return r;
  }

  var CONV = {
    /* ---------- INICIO (portada con el corazón) ---------- */
    bienvenida: { t: 'Hola, viajero. Soy el Observador… y llevo un rato mirándote. ¿Te animas a mirar conmigo?', x: 'happy',
      c: [{ l: 'Hola, Observador', n: 'concepto' }, { l: '¿Quién eres?', n: 'quien' }] },
    quien: { t: 'Alguien que cuida este lugar y ve lo que otros pasan por alto: cada trazo, cada latido.', x: 'sly',
      c: [{ l: '¿Y qué es este lugar?', n: 'concepto' }, { l: 'Prefiero mirar por mi cuenta', n: 'solo' }] },
    concepto: { t: 'Esto es TabCuar: el universo creativo de un ilustrador. Cinco puertas rodean el corazón: Portafolio, TabLab, TabGame, TabCuario y Sobre mí.', x: 'curious',
      c: [{ l: '¿Por qué un corazón?', n: 'corazon' }, { l: 'Enséñame las puertas', n: 'explorar' }] },
    corazon: { t: 'Porque cada puerta late a su ritmo —arte, formación, juego, agua— y en el centro está quien lo construyó.', x: 'calm',
      c: [{ l: '¿Quién lo construyó?', n: 'creador_q' }, { l: 'Entendido, sigo explorando', n: 'solo' }] },
    detras: { t: '¿Quieres descubrir qué hay detrás de este corazón?', x: 'curious', exit: false,
      c: [{ l: 'Sí, quiero descubrirlo.', n: 'detras_si' }, { l: 'No, prefiero explorar por mi cuenta.', n: 'detras_no' }] },
    detras_si: { t: 'Detrás hay cuatro cámaras, y cada una guarda un mundo distinto. ¿Cuál te llama?', x: 'curious',
      c: [{ l: 'La del arte (Portafolio)', go: 'TabCuart' }, { l: 'La del juego (TabGame)', n: 'proyectos_q' }, { l: 'La del agua (TabCuario)', go: 'contacto' }, { l: 'La del aprendizaje (TabLab)', go: 'estudios' }] },
    detras_no: { t: 'Entendido. Los mejores descubrimientos se hacen sin guía. Estaré cerca por si cambias de opinión.', x: 'calm' },
    proyectos_q: { t: '¿Quieres que te muestre los proyectos? Hay un juego de cartas llamado Gehenna: La Corte del Juicio.', x: 'sly', exit: false,
      c: [{ l: '¡Vamos!', go: 'proyectos' }, { l: 'Después, primero quiero mirar.', n: 'mirar' }] },
    mirar: { t: 'Claro. Mira cuanto quieras: los mundos no se van a ninguna parte.', x: 'calm' },
    creador_q: { t: '¿Te gustaría conocer un poco sobre quien construyó este universo?', x: 'curious', exit: false,
      c: [{ l: 'Sí, cuéntame.', n: 'creador_si' }, { l: 'No, quiero seguir explorando.', n: 'creador_no' }] },
    creador_si: { t: 'Es un ilustrador y creador multidisciplinario: personajes, naturaleza y experimentación gráfica. ¿Vamos a su sección?', x: 'happy', exit: false,
      c: [{ l: 'Vamos', go: 'sobre' }, { l: 'Luego', n: 'luego' }] },
    creador_no: { t: 'Respeto el misterio. A veces es mejor no saberlo todo… todavía.', x: 'sly' },
    luego: { t: 'Cuando quieras. El centro del corazón siempre está abierto.', x: 'calm' },
    despues: { t: 'Sin prisa. Aquí estaré cuando quieras seguir.', x: 'calm' },
    solo: { t: 'Como quieras. Si me necesitas, haz clic en mí.', x: 'calm' },
    seguir: { t: 'Perfecto. Sigue explorando; yo observo.', x: 'calm' },
    menu: { t: '¡Me encontraste! ¿Quieres que te guíe?', x: 'happy',
      c: [{ l: 'Descubrir el corazón', n: 'detras' }, { l: 'Ver los proyectos', n: 'proyectos_q' }, { l: 'Conocer a quien lo construyó', n: 'creador_q' }, { l: 'Sorpréndeme', n: 'sorpresa' }] },
    sorpresa: { t: 'Cierra los ojos… y elige conmigo.', x: 'sly', r: ['go:TabCuart', 'go:proyectos', 'go:contacto', 'go:estudios', 'go:sobre'] },

    /* ---------- OTRA CATEGORÍA (disponible desde cualquier sección) ---------- */
    explorar: { t: function (ctx) { return ctx.zone === 'home' ? 'Elige una puerta:' : 'Estas son las demás puertas. ¿A cuál vamos?'; }, x: 'curious',
      c: function (ctx) {
        var all = [['TabCuart', 'Portafolio · ilustración y técnicas'], ['estudios', 'TabLab · educación creativa'], ['proyectos', 'TabGame · Gehenna'], ['contacto', 'TabCuario · peces y plantas'], ['sobre', 'Sobre mí · y contacto']];
        return all.filter(function (a) { return a[0] !== ctx.zone; }).map(function (a) { return { l: a[1], go: a[0] }; });
      } },

    /* ---------- PORTAFOLIO (TabCuart) ---------- */
    tc_intro: { t: 'Portafolio: ilustración, grabado, escultura y animación. Puedes arrastrar y girar las obras. ¿Quieres que te muestre las técnicas?', x: 'curious', exit: false,
      c: [{ l: YES, n: 'tc_tecnicas' }, { l: NO, n: 'tc_alt' }] },
    tc_tecnicas: { t: 'Elige una técnica y la galería se ajusta:', x: 'happy',
      c: [{ l: 'Ilustración digital', act: 'filter', arg: 'digital', say: 'Ilustración digital.' }, { l: 'Grabado', act: 'filter', arg: 'lino', say: 'Grabado.' },
          { l: 'Escultura', act: 'filter', arg: 'escultura', say: 'Escultura.' }, { l: 'Animación', act: 'filter', arg: 'animacion', say: 'Animación.' }, { l: 'Más técnicas', n: 'tc_tecnicas2' }] },
    tc_tecnicas2: { t: 'También hay estas:', x: 'curious',
      c: [{ l: 'Ilustración análoga', act: 'filter', arg: 'tradicional', say: 'Ilustración análoga.' }, { l: '3D', act: 'filter', arg: '3d', say: '3D.' },
          { l: 'Tattoo', act: 'filter', arg: 'tattoo', say: 'Tattoo.' }, { l: 'Todas', act: 'filter', arg: 'all', say: 'Todas las técnicas.' }] },
    tc_alt: { t: 'Entonces, otra cosa: puedes ver cómo evoluciona una obra, del boceto al resultado final. ¿Quieres ver el proceso creativo?', x: 'sly', exit: false,
      c: [{ l: YES, act: 'process', say: 'Aquí está el proceso.' }, { l: NO, n: 'tc_libros_q' }] },
    tc_libros_q: { t: 'Hay también Libros & Cómics para leer página a página, aquí mismo. ¿Te los muestro?', x: 'curious', exit: false,
      c: [{ l: YES, act: 'scroll', arg: '#tabcuartBooks', say: 'Libros & Cómics.' }, { l: NO, n: 'tc_menu' }] },
    tc_menu: { t: '¿Qué prefieres en el Portafolio?', x: 'curious',
      c: function (ctx) { return [{ l: 'Ver las técnicas', n: 'tc_tecnicas' }, { l: 'Ver el proceso creativo', act: 'process', say: 'Aquí está el proceso.' }, { l: 'Libros & Cómics', act: 'scroll', arg: '#tabcuartBooks' }].concat(navTail(ctx)); } },

    /* ---------- TABLAB (estudios) ---------- */
    es_intro: { t: 'TabLab es Educación Creativa: formación continua, compartiendo el proceso de aprender mientras se enseña. ¿Quieres saber qué ofrece?', x: 'curious', exit: false,
      c: [{ l: YES, n: 'es_oferta' }, { l: NO, n: 'es_alt' }] },
    es_oferta: { t: 'Hay tres caminos: Talleres, Cursos y Materiales. ¿Cuál te interesa?', x: 'happy',
      c: [{ l: 'Talleres', n: 'es_talleres' }, { l: 'Cursos', n: 'es_cursos' }, { l: 'Materiales', n: 'es_materiales' }] },
    es_talleres: { t: 'Talleres presenciales o virtuales: sesiones prácticas de ilustración, linograbado y dibujo, en grupos pequeños. Fechas y temas varían según disponibilidad. ¿Quieres escribir para preguntar?', x: 'happy', exit: false,
      c: [{ l: YES, act: 'contact', say: 'Aquí puedes escribir.' }, { l: NO, n: 'es_oferta' }] },
    es_cursos: { t: 'Cursos: formación estructurada en ilustración digital y tradicional —fundamentos del dibujo, composición, color y técnica—. Están en desarrollo; próximamente en formato digital.', x: 'calm',
      c: [{ l: 'Ver los talleres', n: 'es_talleres' }, { l: 'Escribir para saber más', act: 'contact', say: 'Aquí puedes escribir.' }] },
    es_materiales: { t: 'Materiales: guías, referencias, ejercicios prácticos y bibliografía curada para acompañar tu aprendizaje en ilustración y artes visuales.', x: 'curious',
      c: [{ l: 'Ver los talleres', n: 'es_talleres' }, { l: 'Ver los cursos', n: 'es_cursos' }] },
    es_alt: { t: 'Sin problema. Si lo tuyo es experimentar, el Portafolio muestra técnicas y procesos. ¿Te llevo?', x: 'sly', exit: false,
      c: [{ l: YES, go: 'TabCuart' }, { l: NO, n: 'es_menu' }] },
    es_menu: { t: '¿Qué quieres saber de TabLab?', x: 'curious',
      c: function (ctx) { return [{ l: 'Talleres', n: 'es_talleres' }, { l: 'Cursos', n: 'es_cursos' }, { l: 'Materiales', n: 'es_materiales' }].concat(navTail(ctx)); } },

    /* ---------- TABGAME (proyectos · Gehenna) ---------- */
    pr_intro: { t: 'Gehenna: La Corte del Juicio, un juego de cartas estratégico sobre corrupción, poder y ascensión. ¿Quieres probar un duelo?', x: 'sly', exit: false,
      c: [{ l: YES, act: 'scroll', arg: '#gehennaDuel', say: 'La Corte observa.' }, { l: NO, n: 'pr_alt' }] },
    pr_alt: { t: 'Entonces te cuento: cada pecado capital representa una filosofía distinta del poder. ¿Quieres conocerlos?', x: 'curious', exit: false,
      c: [{ l: YES, act: 'scroll', arg: '#gp', say: 'Los siete pecados.' }, { l: NO, n: 'pr_menu' }] },
    pr_menu: { t: '¿Qué prefieres en TabGame?', x: 'sly',
      c: function (ctx) { return [{ l: 'Jugar un duelo', act: 'scroll', arg: '#gehennaDuel', say: 'La Corte observa.' }, { l: 'Conocer los pecados', act: 'scroll', arg: '#gp' }, { l: 'Ver las cartas de muestra', act: 'scroll', arg: '.card-showcase' }].concat(navTail(ctx)); } },

    /* ---------- TABCUARIO (contacto) ---------- */
    tq_intro: { t: 'TabCuario: Peces, Plantas & Ecosistemas, mundos acuáticos cultivados con la misma atención que una ilustración. ¿Qué quieres ver?', x: 'calm',
      c: [{ l: 'Peces', act: 'tab', arg: 'peces', say: 'Peces.' }, { l: 'Plantas', act: 'tab', arg: 'plantas', say: 'Plantas.' }, { l: 'Datos curiosos', act: 'tab', arg: 'curiosos', say: 'Datos curiosos.' }, { l: 'Libros', act: 'scroll', arg: '#tabcuarioBooks', say: 'La biblioteca digital.' }] },
    tq_menu: { t: '¿Qué prefieres en TabCuario?', x: 'calm',
      c: function (ctx) { return [{ l: 'Peces', act: 'tab', arg: 'peces' }, { l: 'Plantas', act: 'tab', arg: 'plantas' }, { l: 'Datos curiosos', act: 'tab', arg: 'curiosos' }, { l: 'Libros', act: 'scroll', arg: '#tabcuarioBooks' }].concat(navTail(ctx)); } },

    /* ---------- SOBRE MÍ (y contacto) ---------- */
    so_intro: { t: 'Ilustrador y creador multidisciplinario: ilustración, personajes, naturaleza y experimentación gráfica. ¿Quieres ver las cartas con sus intereses y programas?', x: 'happy', exit: false,
      c: [{ l: YES, act: 'scroll', arg: '.ab-deck', say: 'Aquí están.' }, { l: NO, n: 'so_alt' }] },
    so_alt: { t: '¿Prefieres escribir directamente? Puedes encargar una obra, tomar un taller o colaborar en un proyecto creativo.', x: 'curious', exit: false,
      c: [{ l: YES, act: 'contact', say: 'Aquí puedes escribir.' }, { l: NO, n: 'so_menu' }] },
    so_contacto: { t: 'Para encargar una obra, tomar un taller o colaborar, escribe por correo (tabcuart.22@gmail.com) o por Instagram (@TabCuar).', x: 'happy',
      c: [{ l: 'Copiar el correo', act: 'copy', say: 'Correo copiado.' }, { l: 'Abrir Instagram', act: 'link', arg: 'https://instagram.com/TabCuar' }] },
    so_menu: { t: '¿Qué quieres de Sobre mí?', x: 'happy',
      c: function (ctx) { return [{ l: 'Ver las cartas', act: 'scroll', arg: '.ab-deck' }, { l: 'Contacto', act: 'scroll', arg: '#sobreContacto' }].concat(navTail(ctx)); } }
  };

  var hist = ['home'], backNav = false, pendingNode = null, introduced = {};
  var conv = null, convT = 0, convS = 0, visited = {}, returns = 0;

  /* ---- historial de navegación real ---- */
  function prevZone() { for (var q = hist.length - 2; q >= 0; q--) if (hist[q] !== zone) return hist[q]; return null; }
  function navTo(z, node) {          /* navegación INMEDIATA: sin esperas; la transición visual la hace la capa */
    convEnd(true); look(null);
    if (z === zone) { speak('Ya estamos aquí.', { force: true, expr: 'happy', ms: 2200 }); return; }
    pendingNode = node || null;
    if (z === 'home') window.closeLayer(); else window.openLayer(z);
  }
  function goBack() { var p = prevZone() || 'home'; backNav = true; navTo(p); }
  function scrollTo(sel) { var el = document.querySelector(sel); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }

  /* ---- acciones que pueden ejecutar las respuestas (act) ---- */
  var ACT = {
    end: function () {},
    home: function () { navTo('home'); },
    back: function () { goBack(); },
    contact: function () {
      if (zone === 'sobre') { scrollTo('#sobreContacto'); startNode('so_contacto'); return; }
      pendingNode = 'so_contacto';                                    /* al llegar, el personaje habla de los medios de contacto */
      if (typeof openContact === 'function') openContact(); else navTo('sobre', 'so_contacto');
    },
    copy: function () { var b = document.querySelector('#sobreContacto .contact-copy'); if (typeof copyContactEmail === 'function' && b) copyContactEmail(b); },
    link: function (u) { window.open(u, '_blank', 'noopener'); },
    filter: function (cat) { var b = document.querySelector('.filter-btn[onclick*="\'' + cat + '\'"]'); if (typeof filterGallery === 'function') filterGallery(cat, b); scrollTo('#gallery'); },
    tab: function (name) { var b = document.querySelector('.aqua-tab[onclick*="\'' + name + '\'"]'); if (b) b.click(); scrollTo('#acuario'); },
    scroll: function (sel) { scrollTo(sel); },
    process: function () { if (window.ProcessSystem) window.ProcessSystem.show(window.ProcessSystem.current(), { scroll: true }); }
  };
  function startNode(id) { window.setTimeout(function () { if (!conv) convStart(id); }, 350); }

  function runChoice(ch) {
    if (ch.n) { showNode(ch.n); return; }
    if (ch.go) { navTo(ch.go); return; }
    convEnd(ch.act !== 'end');                  /* la acción termina la charla; la frase breve la dice el personaje ya fuera de la conversación */
    if (ACT[ch.act]) ACT[ch.act](ch.arg);
    if (ch.say) speak(ch.say, { force: true, expr: 'happy', ms: 3000 });
  }
  function ctxNow() { return { zone: zone, prev: prevZone() }; }
  function showNode(id, focus) {
    var n = CONV[id]; if (!conv || !n) { convEnd(); return; }
    var ctx = ctxNow(), text = typeof n.t === 'function' ? n.t(ctx) : n.t, list = typeof n.c === 'function' ? n.c(ctx) : (n.c || []).slice();
    if (list.length && n.exit !== false && !list.some(function (c) { return c.act === 'end'; })) list.push({ l: 'Seguir explorando', n: 'seguir' });   /* siempre hay salida */
    conv.id = id; clearTimeout(convT); clearTimeout(convS);
    choicesEl.textContent = '';
    var hasC = list.length > 0;
    say.classList.toggle('has-choices', hasC);
    list.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'obs-choice'; b.textContent = c.l;
      b.addEventListener('click', function () { runChoice(c); });
      choicesEl.appendChild(b);
    });
    speak(text, { conv: true, keep: true, force: true, expr: n.x || 'curious' });
    if (focus && hasC) setTimeout(function () { if (conv && conv.id === id && choicesEl.firstChild) choicesEl.firstChild.focus({ preventScroll: true }); }, 80);
    var read = Math.min(7000, 1800 + text.length * 38);
    convS = setTimeout(function () { if (conv && conv.id === id) root.dataset.state = 'idle'; }, read);   /* terminó de hablar: el globo se queda, la boca no */
    if (n.r) convT = setTimeout(function () {                                                           /* elección al azar (Sorpréndeme) */
      var pick = rnd(n.r); if (pick.indexOf('go:') === 0) navTo(pick.slice(3)); else showNode(pick);
    }, 1200);
    else if (hasC) convT = setTimeout(function () { convEnd(); }, 30000);                              /* sin respuesta: se retira sin insistir */
    else convT = setTimeout(function () { convEnd(); }, read + 1800);                                  /* cierre natural */
  }
  function convStart(id, focus) {
    if (!CONV[id]) return;
    if (conv) convEnd(true);
    roam = null; wander = null; conv = { id: id };
    showNode(id, focus);
    schedule();
  }
  function convEnd(silent) {
    clearTimeout(convT); clearTimeout(convS);
    if (!conv) return;
    conv = null; choicesEl.textContent = ''; say.classList.remove('has-choices');
    if (!silent) { root.classList.remove('is-talking'); root.dataset.state = 'idle'; look(null); }
    BUB.dirty = true; schedule();
  }
  function offerReturn() {                                /* al volver al inicio: propone una cámara que aún no visitó (máx. 2 veces) */
    var left = ['TabCuart', 'proyectos', 'estudios', 'contacto'].filter(function (z) { return !visited[z]; });
    if (!left.length || returns >= 2 || sel || dragging) return false;
    returns++; var u = rnd(left);
    CONV.regreso = { t: 'Volviste. Aún queda una cámara sin abrir: ' + ZN[u] + '. ¿Te llevo?', x: 'curious', exit: false,
      c: [{ l: 'Sí, llévame', go: u }, { l: 'Todavía no', n: 'despues' }] };
    convStart('regreso'); return true;
  }

  function setZone(z) {
    convEnd(true);                                                    /* navegar nunca queda bloqueado por una conversación */
    zone = ZONES[z] ? z : 'home';
    if (backNav) { hist.pop(); backNav = false; } else if (hist[hist.length - 1] !== zone) { hist.push(zone); if (hist.length > 14) hist.shift(); }   /* historial real */
    if (zone !== 'home' && zone !== 'sobre') visited[zone] = true;
    var c = ZONES[zone];
    root.dataset.zone = zone; root.dataset.mood = c.mood; base = c.expr; root.dataset.expr = base; F = c.follow; PULL = PULLS[zone] || .35;
    root.style.setProperty('--tw0', c.tail + 's');
    setTimeout(function () { measure(); schedule(); }, 950);
    var node = pendingNode; pendingNode = null;
    setTimeout(function () {                                           /* 250 ms: lo justo para que la capa empiece a aparecer */
      if (node && CONV[node]) { introduced[zone] = true; convStart(node); return; }
      if (zone === 'home') { if (!offerReturn()) speak(MSG.home, { expr: 'curious', force: true, ms: 3800 }); return; }
      if (INTRO[zone] && !introduced[zone]) { introduced[zone] = true; convStart(INTRO[zone]); return; }   /* primera visita: se presenta la sección */
      speak(MSG[zone], { expr: 'curious', force: true, ms: 3800 });
    }, 250);
  }
  var _open = window.openLayer, _close = window.closeLayer;
  if (typeof _open === 'function') window.openLayer = function (z) { var r = _open.apply(this, arguments); setZone(z); return r; };
  if (typeof _close === 'function') window.closeLayer = function () { var r = _close.apply(this, arguments); setZone(null); return r; };

  /* ---- Corazón / categorías de la portada ---- */
  document.querySelectorAll('.hotspot').forEach(function (h) {
    var c = ZONES[h.dataset.zone]; if (!c) return;
    function on() { if (!document.body.classList.contains('layer-open')) speak(c.hover, { look: h, ms: 3800, expr: 'curious', force: true }); }
    function off() { if (!document.body.classList.contains('layer-open')) shush(); }
    h.addEventListener('mouseenter', on); h.addEventListener('focus', on);
    h.addEventListener('mouseleave', off); h.addEventListener('blur', off);
  });
  var heart = document.getElementById('heartAnim');
  if (heart) heart.addEventListener('mouseenter', function () {
    if (!document.body.classList.contains('layer-open')) speak(ZONES.sobre.hover, { look: heart, ms: 3800, expr: 'happy', force: true });
  });

  /* ---- Filtros de TabCuart ---- */
  var bar = document.querySelector('.gallery-filter'), fRot = {};
  if (bar) {
    var fire = function (e) {
      var b = e.target.closest('.filter-btn'); if (!b) return;
      var m = /filterGallery\('([^']+)'/.exec(b.getAttribute('onclick') || ''), L = m && FILTERS[m[1]]; if (!L) return;
      fRot[m[1]] = ((fRot[m[1]] === undefined ? -1 : fRot[m[1]]) + 1) % L.length;
      speak(L[fRot[m[1]]], { look: b, ms: 4200, force: true, expr: 'curious' });
    };
    bar.addEventListener('mouseover', fire); bar.addEventListener('focusin', fire);
    bar.addEventListener('click', function (e) { if (e.target.closest('.filter-btn')) pulse('is-tilt', 1200); });
  }

  /* ---- Elemento secreto: facción oculta de Gehenna ---- */
  var secret = document.querySelector('#proy-gehenna .sin-card[style*="dashed"]');
  if (secret) {
    secret.setAttribute('data-obs', 'secret'); secret.tabIndex = 0;
    secret.addEventListener('click', function () { speak('Shhh… todavía no es hora de revelarla.', { force: true, expr: 'sly', look: secret }); });
  }

  /* ---- Foto de "Sobre mí" ---- */
  var photo = document.querySelector('.about-photo');
  if (photo) {
    photo.setAttribute('tabindex', '0'); photo.setAttribute('role', 'button'); photo.setAttribute('aria-label', 'Ampliar fotografía');
    photo.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); photo.click(); } });
  }

  window.Obs = { say: speak, look: look, expr: expr, hint: hint, watch: watch, act: act, shush: shush, talk: convStart, endTalk: convEnd };

  
/* ---- ENTRADA DEL OBSERVADOR ---- */

/* Mostrar el personaje tan pronto como su imagen esté disponible.
   No depende de que termine la secuencia del corazón. */
function appear() {
  if (root.classList.contains('is-on')) return;

  root.classList.add('is-on');
  measure();
  schedule();

  /* La bienvenida comienza después de aparecer. */
  setTimeout(function () {
    if (!sel && !dragging &&
        !document.body.classList.contains('layer-open')) {
      convStart('bienvenida');
    }
  }, 2400);
}

/* La imagen ya está declarada en el HTML del personaje.
   Esperamos su carga para evitar mostrarlo incompleto. */
var charImg = root.querySelector('.obs-body');

if (charImg && charImg.complete && charImg.naturalWidth > 0) {
  requestAnimationFrame(appear);
} else if (charImg) {
  charImg.addEventListener('load', appear, { once: true });
  charImg.addEventListener('error', appear, { once: true });
} else {
  appear();
}

})();


/* =========================================================
   PROCESO EXPLORABLE — izquierda: Boceto · Desarrollo · Proceso (arrastrable) · derecha: resultado final
   - Galería con scroll nativo + snap: en táctil se desliza con el dedo y el scroll vertical de la página sigue funcionando.
   - Ratón: se arrastra (con inercia ligera y ajuste a la etapa más cercana).
   - Barra, flechas, pestañas y teclado quedan sincronizados con la imagen visible.
   - Etapa 03: usa Img/Etp3.png; si ese archivo no existe, muestra un detalle ampliado de Etp2.png.
   - Resultado final: video grande; se reproduce al verse, se pausa al salir; clic = pausar/reproducir.
========================================================= */
(function () {
  'use strict';
  var root = document.getElementById('processJourney'); if (!root) return;

  /* ---------- Galería de proceso: dirigida por datos (PROCESS_DATA, arriba en este archivo) ---------- */
  var explore = document.getElementById('pvExplore'), vp = document.getElementById('pvViewport');
  if (explore && vp) {
    var tabsBox = explore.querySelector('.pv-tabs'), hint = vp.querySelector('.pv-hint'), emptyEl = document.getElementById('pvEmpty'),
        range = document.getElementById('pvRange'), prevB = document.getElementById('pvPrev'), nextB = document.getElementById('pvNext'),
        countEl = document.getElementById('pvCount'), nameEl = document.getElementById('pvName'), textEl = document.getElementById('pvText'),
        kickerEl = document.getElementById('pvKicker'), worksEl = document.getElementById('pvWorks'), totalEl = document.getElementById('processCount'),
        emptyTxt = document.getElementById('pvEmptyText'), duo = explore.parentNode, finalCount = document.getElementById('pvFinalCount');
    var slides = [], tabs = [], notches = [], N = 0, idx = -1, ticking = false, scrubbing = false, drag = null, used = false, spoke = false, workKey = null;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var maxScroll = function () { return Math.max(1, vp.scrollWidth - vp.clientWidth); };

    /* Perilla: progreso (--pn), muescas por etapa, etiqueta flotante y estados (presionado / rebote / onda) */
    var scrub = document.getElementById('pvScrub'), rail = explore.querySelector('.pv-rail'), tipName = document.getElementById('pvTipName');
    var kOf = function (i) { return N > 1 ? i / (N - 1) : 0; };
    function paint(p) {
      if (scrub) scrub.style.setProperty('--pn', p.toFixed(4));
      if (range) range.style.setProperty('--p', (p * 100).toFixed(1) + '%');
      notches.forEach(function (n, i) { n.classList.toggle('is-passed', p >= kOf(i) - .001); });
    }
    function flash(cls, ms) { if (!scrub) return; scrub.classList.remove(cls); void scrub.offsetWidth; scrub.classList.add(cls); setTimeout(function () { scrub.classList.remove(cls); }, ms); }
    function release() { if (scrub) scrub.classList.remove('is-grab'); }

    /* ---- trabajos: la clave es el archivo de la obra, igual que en la galería y en el visor ---- */
    function itemKey(it) { var m = it.querySelector('.click-img, .click-video'); return m ? resolveWorkInfo(it, m).key : null; }
    function findItem(key) { var all = [].slice.call(document.querySelectorAll('#gallery .gallery-item')); for (var q = 0; q < all.length; q++) if (itemKey(all[q]) === key) return all[q]; return null; }
    function steps(key) { return (key && PROCESS_DATA[key]) || []; }

    /* ---- construye UNA estructura (etapas + pestañas + muescas) para el trabajo elegido ---- */
    function build(list) {
      slides.concat(tabs, notches).forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
      slides = []; tabs = []; notches = []; N = list.length;
      list.forEach(function (st, i) {
        var fig = document.createElement('figure'); fig.className = 'pv-slide'; fig.dataset.title = st.title || ''; fig.dataset.text = st.text || '';
        var isVid = st.type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(st.src || '');
        if (isVid) {
          var vv = document.createElement('video'); vv.src = st.src; vv.muted = true; vv.loop = true; vv.autoplay = true; vv.controls = true; vv.setAttribute('playsinline', ''); vv.preload = 'metadata'; vv.className = 'pv-vid';
          vv.setAttribute('aria-label', st.alt || st.title || 'Video del proceso');
          vv.addEventListener('error', function () { fig.classList.add('is-missing'); });
          var chipV = document.createElement('span'); chipV.className = 'pv-chip';
          var cbV = document.createElement('b'); cbV.textContent = pad(i + 1); chipV.appendChild(cbV); chipV.appendChild(document.createTextNode(' ' + (st.title || '')));
          fig.appendChild(vv); fig.appendChild(chipV); vp.insertBefore(fig, hint); slides.push(fig);
          var tbV = document.createElement('button'); tbV.type = 'button'; tbV.className = 'pv-tab'; tbV.setAttribute('role', 'tab'); tbV.setAttribute('aria-selected', 'false');
          tbV.textContent = st.title || ''; tbV.style.setProperty('--k', kOf(i).toFixed(4));
          tbV.addEventListener('click', function () { touched(); goTo(i); }); tabsBox.appendChild(tbV); tabs.push(tbV);
          if (rail) { var ntV = document.createElement('i'); ntV.className = 'pv-notch'; ntV.style.setProperty('--k', kOf(i).toFixed(4)); rail.appendChild(ntV); notches.push(ntV); }
          return;
        }
        var bg = document.createElement('img'); bg.className = 'pv-bg'; bg.alt = ''; bg.setAttribute('aria-hidden', 'true'); bg.decoding = 'async'; bg.draggable = false; bg.src = st.src;
        var im = document.createElement('img'); im.alt = st.alt || ((st.title || '') + (st.text ? ': ' + st.text : '')); im.draggable = false; im.decoding = 'async';
        if (i) im.loading = 'lazy';
        im.addEventListener('error', function () {
          if (st.fallback && im.getAttribute('src') !== st.fallback) { im.src = st.fallback; bg.src = st.fallback; fig.classList.add('is-detail'); }   /* detalle ampliado de un recurso existente */
          else fig.classList.add('is-missing');
        });
        im.src = st.src;
        var chip = document.createElement('span'); chip.className = 'pv-chip';
        var cb = document.createElement('b'); cb.textContent = pad(i + 1); chip.appendChild(cb); chip.appendChild(document.createTextNode(' ' + (st.title || '')));
        fig.appendChild(bg); fig.appendChild(im); fig.appendChild(chip); vp.insertBefore(fig, hint); slides.push(fig);
        var tb = document.createElement('button'); tb.type = 'button'; tb.className = 'pv-tab'; tb.setAttribute('role', 'tab'); tb.setAttribute('aria-selected', 'false');
        tb.textContent = st.title || ''; tb.style.setProperty('--k', kOf(i).toFixed(4));
        tb.addEventListener('click', function () { touched(); goTo(i); }); tabsBox.appendChild(tb); tabs.push(tb);
        if (rail) { var nt = document.createElement('i'); nt.className = 'pv-notch'; nt.style.setProperty('--k', kOf(i).toFixed(4)); rail.appendChild(nt); notches.push(nt); }
      });
    }

    function setIndex(i) {
      if (i === idx || !slides[i]) return; idx = i;
      var s = slides[i];
      nameEl.textContent = ''; var b = document.createElement('b'); b.textContent = pad(i + 1);
      nameEl.appendChild(b); nameEl.appendChild(document.createTextNode(s.dataset.title || ''));
      textEl.textContent = s.dataset.text || '';
      if (countEl) countEl.textContent = 'Etapa ' + (i + 1) + ' / ' + N;
      if (tipName) tipName.textContent = s.dataset.title || '';
      if (range) range.setAttribute('aria-valuetext', 'Etapa ' + (i + 1) + ' de ' + N + ': ' + (s.dataset.title || ''));
      if (used) flash('is-snap', 460);
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); });
      if (prevB) prevB.disabled = i === 0; if (nextB) nextB.disabled = i === N - 1;
      if (used && !spoke && i === N - 1 && N > 1 && window.Obs) { spoke = true; window.Obs.say('Aquí es donde más se insiste…', { look: vp, expr: 'curious', ms: 3000 }); }
    }
    function onScroll() {
      if (ticking || !N) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var p = clamp(vp.scrollLeft / maxScroll(), 0, 1);
        if (!scrubbing && range) range.value = (p * 100).toFixed(1);
        paint(p);
        setIndex(clamp(Math.round(p * (N - 1)), 0, N - 1));
      });
    }
    function goTo(i) {
      if (!N) return;
      i = clamp(i, 0, N - 1); vp.classList.remove('is-drag');
      vp.scrollTo({ left: i * vp.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    function touched() { used = true; explore.classList.add('is-used'); }

    /* ---- resultado final: imagen o video según FINAL_DATA ---- */
    var finalDefault = null;
    function setFinal(key) {
      var fv = document.getElementById('processVideo3'); if (!fv) return;
      var frame = fv.closest('.pv-frame'), fi = document.getElementById('processFinalImg');
      var t = document.getElementById('processStep3Title'), x = document.getElementById('processStep3Text'), chipB = frame && frame.querySelector('.pv-chip');
      if (!finalDefault) finalDefault = { src: fv.getAttribute('src'), title: t ? t.textContent : '', text: x ? x.textContent : '' };
      var d = (key && FINAL_DATA[key]) || { type: 'video', src: finalDefault.src, title: finalDefault.title, text: finalDefault.text };
      if (t) t.textContent = d.title || finalDefault.title;
      if (x) x.textContent = d.text || finalDefault.text;
      if (d.type === 'image' && fi) {
        fv.pause(); fv.hidden = true; fi.hidden = false; fi.src = d.src; fi.alt = d.alt || d.title || '';
        frame.classList.add('is-image'); frame.classList.remove('is-paused'); frame.removeAttribute('role'); frame.setAttribute('tabindex', '-1');
      } else {
        if (fi) fi.hidden = true; fv.hidden = false;
        if (fv.getAttribute('src') !== d.src) { fv.src = d.src; fv.load(); }
        frame.classList.remove('is-image'); frame.setAttribute('role', 'button'); frame.setAttribute('tabindex', '0');
        frame.classList.toggle('is-paused', fv.paused);
      }
    }

    /* ---- muestra el proceso de un trabajo (o el estado vacío) ---- */
    function render(key, keep) {
      var list = steps(key), at = keep ? Math.max(0, idx) : 0, it = key ? findItem(key) : null, info = it ? resolveWorkInfo(it, it.querySelector('.click-img, .click-video')) : null;
      workKey = key; build(list); idx = -1; spoke = false;
      explore.classList.toggle('is-empty', !N); explore.classList.toggle('is-single', N === 1);
      if (duo) duo.classList.toggle('is-empty', !N);
      if (emptyEl) emptyEl.hidden = !!N;
      if (emptyTxt) emptyTxt.textContent = info ? 'Aún no hay imágenes de proceso para «' + info.title + '».' : 'Este trabajo aún no tiene imágenes de proceso.';
      if (kickerEl) kickerEl.textContent = info && N ? 'Proceso · ' + info.title : 'Boceto · Desarrollo · Proceso';
      if (totalEl) totalEl.textContent = N ? pad(N + 1) + ' ETAPAS' : 'SIN PROCESO';
      if (finalCount) finalCount.textContent = 'Etapa ' + (N + 1);
      var fn = duo && duo.querySelector('.pv-final .pv-stage-name b'); if (fn) fn.textContent = pad(N + 1);
      setFinal(key);
      vp.classList.remove('is-drag'); vp.scrollLeft = 0; if (range) range.value = 0; paint(0);
      if (N) { setIndex(Math.min(at, N - 1)); if (at) vp.scrollLeft = at * vp.clientWidth; onScroll(); }
      else { nameEl.textContent = ''; textEl.textContent = ''; if (countEl) countEl.textContent = '—'; }
      renderWorks();
    }
    /* selector de trabajo: las obras de la MISMA técnica que el trabajo activo (las que muestra la galería) */
    function renderWorks() {
      if (!worksEl) return;
      worksEl.textContent = '';
      var cur = workKey ? findItem(workKey) : null, cat = cur ? cur.dataset.cat : null;
      var list = viewerCollect().filter(function (it) { return !cat || it.dataset.cat === cat; });
      if (list.length) {
        var fb = cat && document.querySelector('.filter-btn[onclick*="\'' + cat + '\'"]');
        var lab = document.createElement('span'); lab.className = 'pv-works-label'; lab.textContent = (fb ? fb.textContent.trim() : 'Trabajo') + ' ·'; worksEl.appendChild(lab);
      }
      list.forEach(function (it) {
        var m = it.querySelector('.click-img, .click-video'); if (!m) return;
        var info = resolveWorkInfo(it, m), b = document.createElement('button');
        b.type = 'button'; b.className = 'pv-work' + (steps(info.key).length ? ' has-process' : ''); b.textContent = info.title;
        b.setAttribute('aria-pressed', String(info.key === workKey)); b.dataset.work = info.key;
        b.addEventListener('click', function () { if (info.key !== workKey) { touched(); render(info.key); } });
        worksEl.appendChild(b);
      });
    }
    function chooseWork() {          /* tras filtrar por técnica: conserva el trabajo si sigue visible; si no, el primero con proceso */
      var keys = viewerCollect().map(itemKey).filter(Boolean);
      if (keys.indexOf(workKey) !== -1) { renderWorks(); return; }
      render(keys.filter(function (k) { return steps(k).length; })[0] || keys[0] || null);
    }
    var _filter = window.filterGallery;
    if (typeof _filter === 'function') window.filterGallery = function () { var r = _filter.apply(this, arguments); chooseWork(); return r; };

    /* API pública: agregar procesos desde JavaScript sin tocar el HTML */
    window.ProcessSystem = {
      has: function (k) { return steps(k).length > 0; },
      get: function (k) { return steps(k).slice(); },
      current: function () { return workKey; },
      add: function (k, st) { (PROCESS_DATA[k] = PROCESS_DATA[k] || []).push(st); if (k === workKey) render(k, true); else renderWorks(); },
      setWork: function (k) { if (k && k !== workKey) render(k); },
      show: function (k, o) {
        if (k) render(k);
        var layer = document.getElementById('layer-TabCuart');
        if (layer && !layer.classList.contains('active') && typeof window.openLayer === 'function') window.openLayer('TabCuart');
        if (o && o.scroll) { var t = document.getElementById('techniqueProcess'); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
      }
    };

    vp.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', function () { vp.scrollLeft = Math.max(0, idx) * vp.clientWidth; onScroll(); });
    vp.addEventListener('dragstart', function (e) { e.preventDefault(); });
    vp.addEventListener('touchstart', touched, { passive: true });
    vp.addEventListener('wheel', function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) touched(); }, { passive: true });

    /* arrastre con ratón (táctil y lápiz usan el scroll nativo) */
    vp.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, s: vp.scrollLeft, lx: e.clientX, lt: performance.now(), v: 0, moved: false };
    });
    vp.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 4) return;
        drag.moved = true; vp.classList.add('is-drag'); touched();
        try { vp.setPointerCapture(e.pointerId); } catch (x) {}
      }
      var now = performance.now(), dt = Math.max(1, now - drag.lt);
      drag.v = drag.v * .6 + ((e.clientX - drag.lx) / dt) * .4; drag.lx = e.clientX; drag.lt = now;
      vp.scrollLeft = drag.s - dx;
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag; drag = null;
      if (!d.moved) return;
      try { vp.releasePointerCapture(e.pointerId); } catch (x) {}
      var pos = vp.scrollLeft / Math.max(1, vp.clientWidth);
      goTo(Math.round(clamp(pos - d.v * .35, 0, N - 1)));
    }
    vp.addEventListener('pointerup', endDrag); vp.addEventListener('pointercancel', endDrag);

    /* teclado */
    vp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); touched(); goTo(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); touched(); goTo(idx - 1); }
      else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      else if (e.key === 'End') { e.preventDefault(); goTo(N - 1); }
    });

    /* barra, flechas y pestañas */
    if (range) {
      range.addEventListener('input', function () {
        scrubbing = true; touched(); vp.classList.add('is-drag');
        vp.scrollLeft = range.value / 100 * maxScroll(); paint(range.value / 100);
      });
      /* el input range NO recibe puntero (lo hace el ojo, abajo); se conserva para teclado y lectores de pantalla */
      range.addEventListener('blur', release);
      range.addEventListener('change', function () { scrubbing = false; goTo(Math.round(range.value / 100 * (N - 1))); });
      range.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); touched(); goTo(idx + 1); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); touched(); goTo(idx - 1); }
      });
    }

    /* ---------- OJO ARRASTRABLE (Pointer Events: ratón, lápiz y pantallas táctiles) ----------
       · Se agarra el ojo y se arrastra en horizontal; también basta un clic/toque en la barra para saltar a la etapa más cercana.
       · touch-action: none en el ojo (CSS): la página no se desplaza mientras se arrastra. El recorrido se limita a [0, 1].
       · La pupila mira hacia donde se mueve (--lx) y reacciona al cursor; al soltar se acomoda en la etapa más cercana. */
    var slider = explore.querySelector('.pv-slider'), knob = scrub && scrub.querySelector('.pv-knob'), eye = null;
    if (slider && knob && scrub) {
      var span = function () { var r = slider.getBoundingClientRect(); return { l: r.left, w: Math.max(1, r.width - knob.offsetWidth), k: knob.offsetWidth }; };
      var pAt = function (x, off) { var s = span(); return clamp((x - off - s.l - s.k / 2) / s.w, 0, 1); };
      var setP = function (p) { vp.scrollLeft = p * maxScroll(); paint(p); if (range) range.value = (p * 100).toFixed(1); };
      var gaze = function (v) { scrub.style.setProperty('--lx', clamp(v, -1, 1).toFixed(2)); };
      slider.addEventListener('pointerdown', function (e) {
        if (eye || N < 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
        var kr = knob.getBoundingClientRect(), onEye = knob.contains(e.target);
        eye = { id: e.pointerId, off: onEye ? e.clientX - (kr.left + kr.width / 2) : 0, lx: e.clientX, lt: performance.now(), v: 0 };
        try { slider.setPointerCapture(e.pointerId); } catch (x) {}
        touched(); scrubbing = true; vp.classList.add('is-drag'); scrub.classList.add('is-grab'); flash('is-ping', 720);
        if (!onEye) setP(pAt(e.clientX, 0));                              /* clic en la barra: el ojo salta hasta ahí */
        e.preventDefault();
      });
      slider.addEventListener('pointermove', function (e) {
        if (eye && e.pointerId === eye.id) {
          var now = performance.now(), dt = Math.max(1, now - eye.lt);
          eye.v = eye.v * .6 + ((e.clientX - eye.lx) / dt) * .4; eye.lx = e.clientX; eye.lt = now;
          setP(pAt(e.clientX, eye.off)); gaze(eye.v * 1.6);
        } else if (e.pointerType !== 'touch') {                           /* al pasar el cursor, la pupila lo sigue */
          var kr = knob.getBoundingClientRect(); gaze((e.clientX - (kr.left + kr.width / 2)) / 110);
        }
      });
      var eyeEnd = function (e) {
        if (!eye || (e && e.pointerId !== eye.id)) return;
        var d = eye; eye = null; scrubbing = false; release(); gaze(0);
        try { slider.releasePointerCapture(d.id); } catch (x) {}
        var p = clamp(vp.scrollLeft / maxScroll() + d.v * .12, 0, 1);       /* un poco de inercia al soltar */
        goTo(Math.round(p * (N - 1)));
      };
      slider.addEventListener('pointerup', eyeEnd); slider.addEventListener('pointercancel', eyeEnd); slider.addEventListener('lostpointercapture', eyeEnd);
      slider.addEventListener('pointerleave', function () { if (!eye) gaze(0); });
    }

    if (prevB) prevB.addEventListener('click', function () { touched(); goTo(idx - 1); });
    if (nextB) nextB.addEventListener('click', function () { touched(); goTo(idx + 1); });

    chooseWork();     /* trabajo inicial: el primero visible que tenga proceso */
  }

  /* ---------- Resultado final (video) ---------- */
  var vid = document.getElementById('processVideo3');
  if (vid) {
    var vf = vid.closest('.pv-frame'), userPaused = false;
    vid.muted = true; vid.loop = true; vid.setAttribute('playsinline', '');
    var still = function () { try { if (vid.duration) vid.currentTime = Math.min(vid.duration * .5, 4); } catch (e) {} };
    var onMeta = function () { if (reduceMotion) still(); };
    vid.addEventListener('loadedmetadata', onMeta); if (vid.readyState >= 1) onMeta();
    var play = function () { var r = vid.play(); if (r && r.catch) r.catch(function () {}); };
    var sync = function () { if (vf) vf.classList.toggle('is-paused', vid.paused); };
    vid.addEventListener('play', sync); vid.addEventListener('pause', sync); sync();
    var toggle = function () { if (vf && vf.classList.contains('is-image')) return; if (vid.paused) { userPaused = false; play(); } else { userPaused = true; vid.pause(); } };
    if (vf) {
      vf.addEventListener('click', toggle);
      vf.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    }
    if ('IntersectionObserver' in window && vf) {
      new IntersectionObserver(function (en) {
        if (vf.classList.contains('is-image')) { vid.pause(); return; } if (en[0].isIntersecting) { if (!reduceMotion && !userPaused) play(); } else vid.pause();
      }, { threshold: .35 }).observe(vf);
    }
  }
})();


(function () {
  'use strict';
  /* ---- SOFTWARE: iconos (nombre + descripción breve al pasar o tocar) ---- */
  var TOOLS = {
    kr: ['Kr', 'Krita',          'Pintura e ilustración digital',     '#3BABFF', '#0d2236'],
    ai: ['Ai', 'Illustrator',    'Vectores y formas limpias',         '#FF9A00', '#2b1500'],
    bl: ['Bl', 'Blender',        'Modelado 3D, luz y render',         '#F5792A', '#1B2A3C'],
    ae: ['Ae', 'After Effects',  'Animación y composición',           '#9999FF', '#00005B'],
    ps: ['Ps', 'Photoshop',      'Retoque y color',                   '#31A8FF', '#001E36']
  };
  var BY = { all: ['kr', 'ai', 'bl', 'ae', 'ps'], digital: ['kr', 'ai', 'ps'], animacion: ['ae', 'kr'], '3d': ['bl'] };
  var box = document.getElementById('techniqueTools');
  function renderTools(cat) {
    if (!box) return;
    var list = BY[cat] || [], wrap = box.closest('.technique-extra-box') || box;
    wrap.hidden = !list.length; box.innerHTML = '';
    list.forEach(function (k) {
      var o = TOOLS[k], s = document.createElement('span');
      s.className = 'tool-ico'; s.tabIndex = 0; s.setAttribute('role', 'img'); s.setAttribute('aria-label', o[1] + ': ' + o[2]);
      s.dataset.tip = o[1]; s.dataset.desc = o[2]; s.style.setProperty('--tc', o[3]); s.style.setProperty('--tb', o[4]); s.textContent = o[0];
      box.appendChild(s);
    });
  }
  renderTools('all');
  var _f = window.filterGallery;
  if (typeof _f === 'function') window.filterGallery = function (c) { var r = _f.apply(this, arguments); renderTools(String(c || 'all').toLowerCase()); return r; };
})();


/* =========================================================
   TABGAMME — GEHENNA: RECORRIDO POR LOS PECADOS (presentación, no juego)
   Se eliminó el juego de cartas (cartas, rondas, medidores, elecciones).
   Interacción: recorrer los 7 pecados (clic, flechas, swipe). Cada uno
   cambia el color, el aura y el glifo del escenario. Tres "fuerzas"
   (Corrupción · Eco · Poder) transforman visualmente esa escena.
   Solo transform/opacity. Reutiliza descripciones y SVG de cartas existentes.
========================================================= */
(function () {
  'use strict';
  var host = document.getElementById('proy-gehenna');
  var anchor = host && host.querySelector('.gehenna-sep');
  if (!anchor) return;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var O = function (t, o) { if (window.Obs) window.Obs.say(t, o || {}); };

  /* art: ruta de una ilustración PROPIA de ese pecado (vacía = aún no existe; no se inventa ninguna).
     artCard: carta de muestra ya existente cuya ilustración SVG se reutiliza. */
  var SINS = [
    { n: 'Ira',      g: '🔥', c: '#d2382a', d: 'Fuerza y destrucción directa. Dominio por la violencia.',      v: 'El fuego no negocia.',            q: 'Cuidado… eso quema.',           x: 'alert',   art: '', artCard: 'Ira Absoluta' },
    { n: 'Soberbia', g: '🦚', c: '#2fa39a', d: 'Alto costo, poder absoluto e irresistible.',                  v: 'Arrodíllate ante lo inevitable.', q: 'Qué seguro te ves…',            x: 'sly',     art: '' },
    { n: 'Envidia',  g: '👁', c: '#69a24b', d: 'Copia y usurpación de habilidades rivales.',                  v: 'Lo tuyo se ve mejor en mis manos.', q: 'Mmm… te está mirando.',        x: 'sly',     art: '', artCard: 'La Envidiosa' },
    { n: 'Gula',     g: '🍷', c: '#a43563', d: 'Consumo masivo. Más cartas, más poder.',                      v: 'Siempre queda lugar para más.',   q: 'Aquí siempre hay hambre.',      x: 'curious', art: '' },
    { n: 'Pereza',   g: '😴', c: '#7189b0', d: 'Pasividad calculada con efectos devastadores.',               v: 'Esperar también es una jugada.',  q: '¿Seguro que quieres hacer esto?', x: 'sleepy', art: '' },
    { n: 'Avaricia', g: '💛', c: '#d39a2b', d: 'Acumulación implacable de recursos y poder.',                 v: 'Nunca es suficiente.',            q: 'Siempre quieres otra…',         x: 'sly',     art: '', artCard: 'El Codicioso' },
    { n: 'Lujuria',  g: '🌹', c: '#c9547f', d: 'Control sutil y manipulación del rival.',                     v: 'Mírame. No podrás evitarlo.',     q: 'No me mires así…',              x: 'laugh',   art: '' }
  ];
  var FORCES = { cor: ['Corrupción', 'Qué oscuro se puso todo…', 'sly'], eco: ['Eco', 'Eco… eco… eco…', 'curious'], pod: ['Poder', '¡Eso sí brilla!', 'happy'] };

  var sec = document.createElement('section');
  sec.className = 'gp'; sec.id = 'gp'; sec.setAttribute('aria-label', 'Gehenna: recorrido por los siete pecados');
  sec.innerHTML =
    '<div class="gp-fx" aria-hidden="true"></div>' +
    '<header class="gp-top"><h3>Los siete pecados</h3><p>Recorre la Corte. Cada pecado cambia el mundo de Gehenna.</p></header>' +
    '<div class="gp-stage" id="gpStage" aria-live="polite">' +
      '<div class="gp-aura" aria-hidden="true"></div>' +
      '<div class="gp-glyph" aria-hidden="true"><span></span><span></span><span></span></div>' +
      '<div class="gp-info"><h4 id="gpName"></h4><p id="gpDesc"></p><blockquote id="gpVoice"></blockquote></div>' +
      '<div class="gp-art" id="gpArt"></div>' +
    '</div>' +
    '<div class="gp-nav"><button type="button" class="gp-arrow" id="gpPrev" aria-label="Pecado anterior">←</button>' +
      '<div class="gp-sigils" role="tablist" aria-label="Pecados">' + SINS.map(function (s, i) {
        return '<button type="button" role="tab" class="gp-sigil" data-i="' + i + '" style="--c:' + s.c + '" aria-label="' + s.n + '"><span aria-hidden="true">' + s.g + '</span><em>' + s.n + '</em></button>';
      }).join('') + '</div><button type="button" class="gp-arrow" id="gpNext" aria-label="Pecado siguiente">→</button></div>' +
    '<div class="gp-forces" role="group" aria-label="Fuerzas de Gehenna">' + Object.keys(FORCES).map(function (k) {
      return '<button type="button" class="gp-force" data-f="' + k + '" aria-pressed="false">' + FORCES[k][0] + '</button>'; }).join('') + '</div>' +
    '<button type="button" class="gp-end" id="gpExplore">Explorar proyecto</button>';
  anchor.after(sec);
  if (window.Obs) window.Obs.watch(sec, 'Aquí empieza la Corte. Recorre cada pecado.');

  var $ = function (s) { return sec.querySelector(s); };
  var stage = $('#gpStage'), name = $('#gpName'), desc = $('#gpDesc'), voice = $('#gpVoice'), art = $('#gpArt'), glyphs = [].slice.call(sec.querySelectorAll('.gp-glyph span'));
  var sig = [].slice.call(sec.querySelectorAll('.gp-sigil')), cur = -1, swapT = 0, force = null;

  function artHTML(s) {
    if (s.art) return '<img src="' + esc(s.art) + '" alt="Ilustración de ' + s.n + '" loading="lazy" decoding="async">';
    if (s.artCard) {
      var cs = document.querySelectorAll('.card-showcase .playing-card');
      for (var i = 0; i < cs.length; i++) { var nm = cs[i].querySelector('.card-name'), sv = cs[i].querySelector('.card-art svg'); if (nm && sv && nm.textContent.trim() === s.artCard) return '<div class="gp-svg">' + sv.outerHTML + '</div>'; }
    }
    return '';
  }
  function show(i, quiet) {
    i = (i + SINS.length) % SINS.length; if (i === cur) return;
    var s = SINS[i], first = cur < 0, dir = i > cur ? 1 : -1; cur = i;
    sec.style.setProperty('--c', s.c); sec.dataset.i = i;
    sig.forEach(function (b, j) { b.setAttribute('aria-selected', String(j === i)); b.tabIndex = j === i ? 0 : -1; });
    clearTimeout(swapT); stage.style.setProperty('--dir', dir);
    stage.classList.add('is-out');
    swapT = setTimeout(function () {
      name.textContent = s.n; desc.textContent = s.d; voice.textContent = '“' + s.v + '”';
      glyphs.forEach(function (g) { g.textContent = s.g; });
      art.innerHTML = artHTML(s) || '<div class="gp-lore" aria-hidden="true">' + s.g + '</div>';
      stage.classList.remove('is-out');
    }, first || reduceMotion ? 0 : 200);
    if (!first) { sec.classList.remove('is-shift'); void sec.offsetWidth; sec.classList.add('is-shift'); }
    if (!quiet) O(s.q, { expr: s.x, ms: 2800, force: true });
  }
  sec.querySelector('.gp-sigils').addEventListener('click', function (e) { var b = e.target.closest('.gp-sigil'); if (b) show(+b.dataset.i); });
  $('#gpPrev').addEventListener('click', function () { show(cur - 1); });
  $('#gpNext').addEventListener('click', function () { show(cur + 1); });
  sec.addEventListener('keydown', function (e) {
    if (!e.target.closest('.gp-sigils')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); sig[cur].focus(); } else if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); sig[cur].focus(); }
  });
  /* Swipe / arrastre horizontal sobre el escenario */
  var sd = null;
  stage.addEventListener('pointerdown', function (e) { sd = { x: e.clientX, y: e.clientY }; });
  stage.addEventListener('pointerup', function (e) { if (!sd) return; var dx = e.clientX - sd.x, dy = e.clientY - sd.y; sd = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(cur + (dx < 0 ? 1 : -1)); });
  stage.addEventListener('pointercancel', function () { sd = null; });

  /* Fuerzas: transforman visualmente la escena (una a la vez; volver a pulsar la apaga) */
  sec.querySelector('.gp-forces').addEventListener('click', function (e) {
    var b = e.target.closest('.gp-force'); if (!b) return;
    var k = b.dataset.f; force = force === k ? null : k;
    sec.classList.remove('f-cor', 'f-eco', 'f-pod'); if (force) sec.classList.add('f-' + force);
    [].forEach.call(sec.querySelectorAll('.gp-force'), function (x) { x.setAttribute('aria-pressed', String(x.dataset.f === force)); });
    if (force) O(FORCES[force][1], { expr: FORCES[force][2], ms: 2600, force: true });
  });
  $('#gpExplore').addEventListener('click', function () {
    var t = host.querySelector('.gehenna-lore-grid') || host; t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    O('Aquí está todo lo demás. Pasa con cuidado.', { expr: 'curious', force: true });
  });
  show(0, true);
})();

/* =========================================================
   TABGAME — DUELO ANTE LA CORTE (juego de cartas RECONSTRUIDO)
   El código del juego original (cartas, rondas, medidores, elecciones) ya no existía; se reconstruye con
   lo que la página conserva: las cartas de muestra (nombre, coste, ATK/DEF/DMG y efecto, leídos del HTML) y el
   texto de Gehenna (corrupción como motor, decidir cuándo avanzar o esperar, riesgo de perder el control).
   Reglas visibles en la propia sección. Constantes de equilibrio: ROUNDS, START_POWER, GAIN, MAX_CORR.
   Facciones con habilidad (por el pecado de la carta): Codicia = roba 2 de Corrupción al atacar · Envidia = copia la
   habilidad del personaje rival al entrar · Ira (Evento) = daño masivo; el tuyo sobrevive con más de 3 DEF.
========================================================= */
(function () {
  'use strict';
  var host = document.getElementById('proy-gehenna'), show = host && host.querySelector('.card-showcase');
  if (!show) return;
  var ROUNDS = 5, START_POWER = 10, START_CORR = 3, GAIN = 3, MAX_CORR = 10, TIMER = 650;

  /* cartas reales: se leen de las cartas de muestra del HTML */
  var CARDS = [].slice.call(show.querySelectorAll('.playing-card')).map(function (el) {
    var q = function (s) { var e = el.querySelector(s); return e ? e.textContent.trim() : ''; };
    var type = q('.card-type').split('·'), st = { ATK: 0, DEF: 0, DMG: 0 };
    [].forEach.call(el.querySelectorAll('.card-stat'), function (s) { var m = s.textContent.match(/(ATK|DEF|DMG)\s*(\d+)/); if (m) st[m[1]] = +m[2]; });
    return { name: q('.card-name'), cost: parseInt(q('.card-cost'), 10) || 0, kind: (type[0] || '').trim(), faction: (type[1] || '').trim(), effect: q('.card-effect'),
             atk: st.ATK, def: st.DEF, dmg: st.DMG, html: el.innerHTML.replace(/\sid="[^"]*"/g, '') };
  }).filter(function (c) { return c.name; });
  if (!CARDS.length) return;

  var O = function (t, o) { if (window.Obs) window.Obs.say(t, o || {}); };
  var sec = document.createElement('section');
  sec.className = 'gd'; sec.id = 'gehennaDuel';       /* sin .reveal: lo crea JS después de iniciar el observador de aparición */ sec.setAttribute('aria-label', 'Duelo ante la Corte');
  var side = function (k, n) {
    return '<div class="gd-side gd-' + k + '" data-side="' + k + '"><div class="gd-who"><b>' + n + '</b><span class="gd-pow-n"></span></div>' +
      '<div class="gd-bar" aria-hidden="true"><i></i></div>' +
      '<div class="gd-corr" aria-label="Corrupción"><em>Corrupción</em><span class="gd-pips" aria-hidden="true">' + new Array(MAX_CORR + 1).join('<i></i>') + '</span><span class="gd-corr-n"></span></div>' +
      '<div class="gd-field"></div></div>';
  };
  sec.innerHTML =
    '<div class="gehenna-section-title gd-title">Duelo ante la Corte</div>' +
    '<p class="gd-intro">Cinco rondas contra la Corte. La corrupción crece cada ronda: elige una carta… o espera. Gana quien conserve más Poder.</p>' +
    '<div class="gd-board">' + side('court', 'La Corte') +
      '<div class="gd-mid"><span class="gd-round" id="gdRound"></span><p class="gd-log" id="gdLog" aria-live="polite"></p></div>' + side('you', 'Tú') + '</div>' +
    '<div class="gd-hand" id="gdHand" role="group" aria-label="Tu mano"></div>' +
    '<div class="gd-over" id="gdOver" hidden><p id="gdResult"></p><button type="button" class="gd-btn" id="gdAgain">Jugar de nuevo</button></div>' +
    '<details class="gd-rules"><summary>Reglas del duelo</summary><ul>' +
      '<li>Cada bando empieza con ' + START_POWER + ' de Poder y ' + START_CORR + ' de Corrupción. Al inicio de cada ronda ambos ganan ' + GAIN + ' de Corrupción (máximo ' + MAX_CORR + ').</li>' +
      '<li>Elige una carta pagando su coste en Corrupción, o espera para ganar ' + GAIN + ' más. La Corte decide a la vez que tú.</li>' +
      '<li>Personaje: ocupa tu campo y ataca cada ronda. Daño al Poder rival = su ATK − la mitad de la DEF del personaje rival (mínimo 1). Sin rival en campo, todo el ATK.</li>' +
      '<li>Evento (Ira Absoluta): daño masivo a todos los personajes en juego; el tuyo sobrevive si tiene más de 3 DEF.</li>' +
      '<li>El Codicioso: al atacar roba 2 de Corrupción al oponente. La Envidiosa: al entrar copia la habilidad del personaje rival.</li>' +
      '<li>Si tu Corrupción llega a ' + MAX_CORR + ' pierdes el control: −2 de Poder y la Corrupción baja a 6.</li>' +
      '<li>Tras ' + ROUNDS + ' rondas gana quien tenga más Poder; si quedan igualados, es un empate.</li></ul></details>';
  show.after(sec);
  if (window.Obs) window.Obs.watch(sec, 'La Corte te espera. ¿Aceptas el duelo?');

  var $ = function (s) { return sec.querySelector(s); };
  var els = { you: $('.gd-you'), court: $('.gd-court') }, handEl = $('#gdHand'), logEl = $('#gdLog'), roundEl = $('#gdRound'), overEl = $('#gdOver'), resEl = $('#gdResult');
  var S, timers = [];
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
  var clear = function () { timers.forEach(clearTimeout); timers = []; };
  var other = function (k) { return k === 'you' ? 'court' : 'you'; };
  var label = function (k) { return k === 'you' ? 'Tú' : 'La Corte'; };
  var clampN = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  function fresh() { return { round: 0, busy: false, over: false, you: { p: START_POWER, c: START_CORR, f: null }, court: { p: START_POWER, c: START_CORR, f: null } }; }
  function steals(side) { var f = side.f; return !!f && (f.copy === 'steal' || f.card.faction === 'Codicia'); }

  function renderSide(k, hit) {
    var d = S[k], e = els[k];
    e.querySelector('.gd-pow-n').textContent = 'Poder ' + Math.max(0, d.p);
    e.querySelector('.gd-bar i').style.width = clampN(d.p / START_POWER * 100, 0, 100) + '%';
    [].forEach.call(e.querySelectorAll('.gd-pips i'), function (p, i) { p.classList.toggle('on', i < d.c); });
    e.querySelector('.gd-corr-n').textContent = d.c + '/' + MAX_CORR;
    var f = e.querySelector('.gd-field');
    f.textContent = '';
    if (d.f) {
      var n = document.createElement('b'); n.textContent = d.f.card.name;
      var s = document.createElement('span'); s.textContent = 'ATK ' + d.f.card.atk + ' · DEF ' + d.f.card.def + (steals(d) ? ' · roba' : '');
      f.appendChild(n); f.appendChild(s); f.classList.add('has');
    } else { f.textContent = 'Sin personaje'; f.classList.remove('has'); }
    if (hit) { e.classList.remove('is-hit'); void e.offsetWidth; e.classList.add('is-hit'); }
  }
  function renderAll() { renderSide('you'); renderSide('court'); roundEl.textContent = S.round ? 'Ronda ' + S.round + ' / ' + ROUNDS : ''; }

  function renderHand() {
    handEl.textContent = '';
    CARDS.forEach(function (card, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'playing-card gd-card'; b.innerHTML = card.html; b.disabled = S.busy || S.over || card.cost > S.you.c;
      b.setAttribute('aria-label', card.name + ', coste ' + card.cost + '. ' + card.effect);
      b.addEventListener('click', function () { play(card); });
      handEl.appendChild(b);
    });
    var w = document.createElement('button'); w.type = 'button'; w.className = 'gd-wait'; w.disabled = S.busy || S.over;
    w.innerHTML = '<b>Esperar</b><span>+' + GAIN + ' Corrupción<br>«Esperar también es una jugada.»</span>';
    w.addEventListener('click', function () { play(null); });
    handEl.appendChild(w);
  }

  function startRound() {
    S.round++; S.busy = false;
    S.you.c = Math.min(MAX_CORR, S.you.c + (S.round > 1 ? GAIN : 0)); S.court.c = Math.min(MAX_CORR, S.court.c + (S.round > 1 ? GAIN : 0));
    renderAll(); renderHand();
    logEl.textContent = S.round === 1 ? 'La Corte observa. Elige tu primera jugada.' : 'Nueva ronda: la corrupción crece.';
  }

  function courtPick() {                 /* la Corte elige entre lo que puede pagar; no gasta un evento si no hay personajes que dañar */
    var ok = CARDS.filter(function (c) { return c.cost <= S.court.c && (c.kind !== 'Evento' || S.you.f); });
    if (!ok.length || Math.random() < .12) return null;
    return ok[Math.floor(Math.random() * ok.length)];
  }

  function play(card) {
    if (S.busy || S.over) return;
    S.busy = true; renderHand();
    var cc = courtPick(), L = [];
    [['you', card], ['court', cc]].forEach(function (p) {
      var d = S[p[0]], cd = p[1];
      if (cd) { d.c -= cd.cost; L.push(label(p[0]) + ' juega ' + cd.name + '.'); }
      else { d.c = Math.min(MAX_CORR, d.c + GAIN); L.push(label(p[0]) + ' espera (+' + GAIN + ' Corrupción).'); }
    });
    renderAll(); logEl.textContent = L.join(' ');
    later(function () { resolve(card, cc); }, TIMER);
  }

  function resolve(yc, cc) {
    var L = [], played = { you: yc, court: cc }, hit = {};
    /* 1) eventos: daño masivo a todos los personajes en juego */
    ['you', 'court'].forEach(function (k) {
      var cd = played[k]; if (!cd || cd.kind !== 'Evento') return;
      [k, other(k)].forEach(function (t) {
        var f = S[t].f; if (!f) return;
        if (t === k && f.card.def > 3) L.push(f.card.name + ' resiste el daño (DEF ' + f.card.def + ').');
        else { L.push(f.card.name + ' cae ante ' + cd.name + '.'); S[t].f = null; }
      });
    });
    /* 2) personajes entran en juego; la Envidia copia la habilidad del personaje rival */
    ['you', 'court'].forEach(function (k) { var cd = played[k]; if (cd && cd.kind === 'Personaje') S[k].f = { card: cd, copy: null }; });
    ['you', 'court'].forEach(function (k) {
      var f = S[k].f, cd = played[k], r = S[other(k)];
      if (f && cd && cd.faction === 'Envidia' && r.f && steals(r)) { f.copy = 'steal'; L.push(f.card.name + ' copia la habilidad de ' + r.f.card.name + '.'); }
    });
    /* 3) combate */
    ['you', 'court'].forEach(function (k) {
      var f = S[k].f; if (!f) return;
      var r = S[other(k)], dmg = r.f ? Math.max(1, f.card.atk - Math.floor(r.f.card.def / 2)) : f.card.atk;   /* la DEF absorbe la mitad (mínimo 1 de daño) */
      r.p -= dmg; hit[other(k)] = true;
      L.push(label(k) + ': ' + f.card.name + ' ataca (' + dmg + ' de daño' + (r.f ? ', DEF ' + r.f.card.def : '') + ').');
      if (steals(S[k]) && r.c > 0) { var t = Math.min(2, r.c); r.c -= t; S[k].c = Math.min(MAX_CORR, S[k].c + t); L.push(label(k) + ' roba ' + t + ' de Corrupción.'); }
    });
    /* 4) perder el control */
    ['you', 'court'].forEach(function (k) {
      if (S[k].c >= MAX_CORR) { S[k].p -= 2; S[k].c = 6; hit[k] = true; L.push(label(k) + ' pierde el control: −2 de Poder.'); }
    });
    renderSide('you', hit.you); renderSide('court', hit.court);
    logEl.textContent = L.join(' ');
    var dead = S.you.p <= 0 || S.court.p <= 0;
    if (dead || S.round >= ROUNDS) later(finish, 1100); else later(startRound, 1400);
  }

  function finish() {
    S.over = true; renderHand();
    var y = S.you.p, c = S.court.p, win = y > c, tie = y === c;
    var msg = win ? 'Ascendiste: la Corte te reconoce con ' + y + ' de Poder frente a ' + Math.max(0, c) + '.'
            : tie ? 'Empate: nadie asciende todavía.'
            : 'La Corte juzga… y gana (' + Math.max(0, c) + ' frente a ' + Math.max(0, y) + ').';
    resEl.textContent = msg; overEl.hidden = false; logEl.textContent = '';
    O(win ? 'Ascendiste. Por ahora.' : tie ? 'Un empate… la Corte espera.' : 'La Corte juzga. Y gana.', { expr: win ? 'happy' : 'sly', ms: 4200 });
  }
  function reset() { clear(); S = fresh(); overEl.hidden = true; startRound(); }
  $('#gdAgain').addEventListener('click', reset);
  reset();
})();

/* =========================================================
   SOBRE MÍ — CARTAS DE JUEGO
   Los bloques EXISTENTES (identidad, programas, intereses, formación, proyectos) se mueven (no se reescriben)
   a cartas coleccionables: marco, categoría, número, gemas y pie. Sin información nueva: categorías y conteos
   salen del contenido ya escrito.
   - Ratón: inclinación 3D según el cursor + luz/reflejo que lo siguen + elevación.
   - Táctil: no depende del cursor. Un toque inclina la carta hacia el dedo un instante y abre/cierra la carta;
     la carta abierta queda "levantada". El desplazamiento de la página nunca se bloquea.
   - Teclado: las cartas vivas son enfocables (Enter / Espacio abre y cierra, Esc cierra).
   - Identidad, Formación y Proyectos: clic / Enter = se abre y revela el resto (una a la vez).
   - Programas e Intereses ya se ven completos: solo reaccionan al cursor (no son botones).
========================================================= */
(function () {
  'use strict';
  var side = document.querySelector('#layer-sobre .about-side'); if (!side) return;
  var bio = side.querySelectorAll('.about-bio-grid > .about-block');
  var MAX = 9;   /* inclinación máxima en grados (abierta: menos, para no estorbar la lectura) */

  /* Emblemas de categoría (trazo simple, 24×24) */
  var ICON = {
    id:    '<path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/>',
    tools: '<path d="M3 21l3.5-.8L19 7.7a2.1 2.1 0 0 0-3-3L3.8 17.2 3 21z"/><path d="M14.5 6.5l3 3"/>',
    int:   '<path d="M5 19C5 10 10 4 20 4c0 10-6 15-15 15z"/><path d="M5 19c3-5 6-8 11-11"/>',
    form:  '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V5.5"/><path d="M9 7h7"/>',
    proj:  '<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>'
  };
  var svg = function (k) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICON[k] + '</svg>'; };

  /* Intereses: el párrafo "A · B · C." pasa a etiquetas. El texto de cada interés es el mismo. */
  var intP = bio[1] && bio[1].querySelector('.about-text'), tagCount = 0;
  if (intP) {
    var parts = intP.textContent.split('·').map(function (t) { return t.replace(/[.\s]+$/, '').replace(/^\s+/, ''); }).filter(Boolean);
    if (parts.length) {
      intP.setAttribute('data-text', intP.textContent.replace(/\s+/g, ' ').trim());
      intP.classList.add('ab-tags'); intP.setAttribute('role', 'list'); intP.textContent = '';
      parts.forEach(function (t) { var s = document.createElement('span'); s.className = 'ab-tag'; s.setAttribute('role', 'listitem'); s.textContent = t; intP.appendChild(s); });
      tagCount = parts.length;
    }
  }
  var count = function (sel) { return side.querySelectorAll(sel).length; };

  /* [elemento, clave, categoría, ¿se abre?, gemas, texto del pie] — el orden define la composición */
  var items = [
    [side.querySelector('.about-identity-card'), 'id',    'Clase',      true,  0,                  'Ilustrador · Creador visual'],
    [bio[0],                                      'tools', 'Arsenal',    false, count('.tool-card'),      count('.tool-card') + ' programas'],
    [bio[1],                                      'int',   'Afinidades', false, Math.min(tagCount, 5),    tagCount + ' intereses'],
    [side.querySelector('.about-formation'),      'form',  'Saber',      true,  count('.formation-line'), count('.formation-line') + ' formaciones'],
    [side.querySelector('.about-projects'),       'proj',  'Misiones',   true,  count('.about-project'),  count('.about-project') + ' proyectos']
  ];
  var live = items.filter(function (it) { return it[0]; });
  var total = live.length;

  var deck = document.createElement('div'); deck.className = 'ab-deck';
  var cards = [], n = 0, DEAL = ['-4deg', '3deg', '-3deg', '4deg', '-2deg'];
  items.forEach(function (it) {
    var el = it[0]; if (!el) return; var key = it[1], open = it[3];
    var card = document.createElement('article'); card.className = 'ab-card ab-' + key;
    card.style.setProperty('--i', n); card.style.setProperty('--deal', DEAL[n % DEAL.length]); n++;
    card.innerHTML =
      '<div class="ab-tilt"><div class="ab-face">' +
        '<span class="ab-mark" aria-hidden="true">' + svg(key) + '</span>' +
        '<header class="ab-top"><span class="ab-cat">' + svg(key) + it[2] + '</span>' +
          '<span class="ab-num" aria-hidden="true">' + String(n).padStart(2, '0') + '<small> / ' + String(total).padStart(2, '0') + '</small></span></header>' +
        '<footer class="ab-foot"><span class="ab-meta">' +
          (it[4] ? '<span class="ab-gems" aria-hidden="true">' + new Array(it[4] + 1).join('<i class="ab-gem"></i>') + '</span>' : '') + it[5] + '</span>' +
          (open ? '<span class="ab-hint" aria-hidden="true"><span class="ab-hint-t">Revelar</span><i class="ab-toggle"></i></span>' : '') +
        '</footer>' +
      '</div><i class="ab-glare" aria-hidden="true"></i><i class="ab-foil" aria-hidden="true"></i></div>';
    card.querySelector('.ab-face').insertBefore(el, card.querySelector('.ab-foot'));
    if (open) {
      card.classList.add('is-live'); card.tabIndex = 0; card.setAttribute('role', 'button'); card.setAttribute('aria-expanded', 'false');
      card.setAttribute('aria-label', it[2] + ': ' + (card.querySelector('.about-card-label') ? card.querySelector('.about-card-label').textContent.trim() : 'sobre mí') + '. Activar para revelar más.');
    }
    deck.appendChild(card); cards.push(card);
  });
  /* ---------- Contacto: el mismo lenguaje de carta (Correo · Instagram). Los enlaces y el botón se MUEVEN, no se reescriben ---------- */
  var chans = [].slice.call(document.querySelectorAll('#sobreContacto .contact-channel')), cdeck = null;
  if (chans.length) {
    ICON.mail = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>';
    ICON.ig = '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".6"/>';
    cdeck = document.createElement('div'); cdeck.className = 'ab-deck ab-deck--contact';
    var holder = chans[0].parentNode;
    chans.forEach(function (el, i) {
      var lab = el.querySelector('.contact-label'), name = lab ? lab.textContent.trim() : 'Contacto', key = /instagram/i.test(name) ? 'ig' : 'mail';
      var card = document.createElement('article'); card.className = 'ab-card ab-' + key;
      card.style.setProperty('--i', i); card.style.setProperty('--deal', DEAL[i % DEAL.length]);
      card.innerHTML =
        '<div class="ab-tilt"><div class="ab-face">' +
          '<span class="ab-mark" aria-hidden="true">' + svg(key) + '</span>' +
          '<header class="ab-top"><span class="ab-cat">' + svg(key) + name + '</span>' +
            '<span class="ab-num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '<small> / ' + String(chans.length).padStart(2, '0') + '</small></span></header>' +
          '<footer class="ab-foot"><span class="ab-meta">' + (key === 'mail' ? 'Escríbeme directamente' : 'Perfil de Instagram') + '</span></footer>' +
        '</div><i class="ab-glare" aria-hidden="true"></i><i class="ab-foil" aria-hidden="true"></i></div>';
      card.querySelector('.ab-face').insertBefore(el, card.querySelector('.ab-foot'));
      if (lab) lab.hidden = true;                               /* el nombre ya está en la etiqueta de la carta */
      cdeck.appendChild(card); cards.push(card);
    });
    holder.replaceWith(cdeck);
    if (reduceMotion || !('IntersectionObserver' in window)) cdeck.classList.add('is-dealt');
    else new IntersectionObserver(function (en, io) { if (en[0].isIntersecting) { cdeck.classList.add('is-dealt'); io.disconnect(); } }, { threshold: .12 }).observe(cdeck);
  }
  if (!cards.length) return;
  side.insertBefore(deck, side.firstChild);
  var emptyGrid = side.querySelector('.about-bio-grid'); if (emptyGrid && !emptyGrid.children.length) emptyGrid.hidden = true;

  /* ---------- Reparto al entrar en pantalla ---------- */
  function deal() { deck.classList.add('is-dealt'); }
  if (reduceMotion || !('IntersectionObserver' in window)) deal();
  else new IntersectionObserver(function (en, io) { if (en[0].isIntersecting) { deal(); io.disconnect(); } }, { threshold: .12 }).observe(deck);

  /* ---------- Abrir / cerrar (una a la vez) ---------- */
  function setOpen(c, on) {
    c.classList.toggle('is-open', on); c.setAttribute('aria-expanded', String(on));
    var t = c.querySelector('.ab-hint-t'); if (t) t.textContent = on ? 'Cerrar' : 'Revelar';
    tilt(c, null);
  }
  deck.addEventListener('click', function (e) {
    var c = e.target.closest('.ab-card.is-live'); if (!c) return;
    var on = !c.classList.contains('is-open');
    cards.forEach(function (o) { if (o !== c && o.classList.contains('is-live')) setOpen(o, false); });
    setOpen(c, on);
  });
  deck.addEventListener('keydown', function (e) {
    var c = e.target.closest && e.target.closest('.ab-card.is-live'); if (!c || e.target !== c) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
    else if (e.key === 'Escape' && c.classList.contains('is-open')) { e.stopPropagation(); setOpen(c, false); }   /* primero cierra la carta; otro Esc cierra la capa */
  });

  /* ---------- Inclinación 3D + luz (un cálculo por frame, solo variables CSS) ---------- */
  var raf = 0, pend = null;
  function tilt(c, p) {   /* p = {x,y} en 0…1 dentro de la carta, o null = reposo */
    if (!p || reduceMotion) {
      c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); c.style.setProperty('--px', '0'); c.style.setProperty('--py', '0');
      if (!p) { c.style.setProperty('--gx', '50%'); c.style.setProperty('--gy', '30%'); }
      return;
    }
    var m = c.classList.contains('is-open') ? MAX * .45 : MAX;
    c.style.setProperty('--ry', ((p.x - .5) * 2 * m).toFixed(2) + 'deg');
    c.style.setProperty('--rx', (-(p.y - .5) * 2 * m).toFixed(2) + 'deg');
    c.style.setProperty('--px', ((p.x - .5) * 2).toFixed(3)); c.style.setProperty('--py', ((p.y - .5) * 2).toFixed(3));
    c.style.setProperty('--gx', (p.x * 100).toFixed(1) + '%'); c.style.setProperty('--gy', (p.y * 100).toFixed(1) + '%');
  }
  function pos(c, e) { var b = c.getBoundingClientRect(); return { x: Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)), y: Math.min(1, Math.max(0, (e.clientY - b.top) / b.height)) }; }
  function frame() { raf = 0; if (pend) { tilt(pend.c, pend.p); pend = null; } }
  function queue(c, e) { pend = { c: c, p: pos(c, e) }; if (!raf) raf = requestAnimationFrame(frame); }
  function leave(c) { c.classList.remove('is-hot', 'is-tracking'); tilt(c, null); }

  cards.forEach(function (c) {
    c.addEventListener('pointerenter', function (e) { if (e.pointerType === 'touch') return; c.classList.add('is-hot', 'is-tracking'); queue(c, e); });
    c.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; if (!c.classList.contains('is-hot')) c.classList.add('is-hot', 'is-tracking'); queue(c, e); }, { passive: true });
    c.addEventListener('pointerleave', function (e) { if (e.pointerType === 'touch') return; leave(c); });
    /* táctil: un toque inclina la carta hacia el dedo un momento; no bloquea el scroll (no hay preventDefault) */
    c.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'touch') return;
      c.classList.add('is-hot', 'is-tracking'); tilt(c, pos(c, e));
      clearTimeout(c.__t); c.__t = setTimeout(function () { c.classList.remove('is-tracking'); tilt(c, null); if (!c.classList.contains('is-open')) c.classList.remove('is-hot'); }, 520);
    }, { passive: true });
    c.addEventListener('pointercancel', function () { leave(c); });
  });
  /* si la carta tocada no es "viva", se quita el estado al tocar fuera */
  document.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch' && !e.target.closest('.ab-card')) cards.forEach(function (c) { if (!c.classList.contains('is-open')) leave(c); }); }, { passive: true });
  /* al cerrar la capa se sueltan todas */
  var _close = window.closeLayer;
  if (typeof _close === 'function') window.closeLayer = function () { cards.forEach(function (c) { if (c.classList.contains('is-live')) setOpen(c, false); leave(c); }); return _close.apply(this, arguments); };
})();
