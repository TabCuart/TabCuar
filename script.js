
// LOADER
window.addEventListener('load',()=>{setTimeout(()=>{document.getElementById('loader').classList.add('hidden');},2000);});

// CURSOR
const cur=document.getElementById('cursor'),ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function animR(){rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(animR);})();
document.querySelectorAll('a,button,.gallery-item,.division-card,.store-card,.lab-big-card,.playing-card,.sin-card,.fish-slot,.plant-card,.about-portrait,.curioso-card,.aqua-tab').forEach(el=>{
  el.addEventListener('mouseenter',()=>{ring.style.width='50px';ring.style.height='50px';ring.style.borderColor='rgba(155,109,255,.65)';});
  el.addEventListener('mouseleave',()=>{ring.style.width='32px';ring.style.height='32px';ring.style.borderColor='rgba(155,109,255,.4)';});
});

// SCROLL REVEAL
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});},{threshold:.07,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// GALLERY FILTER
function filterGallery(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.gallery-item').forEach(item=>{
    const show=cat==='all'||item.dataset.cat===cat;
    item.style.opacity=show?'1':'0.12';
    item.style.filter=show?'none':'grayscale(100%)';
    item.style.transition='all .4s cubic-bezier(.23,1,.32,1)';
  });
}

// AQUA TABS
function switchTab(id,btn){
  document.querySelectorAll('.aqua-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.aqua-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+id).classList.add('active');
}

// Trigger upload gallery
function triggerUpload(item){item.querySelector('input[type=file]').click();}

// Hero image
function loadHeroImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const wrap=input.closest('.hero-img-upload');
    let img=wrap.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';wrap.appendChild(img);}
    img.src=e.target.result;
    wrap.querySelectorAll('.hero-upload-ring,.hero-upload-lbl,.hero-upload-sub').forEach(el=>el.style.display='none');
  };
  r.readAsDataURL(input.files[0]);
}

// Division img
function loadDivImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const slot=input.closest('.div-img-slot');
    let img=slot.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';slot.appendChild(img);}
    img.src=e.target.result;
    const ic=slot.querySelector('.div-up-icon');
    if(ic)ic.style.display='none';
  };
  r.readAsDataURL(input.files[0]);
}

// Gallery
function loadGalleryImage(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const item=input.closest('.gallery-item');
    let img=item.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';item.appendChild(img);}
    img.src=e.target.result;
    const ph=item.querySelector('.upload-placeholder');if(ph)ph.style.display='none';
  };
  r.readAsDataURL(input.files[0]);
}

// Fish
function loadFishImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const slot=input.closest('.fish-slot');
    let img=slot.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';slot.appendChild(img);}
    img.src=e.target.result;
    slot.querySelectorAll('.fish-up-icon,.fish-lbl').forEach(el=>el.style.display='none');
  };
  r.readAsDataURL(input.files[0]);
}

// Plants
function loadPlantImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const wrap=input.closest('.plant-img');
    let img=wrap.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';wrap.appendChild(img);}
    img.src=e.target.result;
    const ic=wrap.querySelector('.pup-icon');if(ic)ic.style.display='none';
  };
  r.readAsDataURL(input.files[0]);
}

// Store
function loadStoreImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const wrap=input.closest('.store-img');
    let img=wrap.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';wrap.appendChild(img);}
    img.src=e.target.result;
    const ph=wrap.querySelector('.upload-placeholder');if(ph)ph.style.display='none';
  };
  r.readAsDataURL(input.files[0]);
}

// Portrait
function loadPortraitImg(input){
  if(!input.files||!input.files[0])return;
  const r=new FileReader();
  r.onload=e=>{
    const portrait=input.closest('.about-portrait');
    let img=portrait.querySelector('img.uploaded');
    if(!img){img=document.createElement('img');img.className='uploaded';portrait.appendChild(img);}
    img.src=e.target.result;
    const ph=portrait.querySelector('.upload-placeholder');if(ph)ph.style.display='none';
  };
  r.readAsDataURL(input.files[0]);
}

// Form
function handleSubmit(e){
  e.preventDefault();const btn=e.target;
  btn.textContent='Enviado ✓';btn.style.color='var(--accent-aqua)';btn.style.borderColor='var(--accent-aqua)';
  setTimeout(()=>{btn.textContent='Enviar mensaje';btn.style.color='';btn.style.borderColor='';},3000);
}

// Parallax bg-text
window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  document.querySelectorAll('.bg-text').forEach(el=>{el.style.transform=`translateY(calc(-50% + ${y*.03}px))`;});
});

// EMBERS — CSS animated particles for Gehenna
(function createEmbers(){
  const container=document.getElementById('embers');
  if(!container)return;
  const colors=['rgba(220,80,20,','rgba(200,50,10,','rgba(240,120,40,','rgba(180,40,10,'];
  for(let i=0;i<30;i++){
    const e=document.createElement('div');
    e.className='ember';
    const size=Math.random()*3+1;
    const color=colors[Math.floor(Math.random()*colors.length)];
    const dur=Math.random()*15+8;
    const delay=Math.random()*20;
    const x=Math.random()*100;
    const dx=(Math.random()-0.5)*200;
    e.style.cssText=`width:${size}px;height:${size}px;left:${x}%;bottom:0;background:${color}0.8);box-shadow:0 0 ${size*3}px ${color}0.5);animation-duration:${dur}s;animation-delay:${delay}s;--dx:${dx}px;`;
    container.appendChild(e);
  }
})();
