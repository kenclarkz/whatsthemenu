-- Whats For Dinner — starter recipe library
-- Run after schema.sql. These recipes are global (family_id = null),
-- so every family can see and suggest them.

insert into public.recipes (title, description, image_url, category, servings, prep_minutes, cook_minutes, ingredients, instructions) values
(
  'Classic Margherita Pizza',
  'Crispy blistered crust, sweet San Marzano tomatoes, and pools of fresh mozzarella.',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
  'Pizza', 4, 30, 12,
  '[{"name":"Pizza dough","quantity":"1","unit":"ball","aisle":"Bakery"},{"name":"San Marzano tomatoes","quantity":"14","unit":"oz","aisle":"Pantry"},{"name":"Fresh mozzarella","quantity":"8","unit":"oz","aisle":"Dairy"},{"name":"Fresh basil","quantity":"1","unit":"bunch","aisle":"Produce"},{"name":"Olive oil","quantity":"2","unit":"tbsp","aisle":"Pantry"},{"name":"Garlic","quantity":"2","unit":"cloves","aisle":"Produce"},{"name":"Salt","quantity":"1","unit":"tsp","aisle":"Spices"}]',
  '["Heat oven with pizza steel to its highest setting for 45 minutes.","Crush tomatoes by hand with salt and a torn garlic clove.","Stretch dough to 12 inches, brush the rim with olive oil.","Spread sauce thinly, scatter torn mozzarella.","Bake 6–8 minutes until the crust is charred in spots.","Finish with basil leaves and a drizzle of olive oil."]'
),
(
  'Blueberry Pancake Stack',
  'Fluffy golden pancakes bursting with blueberries — weekend breakfast royalty.',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=1200&q=80',
  'Breakfast', 4, 15, 15,
  '[{"name":"All-purpose flour","quantity":"2","unit":"cups","aisle":"Pantry"},{"name":"Milk","quantity":"1.5","unit":"cups","aisle":"Dairy"},{"name":"Eggs","quantity":"2","unit":"","aisle":"Dairy"},{"name":"Butter","quantity":"3","unit":"tbsp","aisle":"Dairy"},{"name":"Blueberries","quantity":"1","unit":"cup","aisle":"Produce"},{"name":"Maple syrup","quantity":"0.5","unit":"cup","aisle":"Pantry"},{"name":"Baking powder","quantity":"1","unit":"tbsp","aisle":"Pantry"}]',
  '["Whisk flour, baking powder, and a pinch of salt.","Whisk milk, eggs, and melted butter; fold into dry mix.","Fold in blueberries gently.","Ladle batter onto a buttered griddle over medium heat.","Flip when bubbles pop, cook until golden.","Stack high and drown in maple syrup."]'
),
(
  'Street-Style Beef Tacos',
  'Char-grilled beef, bright salsa verde, and lime on warm corn tortillas.',
  'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=80',
  'Mexican', 4, 20, 15,
  '[{"name":"Flank steak","quantity":"1","unit":"lb","aisle":"Meat & Seafood"},{"name":"Corn tortillas","quantity":"12","unit":"","aisle":"Bakery"},{"name":"Tomatillos","quantity":"8","unit":"","aisle":"Produce"},{"name":"White onion","quantity":"1","unit":"","aisle":"Produce"},{"name":"Cilantro","quantity":"1","unit":"bunch","aisle":"Produce"},{"name":"Limes","quantity":"3","unit":"","aisle":"Produce"},{"name":"Cumin","quantity":"1","unit":"tsp","aisle":"Spices"}]',
  '["Rub steak with cumin, salt, and pepper; rest 10 minutes.","Char tomatillos and half the onion under the broiler.","Blend charred veggies with cilantro for salsa verde.","Grill steak 4 minutes per side for medium-rare; rest and dice.","Toast tortillas directly over the flame.","Build tacos with salsa, diced onion, cilantro, and a big squeeze of lime."]'
),
(
  'Creamy Tuscan Salmon',
  'Pan-seared salmon in a garlicky sun-dried tomato cream sauce with wilted spinach.',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
  'Seafood', 4, 10, 20,
  '[{"name":"Salmon fillets","quantity":"4","unit":"","aisle":"Meat & Seafood"},{"name":"Heavy cream","quantity":"1","unit":"cup","aisle":"Dairy"},{"name":"Sun-dried tomatoes","quantity":"0.5","unit":"cup","aisle":"Pantry"},{"name":"Baby spinach","quantity":"4","unit":"cups","aisle":"Produce"},{"name":"Parmesan","quantity":"0.5","unit":"cup","aisle":"Dairy"},{"name":"Garlic","quantity":"4","unit":"cloves","aisle":"Produce"},{"name":"Olive oil","quantity":"2","unit":"tbsp","aisle":"Pantry"}]',
  '["Pat salmon dry, season generously, sear skin-side down 5 minutes.","Flip, cook 3 minutes more, then rest on a plate.","Sauté garlic and sun-dried tomatoes in the same pan.","Add cream and parmesan; simmer until silky.","Wilt spinach into the sauce.","Return salmon to the pan, spoon sauce over, serve."]'
),
(
  'Spaghetti Aglio e Olio',
  'Five pantry ingredients, ten minutes, pure garlicky gold.',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
  'Pasta', 4, 5, 12,
  '[{"name":"Spaghetti","quantity":"1","unit":"lb","aisle":"Pantry"},{"name":"Garlic","quantity":"8","unit":"cloves","aisle":"Produce"},{"name":"Olive oil","quantity":"0.5","unit":"cup","aisle":"Pantry"},{"name":"Red pepper flakes","quantity":"1","unit":"tsp","aisle":"Spices"},{"name":"Parsley","quantity":"0.5","unit":"cup","aisle":"Produce"},{"name":"Parmesan","quantity":"0.5","unit":"cup","aisle":"Dairy"}]',
  '["Boil spaghetti in aggressively salted water until al dente.","Warm olive oil with sliced garlic over low heat until barely golden.","Add pepper flakes off the heat.","Toss pasta into the oil with a big splash of pasta water.","Stir vigorously until glossy and emulsified.","Shower with parsley and parmesan."]'
),
(
  'Butter Chicken',
  'Velvety tomato curry with warm spices — better than takeout night.',
  'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=1200&q=80',
  'Indian', 6, 25, 35,
  '[{"name":"Chicken thighs","quantity":"2","unit":"lb","aisle":"Meat & Seafood"},{"name":"Yogurt","quantity":"0.75","unit":"cup","aisle":"Dairy"},{"name":"Tomato passata","quantity":"28","unit":"oz","aisle":"Pantry"},{"name":"Heavy cream","quantity":"0.5","unit":"cup","aisle":"Dairy"},{"name":"Butter","quantity":"4","unit":"tbsp","aisle":"Dairy"},{"name":"Garam masala","quantity":"2","unit":"tbsp","aisle":"Spices"},{"name":"Ginger","quantity":"1","unit":"tbsp","aisle":"Produce"},{"name":"Basmati rice","quantity":"2","unit":"cups","aisle":"Pantry"}]',
  '["Marinate chicken in yogurt, ginger, and garam masala for 20+ minutes.","Char chicken pieces under the broiler.","Melt butter, bloom remaining spices, add passata and simmer 10 minutes.","Stir in cream and the charred chicken.","Simmer gently 10 minutes until thickened.","Serve over basmati rice with naan."]'
),
(
  'Rainbow Veggie Stir-Fry',
  'A crunchy, colorful weeknight stir-fry with ginger-soy glaze.',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
  'Healthy', 4, 15, 10,
  '[{"name":"Bell peppers","quantity":"3","unit":"","aisle":"Produce"},{"name":"Broccoli","quantity":"1","unit":"head","aisle":"Produce"},{"name":"Carrots","quantity":"2","unit":"","aisle":"Produce"},{"name":"Snap peas","quantity":"2","unit":"cups","aisle":"Produce"},{"name":"Soy sauce","quantity":"0.33","unit":"cup","aisle":"Pantry"},{"name":"Fresh ginger","quantity":"1","unit":"tbsp","aisle":"Produce"},{"name":"Garlic","quantity":"3","unit":"cloves","aisle":"Produce"},{"name":"Sesame oil","quantity":"1","unit":"tbsp","aisle":"Pantry"},{"name":"Jasmine rice","quantity":"2","unit":"cups","aisle":"Pantry"}]',
  '["Cook jasmine rice according to package directions.","Prep all vegetables before heating the wok.","Sear hardest veggies first: carrots, broccoli, peppers.","Add snap peas, garlic, and ginger for the final minute.","Pour in soy sauce mixture and toss until glazed.","Serve over rice with sesame seeds."]'
),
(
  'Smash Burgers',
  'Lacy-edged patties, molten cheddar, and secret sauce on toasted buns.',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
  'Comfort Food', 4, 15, 10,
  '[{"name":"Ground beef 80/20","quantity":"1.5","unit":"lb","aisle":"Meat & Seafood"},{"name":"Cheddar cheese","quantity":"6","unit":"slices","aisle":"Dairy"},{"name":"Burger buns","quantity":"4","unit":"","aisle":"Bakery"},{"name":"Iceberg lettuce","quantity":"0.25","unit":"head","aisle":"Produce"},{"name":"Tomato","quantity":"2","unit":"","aisle":"Produce"},{"name":"Pickles","quantity":"8","unit":"chips","aisle":"Pantry"},{"name":"Mayonnaise","quantity":"0.25","unit":"cup","aisle":"Pantry"},{"name":"Ketchup","quantity":"2","unit":"tbsp","aisle":"Pantry"}]',
  '["Roll beef into 8 loose balls — do not compress.","Mix mayo, ketchup, and pickle relish for secret sauce.","Smash balls flat on a ripping-hot griddle for 90 seconds.","Flip, cheese immediately, stack in pairs.","Toast buns in the beef drippings.","Sauce both sides, pile high with lettuce, tomato, pickles."]'
),
(
  'Weeknight Chicken Noodle Soup',
  'Golden broth, tender noodles, and a mountain of dill — edible comfort.',
  'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80',
  'Soup', 6, 15, 40,
  '[{"name":"Chicken breast","quantity":"1","unit":"lb","aisle":"Meat & Seafood"},{"name":"Egg noodles","quantity":"8","unit":"oz","aisle":"Pantry"},{"name":"Carrots","quantity":"3","unit":"","aisle":"Produce"},{"name":"Celery","quantity":"3","unit":"stalks","aisle":"Produce"},{"name":"Yellow onion","quantity":"1","unit":"","aisle":"Produce"},{"name":"Chicken stock","quantity":"8","unit":"cups","aisle":"Pantry"},{"name":"Fresh dill","quantity":"0.25","unit":"cup","aisle":"Produce"},{"name":"Lemon","quantity":"1","unit":"","aisle":"Produce"}]',
  '["Sweat onion, carrot, and celery in butter until soft.","Add stock and whole chicken breasts; simmer 20 minutes.","Shred chicken with two forks.","Cook noodles right in the broth.","Finish with dill, lemon juice, salt, and lots of black pepper.","Slurp under a blanket."]'
),
(
  'Sheet-Pan Fajitas',
  'One tray, sizzling peppers and spiced chicken, zero fuss.',
  'https://images.unsplash.com/photo-1552055568-f8e3d9f0cf85?auto=format&fit=crop&w=1200&q=80',
  'Mexican', 4, 10, 25,
  '[{"name":"Chicken breasts","quantity":"1.5","unit":"lb","aisle":"Meat & Seafood"},{"name":"Bell peppers","quantity":"3","unit":"","aisle":"Produce"},{"name":"Red onion","quantity":"2","unit":"","aisle":"Produce"},{"name":"Fajita seasoning","quantity":"2","unit":"tbsp","aisle":"Spices"},{"name":"Flour tortillas","quantity":"8","unit":"","aisle":"Bakery"},{"name":"Avocado","quantity":"2","unit":"","aisle":"Produce"},{"name":"Sour cream","quantity":"0.5","unit":"cup","aisle":"Dairy"}]',
  '["Toss chicken strips and veggies with oil and fajita seasoning.","Spread on two sheet pans without crowding.","Roast at 425°F for 20–25 minutes.","Broil 2 minutes for charry edges.","Wrap tortillas in foil and warm in the oven 5 minutes.","Serve with avocado and sour cream."]'
),
(
  'Miso Ramen Night',
  'Rich miso broth, jammy eggs, and chewy noodles — slurp approved.',
  'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80',
  'Asian', 4, 20, 30,
  '[{"name":"Ramen noodles","quantity":"4","unit":"packs","aisle":"Pantry"},{"name":"White miso paste","quantity":"4","unit":"tbsp","aisle":"Pantry"},{"name":"Chicken stock","quantity":"6","unit":"cups","aisle":"Pantry"},{"name":"Eggs","quantity":"4","unit":"","aisle":"Dairy"},{"name":"Baby bok choy","quantity":"4","unit":"","aisle":"Produce"},{"name":"Scallions","quantity":"1","unit":"bunch","aisle":"Produce"},{"name":"Corn kernels","quantity":"1","unit":"cup","aisle":"Frozen"},{"name":"Sesame oil","quantity":"1","unit":"tbsp","aisle":"Pantry"}]',
  '["Soft-boil eggs exactly 6.5 minutes; peel and halve.","Simmer stock; whisk in miso off the boil.","Char bok choy in sesame oil.","Cook noodles separately, drain well.","Assemble: noodles, broth, corn, choy, eggs, scallions.","Extra chili crisp encouraged."]'
),
(
  'Caprese Pasta Salad',
  'Summer in a bowl — burst cherry tomatoes, mozzarella pearls, basil ribbons.',
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
  'Salad', 6, 15, 12,
  '[{"name":"Farfalle pasta","quantity":"1","unit":"lb","aisle":"Pantry"},{"name":"Cherry tomatoes","quantity":"2","unit":"pints","aisle":"Produce"},{"name":"Mini mozzarella balls","quantity":"8","unit":"oz","aisle":"Dairy"},{"name":"Fresh basil","quantity":"1","unit":"bunch","aisle":"Produce"},{"name":"Balsamic glaze","quantity":"3","unit":"tbsp","aisle":"Pantry"},{"name":"Olive oil","quantity":"0.25","unit":"cup","aisle":"Pantry"},{"name":"Red onion","quantity":"0.5","unit":"","aisle":"Produce"}]',
  '["Cook farfalle al dente; rinse briefly under cool water.","Blister half the tomatoes in a hot dry pan.","Halve the rest raw for sweetness contrast.","Toss pasta, tomatoes, mozzarella, and slivered onion with oil.","Season boldly — pasta drinks up salt.","Top with basil ribbons and zigzags of balsamic glaze."]'
),
(
  'Crispy Fish Tacos',
  'Beer-battered fish, crunchy slaw, and chipotle crema.',
  'https://images.unsplash.com/photo-1613516084499-cc7ed96536f4?auto=format&fit=crop&w=1200&q=80',
  'Seafood', 4, 25, 20,
  '[{"name":"Cod fillets","quantity":"1.5","unit":"lb","aisle":"Meat & Seafood"},{"name":"Flour tortillas","quantity":"8","unit":"","aisle":"Bakery"},{"name":"Cabbage slaw mix","quantity":"8","unit":"oz","aisle":"Produce"},{"name":"Limes","quantity":"3","unit":"","aisle":"Produce"},{"name":"Chipotle in adobo","quantity":"2","unit":"tbsp","aisle":"Pantry"},{"name":"Mayonnaise","quantity":"0.5","unit":"cup","aisle":"Pantry"},{"name":"Beer","quantity":"1","unit":"cup","aisle":"Pantry"},{"name":"Flour","quantity":"1","unit":"cup","aisle":"Pantry"}]',
  '["Whisk flour, beer, and salt into a thin batter.","Whisk mayo, chipotle, and lime juice for crema.","Toss slaw with lime and salt.","Dip fish strips in batter, fry at 375°F until deeply golden.","Drain on a rack — never paper towels.","Build tacos: fish, slaw, crema, extra lime."]'
),
(
  'Mushroom Risotto',
  'Slow-stirred arborio with browned mushrooms and a cloud of parmesan.',
  'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=1200&q=80',
  'Comfort Food', 4, 15, 35,
  '[{"name":"Arborio rice","quantity":"1.5","unit":"cups","aisle":"Pantry"},{"name":"Mixed mushrooms","quantity":"1","unit":"lb","aisle":"Produce"},{"name":"Vegetable stock","quantity":"6","unit":"cups","aisle":"Pantry"},{"name":"White wine","quantity":"0.5","unit":"cup","aisle":"Pantry"},{"name":"Parmesan","quantity":"1","unit":"cup","aisle":"Dairy"},{"name":"Butter","quantity":"4","unit":"tbsp","aisle":"Dairy"},{"name":"Shallots","quantity":"2","unit":"","aisle":"Produce"}]',
  '["Brown mushrooms in batches; reserve.","Soften shallots in butter, toast rice until translucent at edges.","Deglaze with wine.","Add hot stock one ladle at a time, stirring often, 18–22 minutes.","Fold in mushrooms, parmesan, and cold butter off heat.","It should ripple slowly on the plate — loosen with more stock if needed."]'
),
(
  'Honey Garlic Chicken Thighs',
  'Sticky-sweet lacquered thighs with a four-ingredient glaze.',
  'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=1200&q=80',
  'Comfort Food', 4, 10, 25,
  '[{"name":"Bone-in chicken thighs","quantity":"6","unit":"","aisle":"Meat & Seafood"},{"name":"Honey","quantity":"0.33","unit":"cup","aisle":"Pantry"},{"name":"Soy sauce","quantity":"0.33","unit":"cup","aisle":"Pantry"},{"name":"Garlic","quantity":"6","unit":"cloves","aisle":"Produce"},{"name":"Rice vinegar","quantity":"1","unit":"tbsp","aisle":"Pantry"},{"name":"Scallions","quantity":"4","unit":"","aisle":"Produce"},{"name":"Steamed rice","quantity":"3","unit":"cups","aisle":"Pantry"}]',
  '["Season thighs and sear skin-side down until deep amber, 8 minutes.","Flip and cook 5 minutes more; remove.","Pour off fat, sauté minced garlic briefly.","Add honey, soy, vinegar; bubble to syrupy.","Return thighs skin-side up and spoon glaze over.","Scatter scallions and serve over steamed rice."]'
),
(
  'Loaded Breakfast Burritos',
  'Crispy potatoes, scrambled eggs, bacon, and avocado — freezable too.',
  'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=1200&q=80',
  'Breakfast', 4, 20, 20,
  '[{"name":"Large flour tortillas","quantity":"4","unit":"","aisle":"Bakery"},{"name":"Eggs","quantity":"8","unit":"","aisle":"Dairy"},{"name":"Yukon potatoes","quantity":"1","unit":"lb","aisle":"Produce"},{"name":"Bacon","quantity":"8","unit":"slices","aisle":"Meat & Seafood"},{"name":"Avocado","quantity":"2","unit":"","aisle":"Produce"},{"name":"Pepper jack cheese","quantity":"1","unit":"cup","aisle":"Dairy"},{"name":"Salsa","quantity":"0.5","unit":"cup","aisle":"Pantry"}]',
  '["Fry bacon until crisp; pour off most fat.","Dice potatoes small and fry in bacon fat until crunchy.","Soft-scramble eggs low and slow.","Warm tortillas until pliable.","Layer eggs, potatoes, bacon, cheese, avocado, salsa.","Roll tight, seam-side down in a hot pan to seal."]'
),
(
  'Pad Thai for Two... or Four',
  'Sweet-tangy tamarind noodles with peanuts and charred tofu or shrimp.',
  'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1200&q=80',
  'Asian', 4, 20, 15,
  '[{"name":"Rice noodles","quantity":"8","unit":"oz","aisle":"Pantry"},{"name":"Shrimp","quantity":"1","unit":"lb","aisle":"Meat & Seafood"},{"name":"Tamarind paste","quantity":"3","unit":"tbsp","aisle":"Pantry"},{"name":"Fish sauce","quantity":"2","unit":"tbsp","aisle":"Pantry"},{"name":"Palm sugar","quantity":"3","unit":"tbsp","aisle":"Pantry"},{"name":"Eggs","quantity":"3","unit":"","aisle":"Dairy"},{"name":"Bean sprouts","quantity":"2","unit":"cups","aisle":"Produce"},{"name":"Peanuts","quantity":"0.5","unit":"cup","aisle":"Pantry"}]',
  '["Soak noodles in hot tap water until bendy, not soft.","Melt tamarind, fish sauce, and palm sugar into sauce.","Sear shrimp hard, push aside; scramble eggs in the middle.","Add noodles and sauce; toss constantly 2 minutes.","Fold in sprouts and peanuts off heat.","Lime wedge and chili flakes to finish."]'
),
(
  'Sunday Pot Roast',
  'Fall-apart chuck roast with buttery potatoes and carrots in red-wine gravy.',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  'Comfort Food', 6, 20, 210,
  '[{"name":"Chuck roast","quantity":"3","unit":"lb","aisle":"Meat & Seafood"},{"name":"Yukon potatoes","quantity":"1.5","unit":"lb","aisle":"Produce"},{"name":"Carrots","quantity":"4","unit":"","aisle":"Produce"},{"name":"Yellow onions","quantity":"2","unit":"","aisle":"Produce"},{"name":"Beef stock","quantity":"3","unit":"cups","aisle":"Pantry"},{"name":"Red wine","quantity":"1","unit":"cup","aisle":"Pantry"},{"name":"Tomato paste","quantity":"2","unit":"tbsp","aisle":"Pantry"},{"name":"Rosemary","quantity":"2","unit":"sprigs","aisle":"Produce"}]',
  '["Sear the roast on every surface until mahogany, 15 minutes total.","Caramelize onions, then tomato paste.","Deglaze with wine and scrape up the fond.","Return roast with stock and herbs; braise covered at 300°F for 2.5 hours.","Add potatoes and carrots for the final hour.","Rest meat 15 minutes; reduce liquid into gravy."]'
),
(
  'Green Goddess Grain Bowls',
  'Quinoa, roasted chickpeas, avocado, and a herby yogurt dressing.',
  'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=1200&q=80',
  'Healthy', 4, 20, 25,
  '[{"name":"Quinoa","quantity":"1","unit":"cup","aisle":"Pantry"},{"name":"Chickpeas","quantity":"2","unit":"cans","aisle":"Pantry"},{"name":"Avocados","quantity":"2","unit":"","aisle":"Produce"},{"name":"Cucumber","quantity":"1","unit":"","aisle":"Produce"},{"name":"Greek yogurt","quantity":"0.75","unit":"cup","aisle":"Dairy"},{"name":"Fresh herbs (basil/parsley/dill)","quantity":"1","unit":"cup","aisle":"Produce"},{"name":"Lemon","quantity":"1","unit":"","aisle":"Produce"},{"name":"Olive oil","quantity":"3","unit":"tbsp","aisle":"Pantry"}]',
  '["Roast drained chickpeas with smoked paprika at 425°F for 25 minutes.","Cook quinoa and fluff.","Blend yogurt, herbs, lemon, oil, and garlic into dressing.","Halve cucumber and slice avocado.","Layer grains, chickpeas, and veg in wide bowls.","Swirl dressing over everything."]'
),
(
  'BBQ Chicken Skewers',
  'Charred sweet-and-smoky skewers with grilled pineapple.',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
  'Comfort Food', 4, 20, 15,
  '[{"name":"Chicken thighs (boneless)","quantity":"2","unit":"lb","aisle":"Meat & Seafood"},{"name":"BBQ sauce","quantity":"1","unit":"cup","aisle":"Pantry"},{"name":"Fresh pineapple","quantity":"0.5","unit":"","aisle":"Produce"},{"name":"Red onion","quantity":"1","unit":"","aisle":"Produce"},{"name":"Smoked paprika","quantity":"1","unit":"tsp","aisle":"Spices"},{"name":"Lime","quantity":"1","unit":"","aisle":"Produce"}]',
  '["Cube thighs and toss with oil, paprika, salt.","Skewer alternating chicken, pineapple chunks, onion petals.","Grill over medium-high, turning every 3 minutes.","Brush with BBQ sauce only during the last 4 minutes.","Look for glossy charred edges.","Hit with lime juice before serving."]'
),
(
  'Rigatoni alla Vodka',
  'Silky blush sauce with a whisper of heat and crispy pancetta crumble.',
  'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=1200&q=80',
  'Pasta', 4, 10, 25,
  '[{"name":"Rigatoni","quantity":"1","unit":"lb","aisle":"Pantry"},{"name":"Pancetta","quantity":"4","unit":"oz","aisle":"Meat & Seafood"},{"name":"Crushed tomatoes","quantity":"28","unit":"oz","aisle":"Pantry"},{"name":"Vodka","quantity":"0.25","unit":"cup","aisle":"Pantry"},{"name":"Heavy cream","quantity":"0.5","unit":"cup","aisle":"Dairy"},{"name":"Parmesan","quantity":"1","unit":"cup","aisle":"Dairy"},{"name":"Calabrian chili paste","quantity":"1","unit":"tsp","aisle":"Pantry"}]',
  '["Render pancetta until crisp; remove but keep the fat.","Sauté shallot, add tomato paste and chili.","Carefully add vodka and reduce 2 minutes.","Stir in crushed tomatoes; simmer 15 minutes.","Lower heat, swirl in cream and parmesan.","Toss rigatoni with splashes of pasta water until velvety."]'
),
(
  'Chocolate Lava Cakes',
  'Molten-centered mini cakes — restaurant drama, 25 minutes of work.',
  'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
  'Dessert', 4, 15, 12,
  '[{"name":"Dark chocolate (70%)","quantity":"6","unit":"oz","aisle":"Pantry"},{"name":"Butter","quantity":"0.5","unit":"cup","aisle":"Dairy"},{"name":"Eggs","quantity":"3","unit":"","aisle":"Dairy"},{"name":"Powdered sugar","quantity":"1","unit":"cup","aisle":"Pantry"},{"name":"Flour","quantity":"0.25","unit":"cup","aisle":"Pantry"},{"name":"Vanilla ice cream","quantity":"4","unit":"scoops","aisle":"Frozen"}]',
  '["Melt chocolate and butter together until smooth.","Whisk eggs and powdered sugar until pale and doubled.","Fold chocolate into eggs, then sift in flour.","Divide into buttered-and-sugared ramekins.","Bake at 425°F for exactly 11–12 minutes — edges set, center wobbly.","Invert onto plates immediately; crown with ice cream."]'
);
