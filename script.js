document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => menu.classList.toggle("open"));
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => menu.classList.remove("open"));
    });
  }

  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".product-card");
  const search = document.querySelector("#search");
  const empty = document.querySelector("#emptyState");

  function filterProducts() {
    if (!cards.length) return;
    const active = document.querySelector(".filter.active")?.dataset.filter || "todos";
    const term = (search?.value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    let visible = 0;

    cards.forEach(card => {
      const categoryOK = active === "todos" || card.dataset.category === active;
      const normalizedName = card.dataset.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const nameOK = !term || normalizedName.includes(term);
      const show = categoryOK && nameOK;
      card.style.display = show ? "" : "block";
      if (!show) card.style.display = "none";
      if (show) visible++;
    });

    if (empty) empty.hidden = visible !== 0;
  }

  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      filterProducts();
    });
  });

  search?.addEventListener("input", filterProducts);
});
