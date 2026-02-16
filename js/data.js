window.MAP = {
  "ei":"egg","eier":"egg","egg":"egg",
  "hähnchen":"chicken","haehnchen":"chicken","chicken":"chicken",
  "thunfisch":"tuna","tuna":"tuna",
  "skyr":"skyr","joghurt":"yogurt","yogurt":"yogurt","greek yogurt":"yogurt",
  "hüttenkäse":"cottage_cheese","huettenkaese":"cottage_cheese","cottage cheese":"cottage_cheese",
  "käse":"cheese","kaese":"cheese","cheese":"cheese",

  "reis":"rice","rice":"rice",
  "nudeln":"pasta","pasta":"pasta",
  "wrap":"wrap","wraps":"wrap","tortilla":"wrap",
  "brot":"bread","toast":"bread","bread":"bread",
  "hafer":"oats","haferflocken":"oats","oats":"oats",

  "sojasauce":"soy_sauce","soy sauce":"soy_sauce",
  "mayo":"mayo","mayonnaise":"mayo",
  "pesto":"pesto",
  "tomate":"tomato","tomaten":"tomato","tomato":"tomato",
  "parmesan":"parmesan",
  "olivenöl":"oil","olivenoel":"oil","oil":"oil",
  "butter":"butter",
  "nüsse":"nuts","nuesse":"nuts","nuts":"nuts",
  "honig":"honey","honey":"honey",
  "salat":"salad","salad":"salad",
};

window.PROTEIN = {
  chicken: { per100g: 22 },
  tuna: { per100g: 23 },
  skyr: { per100g: 11 },
  yogurt: { per100g: 10 },
  cottage_cheese: { per100g: 12 },
  egg: { perUnit: 6 },
  cheese: { per100g: 25 },
  parmesan: { per100g: 32 },
  rice: { per100g: 7 },
  pasta: { per100g: 13 },
  bread: { per100g: 9 },
  oats: { per100g: 13 },
  nuts: { per100g: 20 },
  mayo: { per100g: 1 },
  soy_sauce: { per100g: 8 },
  tomato: { per100g: 1 },
  oil: { per100g: 0 },
  butter: { per100g: 1 },
  honey: { per100g: 0 },
  salad: { per100g: 1 },
  wrap: { per100g: 8 }
};

window.RECIPES = [

{
  id:"tuna_rice_bowl",
  time:8, maxIng:5, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Tuna Rice Bowl", en:"Tuna Rice Bowl"},
  ingredients:[
    {key:"rice", qty:75, unit:"g", label:{de:"Reis (trocken)", en:"Rice (dry)"}},
    {key:"tuna", qty:1, unit:"can", label:{de:"Thunfisch (Dose)", en:"Tuna (can)"}},
    {key:"mayo", qty:1, unit:"tbsp", label:{de:"Mayo", en:"Mayo"}},
    {key:"soy_sauce", qty:1, unit:"tsp", label:{de:"Sojasauce", en:"Soy sauce"}}
  ],
  steps:{
    de:["Reis kochen.","Thunfisch abtropfen.","Mit Mayo + Sojasauce mischen.","Kurz erwärmen oder kalt essen."],
    en:["Cook rice.","Drain tuna.","Mix with mayo + soy sauce.","Warm briefly or eat cold."]
  },
  tags:["rice","tuna","high-protein","onePan"]
},

{
  id:"chicken_wrap",
  time:10, maxIng:5, noChop:false, onePan:true, ultraLazy:false,
  title:{de:"Creamy Chicken Wrap", en:"Creamy Chicken Wrap"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"skyr", qty:2, unit:"tbsp", label:{de:"Skyr", en:"Skyr"}},
    {key:"salad", qty:50, unit:"g", label:{de:"Salat", en:"Salad"}}
  ],
  steps:{
    de:["Hähnchen braten.","Skyr unterrühren.","In Wrap füllen.","Zusammenrollen."],
    en:["Pan-fry chicken.","Stir in skyr.","Fill wrap.","Roll up."]
  },
  tags:["wrap","chicken","high-protein","onePan"]
},

{
  id:"skyr_bowl",
  time:3, maxIng:4, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Skyr Power Bowl", en:"Skyr Power Bowl"},
  ingredients:[
    {key:"skyr", qty:200, unit:"g", label:{de:"Skyr", en:"Skyr"}},
    {key:"nuts", qty:30, unit:"g", label:{de:"Nüsse", en:"Nuts"}},
    {key:"honey", qty:1, unit:"tsp", label:{de:"Honig", en:"Honey"}}
  ],
  steps:{
    de:["Skyr in Schüssel geben.","Nüsse + Honig dazu.","Fertig."],
    en:["Add skyr to bowl.","Top with nuts + honey.","Done."]
  },
  tags:["skyr","high-protein","noChop","ultraLazy"]
},

{
  id:"egg_cheese_toast",
  time:7, maxIng:4, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Egg & Cheese Toast", en:"Egg & Cheese Toast"},
  ingredients:[
    {key:"egg", qty:2, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"bread", qty:2, unit:"slice", label:{de:"Toast", en:"Toast"}},
    {key:"cheese", qty:30, unit:"g", label:{de:"Käse", en:"Cheese"}}
  ],
  steps:{
    de:["Eier in Pfanne stocken lassen.","Toast + Käse dazu.","Zusammenklappen."],
    en:["Cook eggs in pan.","Add toast + cheese.","Fold together."]
  },
  tags:["egg","bread","cheese","onePan"]
},

{
  id:"pesto_pasta",
  time:9, maxIng:3, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Lazy Pesto Pasta", en:"Lazy Pesto Pasta"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"pesto", qty:1, unit:"tbsp", label:{de:"Pesto", en:"Pesto"}},
    {key:"parmesan", qty:20, unit:"g", label:{de:"Parmesan", en:"Parmesan"}}
  ],
  steps:{
    de:["Pasta kochen.","Pesto unterheben.","Parmesan drauf."],
    en:["Cook pasta.","Stir in pesto.","Add parmesan."]
  },
  tags:["pasta","comfort","ultraLazy"]
},

{
  id:"cottage_chicken_bowl",
  time:10, maxIng:4, noChop:false, onePan:true, ultraLazy:false,
  title:{de:"Cottage Chicken Bowl", en:"Cottage Chicken Bowl"},
  ingredients:[
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"cottage_cheese", qty:150, unit:"g", label:{de:"Hüttenkäse", en:"Cottage cheese"}},
    {key:"rice", qty:60, unit:"g", label:{de:"Reis (trocken)", en:"Rice (dry)"}}
  ],
  steps:{
    de:["Reis kochen.","Hähnchen anbraten.","Mit Hüttenkäse mischen."],
    en:["Cook rice.","Pan-fry chicken.","Mix with cottage cheese."]
  },
  tags:["chicken","cottage_cheese","high-protein","onePan"]
},

{
  id:"creamy_tuna_pasta",
  time:10, maxIng:4, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Creamy Tuna Pasta", en:"Creamy Tuna Pasta"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"tuna", qty:1, unit:"can", label:{de:"Thunfisch", en:"Tuna"}},
    {key:"cheese", qty:30, unit:"g", label:{de:"Käse", en:"Cheese"}}
  ],
  steps:{
    de:["Pasta kochen.","Thunfisch + Käse unterheben."],
    en:["Cook pasta.","Stir in tuna + cheese."]
  },
  tags:["pasta","tuna","high-protein"]
},

{
  id:"creamy_pesto_rosso_pasta",
  category:"pasta",
  time:15,
  maxIng:6,
  noChop:true,
  onePan:true,
  ultraLazy:true,
  difficulty:"lazy",

  title:{
    de:"Creamy Pesto Rosso Pasta",
    en:"Creamy Pesto Rosso Pasta"
  },

  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Nudeln (trocken)", en:"Pasta (dry)"}},
    {key:"pesto_rosso", qty:2, unit:"tbsp", label:{de:"Pesto Rosso", en:"Pesto Rosso"}},
    {key:"cream_cheese", qty:2, unit:"tbsp", label:{de:"Philadelphia", en:"Cream cheese"}},
    {key:"sour_cream", qty:2, unit:"tbsp", label:{de:"Sauerrahm", en:"Sour cream"}},
    {key:"passata", qty:180, unit:"ml", label:{de:"Passierte Tomaten", en:"Passata"}},
    {key:"salt_pepper", qty:1, unit:"pinch", label:{de:"Salz & Pfeffer", en:"Salt & pepper"}}
  ],

  steps:{
    de:[
      "Nudeln in salzigem Wasser kochen.",
      "Passierte Tomaten erhitzen, Pesto Rosso einrühren.",
      "Philadelphia unterrühren bis cremig.",
      "Sauerrahm dazugeben.",
      "Mit Salz & Pfeffer abschmecken.",
      "Etwas Nudelwasser zugeben falls zu dick.",
      "Nudeln unterheben und 1 Minute ziehen lassen."
    ],
    en:[
      "Cook pasta in salted water.",
      "Heat passata and stir in pesto rosso.",
      "Add cream cheese until creamy.",
      "Stir in sour cream.",
      "Season with salt & pepper.",
      "Add some pasta water if too thick.",
      "Mix in pasta and let sit for 1 minute."
    ]
  },

  tags:["pasta","vegetarian","creamy","ultra-lazy"]
},

{
  id:"lazy_omelette",
  time:6, maxIng:3, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Lazy Omelette", en:"Lazy Omelette"},
  ingredients:[
    {key:"egg", qty:3, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"cheese", qty:30, unit:"g", label:{de:"Käse", en:"Cheese"}}
  ],
  steps:{
    de:["Eier verquirlen.","In Pfanne stocken lassen.","Käse dazu."],
    en:["Whisk eggs.","Cook in pan.","Add cheese."]
  },
  tags:["egg","cheese","onePan"]
},

{
  id:"tomato_mozz_wrap",
  time:5, maxIng:4, noChop:false, onePan:false, ultraLazy:true,
  title:{de:"Tomato Mozzarella Wrap", en:"Tomato Mozzarella Wrap"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"cheese", qty:80, unit:"g", label:{de:"Mozzarella", en:"Mozzarella"}},
    {key:"tomato", qty:120, unit:"g", label:{de:"Tomate", en:"Tomato"}}
  ],
  steps:{
    de:["Tomate schneiden.","In Wrap geben.","Zusammenrollen."],
    en:["Slice tomato.","Add to wrap.","Roll up."]
  },
  tags:["wrap","cheese","tomato"]
},

// ===== Batch 1: 20 Lazy Chef recipes =====

{
  id:"tuna_mayo_rice",
  time:8, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Thunfisch-Mayo Rice Bowl", en:"Tuna Mayo Rice Bowl"},
  ingredients:[
    {key:"rice", qty:75, unit:"g", label:{de:"Reis (trocken) / Reste", en:"Rice (dry) / leftovers"}},
    {key:"tuna", qty:1, unit:"can", label:{de:"Thunfisch (Dose)", en:"Tuna (can)"}},
    {key:"mayo", qty:1, unit:"tbsp", label:{de:"Mayo", en:"Mayo"}},
    {key:"soy_sauce", qty:1, unit:"tsp", label:{de:"Sojasauce", en:"Soy sauce"}},
    {key:"chili_flakes", qty:1, unit:"pinch", label:{de:"Chili-Flocken", en:"Chili flakes"}}
  ],
  steps:{
    de:["Reis kochen oder Reste in eine Bowl.","Thunfisch abtropfen, mit Mayo + Sojasauce mischen.","Auf Reis geben, Chili drüber. Fertig."],
    en:["Cook rice or use leftovers in a bowl.","Drain tuna, mix with mayo + soy sauce.","Put on rice, add chili. Done."]
  }
},
{
  id:"egg_soy_rice",
  time:9, maxIng:5, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Soja-Ei Reispfanne", en:"Soy Egg Rice Pan"},
  ingredients:[
    {key:"rice", qty:75, unit:"g", label:{de:"Reis (trocken) / Reste", en:"Rice (dry) / leftovers"}},
    {key:"egg", qty:2, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"soy_sauce", qty:1, unit:"tbsp", label:{de:"Sojasauce", en:"Soy sauce"}},
    {key:"oil", qty:1, unit:"tsp", label:{de:"Öl", en:"Oil"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Pfanne erhitzen, Öl rein.","Eier reinschlagen, kurz stocken lassen.","Reis dazu (oder Reste), Sojasauce rein.","1–2 Min rühren, pfeffern. Fertig."],
    en:["Heat pan, add oil.","Crack eggs in, let set briefly.","Add rice (or leftovers), add soy sauce.","Stir 1–2 min, pepper. Done."]
  }
},
{
  id:"pesto_chicken_pasta",
  time:10, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"Pesto Chicken Pasta", en:"Pesto Chicken Pasta"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"pesto", qty:1, unit:"tbsp", label:{de:"Pesto", en:"Pesto"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Pasta kochen (Salz ins Wasser).","Hähnchen in Pfanne anbraten (oder kurz durchgaren).","Pasta abgießen, direkt in die Pfanne.","Pesto rein, pfeffern, 30 Sek. mischen."],
    en:["Cook pasta (salt the water).","Pan-fry chicken until done.","Drain pasta, add to pan.","Add pesto, pepper, toss 30 sec."]
  }
},
{
  id:"tomato_mozz_wrap",
  time:6, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Tomate-Mozzarella Wrap", en:"Tomato Mozzarella Wrap"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"tomato", qty:120, unit:"g", label:{de:"Tomaten", en:"Tomatoes"}},
    {key:"mozzarella", qty:125, unit:"g", label:{de:"Mozzarella", en:"Mozzarella"}},
    {key:"olive_oil", qty:1, unit:"tsp", label:{de:"Olivenöl", en:"Olive oil"}},
    {key:"oregano", qty:1, unit:"pinch", label:{de:"Oregano", en:"Oregano"}}
  ],
  steps:{
    de:["Tomaten grob schneiden (oder halbieren).","Alles in den Wrap: Tomate + Mozzarella.","Öl + Oregano drüber, optional Salz/Pfeffer.","Einrollen, fertig."],
    en:["Rough-chop tomatoes (or halve).","Add tomato + mozzarella to wrap.","Drizzle oil + oregano, optional salt/pepper.","Roll up, done."]
  }
},
{
  id:"skyr_garlic_dip_wrap",
  time:5, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Skyr-Knoblauch Wrap Dip", en:"Skyr Garlic Wrap Dip"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"skyr", qty:200, unit:"g", label:{de:"Skyr", en:"Skyr"}},
    {key:"garlic_powder", qty:1, unit:"pinch", label:{de:"Knoblauchpulver", en:"Garlic powder"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Skyr + Knoblauchpulver + Salz + Pfeffer verrühren.","Wrap aufrollen/klein schneiden.","Dip in Schüssel, Wrap dippen. Ultra-lazy."],
    en:["Mix skyr + garlic powder + salt + pepper.","Roll/slice wrap.","Dip and eat. Ultra-lazy."]
  }
},
{
  id:"oats_skyr_cinnamon",
  time:4, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Skyr-Zimt Oat Bowl", en:"Skyr Cinnamon Oat Bowl"},
  ingredients:[
    {key:"oats", qty:60, unit:"g", label:{de:"Haferflocken", en:"Oats"}},
    {key:"skyr", qty:200, unit:"g", label:{de:"Skyr", en:"Skyr"}},
    {key:"milk", qty:60, unit:"ml", label:{de:"Milch (optional)", en:"Milk (optional)"}},
    {key:"cinnamon", qty:1, unit:"pinch", label:{de:"Zimt", en:"Cinnamon"}},
    {key:"honey", qty:1, unit:"tsp", label:{de:"Honig (optional)", en:"Honey (optional)"}}
  ],
  steps:{
    de:["Hafer + Skyr in Bowl.","Mit Milch cremiger machen (optional).","Zimt + Honig drüber. Fertig."],
    en:["Oats + skyr in a bowl.","Add milk for creaminess (optional).","Add cinnamon + honey. Done."]
  }
},
{
  id:"cottage_tomato_bowl",
  time:5, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Hüttenkäse-Tomaten Bowl", en:"Cottage Cheese Tomato Bowl"},
  ingredients:[
    {key:"cottage_cheese", qty:200, unit:"g", label:{de:"Hüttenkäse", en:"Cottage cheese"}},
    {key:"tomato", qty:120, unit:"g", label:{de:"Tomaten", en:"Tomatoes"}},
    {key:"olive_oil", qty:1, unit:"tsp", label:{de:"Olivenöl", en:"Olive oil"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Tomaten schneiden, mit Hüttenkäse mischen.","Öl + Salz + Pfeffer drauf.","Optional: Oregano/Chili."],
    en:["Chop tomatoes, mix with cottage cheese.","Add oil + salt + pepper.","Optional: oregano/chili."]
  }
},
{
  id:"butter_egg_toast",
  time:7, maxIng:5, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Butter-Ei Toast", en:"Butter Egg Toast"},
  ingredients:[
    {key:"bread", qty:2, unit:"slice", label:{de:"Toast", en:"Toast"}},
    {key:"egg", qty:2, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"butter", qty:1, unit:"tsp", label:{de:"Butter", en:"Butter"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Toast toastet (oder Pfanne kurz).","In Pfanne Butter schmelzen, Eier rein.","Salz/Pfeffer drauf.","Toast + Eier = fertig."],
    en:["Toast the bread.","Melt butter in pan, add eggs.","Salt/pepper.","Toast + eggs = done."]
  }
},
{
  id:"spicy_tuna_pasta",
  time:10, maxIng:5, noChop:true, onePan:false, ultraLazy:false,
  title:{de:"Spicy Tuna Pasta", en:"Spicy Tuna Pasta"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"tuna", qty:1, unit:"can", label:{de:"Thunfisch (Dose)", en:"Tuna (can)"}},
    {key:"tomato", qty:180, unit:"g", label:{de:"Tomate/Passata", en:"Tomato/passata"}},
    {key:"chili_flakes", qty:1, unit:"pinch", label:{de:"Chili-Flocken", en:"Chili flakes"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}}
  ],
  steps:{
    de:["Pasta kochen.","Tomate in Topf/Pfanne warm machen, Chili + Salz rein.","Thunfisch rein, 1 Min. ziehen lassen.","Pasta rein, mischen. Fertig."],
    en:["Cook pasta.","Warm tomato in pot/pan, add chili + salt.","Add tuna, heat 1 min.","Toss pasta in. Done."]
  }
},
{
  id:"onepan_chicken_tomato_rice",
  time:10, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"One-Pan Chicken Tomato Rice", en:"One-Pan Chicken Tomato Rice"},
  ingredients:[
    {key:"rice", qty:75, unit:"g", label:{de:"Reis (trocken)", en:"Rice (dry)"}},
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"tomato", qty:180, unit:"g", label:{de:"Tomate/Passata", en:"Tomato/passata"}},
    {key:"paprika", qty:1, unit:"pinch", label:{de:"Paprika edelsüß", en:"Paprika"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}}
  ],
  steps:{
    de:["Hähnchen in Pfanne anbraten (Salz + Paprika).","Tomate rein, kurz aufkochen.","Gekochten Reis rein (oder Reste), 1–2 Min mischen.","Fertig."],
    en:["Pan-fry chicken (salt + paprika).","Add tomato, simmer briefly.","Add cooked rice (or leftovers), toss 1–2 min.","Done."]
  }
},
{
  id:"pesto_egg_wrap",
  time:7, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"Pesto-Ei Wrap", en:"Pesto Egg Wrap"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"egg", qty:2, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"pesto", qty:1, unit:"tbsp", label:{de:"Pesto", en:"Pesto"}},
    {key:"oil", qty:1, unit:"tsp", label:{de:"Öl", en:"Oil"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Eier in Pfanne mit Öl rühren (Rührei).","Wrap kurz erwärmen (optional).","Pesto auf den Wrap, Rührei drauf, pfeffern.","Einrollen, fertig."],
    en:["Scramble eggs in a pan with oil.","Warm wrap (optional).","Spread pesto, add eggs, pepper.","Roll up, done."]
  }
},
{
  id:"skyr_tuna_dip_toast",
  time:6, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Skyr-Thunfisch Toast Dip", en:"Skyr Tuna Toast Dip"},
  ingredients:[
    {key:"bread", qty:2, unit:"slice", label:{de:"Toast", en:"Toast"}},
    {key:"tuna", qty:1, unit:"can", label:{de:"Thunfisch (Dose)", en:"Tuna (can)"}},
    {key:"skyr", qty:150, unit:"g", label:{de:"Skyr", en:"Skyr"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Thunfisch abtropfen, mit Skyr mischen.","Salz/Pfeffer rein.","Toast toastet, dippen. Fertig."],
    en:["Drain tuna, mix with skyr.","Add salt/pepper.","Toast bread, dip. Done."]
  }
},
{
  id:"chicken_wrap_garlic",
  time:9, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"Garlic Chicken Wrap", en:"Garlic Chicken Wrap"},
  ingredients:[
    {key:"wrap", qty:1, unit:"wrap", label:{de:"Wrap", en:"Wrap"}},
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"garlic_powder", qty:1, unit:"pinch", label:{de:"Knoblauchpulver", en:"Garlic powder"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"oil", qty:1, unit:"tsp", label:{de:"Öl", en:"Oil"}}
  ],
  steps:{
    de:["Hähnchen in Pfanne mit Öl braten.","Salz + Knoblauchpulver drüber.","Wrap füllen, einrollen.","Optional: Pfeffer/Chili."],
    en:["Pan-fry chicken with oil.","Add salt + garlic powder.","Fill wrap, roll up.","Optional: pepper/chili."]
  }
},
{
  id:"cheese_pesto_toast",
  time:6, maxIng:5, noChop:true, onePan:true, ultraLazy:true,
  title:{de:"Pesto-Käse Toast", en:"Pesto Cheese Toast"},
  ingredients:[
    {key:"bread", qty:2, unit:"slice", label:{de:"Toast", en:"Toast"}},
    {key:"pesto", qty:1, unit:"tbsp", label:{de:"Pesto", en:"Pesto"}},
    {key:"cheese", qty:50, unit:"g", label:{de:"Käse", en:"Cheese"}},
    {key:"butter", qty:1, unit:"tsp", label:{de:"Butter", en:"Butter"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Toast leicht buttern.","Pesto drauf, Käse drüber.","In Pfanne/Toaster bis Käse schmilzt.","Pfeffer drauf. Fertig."],
    en:["Lightly butter toast.","Add pesto, top with cheese.","Toast/pan until melted.","Pepper. Done."]
  }
},
{
  id:"oats_yogurt_crunch",
  time:4, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Joghurt Crunch Oats", en:"Yogurt Crunch Oats"},
  ingredients:[
    {key:"oats", qty:60, unit:"g", label:{de:"Haferflocken", en:"Oats"}},
    {key:"yogurt", qty:200, unit:"g", label:{de:"Joghurt", en:"Yogurt"}},
    {key:"honey", qty:1, unit:"tsp", label:{de:"Honig (optional)", en:"Honey (optional)"}},
    {key:"cinnamon", qty:1, unit:"pinch", label:{de:"Zimt", en:"Cinnamon"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Prise Salz", en:"Pinch of salt"}}
  ],
  steps:{
    de:["Joghurt in Bowl.","Hafer drauf, Zimt + Prise Salz.","Optional Honig. Fertig."],
    en:["Yogurt in a bowl.","Top with oats, cinnamon + pinch of salt.","Optional honey. Done."]
  }
},
{
  id:"skyr_protein_pasta_pesto",
  time:10, maxIng:5, noChop:true, onePan:false, ultraLazy:false,
  title:{de:"Protein-Pesto Pasta (Skyr)", en:"Protein Pesto Pasta (Skyr)"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"skyr", qty:150, unit:"g", label:{de:"Skyr", en:"Skyr"}},
    {key:"pesto", qty:1, unit:"tbsp", label:{de:"Pesto", en:"Pesto"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}}
  ],
  steps:{
    de:["Pasta kochen, 2 EL Kochwasser aufheben.","Skyr + Pesto + bisschen Kochwasser cremig rühren.","Pasta abgießen, Sauce drüber.","Salz/Pfeffer. Fertig."],
    en:["Cook pasta, save 2 tbsp pasta water.","Mix skyr + pesto + a bit of water until creamy.","Drain pasta, add sauce.","Salt/pepper. Done."]
  }
},
{
  id:"egg_tomato_toast",
  time:8, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"Tomaten-Ei Toast", en:"Tomato Egg Toast"},
  ingredients:[
    {key:"bread", qty:2, unit:"slice", label:{de:"Toast", en:"Toast"}},
    {key:"egg", qty:2, unit:"pcs", label:{de:"Eier", en:"Eggs"}},
    {key:"tomato", qty:120, unit:"g", label:{de:"Tomaten", en:"Tomatoes"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"oregano", qty:1, unit:"pinch", label:{de:"Oregano", en:"Oregano"}}
  ],
  steps:{
    de:["Toast toastet.","Tomaten kurz in Pfanne anwärmen (optional).","Eier als Spiegelei/Rührei machen.","Toast + Tomate + Ei, Salz/Oregano drauf."],
    en:["Toast bread.","Warm tomatoes briefly (optional).","Cook eggs (fried/scrambled).","Toast + tomato + egg, add salt/oregano."]
  }
},
{
  id:"chicken_mayo_rice",
  time:9, maxIng:5, noChop:true, onePan:true, ultraLazy:false,
  title:{de:"Chicken-Mayo Rice Bowl", en:"Chicken Mayo Rice Bowl"},
  ingredients:[
    {key:"rice", qty:75, unit:"g", label:{de:"Reis (trocken) / Reste", en:"Rice (dry) / leftovers"}},
    {key:"chicken", qty:150, unit:"g", label:{de:"Hähnchenbrust", en:"Chicken breast"}},
    {key:"mayo", qty:1, unit:"tbsp", label:{de:"Mayo", en:"Mayo"}},
    {key:"pepper", qty:1, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}}
  ],
  steps:{
    de:["Chicken in Pfanne braten, Salz/Pfeffer.","Reis in Bowl (gekocht).","Mayo drüber, Chicken drauf, kurz mischen.","Fertig."],
    en:["Pan-fry chicken, salt/pepper.","Put cooked rice in a bowl.","Add mayo, top with chicken, mix.","Done."]
  }
},
{
  id:"quick_pasta_butter_pepper",
  time:10, maxIng:5, noChop:true, onePan:false, ultraLazy:true,
  title:{de:"Butter-Pfeffer Pasta", en:"Butter Pepper Pasta"},
  ingredients:[
    {key:"pasta", qty:80, unit:"g", label:{de:"Pasta (trocken)", en:"Pasta (dry)"}},
    {key:"butter", qty:1, unit:"tbsp", label:{de:"Butter", en:"Butter"}},
    {key:"pepper", qty:2, unit:"pinch", label:{de:"Pfeffer", en:"Pepper"}},
    {key:"salt", qty:1, unit:"pinch", label:{de:"Salz", en:"Salt"}},
    {key:"cheese", qty:30, unit:"g", label:{de:"Käse (optional)", en:"Cheese (optional)"}}
  ],
  steps:{
    de:["Pasta kochen (salzen).","Abgießen, Butter rein, pfeffern.","Optional Käse drüber, 20 Sek. mischen.","Fertig."],
    en:["Cook pasta (salted water).","Drain, add butter, pepper.","Optional cheese, toss 20 sec.","Done."]
  }
},

];