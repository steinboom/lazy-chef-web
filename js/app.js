/* globals I18N, MAP, PROTEIN, RECIPES */

const LS = {
  lang: "lazy.lang",
  portion: "lazy.portion",
  filters: "lazy.filters",
  ingredients: "lazy.ingredients",
  favorites: "lazy.favorites"
};

const defaultFilters = { max10:true, max5:true, noChop:false, onePan:false, highProtein:false, ultraLazy:false };

let state = {
  lang: localStorage.getItem(LS.lang) || "de",
  portion: parseInt(localStorage.getItem(LS.portion) || "1", 10),
  filters: (() => {
    try { return { ...defaultFilters, ...(JSON.parse(localStorage.getItem(LS.filters))||{}) }; }
    catch { return { ...defaultFilters }; }
  })(),
  ingredients: (() => {
    try { return (JSON.parse(localStorage.getItem(LS.ingredients))||[]); }
    catch { return []; }
  })(),
  favorites: new Set((() => {
    try { return (JSON.parse(localStorage.getItem(LS.favorites))||[]); }
    catch { return []; }
  })())
};

const $ = (id) => document.getElementById(id);

const chipsEl = $("chips");
const inputEl = $("ingInput");
const resultsEl = $("results");
const overlay = $("overlay");
const sheet = $("sheet");
const sheetBody = $("sheetBody");

function save(){
  localStorage.setItem(LS.lang, state.lang);
  localStorage.setItem(LS.portion, String(state.portion));
  localStorage.setItem(LS.filters, JSON.stringify(state.filters));
  localStorage.setItem(LS.ingredients, JSON.stringify(state.ingredients));
  localStorage.setItem(LS.favorites, JSON.stringify(Array.from(state.favorites)));
}

function t(key){ return I18N[state.lang][key]; }
function norm(s){ return (s||"").trim().toLowerCase(); }
function toKey(raw){ const n = norm(raw); return MAP[n] || n; }
function unique(arr){ return Array.from(new Set(arr)); }

const UNIT_TO_G = { g:1, ml:1, tbsp:15, tsp:5, slice:30, wrap:60, can:120 };

function approxProtein(ingredient){
  const ref = PROTEIN[ingredient.key];
  if(!ref) return 0;

  if(ingredient.unit === "pcs" && ref.perUnit){
    return ingredient.qty * ref.perUnit;
  }

  let grams = ingredient.qty;
  if(UNIT_TO_G[ingredient.unit]) grams = ingredient.qty * UNIT_TO_G[ingredient.unit];

  if(ref.per100g) return (grams / 100) * ref.per100g;
  return 0;
}

function proteinPerPerson(recipe){
  return recipe.ingredients.reduce((sum, ing) => sum + approxProtein({key:ing.key, qty: ing.qty, unit: ing.unit}), 0);
}

function proteinForCurrentPortion(recipe){
  const base = proteinPerPerson(recipe);
  // pro Portion bleibt gleich; Portion skaliert nur die Mengen
  return base;
}

function recipeMetaLine(recipe){
  const parts = [];
  parts.push(`⏱ ${recipe.time} ${t("time")}`);
  if(recipe.onePan) parts.push("🍳 1-pan");
  if(recipe.noChop) parts.push("✂️ no-chop");
  const p = Math.round(proteinForCurrentPortion(recipe));
  parts.push(`🔥 ~${p}g ${t("protein")} ${t("perPortion")}`);
  return parts.join(" · ");
}

function passesFilters(recipe){
  const f = state.filters;
  if(f.max10 && recipe.time > 10) return false;
  if(f.max5 && recipe.maxIng > 5) return false;
  if(f.noChop && !recipe.noChop) return false;
  if(f.onePan && !recipe.onePan) return false;
  if(f.ultraLazy && !recipe.ultraLazy) return false;

  if(f.highProtein){
    if(proteinForCurrentPortion(recipe) < 30) return false;
  }
  return true;
}

function matchScore(recipe){
  const have = new Set(state.ingredients.map(toKey));
  let score = 0;
  for(const ing of (recipe.ingredients||[])){
    if(have.has(ing.key)) score += 4;
  }
  return score;
}

/* ---------- UI helpers: Favorites FAB + Toast ---------- */

let _scrollY = 0;

function lockScroll(){
  _scrollY = window.scrollY || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${_scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockScroll(){
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, _scrollY);
}

function renderFavCount(){
  const n = state.favorites.size;
  const el = $("favCount");
  if(!el) return;
  el.textContent = String(n);
  el.style.display = n > 0 ? "flex" : "none";
}

function showToast(msg){
  const el = $("toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("on");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("on"), 1100);
}

function pulseFavFab(){
  const fab = $("favFab");
  if(!fab) return;
  fab.classList.remove("pulse");
  void fab.offsetWidth;
  fab.classList.add("pulse");
  setTimeout(() => fab.classList.remove("pulse"), 320);
}

function hapticTap(){
  try{ if(navigator.vibrate) navigator.vibrate(20); }catch(e){}
}

function toggleFavorite(id){
  const added = !state.favorites.has(id);
  if(added) state.favorites.add(id);
  else state.favorites.delete(id);

  save();
  renderFavCount();
  hapticTap();
  pulseFavFab();
  showToast(added ? t("saved") : t("removed"));
  return added;
}

/* ---------- Render ---------- */

function renderText(){
  $("tagline").textContent = t("tagline");
  $("portionLabel").textContent = t("portion");
  $("h_ingredients").textContent = t("ingredients");
  $("h_filters").textContent = t("filters");
  $("h_results").textContent = t("results");
  $("hint1").textContent = t("hint1");

  $("btnFind").textContent = t("find");
  $("btnOfflineAI").textContent = t("offlineAI"); // Lazy Mix
  $("btnReset").textContent = t("reset");
  $("ingInput").placeholder = t("inputPlaceholder");
}

function renderSegs(){
  $("p1").classList.toggle("on", state.portion === 1);
  $("p2").classList.toggle("on", state.portion === 2);
  $("de").classList.toggle("on", state.lang === "de");
  $("en").classList.toggle("on", state.lang === "en");
}

function renderFilterPills(){
  document.querySelectorAll(".pill[data-filter]").forEach(p => {
    const k = p.dataset.filter;
    p.classList.toggle("on", !!state.filters[k]);
  });
}

function renderChips(){
  chipsEl.innerHTML = "";
  state.ingredients.forEach(raw => {
    const el = document.createElement("div");
    el.className = "chip";
    el.innerHTML = `<span>${raw}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.onclick = () => {
      state.ingredients = state.ingredients.filter(x => x !== raw);
      save();
      renderAll();
    };
    el.appendChild(btn);
    chipsEl.appendChild(el);
  });
}

function renderResults(){
  resultsEl.innerHTML = "";

  let list = RECIPES
    .filter(passesFilters)
    .filter(r => {
      if(!state.ingredients.length) return true;
      return matchScore(r) > 0;
    });

  // simple sort
  list.sort((a,b)=> (matchScore(b)-matchScore(a)) || (a.time-b.time));

  list = list.slice(0, 8);

  if(!list.length){
    resultsEl.innerHTML = `<div class="card">${t("empty")}</div>`;
    return;
  }

  list.forEach(r => {
    const card = document.createElement("div");
    card.className = "card recipeCard";

    const isFav = state.favorites.has(r.id);

    card.innerHTML = `
      <div class="row" style="justify-content:space-between;align-items:flex-start;">
        <h3 class="title">${r.title[state.lang]}</h3>
        <button class="favBtn ${isFav ? "on":""}" aria-label="favorite">${isFav ? "❤️" : "🤍"}</button>
      </div>

      <div class="meta">${recipeMetaLine(r)}</div>

      <div class="cardActions">
        <button class="linkBtn">${t("details")} →</button>
      </div>
    `;

    card.querySelector(".linkBtn").onclick = () => openSheet(r);
    card.querySelector(".favBtn").onclick = () => {
      toggleFavorite(r.id);
      renderResults();
    };

    resultsEl.appendChild(card);
  });
}

function renderAll(){
  renderText();
  renderSegs();
  renderFilterPills();
  renderChips();
  renderFavCount();
  renderResults();
}

/* ---------- Sheet ---------- */

function fmtQty(q){ return Number.isInteger(q) ? String(q) : (Math.round(q*10)/10).toString(); }

function openSheet(recipe){
  const factor = state.portion;
  const ingsScaled = recipe.ingredients.map(i => ({ ...i, qty: i.qty * factor }));

  sheetBody.innerHTML = `
    <div class="sheetTopRow">
      <div>
        <h3 class="bigTitle">${recipe.title[state.lang]}</h3>
        <div class="meta" style="margin-top:6px">${recipeMetaLine(recipe)}</div>
      </div>
      <button class="closeBtn" id="closeBtn">✕</button>
    </div>

    <div class="sectionTitle">${t("portion")}</div>
    <div class="row">
      <div class="seg" style="border:1px solid var(--border); background:#fff;">
        <button id="sheetP1" class="${state.portion===1?'on':''}">1</button>
        <button id="sheetP2" class="${state.portion===2?'on':''}">2</button>
      </div>
      <span class="badge">🔥 ~${Math.round(proteinForCurrentPortion(recipe))}g ${t("protein")} ${t("perPortion")}</span>
    </div>

    <div class="sectionTitle">${t("ingredientsLabel")}</div>
    <ul class="ingList">
      ${ingsScaled.map(i => `<li><b>${fmtQty(i.qty)} ${i.unit}</b> — ${i.label[state.lang]}</li>`).join("")}
    </ul>

    <div class="sectionTitle">${t("stepsLabel")}</div>
    <ol class="steps">
      ${recipe.steps[state.lang].map(s => `<li>${s}</li>`).join("")}
    </ol>

    <div style="margin-top:14px" class="row">
      <button class="btn" id="sheetFav">${state.favorites.has(recipe.id) ? "❤️ Favorit" : "🤍 Favorit"}</button>
    </div>
  `;

  $("closeBtn").onclick = closeSheet;

  $("sheetP1").onclick = () => { state.portion = 1; save(); openSheet(recipe); renderAll(); };
  $("sheetP2").onclick = () => { state.portion = 2; save(); openSheet(recipe); renderAll(); };

  $("sheetFav").onclick = () => {
    toggleFavorite(recipe.id);
    openSheet(recipe);
    renderResults();
  };

  sheet.dataset.mode = "recipe";
  overlay.classList.add("on");
  sheet.classList.add("on");
  lockScroll();
}

function closeSheet(){
  overlay.classList.remove("on");
  sheet.classList.remove("on");
  unlockScroll();
  sheet.dataset.mode = "";
}

overlay.onclick = closeSheet;

/* ---------- Favorites Sheet ---------- */

function openFavoritesSheet(){
  const fav = RECIPES.filter(r => state.favorites.has(r.id));

  sheetBody.innerHTML = `
    <div class="sheetTopRow">
      <div>
        <h3 class="bigTitle">${t("favoritesTitle")}</h3>
        <div class="meta" style="margin-top:6px">${t("favoritesHint")}</div>
      </div>
      <button class="closeBtn" id="closeBtn">✕</button>
    </div>

    <div class="sectionTitle">${t("favoritesSaved")}</div>

    <div>
      ${
        fav.length
          ? fav.map(r => `
              <div class="card" style="box-shadow:none; margin-bottom:10px; cursor:pointer;" data-favid="${r.id}">
                <div style="font-weight:900; font-size:16px;">${r.title[state.lang]}</div>
                <div class="meta" style="margin-top:6px;">${recipeMetaLine(r)}</div>
              </div>
            `).join("")
          : `<div class="hint">${t("noFavs")}</div>`
      }
    </div>
  `;

  $("closeBtn").onclick = closeSheet;

  sheetBody.querySelectorAll("[data-favid]").forEach(el => {
    el.onclick = () => {
      const id = el.getAttribute("data-favid");
      const recipe = RECIPES.find(x => x.id === id);
      if(recipe) openSheet(recipe);
    };
  });

  sheet.dataset.mode = "favorites";
  overlay.classList.add("on");
  sheet.classList.add("on");
  lockScroll();
}

/* ---------- Lazy Mix: Offline Builder (regelbasiert) ---------- */

const FITNESS_TOP = ["chicken","tuna","egg","skyr","cottage_cheese"];

function lazyMixBuild(){
  const have = new Set(state.ingredients.map(toKey));

  const bases = ["rice","pasta","wrap","bread","oats"];
  let base = bases.find(b => have.has(b)) || "rice";

  let protein = null;
  if(state.filters.highProtein){
    protein = FITNESS_TOP.find(p => have.has(p)) || "chicken";
  }else{
    const proteins = ["egg","tuna","chicken","skyr","cottage_cheese","cheese","yogurt"];
    protein = proteins.find(p => have.has(p)) || "egg";
  }

  const sauces = ["soy_sauce","tomato","pesto","mayo","oil","butter"];
  let sauce = sauces.find(s => have.has(s)) || "oil";

  const ultra = state.filters.ultraLazy;

  const recipe = {
    id: "lazy_mix",
    time: 10,
    maxIng: ultra ? 3 : 5,
    noChop: true,
    onePan: !!state.filters.onePan,
    ultraLazy: ultra,
    title: { de: "Lazy Mix", en: "Lazy Mix" },
    ingredients: [],
    steps: { de: [], en: [] },
    tags: ["lazy_mix"]
  };

  const addIng = (key, qty, unit, de, en) => recipe.ingredients.push({key, qty, unit, label:{de,en}});

  if(base === "wrap") addIng("wrap", 1, "wrap", "Wrap", "Wrap");
  else if(base === "bread") addIng("bread", 2, "slice", "Toast", "Toast");
  else if(base === "oats") addIng("oats", 60, "g", "Haferflocken", "Oats");
  else if(base === "pasta") addIng("pasta", 80, "g", "Pasta (trocken)", "Pasta (dry)");
  else addIng("rice", 75, "g", "Reis (trocken)", "Rice (dry)");

  if(protein === "egg") addIng("egg", 2, "pcs", "Eier", "Eggs");
  else if(protein === "tuna") addIng("tuna", 1, "can", "Thunfisch (Dose)", "Tuna (can)");
  else if(protein === "skyr") addIng("skyr", 200, "g", "Skyr", "Skyr");
  else if(protein === "cottage_cheese") addIng("cottage_cheese", 180, "g", "Hüttenkäse", "Cottage cheese");
  else if(protein === "chicken") addIng("chicken", 150, "g", "Hähnchenbrust", "Chicken breast");
  else addIng("cheese", 40, "g", "Käse", "Cheese");

  if(!ultra){
    if(sauce === "soy_sauce") addIng("soy_sauce", 1, "tsp", "Sojasauce", "Soy sauce");
    else if(sauce === "tomato") addIng("tomato", 120, "g", "Tomate", "Tomato");
    else if(sauce === "pesto") addIng("pesto", 1, "tbsp", "Pesto", "Pesto");
    else if(sauce === "mayo") addIng("mayo", 1, "tbsp", "Mayo", "Mayo");
    else if(sauce === "butter") addIng("butter", 1, "tsp", "Butter", "Butter");
    else addIng("oil", 1, "tsp", "Öl", "Oil");
  }

  recipe.steps.de = state.filters.onePan
    ? ["Basis kochen oder Reste nehmen.","Protein in Pfanne kurz warm machen.","Sauce dazu, kurz mischen.","Fertig."]
    : ["Basis vorbereiten.","Protein dazu.","Sauce rein, kurz mischen.","Fertig."];

  recipe.steps.en = state.filters.onePan
    ? ["Cook base or use leftovers.","Warm protein in a pan.","Add sauce, mix briefly.","Done."]
    : ["Prepare the base.","Add protein.","Add sauce, mix.","Done."];

  return recipe;
}

/* ---------- Events ---------- */

function addIngredient(raw){
  const cleaned = raw.trim();
  if(!cleaned) return;
  if(state.ingredients.includes(cleaned)) return;
  state.ingredients = unique([...state.ingredients, cleaned]).slice(0, 20);
  save();
  renderAll();
}

inputEl.addEventListener("keydown", (e) => {
  if(e.key === "Enter"){
    e.preventDefault();
    addIngredient(inputEl.value);
    inputEl.value = "";
  }
});

document.querySelectorAll(".pill[data-filter]").forEach(p => {
  p.addEventListener("click", () => {
    if(p.classList.contains("disabled")) return;
    const k = p.dataset.filter;
    state.filters[k] = !state.filters[k];
    save();
    renderAll();
  });
});

$("btnFind").onclick = () => renderResults();

$("btnOfflineAI").onclick = () => {
  const r = lazyMixBuild();
  openSheet(r);
};

$("btnReset").onclick = () => {
  state.ingredients = [];
  state.filters = { ...defaultFilters };
  save();
  renderAll();
};

$("p1").onclick = () => { state.portion = 1; save(); renderAll(); };
$("p2").onclick = () => { state.portion = 2; save(); renderAll(); };

$("de").onclick = () => { state.lang = "de"; save(); renderAll(); };
$("en").onclick = () => { state.lang = "en"; save(); renderAll(); };

$("favFab").onclick = () => {
  const isOpen = sheet.classList.contains("on");
  const isFavs = sheet.dataset.mode === "favorites";

  if (isOpen && isFavs) {
    closeSheet();              // toggle: schließen
  } else {
    openFavoritesSheet();      // öffnen (oder von Rezept -> Favoriten wechseln)
  }
};

/* ---------- Init ---------- */
renderAll();