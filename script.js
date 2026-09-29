document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  /* Menu mobile */
  const toggle = $(".menu-toggle");
  const menu = $(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$('a', menu).forEach(link => link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  /* Cabeçalho com efeito ao rolar */
  const header = $(".header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 18);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Barra de progresso de leitura */
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.prepend(progress);
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* Animações de entrada sem bloquear o conteúdo */
  const revealItems = $$('[data-reveal]');
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  /* Navegação ativa por seção */
  const navLinks = $$('.menu a[href^="#"]');
  const sections = navLinks.map(link => $(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(section => navObserver.observe(section));
  }

  /* Hero: troca suave das imagens sem alterar a estrutura */
  const heroMain = $(".hero-main img");
  if (heroMain) {
    const heroImages = [
      ["thermo-booster.webp", "Fluido térmico Thermo Booster"],
      ["cortina-blackout-cinza.webp", "Cortina Blackout DaCaLi Store"],
      ["kit-eudora-club6.webp", "Kit Eudora Club 6"]
    ];
    let index = 0;
    setInterval(() => {
      index = (index + 1) % heroImages.length;
      heroMain.classList.add("is-changing");
      window.setTimeout(() => {
        heroMain.src = heroImages[index][0];
        heroMain.alt = heroImages[index][1];
        heroMain.classList.remove("is-changing");
      }, 260);
    }, 5200);
  }

  /* Botão voltar ao topo */
  const backTop = $(".back-to-top");
  if (backTop) {
    const toggleTop = () => backTop.classList.toggle("show", window.scrollY > 500);
    window.addEventListener("scroll", toggleTop, { passive: true });
    toggleTop();
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* Ano automático do rodapé */
  $$(".copyright").forEach(el => {
    el.innerHTML = el.innerHTML.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
  });

  /* Catálogo: filtros e busca */
  const filters = $$(".filter");
  const cards = $$(".product-card");
  const search = $("#search");
  const empty = $("#emptyState");
  const count = $("#catalogCount");
  const selectedImage = $("#selectedCategoryImage");
  const selectedTitle = $("#selectedCategoryTitle");
  const selectedText = $("#selectedCategoryText");
  const categoryData = {
    todos:{title:"Todos os produtos",text:"Explore nossa seleção completa. Clique em uma categoria para ver somente os produtos daquele segmento.",image:"jogo-cama.jpg"},
    "cama-mesa-banho":{title:"Cama, Mesa e Banho",text:"Jogos de cama, mantas, cortinas, edredons e itens para deixar sua casa mais confortável.",image:"cortina-blackout-cinza.webp"},
    beleza:{title:"Beleza",text:"Perfumes, maquiagem e cuidados capilares para sua rotina de beleza.",image:"thermo-booster.webp"},
    casa:{title:"Casa e Cozinha",text:"Panelas e utilidades para tornar o dia a dia mais prático.",image:"panelas-ruby.jpg"},
    presentes:{title:"Presentes",text:"Opções para surpreender em aniversários, datas especiais e momentos importantes.",image:"kit-presente-banho.webp"},
    brinquedos:{title:"Brinquedos",text:"Pelúcias e itens divertidos para presentear crianças e fãs de personagens.",image:"pelucia-stitch.webp"},
    alimentos:{title:"Alimentos",text:"Produtos selecionados para sua despensa e para o dia a dia.",image:"chi-mifen-arroz.jpg"}
  };
  const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  function filterProducts(){
    if (!cards.length) return;
    const active = $(".filter.active")?.dataset.filter || "todos";
    const term = norm(search?.value).trim();
    let visible = 0;
    cards.forEach(card => {
      const okCat = active === "todos" || card.dataset.category === active;
      const okName = !term || norm(card.dataset.name).includes(term) || norm(card.textContent).includes(term);
      const show = okCat && okName;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = `${visible} ${visible === 1 ? "produto" : "produtos"}`;
  }
  function setCategory(category, updateHash = true){
    const active = categoryData[category] ? category : "todos";
    filters.forEach(x => x.classList.toggle("active", x.dataset.filter === active));
    if (selectedImage) { selectedImage.src = categoryData[active].image; selectedImage.alt = categoryData[active].title; }
    if (selectedTitle) selectedTitle.textContent = categoryData[active].title;
    if (selectedText) selectedText.textContent = categoryData[active].text;
    if (updateHash) history.replaceState(null, "", active === "todos" ? location.pathname + location.search : `${location.pathname}#${active}`);
    filterProducts();
  }
  filters.forEach(btn => btn.addEventListener("click", () => {
    setCategory(btn.dataset.filter, true);
    $(".catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  search?.addEventListener("input", filterProducts);
  const hash = decodeURIComponent(location.hash.replace("#", ""));
  setCategory(categoryData[hash] ? hash : "todos", false);
  if (hash && categoryData[hash]) setTimeout(() => $(".catalog")?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);

  /* Carrossel de categorias: setas no computador + arraste no toque/mouse */
  const track = $("#categoryTrack");
  if (track) {
    const prev = $(".carousel-arrow.prev");
    const next = $(".carousel-arrow.next");
    const move = dir => track.scrollBy({ left: dir * Math.min(track.clientWidth * .78, 620), behavior: "smooth" });
    prev?.addEventListener("click", () => move(-1));
    next?.addEventListener("click", () => move(1));

    let dragging = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener("pointerdown", e => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture?.(e.pointerId);
    });
    track.addEventListener("pointermove", e => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    const stopDrag = e => {
      if (!dragging) return;
      dragging = false; track.classList.remove("is-dragging");
      if (moved) {
        track.dataset.justDragged = "true";
        window.setTimeout(() => delete track.dataset.justDragged, 80);
      }
      try { track.releasePointerCapture?.(e.pointerId); } catch (_) {}
    };
    track.addEventListener("pointerup", stopDrag);
    track.addEventListener("pointercancel", stopDrag);
    track.addEventListener("click", e => {
      if (track.dataset.justDragged === "true") { e.preventDefault(); e.stopPropagation(); }
    }, true);

    const updateArrows = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
    };
    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();
  }
});
