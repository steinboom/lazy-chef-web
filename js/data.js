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
  "salat":"salad","salad":"salad"
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
}

];