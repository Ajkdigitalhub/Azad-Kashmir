/* ==========================================================
   providers.js  -  hotels, guides and transport services

   HOW TO ADD A PROVIDER
   1. Copy one block { ... } below, paste it after the last one, add a comma.
   2. Change the details. Remove the line  demo: true  (the 3 samples below are only for testing; delete them).
   3. Put the provider's photos in the images folder and write the names in photos: [...].
   4. Save and upload to GitHub. The site updates in 1-2 minutes.

   RULES
   - Only add a provider after you have checked the phone number and the place yourself.
   - type is one of: 'hotel', 'guide', 'transport'  (transport = jeeps, cars, vans, coasters, bikes)
   - whatsapp: number with country code and no + or spaces, e.g. '923001234567'
   - verified: true only if YOU checked it, and write the date in verifiedOn ('YYYY-MM-DD')
   - featured: true only for paid "Featured" listings (the site labels them clearly)
   - listedUntil: after this date the listing hides by itself ('YYYY-MM-DD')
   - Do not put prices here. Cards say "call for the current price".
   ========================================================== */
const PROVIDERS = [
  {
    type: 'hotel',
    name: 'Sample Mountain Hotel',
    district: 'Neelum District',
    area: 'Athmuqam',
    phone: '0300-0000000',
    whatsapp: '920000000000',
    features: ['Hot water', 'Parking', 'Meals'],
    photos: [],
    maps: 'Athmuqam, Neelum',
    verified: true,
    verifiedOn: '2026-10-15',
    featured: true,
    listedUntil: '2027-12-31',
    demo: true
  },
  {
    type: 'hotel',
    name: 'Sample Guest House',
    district: 'Muzaffarabad',
    area: 'City centre',
    phone: '0300-0000000',
    whatsapp: '920000000000',
    features: ['Family rooms', 'Wi-Fi'],
    photos: [],
    maps: 'Muzaffarabad',
    verified: true,
    verifiedOn: '2026-10-15',
    featured: false,
    listedUntil: '2027-12-31',
    demo: true
  },
  {
    type: 'guide',
    name: 'Sample Trekking Guide',
    district: 'Neelum District',
    area: 'Kel',
    phone: '0300-0000000',
    whatsapp: '920000000000',
    features: ['Urdu', 'Pahari', 'Ratti Gali treks'],
    photos: [],
    maps: 'Kel, Neelum',
    verified: true,
    verifiedOn: '2026-10-15',
    featured: false,
    listedUntil: '2027-12-31',
    demo: true
  },
  {
    type: 'transport',
    name: 'Sample Transport Service',
    district: 'Neelum District',
    area: 'Dowarian',
    phone: '0300-0000000',
    whatsapp: '920000000000',
    features: ['Jeep 4x4', '7 seats'],
    photos: [],
    maps: 'Dowarian, Neelum',
    verified: true,
    verifiedOn: '2026-10-15',
    featured: false,
    listedUntil: '2027-12-31',
    demo: true
  }
];
