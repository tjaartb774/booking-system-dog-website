/* ==========================================================================
   Beyond the Leash - site content
   --------------------------------------------------------------------------
   This is the ONE file to edit when details change. Everything marked
   "PLACEHOLDER" was written without confirmed information from the business
   and should be checked before going live.
   ========================================================================== */

window.BTL = {
  business: {
    name: 'Beyond the Leash',
    fullName: 'Beyond The Leash Dog Grooming and Training',
    tagline: 'Where grooming is more than just a service',
    phoneDisplay: '+27 76 961 0712',
    phoneTel: '+27769610712',
    whatsapp: '27769610712',                      // digits only, country code first
    email: 'beyondtheleashstilbaai@gmail.com',
    town: 'Stilbaai, Western Cape, South Africa, 6674',
    serviceArea: 'Stilbaai, Riversdale and surrounds',
    languages: 'English and Afrikaans',
    facebook: 'https://www.facebook.com/',          // PLACEHOLDER: paste the page URL
    facebookLabel: '100% recommend (10 reviews)',
    tiktok: 'https://www.tiktok.com/@adoptionisaheartthing'
  },

  /* Grooming and training services. No prices on purpose: the policy says
     quotes depend on breed, size, coat and behaviour.
     PLACEHOLDER: the list and wording below are typical grooming services.
     Edit, remove or add to match what you actually offer. */
  services: [
    {
      id: 'full-groom',
      icon: 'scissors',
      name: 'Full Groom',
      blurb: 'The works, done gently and at your dog\'s pace.',
      includes: ['Bath and blow dry', 'Brush out', 'Clip or scissor style', 'Nails, ears and sanitary tidy'],
      quoteNote: 'Quote depends on size, coat type and condition.'
    },
    {
      id: 'bath-tidy',
      icon: 'bubbles',
      name: 'Bath & Tidy',
      blurb: 'A fresh wash, dry and a light tidy between full grooms.',
      includes: ['Bath and blow dry', 'Brush out', 'Face, feet and sanitary tidy', 'Nail trim'],
      quoteNote: 'Quote depends on size and coat.'
    },
    {
      id: 'puppy-intro',
      icon: 'puppy',
      name: 'Puppy Introduction',
      blurb: 'Short, happy first visits that teach puppies grooming is safe.',
      includes: ['Gentle handling and table time', 'Bath and dry', 'Light tidy', 'Treats, breaks and play'],
      quoteNote: 'Please tell us your puppy\'s vaccination status when booking.'
    },
    {
      id: 'nails-paws',
      icon: 'paw',
      name: 'Nail Trim & Paw Care',
      blurb: 'Nails, paw pads and the bits in between.',
      includes: ['Nail trim or grind', 'Paw pad trim', 'Pad check'],
      quoteNote: 'Nervous about nails? Tell us and we will go slowly.'
    },
    {
      id: 'dematting',
      icon: 'comb',
      name: 'De-matting & Coat Reset',
      blurb: 'When brushing would hurt, we clip shorter and start fresh.',
      includes: ['Coat assessment', 'Humane mat removal or short clip', 'Skin check', 'Home brushing advice'],
      quoteNote: 'Severe matting may carry an extra charge, discussed with you first.'
    },
    {
      id: 'senior-care',
      icon: 'heart',
      name: 'Senior & Special-Care Groom',
      blurb: 'Extra patience for older dogs and dogs with medical needs.',
      includes: ['Shorter sessions with rests', 'Supportive handling', 'Adapted style for comfort'],
      quoteNote: 'Please share any medical conditions before the visit.'
    },
    {
      id: 'training',
      icon: 'star',
      name: 'Force-Free Training',
      blurb: 'In-person classes built on trust, not force.',
      includes: ['In-person classes', 'Positive, reward-based methods', 'Help with grooming tolerance'],
      quoteNote: 'Contact us to hear what is running at the moment.',
      training: true
    }
  ],

  /* Groom Finder quiz. Each answer adds points to service ids.
     The highest scoring service wins. */
  quiz: [
    {
      id: 'size',
      question: 'How big is your dog?',
      options: [
        { label: 'Small', emoji: '🐕', scores: {} },
        { label: 'Medium', emoji: '🐶', scores: {} },
        { label: 'Large', emoji: '🦮', scores: {} }
      ]
    },
    {
      id: 'coat',
      question: 'What kind of coat?',
      options: [
        { label: 'Short and smooth', emoji: '✨', scores: { 'bath-tidy': 3 } },
        { label: 'Long, curly or wavy', emoji: '🌀', scores: { 'full-groom': 3 } },
        { label: 'Double coat / fluffy', emoji: '☁️', scores: { 'bath-tidy': 2, 'full-groom': 1 } },
        { label: 'Wiry', emoji: '🧶', scores: { 'full-groom': 2 } }
      ]
    },
    {
      id: 'last',
      question: 'When was the last groom?',
      options: [
        { label: 'Never, this is a puppy', emoji: '🍼', scores: { 'puppy-intro': 6 } },
        { label: 'Within 2 months', emoji: '📅', scores: { 'bath-tidy': 2, 'nails-paws': 1 } },
        { label: '3 to 6 months ago', emoji: '🗓️', scores: { 'full-groom': 2 } },
        { label: 'Longer, or never', emoji: '🤷', scores: { 'full-groom': 2, 'dematting': 2 } }
      ]
    },
    {
      id: 'extra',
      question: 'Anything we should know?',
      options: [
        { label: 'There are knots or mats', emoji: '🪢', scores: { 'dematting': 5 } },
        { label: 'They are a senior or have a medical condition', emoji: '💜', scores: { 'senior-care': 5 } },
        { label: 'Just the nails are long', icon: 'paw', scores: { 'nails-paws': 5 } },
        { label: 'Nope, all good', emoji: '😊', scores: {} }
      ]
    }
  ],

  quizTips: {
    'full-groom': 'Bring your dog\'s favourite treats. We use lots of breaks and praise.',
    'bath-tidy': 'A quick brush at home the day before makes bath day even easier.',
    'puppy-intro': 'Short, sweet and fun. Puppies should be vaccinated for their age before visiting.',
    'nails-paws': 'Tell us if your dog dislikes paw handling so we can take it slowly.',
    'dematting': 'Your dog\'s comfort comes first. Where brushing would hurt, we clip shorter and start fresh.',
    'senior-care': 'We adapt the session to your dog\'s energy, with rests whenever they need them.',
    'training': 'Get in touch and we will chat about what you and your dog need.'
  },

  /* Pre-visit checklist shown on the home page */
  checklist: [
    { id: 'vacc', text: 'Vaccinations are up to date for my dog\'s age' },
    { id: 'behaviour', text: 'I will tell the groomer about any nervousness, triggers or past bites' },
    { id: 'health', text: 'I will share any medical conditions, allergies or recent operations' },
    { id: 'parasites', text: 'My dog has no fleas, ticks or contagious illness right now' },
    { id: 'gear', text: 'Collar, harness and lead are in safe working condition' },
    { id: 'collect', text: 'I can collect promptly once I get the "ready" message' }
  ],

  timeSlots: ['Morning', 'Midday', 'Afternoon', 'Any time'],

  /* Catalog. Products, sizes and prices come from the "Meet the Brands"
     price list (retail prices from each brand's own online shop, 17 Nov 2026).
     Pictures are the brands' own product photos, loaded from their websites;
     replace `image` with a path such as 'assets/products/name.jpg' to use your
     own photo. Each product has one or more `variants` (size and price). */
  shop: {
    currency: 'R',
    note: 'Collect from the parlour in Stilbaai, or ask about delivery. Payment and collection are confirmed on WhatsApp. Prices follow the brands\' current retail prices and can change.',
    categories: ["Treats", "Bath & care", "Walkies", "Toys", "Beds"],
    brands: [
          {
                "name": "Raw Love",
                "blurb": "Raw, grain-free meals for dogs and cats, plus bones, biscuits and supplements.",
                "site": "https://rawlovepets.co.za"
          },
          {
                "name": "Yummies Pet Treats",
                "blurb": "Free-range venison chews and treats, made in South Africa.",
                "site": "https://yummiespettreats.co.za"
          },
          {
                "name": "Innovablendz",
                "blurb": "Botanical teas, grooming care and Photizo light therapy for animals.",
                "site": "https://innovablendz.co.za"
          },
          {
                "name": "Good Dawg!",
                "blurb": "Single-protein natural treats, sold by weight.",
                "site": "https://gooddawg.co.za"
          },
          {
                "name": "La Furmilia",
                "blurb": "Cape Town dogwear: collars, leads, harnesses, jerseys and ID tags.",
                "site": "https://lafurmilia.co.za"
          },
          {
                "name": "Lead With Love",
                "blurb": "Handmade paracord leads and collars, made by local women.",
                "site": "https://leadwithlove.africa"
          },
          {
                "name": "Huntlea",
                "blurb": "Dog and cat beds, covers, leather collars and leads, toys and travel gear.",
                "site": "https://huntlea.co.za"
          }
    ]
  },
  products: [
      {
          "id": "rl-venison-chews",
          "brand": "Raw Love",
          "name": "Venison Chews",
          "category": "Treats",
          "blurb": "Air-dried venison lung, no salt or spices. Long lasting and easy to digest.",
          "image": "https://www.rawlovepets.co.za/cdn/shop/files/NOBORDER50g_Venison_Chews-1_1200x1200.png?v=1781856635",
          "link": "https://www.rawlovepets.co.za/products/venison-chews",
          "variants": [
              {
                  "label": "Each",
                  "price": 49
              }
          ]
      },
      {
          "id": "rl-health-biscuits",
          "brand": "Raw Love",
          "name": "Health Biscuits",
          "category": "Treats",
          "blurb": "Wheat-free biscuits with organic rosehip, rooibos and sutherlandia.",
          "image": "https://www.rawlovepets.co.za/cdn/shop/products/100g_1200x1200.png?v=1615841518",
          "link": "https://www.rawlovepets.co.za/products/health-treats",
          "variants": [
              {
                  "label": "100g",
                  "price": 61
              },
              {
                  "label": "200g",
                  "price": 122
              }
          ]
      },
      {
          "id": "rl-pb-biscuits",
          "brand": "Raw Love",
          "name": "Peanut Butter Biscuits",
          "category": "Treats",
          "blurb": "Organic peanut butter, banana, free-range eggs and coconut flour.",
          "image": "https://www.rawlovepets.co.za/cdn/shop/products/100g_701058ba-3ee6-45f2-9b4d-5dcc0f5955d0_1200x1200.png?v=1615841909",
          "link": "https://www.rawlovepets.co.za/products/peanut-butter-treats",
          "variants": [
              {
                  "label": "Each",
                  "price": 58
              }
          ]
      },
      {
          "id": "ym-training-bites",
          "brand": "Yummies Pet Treats",
          "name": "Meaty Training Bites",
          "category": "Treats",
          "blurb": "Venison stix cut into small bites. Perfect for training on the table.",
          "image": "https://cdn.shopify.com/s/files/1/0686/2559/6598/files/Puppy_Chews_16.jpg?v=1763811320",
          "link": "https://yummiespettreats.co.za/product/meaty-training-bits",
          "variants": [
              {
                  "label": "Each",
                  "price": 42
              }
          ]
      },
      {
          "id": "ym-chew-box",
          "brand": "Yummies Pet Treats",
          "name": "Springbok Chew Box",
          "category": "Treats",
          "blurb": "Seven different springbok and venison chews, slow-dried, in one box.",
          "image": "https://cdn.shopify.com/s/files/1/0686/2559/6598/files/Venison_Hide_Twist_5.jpg?v=1775758078",
          "link": "https://yummiespettreats.co.za/product/springbok-chew-box",
          "variants": [
              {
                  "label": "Each",
                  "price": 350
              }
          ]
      },
      {
          "id": "ym-twisties",
          "brand": "Yummies Pet Treats",
          "name": "Venison Hide Twisties",
          "category": "Treats",
          "blurb": "Twisted, air-dried venison sinews for a firm, long chew.",
          "image": "https://cdn.shopify.com/s/files/1/0686/2559/6598/files/Puppy_Chews_5.jpg?v=1763806462",
          "link": "https://yummiespettreats.co.za/product/twisties",
          "variants": [
              {
                  "label": "Each",
                  "price": 34.5
              }
          ]
      },
      {
          "id": "ib-shampoo",
          "brand": "Innovablendz",
          "name": "Botanical Dog Shampoo",
          "category": "Bath & care",
          "blurb": "Gentle, low-foaming wash with rooibos, honeybush, neem and calendula.",
          "image": "https://innovablendz.co.za/wp-content/uploads/innovablendz-shampoo-front.png",
          "link": "https://innovablendz.co.za/product/botanical-dog-shampoo/",
          "variants": [
              {
                  "label": "Each",
                  "price": 179
              }
          ]
      },
      {
          "id": "ib-conditioner",
          "brand": "Innovablendz",
          "name": "Botanical Dog Conditioner",
          "category": "Bath & care",
          "blurb": "Aloe, calendula, jojoba and panthenol to replenish moisture and soothe skin.",
          "image": "https://innovablendz.co.za/wp-content/uploads/innovablendz-conditioner-front.png",
          "link": "https://innovablendz.co.za/product/botanical-dog-conditioner/",
          "variants": [
              {
                  "label": "Each",
                  "price": 199
              }
          ]
      },
      {
          "id": "ib-balm",
          "brand": "Innovablendz",
          "name": "Botanical Balm for Dogs",
          "category": "Bath & care",
          "blurb": "Everyday balm for paws, noses and dry skin. Safe for daily use.",
          "image": "https://innovablendz.co.za/wp-content/uploads/innovablendz-botanical-balm-front.png",
          "link": "https://innovablendz.co.za/product/botanical-balm-for-dogs/",
          "variants": [
              {
                  "label": "Each",
                  "price": 60
              }
          ]
      },
      {
          "id": "gd-chicken-strips",
          "brand": "Good Dawg!",
          "name": "Chicken Fillet Strips",
          "category": "Treats",
          "blurb": "Lean, slow-dried chicken. High protein, low fat, kind to sensitive tummies.",
          "image": "https://www.gooddawg.co.za/wp-content/uploads/2025/12/Chicken-Fillet-Sticks-scaled.jpg",
          "link": "https://www.gooddawg.co.za/product/chicken-fillet-strips/",
          "variants": [
              {
                  "label": "50g",
                  "price": 45
              },
              {
                  "label": "100g",
                  "price": 89
              }
          ]
      },
      {
          "id": "gd-ostrich-training",
          "brand": "Good Dawg!",
          "name": "Ostrich Liver Training Treats",
          "category": "Treats",
          "blurb": "Tiny 5 mm ostrich liver rewards. High value and mess-free.",
          "image": "https://www.gooddawg.co.za/wp-content/uploads/2025/12/Training-treats.jpg",
          "link": "https://www.gooddawg.co.za/product/ostrich-liver-training-treats/",
          "variants": [
              {
                  "label": "100g",
                  "price": 52
              },
              {
                  "label": "250g",
                  "price": 129
              },
              {
                  "label": "500g",
                  "price": 258
              },
              {
                  "label": "1kg",
                  "price": 503
              }
          ]
      },
      {
          "id": "gd-salmon-strips",
          "brand": "Good Dawg!",
          "name": "Salmon strips",
          "category": "Treats",
          "blurb": "Single-ingredient air-dried salmon, rich in omega-3 for skin and coat.",
          "image": "https://www.gooddawg.co.za/wp-content/uploads/2026/09/good-dawg-salmon-strips-dog-cat-treats.jpg.jpeg",
          "link": "https://www.gooddawg.co.za/product/salmon-strips/",
          "variants": [
              {
                  "label": "50g",
                  "price": 40
              },
              {
                  "label": "100g",
                  "price": 80
              },
              {
                  "label": "250g",
                  "price": 200
              }
          ]
      },
      {
          "id": "lf-collar-gingham",
          "brand": "La Furmilia",
          "name": "Dog collar - Blueberry Gingham",
          "category": "Walkies",
          "blurb": "Soft, durable fabric collar in a blue gingham check. Sizes XS to L.",
          "image": "https://lafurmilia.co.za/cdn/shop/files/blueginghamcheckdogcollar.jpg?v=1739725874&width=800",
          "link": "https://lafurmilia.co.za/products/dog-collar-blueberry-gingham",
          "variants": [
              {
                  "label": "XS",
                  "price": 155
              },
              {
                  "label": "Small",
                  "price": 155
              },
              {
                  "label": "Medium",
                  "price": 195
              },
              {
                  "label": "Large",
                  "price": 220
              }
          ]
      },
      {
          "id": "lf-harness-beach",
          "brand": "La Furmilia",
          "name": "Dog harness - Beach Vibes Only",
          "category": "Walkies",
          "blurb": "Comfortable harness with summery orange, yellow and navy accents.",
          "image": "https://lafurmilia.co.za/cdn/shop/files/dogh-harnesstinbeachvibesdesign.jpg?v=1706714742&width=800",
          "link": "https://lafurmilia.co.za/products/dog-harness-beach-vibes-only",
          "variants": [
              {
                  "label": "XS",
                  "price": 380
              },
              {
                  "label": "Small",
                  "price": 380
              },
              {
                  "label": "Medium",
                  "price": 450
              },
              {
                  "label": "Large",
                  "price": 495
              }
          ]
      },
      {
          "id": "lf-rope-toy",
          "brand": "La Furmilia",
          "name": "Rope Dog Toy - dog toy",
          "category": "Toys",
          "blurb": "Hand-knotted from recycled fabric, so no two are the same.",
          "image": "https://lafurmilia.co.za/cdn/shop/files/extrastrongropetoyfordogs.jpg?v=1706463576&width=800",
          "link": "https://lafurmilia.co.za/products/rope-dog-toy-dog-toy",
          "variants": [
              {
                  "label": "XS",
                  "price": 80
              },
              {
                  "label": "Small",
                  "price": 80
              },
              {
                  "label": "Medium",
                  "price": 120
              },
              {
                  "label": "Large",
                  "price": 130
              }
          ]
      },
      {
          "id": "lwl-classic-collar",
          "brand": "Lead With Love",
          "name": "The Classic Collar",
          "category": "Walkies",
          "blurb": "Handmade paracord collar, made by local women. Solid colours.",
          "image": "https://leadwithlove.africa/cdn/shop/files/product_classic-collar_1-colour_green.png?v=1770635031&width=800",
          "link": "https://leadwithlove.africa/products/the-classic-collar-solid-colour",
          "variants": [
              {
                  "label": "XXS (20cm)",
                  "price": 285
              },
              {
                  "label": "XS (25cm)",
                  "price": 285
              },
              {
                  "label": "XS+ (30cm)",
                  "price": 285
              },
              {
                  "label": "S (35cm)",
                  "price": 335
              },
              {
                  "label": "S+ (40cm)",
                  "price": 335
              },
              {
                  "label": "M (45cm)",
                  "price": 335
              },
              {
                  "label": "M+ (50cm)",
                  "price": 335
              },
              {
                  "label": "L (55cm)",
                  "price": 385
              },
              {
                  "label": "L+ (60cm)",
                  "price": 385
              },
              {
                  "label": "XL (65cm)",
                  "price": 385
              },
              {
                  "label": "XL+ (70cm)",
                  "price": 385
              }
          ]
      },
      {
          "id": "lwl-classic-lead",
          "brand": "Lead With Love",
          "name": "The Classic Lead",
          "category": "Walkies",
          "blurb": "Handmade paracord lead to match the Classic Collar.",
          "image": "https://leadwithlove.africa/cdn/shop/files/Classic_Lead_Army_Green.png?v=1770635031&width=800",
          "link": "https://leadwithlove.africa/products/the-classic-lead-updated-variants",
          "variants": [
              {
                  "label": "Each",
                  "price": 455
              }
          ]
      },
      {
          "id": "lwl-neck-scarf",
          "brand": "Lead With Love",
          "name": "The Neck Scarf",
          "category": "Walkies",
          "blurb": "A neat neck scarf for walks and photos.",
          "image": "https://leadwithlove.africa/cdn/shop/files/IMG_2819.heic?v=1791371653&width=800&format=jpg",
          "link": "https://leadwithlove.africa/products/the-neck-scarf",
          "variants": [
              {
                  "label": "Small",
                  "price": 150
              },
              {
                  "label": "Medium",
                  "price": 200
              },
              {
                  "label": "Large",
                  "price": 250
              }
          ]
      },
      {
          "id": "hl-rope-3-knot",
          "brand": "Huntlea",
          "name": "Huntlea Dog Rope Toy 3 Knot",
          "category": "Toys",
          "blurb": "100% natural cotton rope with a leather tag, handmade in their factory.",
          "image": "https://huntlea.co.za/cdn/shop/files/3-Knot-Rope-1.png?v=1685428813&width=800",
          "link": "https://huntlea.co.za/products/huntlea-rope-toy-3-knot",
          "variants": [
              {
                  "label": "Small",
                  "price": 50
              },
              {
                  "label": "Medium",
                  "price": 75
              },
              {
                  "label": "Large",
                  "price": 130
              },
              {
                  "label": "X-Large",
                  "price": 190
              }
          ]
      },
      {
          "id": "hl-impala-lead",
          "brand": "Huntlea",
          "name": "Impala Leather Dog Lead",
          "category": "Walkies",
          "blurb": "Full-grain leather lead, soft to the touch, with a D ring on the handle.",
          "image": "https://huntlea.co.za/cdn/shop/files/Impalalead-Lifestyle1_1080px.png?v=1730894501&width=800",
          "link": "https://huntlea.co.za/products/impala-leather-lead",
          "variants": [
              {
                  "label": "Puppy",
                  "price": 155
              },
              {
                  "label": "X-Small",
                  "price": 175
              },
              {
                  "label": "Small",
                  "price": 220
              },
              {
                  "label": "Medium",
                  "price": 275
              },
              {
                  "label": "Large",
                  "price": 330
              }
          ]
      },
      {
          "id": "hl-kalahari-napper",
          "brand": "Huntlea",
          "name": "Huntlea Kalahari Napper Dog Bed",
          "category": "Beds",
          "blurb": "Waterproof, UV-resistant Riptec bed for patio, garden or indoors.",
          "image": "https://huntlea.co.za/cdn/shop/files/KalahariNapper1.png?v=1693377145&width=800",
          "link": "https://huntlea.co.za/products/kalahari-napper-dog-ded",
          "variants": [
              {
                  "label": "Small",
                  "price": 650
              },
              {
                  "label": "Medium",
                  "price": 850
              },
              {
                  "label": "Large",
                  "price": 1350
              },
              {
                  "label": "Xlarge",
                  "price": 1795
              },
              {
                  "label": "2XLarge",
                  "price": 2250
              }
          ]
      }
  ]
};
