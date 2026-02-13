// ---------- STATE ----------

const defaultFilters = {
  max10: true,
  max5: true,
  noChop: false,
  onePan: false,
  highProtein: false,
  ultraLazy: false
};

let state = {
  lang: "de",
  portion: 1,
  ingredients: [],
  filters: { ...defaultFilters },
  favorites: new Set(JSON.parse(localStorage.getItem("lazychef_favs") || "[]"))
};

// ---------- HELPERS ----------

const $ = id => document.getElementById(id);

function saveFavs(){
  localStorage.setItem("lazychef_favs", JSON.stringify([...state.favorites]));
}

function t(key){
  return window.I18N[state.lang][key] || key;
}

function toKey(val){
  return window.MAP[val.toLowerCase()] || val.toLowerCase();
}

function calcProtein(recipe){
  let total = 0;

  recipe.ingredients.forEach(ing=>{
    const meta = window.PROTEIN[ing.key];
    if(!meta) return;

    if(meta.perUnit && ing.unit === "pcs"){
      total += meta.perUnit * ing.qty;
    }else if(meta.per100g){
      total += meta.per100g * (ing.qty / 100);
    }
  });

  return Math.round(total);
}

// ---------- RENDER ----------

function renderChips(){
  const wrap = $("chips");
  wrap.innerHTML = "";

  state.ingredients.forEach((ing,i)=>{
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.innerHTML = `
      ${ing}
      <button>×</button>
    `;
    chip.querySelector("button").onclick = ()=>{
      state.ingredients.splice(i,1);
      renderAll();
    };
    wrap.appendChild(chip);
  });
}

function recipeMetaLine(r){
  const protein = calcProtein(r);
  return `
    ⏱ ${r.time} ${t("time")}
    ${protein ? `• 💪 ${protein}g ${t("protein")}` : ""}
  `;
}

function renderResults(){
  const wrap = $("results");
  wrap.innerHTML = "";

  let results = window.RECIPES.filter(r=>{
    if(state.filters.max10 && r.time > 10) return false;
    if(state.filters.max5 && r.maxIng > 5) return false;
    if(state.filters.noChop && !r.noChop) return false;
    if(state.filters.onePan && !r.onePan) return false;
    if(state.filters.ultraLazy && !r.ultraLazy) return false;

    if(state.filters.highProtein){
      if(calcProtein(r) < 30) return false;
    }

    return true;
  });

  if(!results.length){
    wrap.innerHTML = `<div class="hint">${t("empty")}</div>`;
    return;
  }

  results.forEach(r=>{
    const card = document.createElement("div");
    card.className = "card recipeCard";

    const fav = state.favorites.has(r.id);

    card.innerHTML = `
      <div>
        <div class="title">${r.title[state.lang]}</div>
        <div class="meta">${recipeMetaLine(r)}</div>
      </div>

      <div class="cardActions">
        <button class="linkBtn">${t("details")}</button>
        <button class="favBtn ${fav ? "on":""}">♥</button>
      </div>
    `;

    card.querySelector(".linkBtn").onclick = ()=> openSheet(r);

    card.querySelector(".favBtn").onclick = ()=>{
      const added = !state.favorites.has(r.id);
      if(added) state.favorites.add(r.id);
      else state.favorites.delete(r.id);

      saveFavs();
      renderFavCount();
      renderResults();

      showToast(added ? t("saved") : t("removed"));
    };

    wrap.appendChild(card);
  });
}

// ---------- FAVORITES FAB ----------

function renderFavCount(){
  const n = state.favorites.size;
  const el = $("favCount");
  el.textContent = n;
  el.style.display = n>0 ? "flex":"none";
}

function openFavoritesSheet(){
  const favs = window.RECIPES.filter(r=> state.favorites.has(r.id));

  const body = $("sheetBody");
  body.innerHTML = `
    <div class="sheetTopRow">
      <h3 class="bigTitle">${t("favoritesTitle")}</h3>
      <button class="closeBtn" id="closeBtn">✕</button>
    </div>

    <div class="sectionTitle">${t("favoritesSaved")}</div>

    ${
      favs.length
        ? favs.map(r=>`
          <div class="card" data-id="${r.id}" style="cursor:pointer;margin-bottom:10px;">
            <div style="font-weight:900">${r.title[state.lang]}</div>
            <div class="meta">${recipeMetaLine(r)}</div>
          </div>
        `).join("")
        : `<div class="hint">${t("noFavs")}</div>`
    }
  `;

  $("closeBtn").onclick = closeSheet;

  body.querySelectorAll("[data-id]").forEach(el=>{
    el.onclick = ()=>{
      const id = el.getAttribute("data-id");
      const recipe = window.RECIPES.find(r=>r.id===id);
      if(recipe) openSheet(recipe);
    };
  });

  $("overlay").classList.add("on");
  $("sheet").classList.add("on");
}

// ---------- SHEET ----------

function openSheet(recipe){
  const protein = calcProtein(recipe);

  const body = $("sheetBody");
  body.innerHTML = `
    <div class="sheetTopRow">
      <div>
        <h3 class="bigTitle">${recipe.title[state.lang]}</h3>
        <div class="meta">${recipeMetaLine(recipe)}</div>
      </div>
      <button class="closeBtn" id="closeBtn">✕</button>
    </div>

    <div class="sectionTitle">${t("ingredientsLabel")}</div>
    <ul class="ingList">
      ${
        recipe.ingredients.map(ing=>`
          <li>
            ${ing.qty * state.portion} ${ing.unit}
            ${ing.label[state.lang]}
          </li>
        `).join("")
      }
    </ul>

    <div class="sectionTitle">${t("stepsLabel")}</div>
    <ol class="steps">
      ${
        recipe.steps[state.lang].map(s=>`<li>${s}</li>`).join("")
      }
    </ol>
  `;

  $("closeBtn").onclick = closeSheet;

  $("overlay").classList.add("on");
  $("sheet").classList.add("on");
}

function closeSheet(){
  $("overlay").classList.remove("on");
  $("sheet").classList.remove("on");
}

// ---------- TOAST ----------

function showToast(msg){
  const el = $("toast");
  el.textContent = msg;
  el.classList.add("on");
  setTimeout(()=> el.classList.remove("on"), 1200);
}

// ---------- LAZY MIX ----------

function lazyMix(){
  const r = window.RECIPES[Math.floor(Math.random()*window.RECIPES.length)];
  openSheet(r);
}

// ---------- EVENTS ----------

$("ingInput").addEventListener("keydown", e=>{
  if(e.key==="Enter"){
    const val = e.target.value.trim();
    if(!val) return;

    state.ingredients.push(val);
    e.target.value="";
    renderAll();
  }
});

$("btnFind").onclick = renderResults;
$("btnOfflineAI").onclick = lazyMix;

$("btnReset").onclick = ()=>{
  state.ingredients=[];
  state.filters={...defaultFilters};
  renderAll();
};

document.querySelectorAll(".pill").forEach(p=>{
  if(p.classList.contains("disabled")) return;
  p.onclick = ()=>{
    const key = p.dataset.filter;
    state.filters[key] = !state.filters[key];
    p.classList.toggle("on", state.filters[key]);
  };
});

$("p1").onclick = ()=>{
  state.portion=1;
  $("p1").classList.add("on");
  $("p2").classList.remove("on");
};

$("p2").onclick = ()=>{
  state.portion=2;
  $("p2").classList.add("on");
  $("p1").classList.remove("on");
};

$("de").onclick = ()=>{
  state.lang="de";
  $("de").classList.add("on");
  $("en").classList.remove("on");
  renderAll();
};

$("en").onclick = ()=>{
  state.lang="en";
  $("en").classList.add("on");
  $("de").classList.remove("on");
  renderAll();
};

$("overlay").onclick = closeSheet;
$("favFab").onclick = openFavoritesSheet;

// ---------- INIT ----------

function renderAll(){
  renderChips();
  renderResults();
  renderFavCount();
}

renderAll();