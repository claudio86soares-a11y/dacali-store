/* DaCaLi Store — interações compartilhadas do cabeçalho */
(function(){
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');
  if (!toggle || !menu) return;
  const close = () => {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menu');
  };
  const open = () => {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Fechar menu');
  };
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.contains('open') ? close() : open();
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('click', event => {
    if (menu.classList.contains('open') && !menu.contains(event.target) && event.target !== toggle) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) close();
  });
})();
