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
function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}

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

function t(key){
  return (window.I18N && window.I18N[state.lang] && window.I18N[state.lang][key])
    ? window.I18N[state.lang][key]
    : "";
}
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

function computeTags(recipe){
  const tags = new Set();

  // Flags
  if(recipe.onePan) tags.add("onePan");
  if(recipe.noChop) tags.add("noChop");
  if(recipe.ultraLazy) tags.add("ultraLazy");

  const keys = (recipe.ingredients || []).map(i => i.key);

  // Base tags
  if(keys.includes("rice")) tags.add("rice");
  if(keys.includes("pasta")) tags.add("pasta");
  if(keys.includes("wrap")) tags.add("wrap");
  if(keys.includes("bread")) tags.add("bread");
  if(keys.includes("oats")) tags.add("oats");

  // Protein tags
  if(keys.includes("chicken")) tags.add("chicken");
  if(keys.includes("tuna")) tags.add("tuna");
  if(keys.includes("egg")) tags.add("egg");
  if(keys.includes("skyr")) tags.add("skyr");
  if(keys.includes("cottage_cheese")) tags.add("cottage_cheese");
  if(keys.includes("yogurt")) tags.add("yogurt");
  if(keys.includes("cheese")) tags.add("cheese");
  if(keys.includes("mozzarella")) tags.add("mozzarella");

  // Taste tags
  if(keys.includes("soy_sauce")) tags.add("soy");
  if(keys.includes("pesto")) tags.add("pesto");
  if(keys.includes("tomato")) tags.add("tomato");
  if(keys.includes("mayo") || keys.includes("skyr") || keys.includes("cottage_cheese")) tags.add("creamy");
  if(keys.includes("chili_flakes")) tags.add("spicy");
  if(keys.includes("cinnamon") || keys.includes("honey")) tags.add("sweet");

  // Meal heuristics
  if(tags.has("oats")) tags.add("breakfast");
  if(tags.has("bread") && tags.has("egg")) tags.add("breakfast");
  if(tags.has("wrap")) tags.add("lunch");
  if(tags.has("pasta") || tags.has("rice")) tags.add("dinner");

  // 🔥 NEW: High Protein auto-detection
  try{
    const protein = proteinPerPerson(recipe);
    if(protein >= 30){
      tags.add("highProtein");
    }
  }catch(e){}

  return Array.from(tags);
}

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
  document.body.style.overflow = "";
  window.scrollTo(0, _scrollY || 0);
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

  $("btnOfflineAI").textContent = t("offlineAI");
  $("ingInput").placeholder = t("inputPlaceholder");
  
  setText("pillMax10", t("f_max10") || "≤10 min");
  setText("pillMax5",  t("f_max5")  || "≤5");
  setText("pillNoChop", t("f_noChop") || "No-Chop");
  setText("pillOnePan", t("f_onePan") || "1 Topf/Pfanne");
  setText("pillHPText", t("f_highProtein") || "High-Protein");
  setText("pillUltra",  t("f_ultraLazy") || "Ultra-Lazy");
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
el.className = "chip new";
setTimeout(()=> el.classList.remove("new"), 220);
    el.innerHTML = `<span>${raw}</span>`;
    const btn = document.createElement("button");
    btn.textContent = "✕";
    btn.onclick = () => {
  const idx = state.ingredients.indexOf(raw);
  if(idx >= 0) state.ingredients.splice(idx, 1);
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
  const whyHtml = recipe.why
  ? `<div class="hint" style="margin-top:8px"><b>${t("mixWhy") || "Why:"}</b> ${recipe.why[state.lang]}</div>`
  : ""; 
  const ingsScaled = (recipe.ingredients || []).map(i => ({ ...i, qty: i.qty * factor }));
  document.querySelector(".fab")?.classList.add("hidden");
  
  sheetBody.innerHTML = `
    <div class="sheetTopRow">
      <div>
        <h3 class="bigTitle">${recipe.title[state.lang]}</h3>
        <div class="meta" style="margin-top:6px">${recipeMetaLine(recipe)}</div>
        ${whyHtml}
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
      ${(recipe.steps?.[state.lang] || []).map(s => `<li>${s}</li>`).join("")}
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

  sheet.style.transform = "";        // wichtig nach Drag
  sheet.style.transition = "";

  unlockScroll();
  sheet.dataset.mode = "";
  document.querySelector(".fab")?.classList.remove("hidden");
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
      <div class="row" style="justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:900; font-size:16px;">${r.title[state.lang]}</div>
          <div class="meta" style="margin-top:6px;">${recipeMetaLine(r)}</div>
        </div>
        <button class="favBtn on" data-unfav="${r.id}" aria-label="remove">❤️</button>
      </div>
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
  
  sheetBody.querySelectorAll("[data-unfav]").forEach(btn => {
  btn.onclick = (e) => {
    e.stopPropagation(); // verhindert, dass das Rezept geöffnet wird
    const id = btn.getAttribute("data-unfav");
    toggleFavorite(id);
    renderResults();
    openFavoritesSheet(); // neu rendern
  };
});

  sheet.dataset.mode = "favorites";
  overlay.classList.add("on");
  sheet.classList.add("on");
  lockScroll();
}

/* ---------- Lazy Mix: Offline Builder (regelbasiert) ---------- */

const FITNESS_TOP = ["chicken","tuna","egg","skyr","cottage_cheese"];

function pickFirstHave(haveSet, keys){
  return keys.find(k => haveSet.has(k)) || null;
}

function proteinKeyOrder(){
  // HighProtein bevorzugt diese, sonst normaler Mix
  return state.filters.highProtein
    ? ["chicken","tuna","egg","skyr","cottage_cheese","yogurt","cheese"]
    : ["egg","tuna","chicken","skyr","cottage_cheese","yogurt","cheese"];
}

function baseIntentOrder(){
  // Intent Detection: was fühlt sich am “lazy”-sten an?
  // Wrap/Bread = schnell, Rice leftovers/Bowl, Pasta, Oats
  return ["wrap","bread","rice","pasta","oats"];
}

function saucePreferenceFor(base, protein){
  // Flavor Pairing Matrix (nur Reihenfolge; genommen wird nur, was du hast)
  if(base === "rice" && protein === "tuna") return ["mayo","soy_sauce","tomato","pesto","oil","butter"];
  if(base === "rice" && protein === "egg")  return ["soy_sauce","mayo","oil","butter","tomato","pesto"];
  if(base === "rice" && protein === "chicken") return ["soy_sauce","tomato","pesto","oil","butter","mayo"];

  if(base === "pasta") return ["pesto","tomato","butter","oil","mayo","soy_sauce"];

  if(base === "wrap" || base === "bread"){
    if(protein === "tuna") return ["mayo","tomato","pesto","soy_sauce","oil","butter"];
    if(protein === "egg")  return ["butter","mayo","tomato","pesto","oil","soy_sauce"];
    return ["mayo","tomato","pesto","soy_sauce","oil","butter"];
  }

  if(base === "oats") return ["honey"]; // nur wenn du honey hast
  return ["soy_sauce","tomato","pesto","mayo","oil","butter"];
}

function bumpProteinForHP(proteinKey, qty){
  // Protein-Optimierung: HighProtein soll ≥30g treffen
  // Wir erhöhen nur sinnvolle Protein-Zutaten.
  if(proteinKey === "chicken") return Math.max(qty, 180);
  if(proteinKey === "tuna") return qty; // 1 can bleibt
  if(proteinKey === "egg") return Math.max(qty, 3); // 3 Eier
  if(proteinKey === "skyr") return Math.max(qty, 250);
  if(proteinKey === "cottage_cheese") return Math.max(qty, 220);
  if(proteinKey === "yogurt") return Math.max(qty, 250);
  if(proteinKey === "cheese") return Math.max(qty, 60);
  return qty;
}

function lazyMixBuild(){
  const have = new Set(state.ingredients.map(toKey));

  // Intent: was ist am "laziest"?
  const bases = ["wrap","bread","rice","pasta","oats"];
  const proteinsAll = ["egg","tuna","chicken","skyr","cottage_cheese","yogurt","cheese"];
  const proteinsHP  = FITNESS_TOP;
  const sauces = ["soy_sauce","pesto","tomato","mayo","butter","oil"];

  const hasBase = bases.some(b => have.has(b));
  const hasProtein = (state.filters.highProtein ? proteinsHP : proteinsAll).some(p => have.has(p));

  // Smartere Hinweise (wie "KI")
  if(!hasBase && !hasProtein){
    showToast(t("mixNeedMore"));
    return null;
  }
  if(!hasBase && hasProtein){
    showToast(t("mixNeedBase"));
    return null;
  }
  if(hasBase && !hasProtein){
    showToast(t("mixNeedProtein"));
    return null;
  }

  // 1) Base wählen (Intent Reihenfolge)
  const base = bases.find(b => have.has(b));

  // 2) Protein wählen
  const protein = (state.filters.highProtein ? proteinsHP : proteinsAll).find(p => have.has(p));

  const ultra = state.filters.ultraLazy;

  // 3) Sauce wählen: passend zur Kombi, aber nur wenn vorhanden
  const preferSauceOrder = (() => {
    if(base === "rice" && (protein === "tuna" || protein === "egg")) return ["mayo","soy_sauce","oil","butter","tomato","pesto"];
    if(base === "rice" && protein === "chicken") return ["soy_sauce","tomato","oil","butter","pesto","mayo"];
    if(base === "pasta") return ["pesto","tomato","butter","oil","mayo","soy_sauce"];
    if(base === "wrap" || base === "bread") return ["mayo","tomato","pesto","butter","oil","soy_sauce"];
    // oats: nur wenn du wirklich honey hast – sonst ignorieren
    if(base === "oats") return ["honey","mayo","skyr","yogurt"]; 
    return ["soy_sauce","tomato","pesto","mayo","oil","butter"];
  })();

  let sauce = preferSauceOrder.find(s => have.has(s)) || sauces.find(s => have.has(s)) || null;

  // Rezept-Name (safe)
  const NAME = {
    chicken: {de:"Chicken", en:"Chicken"},
    tuna: {de:"Thunfisch", en:"Tuna"},
    egg: {de:"Ei", en:"Egg"},
    skyr: {de:"Skyr", en:"Skyr"},
    cottage_cheese: {de:"Hüttenkäse", en:"Cottage Cheese"},
    yogurt: {de:"Joghurt", en:"Yogurt"},
    cheese: {de:"Käse", en:"Cheese"},

    rice: {de:"Rice Bowl", en:"Rice Bowl"},
    pasta: {de:"Pasta", en:"Pasta"},
    wrap: {de:"Wrap", en:"Wrap"},
    bread: {de:"Toast", en:"Toast"},
    oats: {de:"Oat Bowl", en:"Oat Bowl"},

    soy_sauce: {de:"Soja", en:"Soy"},
    pesto: {de:"Pesto", en:"Pesto"},
    tomato: {de:"Tomate", en:"Tomato"},
    mayo: {de:"Mayo", en:"Mayo"},
    butter: {de:"Butter", en:"Butter"},
    oil: {de:"Öl", en:"Oil"},
    honey: {de:"Honig", en:"Honey"}
  };

  const sauceTitleDE = (sauce && NAME[sauce]) ? ` (${NAME[sauce].de})` : "";
  const sauceTitleEN = (sauce && NAME[sauce]) ? ` (${NAME[sauce].en})` : "";

  const title = {
    de: `Lazy Mix — ${(NAME[protein]?.de || protein)} ${(NAME[base]?.de || base)}${(sauce && !ultra) ? sauceTitleDE : ""}`,
    en: `Lazy Mix — ${(NAME[protein]?.en || protein)} ${(NAME[base]?.en || base)}${(sauce && !ultra) ? sauceTitleEN : ""}`
  };

  const recipe = {
    id: "lazy_mix",
    time: 10,
    maxIng: ultra ? 3 : 5,
    noChop: true,
    onePan: !!state.filters.onePan,
    ultraLazy: ultra,
    title,
    ingredients: [],
    steps: { de: [], en: [] },
    tags: ["lazy_mix"]
  };

  const addIng = (key, qty, unit, de, en) =>
    recipe.ingredients.push({key, qty, unit, label:{de,en}});

  // Base Zutaten
  if(base === "wrap") addIng("wrap", 1, "wrap", "Wrap", "Wrap");
  else if(base === "bread") addIng("bread", 2, "slice", "Toast", "Toast");
  else if(base === "oats") addIng("oats", 60, "g", "Haferflocken", "Oats");
  else if(base === "pasta") addIng("pasta", 80, "g", "Pasta (trocken)", "Pasta (dry)");
  else addIng("rice", 75, "g", "Reis (trocken)", "Rice (dry)");

  // Protein + High-Protein Optimierung
  if(protein === "egg"){
    const q = state.filters.highProtein ? bumpProteinForHP("egg", 2) : 2;
    addIng("egg", q, "pcs", "Eier", "Eggs");
  }
  else if(protein === "tuna"){
    addIng("tuna", 1, "can", "Thunfisch (Dose)", "Tuna (can)");
  }
  else if(protein === "skyr"){
    const q = state.filters.highProtein ? bumpProteinForHP("skyr", 200) : 200;
    addIng("skyr", q, "g", "Skyr", "Skyr");
  }
  else if(protein === "cottage_cheese"){
    const q = state.filters.highProtein ? bumpProteinForHP("cottage_cheese", 180) : 180;
    addIng("cottage_cheese", q, "g", "Hüttenkäse", "Cottage cheese");
  }
  else if(protein === "yogurt"){
    const q = state.filters.highProtein ? bumpProteinForHP("yogurt", 200) : 200;
    addIng("yogurt", q, "g", "Joghurt", "Yogurt");
  }
  else if(protein === "chicken"){
    const q = state.filters.highProtein ? bumpProteinForHP("chicken", 150) : 150;
    addIng("chicken", q, "g", "Hähnchenbrust", "Chicken breast");
  }
  else{
    const q = state.filters.highProtein ? bumpProteinForHP("cheese", 40) : 40;
    addIng("cheese", q, "g", "Käse", "Cheese");
  }

  // Sauce nur wenn vorhanden und nicht ultra
  if(!ultra && sauce){
    if(sauce === "soy_sauce") addIng("soy_sauce", 1, "tsp", "Sojasauce", "Soy sauce");
    else if(sauce === "tomato") addIng("tomato", 120, "g", "Tomate", "Tomato");
    else if(sauce === "pesto") addIng("pesto", 1, "tbsp", "Pesto", "Pesto");
    else if(sauce === "mayo") addIng("mayo", 1, "tbsp", "Mayo", "Mayo");
    else if(sauce === "butter") addIng("butter", 1, "tsp", "Butter", "Butter");
    else if(sauce === "oil") addIng("oil", 1, "tsp", "Öl", "Oil");
    else if(sauce === "honey") addIng("honey", 1, "tsp", "Honig", "Honey");
  }

  // Steps (onePan/ultra wirkt trotzdem)
  recipe.steps.de = [
    (base === "rice" || base === "pasta" || base === "oats") ? "Basis vorbereiten (kochen oder Reste verwenden)." : "Basis bereitlegen.",
    (protein === "chicken") ? "Protein in der Pfanne anbraten (oder kurz erwärmen)." : "Protein dazugeben (ggf. kurz erwärmen).",
    (!ultra && sauce) ? "Sauce dazu, alles kurz mischen." : "Kurz mischen & abschmecken.",
    "Fertig. Optional: Salz/Pfeffer, wenn du willst."
  ];

  recipe.steps.en = [
    (base === "rice" || base === "pasta" || base === "oats") ? "Prepare the base (cook or use leftovers)." : "Get the base ready.",
    (protein === "chicken") ? "Pan-fry the protein (or warm it briefly)." : "Add the protein (warm briefly if needed).",
    (!ultra && sauce) ? "Add sauce and mix briefly." : "Mix briefly & season to taste.",
    "Done. Optional: salt/pepper if you want."
  ];

  // KI-Erklärung
  const proteinName = NAME[protein] ? NAME[protein][state.lang] : protein;
  const baseName = NAME[base] ? NAME[base][state.lang] : base;
  const sauceName = (sauce && NAME[sauce]) ? NAME[sauce][state.lang] : null;

  recipe.why = {
    de: `Ich habe ${proteinName} + ${baseName} aus deinen Zutaten gewählt.${sauceName && !ultra ? ` Dazu passt ${sauceName} am besten.` : ""}${state.filters.highProtein ? " Ziel: High Protein (≥30g)." : ""}`,
    en: `Picked ${proteinName} + ${baseName} from your ingredients.${sauceName && !ultra ? ` Best match: ${sauceName}.` : ""}${state.filters.highProtein ? " Goal: High Protein (≥30g)." : ""}`
  };

  showToast(t("mixBuilt"));
  return recipe;
}

/* ---------- Events ---------- */

function addIngredient(raw){
  const cleaned = (raw || "").trim();
  if(!cleaned) return; // (2) leere Eingabe blocken

  const newKey = toKey(cleaned);

  // (1) doppelte Zutaten verhindern (case/DE-EN egal)
  const exists = state.ingredients.some(x => toKey(x) === newKey);
  if(exists) return;

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

$("btnOfflineAI").onclick = () => {
  const r = lazyMixBuild();
  if(!r) return;
  openSheet(r);
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

let sheetDragInitialized = false;

function enableSheetDragToClose(){
  if(sheetDragInitialized) return;
  sheetDragInitialized = true;

  const sheetEl = document.getElementById("sheet");
  const bodyEl = document.getElementById("sheetBody");
  const grabEl = sheetEl.querySelector(".sheetHeader");

  if(!grabEl) return;

  let startY = 0;
  let currentY = 0;
  let dragging = false;

  function setTranslate(y){
    sheetEl.style.transform = `translateY(${y}px)`;
  }

  function resetTranslate(){
    sheetEl.style.transform = "";
  }

  grabEl.addEventListener("touchstart", (e) => {
    if(!sheetEl.classList.contains("on")) return;
    if(bodyEl && bodyEl.scrollTop > 0) return;

    dragging = true;
    startY = e.touches[0].clientY;
    currentY = 0;
    sheetEl.style.transition = "none";
  }, { passive: true });

  grabEl.addEventListener("touchmove", (e) => {
    if(!dragging) return;
    const y = e.touches[0].clientY;
    currentY = Math.max(0, y - startY);
    setTranslate(currentY);
  }, { passive: true });

  grabEl.addEventListener("touchend", () => {
    if(!dragging) return;
    dragging = false;
    sheetEl.style.transition = "";

    if(currentY > 90){
      resetTranslate();
      closeSheet();
    } else {
      resetTranslate();
    }
  });
}

function normalizeRecipes(){
  // RECIPES ist global (const) – aber nicht zwingend window.RECIPES
  if(typeof RECIPES === "undefined") return;

  RECIPES.forEach(r => {
    r.tags = computeTags(r);
  });
}


/* ---------- Start App ---------- */

normalizeRecipes();
renderAll();
enableSheetDragToClose();
