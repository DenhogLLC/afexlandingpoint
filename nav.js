const NAV_PAGES = [
  { label:'Home',         href:'index.html' },
  { label:'Forms',        href:'pages/forms.html' },
  { label:'School',       href:'pages/school.html' },
  { label:'Scripts',      href:'pages/scripts.html' },
  { label:'Resources',    href:'pages/resources.html' },
  { label:'Compensation', href:'pages/compensation.html' }
];

function buildNav(activeLabel, hrefPrefix){
  const prefix = hrefPrefix || '';
  const links = NAV_PAGES.map(p=>{
    const cls = p.label === activeLabel ? ' class="active"' : '';
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
