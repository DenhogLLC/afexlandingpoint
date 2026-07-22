const NAV_HOME_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' +
  '</svg>';

const NAV_PAGES = [
  { label:'Home',         href:'index.html', icon:NAV_HOME_ICON },
  { label:'Forms',        href:'pages/forms.html' },
  { label:'School',       href:'pages/school.html' },
  { label:'Scripts',      href:'pages/scripts.html' },
  { label:'Resources',    href:'pages/resources.html' },
  { label:'Compensation', href:'pages/compensation.html' }
];

function buildNav(activeLabel, hrefPrefix){
  const prefix = hrefPrefix || '';
  const links = NAV_PAGES.map(p=>{
    const isActive = p.label === activeLabel;
    if(p.icon){
      const cls = 'nav-ico' + (isActive ? ' active' : '');
      return '<a href="'+prefix+p.href+'" class="'+cls+'" aria-label="'+p.label+'">'+p.icon+'</a>';
    }
    const cls = isActive ? ' class="active"' : '';
    return '<a href="'+prefix+p.href+'"'+cls+'>'+p.label+'</a>';
  }).join('');

  return ''+
    '<nav class="nav" aria-label="Main navigation">' +
      '<a href="'+prefix+'index.html" class="nav-logo" role="img" aria-label="AFEX home"></a>' +
      '<div class="nav-links">'+links+'</div>' +
      '<button class="nav-bell" id="navBell" aria-label="Notifications">' +
        '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
          '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>' +
        '<span class="nav-bell-dot" id="navBellDot"></span>' +
      '</button>' +
    '</nav>';
}

function mountNav(activeLabel, hrefPrefix){
  const slot = document.getElementById('nav-slot');
  if(slot) slot.outerHTML = buildNav(activeLabel, hrefPrefix);
}

function setNavTrail(label){
  const links = document.querySelector('.nav-links');
  if(!links) return;
  const school = Array.from(links.querySelectorAll('a')).find(a=> a.textContent.trim() === 'School');
  if(!school) return;

  let trail = document.getElementById('navTrail');
  if(!trail){
    trail = document.createElement('span');
    trail.className = 'nav-trail';
    trail.id = 'navTrail';
    trail.innerHTML =
      '<span class="nav-trail-line" aria-hidden="true"></span>'+
      '<span class="nav-trail-tab" id="navTrailTab"></span>';
    school.insertAdjacentElement('afterend', trail);
  }
  document.getElementById('navTrailTab').textContent = label;
  school.classList.add('faded');
  requestAnimationFrame(()=>{ trail.classList.add('on'); });
}

function clearNavTrail(){
  const trail = document.getElementById('navTrail');
  const links = document.querySelector('.nav-links');
  if(links){
    const school = Array.from(links.querySelectorAll('a')).find(a=> a.textContent.trim() === 'School');
    if(school) school.classList.remove('faded');
  }
  if(!trail) return;
  trail.classList.remove('on');
  setTimeout(()=>{ if(trail && !trail.classList.contains('on')) trail.remove(); }, 420);
}

if('scrollRestoration' in history){ history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);

function initPdfModal(){
  if(document.getElementById('pdfModal')) return;
  const wrap = document.createElement('div');
  wrap.className = 'pdfmodal';
  wrap.id = 'pdfModal';
  wrap.setAttribute('role','dialog');
  wrap.setAttribute('aria-modal','true');
  wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML =
    '<div class="pdfmodal-scrim" id="pdfScrim"></div>'+
    '<div class="pdfmodal-shell">'+
      '<div class="pdfmodal-bar">'+
        '<span class="pdfmodal-title" id="pdfTitle"></span>'+
        '<button class="pdfmodal-close" id="pdfClose" aria-label="Close">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>'+
        '</button>'+
      '</div>'+
      '<iframe class="pdfmodal-frame" id="pdfFrame" title="Document preview"></iframe>'+
      '<div class="pdfmodal-foot">'+
        '<a class="pdfmodal-pop" id="pdfPop" target="_blank" rel="noopener">'+
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'+
          'Open in new tab'+
        '</a>'+
      '</div>'+
    '</div>';
  document.body.appendChild(wrap);

  const closeBtn = document.getElementById('pdfClose');
  const scrim = document.getElementById('pdfScrim');
  closeBtn.addEventListener('click', closePdf);
  scrim.addEventListener('click', closePdf);
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') closePdf(); });
}

let pdfLastFocus = null;

function openPdf(url, title){
  initPdfModal();
  pdfLastFocus = document.activeElement;
  document.getElementById('pdfFrame').src = url;
  document.getElementById('pdfPop').href = url;
  document.getElementById('pdfTitle').textContent = title || '';
  const m = document.getElementById('pdfModal');
  m.setAttribute('aria-hidden','false');
  m.classList.add('on');
  document.body.classList.add('pdf-open');
  document.getElementById('pdfClose').focus();
}

function closePdf(){
  const m = document.getElementById('pdfModal');
  if(!m || !m.classList.contains('on')) return;
  m.classList.remove('on');
  m.setAttribute('aria-hidden','true');
  document.body.classList.remove('pdf-open');
  setTimeout(()=>{ const f = document.getElementById('pdfFrame'); if(f) f.src = ''; }, 350);
  if(pdfLastFocus) pdfLastFocus.focus();
}

document.addEventListener('click', function(e){
  const a = e.target.closest('a[href$=".pdf"]');
  if(!a) return;
  if(a.id === 'pdfPop' || a.closest('.pdfmodal')) return;
  e.preventDefault();
  const name = a.querySelector('.doc-name');
  openPdf(a.getAttribute('href'), name ? name.textContent : '');
});
