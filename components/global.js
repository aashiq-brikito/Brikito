(function(){
  const base = document.currentScript && document.currentScript.dataset.base ? document.currentScript.dataset.base : '';
  // Site-wide tracking (Meta Pixel / Google Analytics)
  const tracking=document.createElement('script');tracking.src=base+'components/tracking.js';document.head.appendChild(tracking);
  function load(selector, url, position){
    const target=document.querySelector(selector);
    if(!target) return Promise.resolve();
    return fetch(base + url, {cache:'no-cache'}).then(r=>{if(!r.ok) throw new Error('Could not load '+url);return r.text();}).then(html=>{target.insertAdjacentHTML(position,html);target.remove();}).catch(err=>console.error('[Brikito shared layout]',err));
  }
  Promise.all([
    load('[data-global-header]', 'components/header.html', 'beforebegin'),
    load('[data-global-footer]', 'components/footer.html', 'beforebegin')
  ]).then(()=>{
    const toggle=document.querySelector('.global-menu-toggle');
    const nav=document.querySelector('.global-nav');
    if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');});}
    document.querySelectorAll('.global-dd').forEach(dd=>{
      const btn=dd.querySelector('.global-dd-btn');
      if(!btn) return;
      const set=open=>{dd.classList.toggle('is-open',open);btn.setAttribute('aria-expanded',String(open));};
      btn.addEventListener('click',e=>{e.stopPropagation();set(!dd.classList.contains('is-open'));});
      document.addEventListener('click',e=>{if(!dd.contains(e.target)) set(false);});
      document.addEventListener('keydown',e=>{if(e.key==='Escape'){set(false);btn.focus();}});
      dd.addEventListener('focusout',e=>{if(!dd.contains(e.relatedTarget)) set(false);});
    });
    const year=document.getElementById('global-year'); if(year) year.textContent=new Date().getFullYear();
  });
})();
