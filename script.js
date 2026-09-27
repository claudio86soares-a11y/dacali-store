document.addEventListener("DOMContentLoaded",()=>{
  const toggle=document.querySelector(".menu-toggle"),menu=document.querySelector(".menu");
  if(toggle&&menu){toggle.addEventListener("click",()=>{const open=menu.classList.toggle("open");toggle.setAttribute("aria-expanded",open)});menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{menu.classList.remove("open");toggle.setAttribute("aria-expanded","false")}))}

  const filters=[...document.querySelectorAll(".filter")],cards=[...document.querySelectorAll(".product-card")],search=document.querySelector("#search"),empty=document.querySelector("#emptyState"),count=document.querySelector("#catalogCount");
  const selectedImage=document.querySelector("#selectedCategoryImage"),selectedTitle=document.querySelector("#selectedCategoryTitle"),selectedText=document.querySelector("#selectedCategoryText");
  const categoryData={
    todos:{title:"Todos os produtos",text:"Explore nossa seleção completa. Clique em uma categoria para ver somente os produtos daquele segmento.",image:"jogo-cama.jpg"},
    "cama-mesa-banho":{title:"Cama, Mesa e Banho",text:"Jogos de cama, mantas, cortinas, edredons e itens para deixar sua casa mais confortável.",image:"cortina-blackout-cinza.webp"},
    beleza:{title:"Beleza",text:"Perfumes, maquiagem e cuidados capilares para sua rotina de beleza.",image:"thermo-booster.webp"},
    casa:{title:"Casa e Cozinha",text:"Panelas e utilidades para tornar o dia a dia mais prático.",image:"panelas-ruby.jpg"},
    presentes:{title:"Presentes",text:"Opções para surpreender em aniversários, datas especiais e momentos importantes.",image:"kit-presente-banho.webp"},
    brinquedos:{title:"Brinquedos",text:"Pelúcias e itens divertidos para presentear crianças e fãs de personagens.",image:"pelucia-stitch.webp"},
    alimentos:{title:"Alimentos",text:"Produtos selecionados para sua despensa e para o dia a dia.",image:"chi-mifen-arroz.jpg"}
  };
  function norm(s){return(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
  function setCategory(category,updateHash=true){
    const active=categoryData[category]?category:"todos";
    filters.forEach(x=>x.classList.toggle("active",x.dataset.filter===active));
    if(selectedImage){selectedImage.src=categoryData[active].image;selectedImage.alt=categoryData[active].title}
    if(selectedTitle)selectedTitle.textContent=categoryData[active].title;
    if(selectedText)selectedText.textContent=categoryData[active].text;
    if(updateHash){history.replaceState(null,"",active==="todos"?location.pathname+location.search:location.pathname+"#"+active)}
    filterProducts();
  }
  function filterProducts(){
    if(!cards.length)return;
    const active=document.querySelector(".filter.active")?.dataset.filter||"todos",term=norm(search?.value).trim();
    let visible=0;
    cards.forEach(card=>{const okCat=active==="todos"||card.dataset.category===active;const okName=!term||norm(card.dataset.name).includes(term)||norm(card.textContent).includes(term);const show=okCat&&okName;card.hidden=!show;if(show)visible++});
    if(empty)empty.hidden=visible!==0;
    if(count)count.textContent=`${visible} ${visible===1?"produto":"produtos"}`;
  }
  filters.forEach(btn=>btn.addEventListener("click",()=>{setCategory(btn.dataset.filter,true);document.querySelector(".catalog")?.scrollIntoView({behavior:"smooth",block:"start"})}));
  search?.addEventListener("input",filterProducts);
  const hash=decodeURIComponent(location.hash.replace("#",""));
  setCategory(categoryData[hash]?hash:"todos",false);
  if(hash&&categoryData[hash])setTimeout(()=>document.querySelector(".catalog")?.scrollIntoView({behavior:"smooth",block:"start"}),150);
});
