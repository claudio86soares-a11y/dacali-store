document.querySelectorAll('nav a, .footer-links a, .btn').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
    const target = link.getAttribute('href');
    const navItem = document.querySelector(`nav a[href="${target}"]`);
    if (navItem) navItem.classList.add('active');
  });
});

const search = document.querySelector('.search input');
search?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && search.value.trim()) {
    alert(`Busca por: ${search.value.trim()}`);
  }
});
