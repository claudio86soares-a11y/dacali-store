/* DaCaLi Store — interações compartilhadas */
(function(){
  'use strict';
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.menu');
  const header=document.querySelector('.header');
  if(toggle&&menu){
    const close=()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');};
    const open=()=>{menu.classList.add('open');toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Fechar menu');};
    toggle.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();menu.classList.contains('open')?close():open();});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('click',e=>{if(menu.classList.contains('open')&&!menu.contains(e.target)&&e.target!==toggle)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
    window.addEventListener('resize',()=>{if(window.innerWidth>900)close();});
  }
  if(header){
    const onScroll=()=>header.classList.toggle('scrolled',window.scrollY>18);
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }
  // Fail-safe: content must never disappear if an animation observer is unavailable.
  document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('is-visible'));
})();
