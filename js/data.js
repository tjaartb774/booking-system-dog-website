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
        { label: 'Just the nails are long', emoji: '🐾', scores: { 'nails-paws': 5 } },
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

  timeSlots: ['Morning', 'Midday', 'Afternoon', 'Any time']
};
