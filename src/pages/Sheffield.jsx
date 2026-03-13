import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'
import { venueWineLists } from '../data/venueWineLists'
import { useVenueSourceInbox } from '../hooks/useVenueSourceInbox'

function mapUrl(name, town) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${town}`)}`
}

function bookingUrl(name, town) {
  return `https://www.google.com/search?q=${encodeURIComponent(`${name} ${town} booking`)}`
}

function formatVenueWinePrice(price) {
  if (typeof price !== 'number') return 'Price on menu'
  if (Number.isInteger(price)) return `£${price}`
  return `£${price.toFixed(2)}`
}

function normalizeVenueWineCategory(category) {
  const value = (category || '').toLowerCase()
  if (value === 'sparkling-rosé' || value === 'sparkling-rose') return 'sparkling-rosé'
  if (value.startsWith('sparkling')) return 'sparkling'
  if (value === 'rose') return 'rosé'
  return value || 'wine'
}

function venueWineCategoryLabel(category) {
  const key = normalizeVenueWineCategory(category)
  if (key === 'rosé') return 'Rosé'
  if (key === 'sparkling-rosé') return 'Sparkling Rosé'
  if (key === 'sparkling') return 'Sparkling'
  if (key === 'fortified') return 'Fortified'
  if (key === 'dessert') return 'Dessert'
  if (key === 'orange') return 'Orange'
  if (key === 'white') return 'White'
  if (key === 'red') return 'Red'
  return 'Wine'
}

function renderStars(value) {
  if (typeof value !== 'number' || value <= 0) return null
  const full = Math.max(0, Math.min(5, Math.round(value)))
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}


const VENUES = [
  {
    id: 'gill-and-co',
    name: 'Gill & Co.',
    amandaFavourite: true,
    town: 'Sheffield',
    area: 'Ecclesall Road',
    type: 'Wine bar',
    note: 'Amanda regular',
    vibe: 'Relaxed and social, especially good for by-the-glass discovery.',
    whyAmandaLovesIt: 'Amanda uses Gill & Co. for discovery nights where she wants to taste across styles rather than commit to one obvious bottle.',
    bestFor: ['By-the-glass flights', 'Lighter pairings', 'Group catch-ups'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'Walk-ins often work early week; reserve for peak evenings.',
    stylePrompts: ['Crisp & mineral', 'Aromatic white', 'Lighter red', 'Exploration'],
    wineIds: ['tesco-finest-chablis', 'waitrose-loved-found-albarino', 'sainsburys-ttd-cotes-du-rhone', 'bollinger-special-cuvee'],
  },
  {
    id: 'harritt-wine-bar',
    name: 'The Harritt Wine Bar',
    amandaFavourite: true,
    town: 'Sheffield',
    area: '619 Ecclesall Road, Sharrow',
    type: 'Curated wine bar',
    note: 'Food-led nights',
    vibe: 'A compact, carefully curated wine bar built around quality bottles, cheese boards, and charcuterie.',
    whyAmandaLovesIt: 'Amanda loves The Harritt for focused wine selection, warm service, and easy pairing with boards and small plates.',
    bestFor: ['Date nights', 'Cheese and charcuterie', 'By-the-glass exploration'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for prime times and dinner service.',
    address: '619 Ecclesall Rd, Sharrow, Sheffield S11 8PT',
    phone: '0114 349 5351',
    email: 'reservations@theharritt.com',
    website: 'https://theharritt.co.uk',
    instagram: 'https://www.instagram.com/theharrittwinebar/',
    stylePrompts: ['Classic Champagne', 'Provence rosé', 'Rioja and Pinot Noir', 'Rotating unusual regions'],
    wineIds: ['barolo-conterno', 'dom-perignon-2013', 'waitrose-muga-rioja-reserva', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'rafters-restaurant',
    name: 'Rafters Restaurant',
    amandaFavourite: true,
    town: 'Sheffield',
    area: 'Ecclesall Road area',
    type: 'Fine dining restaurant',
    note: 'Amanda top favourite',
    vibe: 'Elegant, special-occasion dining where wine pairings matter as much as the food.',
    whyAmandaLovesIt: 'Rafters is one of Amanda\'s top choices when she wants a memorable, food-led evening with serious glasses.',
    bestFor: ['Special occasions', 'Tasting menus', 'Premium wine moments'],
    typicalSpend: 'Premium',
    reserveTip: 'Reserve ahead and ask for pairing guidance when booking.',
    stylePrompts: ['Mineral sparkling', 'Structured red', 'Mature classics', 'Food-first pairing'],
    wineIds: ['dom-perignon-2013', 'trimbach-clos-ste-hune', 'barolo-conterno', 'chateau-margaux-2015'],
  },
  {
    id: 'peacock-inn',
    name: 'The Peacock Inn',
    town: 'Stannington',
    area: 'Local',
    type: 'Pub + restaurant',
    note: 'Walking distance',
    vibe: 'Easy local option when convenience matters and you still want a decent glass.',
    whyAmandaLovesIt: 'It is walking distance, so it is ideal for spontaneous evenings without planning a trip.',
    bestFor: ['Spontaneous nights', 'Comfort food', 'Local catch-ups'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'Useful fallback when you want low-friction local plans.',
    website: 'https://peacock-stannington.co.uk/',
    stylePrompts: ['Reliable red', 'Versatile white', 'House-plus pick'],
    wineIds: ['waitrose-no1-macon-villages', 'tesco-finest-malbec', 'asda-extra-special-barossa-shiraz', 'aldi-exquisite-rioja-reserva'],
  },
  {
    id: 'rose-and-crown',
    name: 'The Rose and Crown',
    town: 'Stannington',
    area: 'Local',
    type: 'Pub',
    note: 'Local favourite',
    vibe: 'Classic local atmosphere and easy to slot into weeknight plans.',
    whyAmandaLovesIt: 'A reliable local choice when she wants a familiar setting and uncomplicated wine decisions.',
    bestFor: ['Weeknight plans', 'Casual food', 'Low-friction choice'],
    typicalSpend: 'Lean',
    reserveTip: 'Great default option when choosing quickly.',
    stylePrompts: ['Accessible red', 'Fresh white', 'Crowd-pleaser'],
    wineIds: ['tesco-finest-rioja-blanco', 'trivento-reserve-malbec', 'baron-de-ley-rioja-reserva', 'lidl-moselland-riesling'],
  },
  {
    id: 'crown-and-glove',
    name: 'The Crown & Glove',
    town: 'Stannington',
    area: 'Local',
    type: 'Pub',
    note: 'Local pub',
    vibe: 'Traditional stone-built village pub with hilltop views across the Peak District and Rivelin Valley.',
    whyAmandaLovesIt: 'A friendly local with great views and a straightforward drinks list — easy to walk to and unwind.',
    bestFor: ['Casual drinks', 'Village atmosphere', 'Peak District views'],
    typicalSpend: 'Lean',
    reserveTip: 'No booking needed — just turn up.',
    website: 'https://www.crownandglove.com/',
    address: '96 Uppergate Road, Stannington, Sheffield S6 6BY',
    phone: '01142 324440',
    stylePrompts: ['Easy-drinking red', 'Crisp white', 'Prosecco'],
    wineIds: ['aldi-exquisite-rioja-reserva', 'tesco-finest-malbec', 'waitrose-no1-macon-villages', 'aldi-costellore-prosecco-spumante-nv'],
  },
  {
    id: 'the-swan-walton',
    name: 'The Swan',
    town: 'Walton-on-Thames',
    area: 'Riverside, Manor Road',
    type: 'Pub + restaurant',
    note: 'Summer favourite',
    vibe: 'Refurbished Young\'s riverside pub with heated garden huts and a Thames-side terrace.',
    whyAmandaLovesIt: 'The riverside setting and outdoor terrace make it one of her strongest seasonal picks for long summer evenings.',
    bestFor: ['Summer evenings', 'Outdoor dining', 'Friends visiting'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Reserve ahead in warm weather and weekend slots.',
    website: 'https://www.swanwalton.com/',
    address: '50 Manor Rd, Walton-on-Thames KT12 2PF',
    stylePrompts: ['Rosé season', 'Sparkling start', 'Food-friendly bottle'],
    wineIds: ['tesco-finest-provence-rose', 'waitrose-la-vieille-ferme-rose', 'bollinger-special-cuvee', 'cloudy-bay-sauvignon'],
  },
  {
    id: 'the-anglers',
    name: 'The Anglers',
    town: 'Walton-on-Thames',
    area: 'Central Walton',
    type: 'Pub + restaurant',
    note: 'Local Walton pick',
    vibe: 'A well-liked neighbourhood pub with a good food menu and relaxed atmosphere.',
    whyAmandaLovesIt: 'A reliable Walton option when she wants proper pub food with a decent wine choice alongside.',
    bestFor: ['Pub food evenings', 'Casual catch-ups', 'Weekend lunches'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book for weekends; walk-ins usually fine midweek.',
    stylePrompts: ['Versatile red', 'Crisp white', 'Classic pairing'],
    wineIds: ['tesco-finest-rioja-blanco', 'trivento-reserve-malbec', 'waitrose-loved-found-albarino', 'cloudy-bay-sauvignon'],
  },
  {
    id: 'stroud-hotel',
    name: 'The Stroud Hotel',
    town: 'Stroud',
    area: 'Town centre',
    type: 'Hotel + restaurant',
    note: 'Work trip option',
    vibe: 'Dependable for work-travel dinners where you still want a good bottle.',
    whyAmandaLovesIt: 'A solid Stroud base where she can keep wine quality high without overcomplicating the night.',
    bestFor: ['Work travel', 'Business dinner', 'Comfortable overnight'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Use the wine list to step up one tier from default house pours.',
    stylePrompts: ['Structured but flexible', 'Classic pairing', 'One-bottle dinner'],
    wineIds: ['waitrose-no1-cdp-rouge', 'tesco-finest-chablis', 'sainsburys-ttd-cdp-rouge', 'waitrose-cune-rioja'],
  },
  {
    id: 'painwick-hotel',
    name: 'Painswick Hotel',
    town: 'Stroud',
    area: 'Painswick area',
    type: 'Hotel',
    note: 'Fun while working',
    vibe: 'Good energy for mixing work commitments with a properly enjoyable evening.',
    whyAmandaLovesIt: 'Her note is simple: fun while working, so this is where practicality and enjoyment meet.',
    bestFor: ['Work + leisure', 'Relaxed premium feel', 'Longer stays'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Treat this as a quality reset venue during work-heavy weeks.',
    stylePrompts: ['Reward bottle', 'Textured white', 'Serious red'],
    wineIds: ['trimbach-clos-ste-hune', 'waitrose-schug-carneros-pinot-noir', 'waitrose-contino-vina-del-olivo', 'dom-perignon-2013'],
  },
  {
    id: 'linden-hall',
    name: 'Macdonald Linden Hall Hotel',
    town: 'Morpeth',
    area: 'Country estate setting',
    type: 'Hotel + restaurant',
    note: 'Country break',
    vibe: 'Classic country-hotel setting suited to longer meals and fuller reds.',
    whyAmandaLovesIt: 'A dependable Morpeth base when she wants a proper hotel meal with bottle structure.',
    bestFor: ['Country retreat', 'Long dinners', 'Classic service'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Ask for decanting if picking younger reds with tannin.',
    stylePrompts: ['Classic red', 'Old-world profile', 'Food-led pairing'],
    wineIds: ['barolo-conterno', 'waitrose-muga-rioja-reserva', 'penfolds-grange', 'vega-sicilia-unico'],
  },
  {
    id: 'morpeth-lodge',
    name: 'Morpeth Lodge',
    town: 'Morpeth',
    area: 'Local Morpeth',
    type: 'Lodge',
    note: 'Convenient Morpeth option',
    vibe: 'Flexible local base where wine choices should stay clear and practical.',
    whyAmandaLovesIt: 'It works as a useful Morpeth option when convenience and straightforward decision-making are key.',
    bestFor: ['Simple plans', 'Local convenience', 'Short stay'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'Keep bottle choices versatile when menus vary.',
    stylePrompts: ['Versatile bottle', 'Balanced acidity', 'Easy pairing'],
    wineIds: ['waitrose-loved-found-shiraz', 'tesco-finest-barossa-shiraz', 'waitrose-no1-macon-villages', 'aldi-costellore-prosecco-spumante-nv'],
  },
  {
    id: 'eshott-hall',
    name: 'Eshott Hall',
    town: 'Morpeth',
    area: 'Near Morpeth',
    type: 'Luxury country house hotel',
    note: 'Bit of luxury',
    vibe: 'Luxury setting where a proper bottle makes the evening.',
    whyAmandaLovesIt: 'Her note says it best: a bit of luxury, so this is for treat-night bottle choices.',
    bestFor: ['Luxury evenings', 'Occasion dinners', 'Premium bottle moments'],
    typicalSpend: 'Premium',
    reserveTip: 'Go for one great bottle over two average ones.',
    stylePrompts: ['Premium classic', 'Age-worthy red', 'Signature Champagne'],
    wineIds: ['chateau-margaux-2015', 'chateau-yquem-2015', 'dom-perignon-2013', 'trimbach-clos-ste-hune'],
  },
  // ── Valencia ──────────────────────────────────────────────────────────────
  {
    id: 'el-poblet-valencia',
    name: 'El Poblet',
    town: 'Valencia',
    area: 'Old Town · Carrer de Correus, 8',
    type: 'Fine dining restaurant',
    note: 'Valencia travel pick',
    vibe: "One of Valencia's most celebrated restaurants — Quique Dacosta's city outpost delivers a refined tasting menu rooted in Valencian coastal produce, presented with exceptional precision and two Michelin stars.",
    whyAmandaLovesIt: "The place to choose when you want an evening that feels genuinely special in Valencia. El Poblet earns its two Michelin stars through technical elegance and a wine list that fully matches the ambition of the kitchen. The cooking distils the flavours of the Valencian coast into something memorable — book as far ahead as possible and allow the full tasting menu.",
    bestFor: ['Special occasion dinner', 'Tasting menu', 'Serious wine pairing'],
    typicalSpend: 'Premium',
    reserveTip: 'Book weeks in advance. Tasting menus only at dinner; lunch service available midweek. Closed Sunday and Monday.',
    address: 'Carrer de Correus, 8, Valencia 46002',
    phone: '+34 961 11 11 06',
    website: 'https://elpobletrestaurante.com',
    stylePrompts: ['Grand Cru white', 'Mineral sparkling', 'Structured old-world red', 'Classic food pairing'],
    wineIds: ['trimbach-clos-ste-hune', 'bollinger-special-cuvee', 'barolo-conterno', 'dom-perignon-2013'],
  },
  {
    id: 'forastera-valencia',
    name: 'Forastera',
    town: 'Valencia',
    area: 'El Carmen · Carrer del Pintor Domingo, 40',
    type: 'Modern Mediterranean restaurant',
    note: 'Valencia travel pick',
    vibe: 'A forward-thinking neighbourhood restaurant in the heart of El Carmen where a young, ambitious team works with local Valencian ingredients and applies open, technique-driven cooking — seasonal rice, market fish, and Mediterranean plates done thoughtfully and without pretension.',
    whyAmandaLovesIt: "The right choice when you want a proper dinner in the old town without the formality of fine dining. The wine list leans Spanish with good regional depth, service is warm, and the cooking consistently delivers something worth eating slowly. One of the best places to eat in El Carmen.",
    bestFor: ['Dinner in the old town', 'Seasonal Valencian cooking', 'Good-value wine list'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead for dinner, especially at weekends. Open Tuesday to Sunday.',
    address: 'Carrer del Pintor Domingo, 40, Valencia 46001',
    phone: '+34 963 55 89 15',
    stylePrompts: ['Valencian regional white', 'Rioja and Garnacha', 'Aromatic rosé', 'Classic old-world'],
    wineIds: ['waitrose-cune-rioja', 'waitrose-loved-found-albarino', 'tesco-finest-provence-rose', 'waitrose-muga-rioja-reserva'],
  },
  {
    id: 'tinto-fino-ultramarino',
    name: 'Tinto Fino Ultramarino',
    town: 'Valencia',
    area: 'El Carmen · Carrer de la Corretgeria, 38',
    type: 'Wine bar',
    note: 'Valencia travel pick',
    vibe: "Bare-brick wine bar tucked into El Carmen, specialising in Spanish and Italian bottles alongside each other. Small plates rotate around artisan ingredients — speck-wrapped artichoke with mozzarella, courgette and goat's cheese pastry — and the by-the-glass list is well-chosen at honest prices.",
    whyAmandaLovesIt: 'An early evening stop or late-night wine destination that balances discovery with comfort. The Spanish-Italian wine philosophy is unusual and genuinely interesting — the list puts Rioja alongside Barolo and Vermentino alongside Albariño in a way that rewards curiosity.',
    bestFor: ['Evening drinks', 'Wine exploration', 'Small plates pairing'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'Walk-ins welcomed. Popular in the early evening — arrive by 8pm for a seat at the bar.',
    address: 'Carrer de la Corretgeria, 38, Valencia 46001',
    stylePrompts: ['Spanish alongside Italian', 'Low-intervention', 'By-the-glass discovery', 'Unfamiliar regions'],
    wineIds: ['waitrose-contino-vina-del-olivo', 'aldi-exquisite-rioja-reserva', 'baron-de-ley-rioja-reserva', 'waitrose-no1-macon-villages'],
  },
  {
    id: 'taberna-la-samorra',
    name: 'Taberna La Samorra',
    town: 'Valencia',
    area: "El Carmen · Carrer de l'Almodí, 14",
    type: 'Tapas bar',
    note: 'Valencia travel pick',
    vibe: 'Classic Valencian tapas bar near Plaza de la Virgen — one of the best spots to eat standing or perched at the bar, grazing through small plates of local produce with a cold glass in hand. Simple, genuine, and completely unpretentious.',
    whyAmandaLovesIt: 'Exactly what you want for a quick lunch or casual afternoon bite in the heart of the old town. Generous portions, strong local identity, and no fuss. The kind of place you pass twice before you decide to go in — and then return to the following day.',
    bestFor: ['Casual lunch', 'Pre-dinner tapas', 'Old town walking stop'],
    typicalSpend: 'Lean',
    reserveTip: 'No reservations needed — arrive early or late to avoid the peak rush. Ideal for a quick lunch stop between sightseeing.',
    address: "Carrer de l'Almodí, 14, Valencia 46003",
    phone: '+34 640 73 51 00',
    stylePrompts: ['Crisp local white', 'Easy-drinking red', 'Refreshing rosé'],
    wineIds: ['tesco-finest-rioja-blanco', 'waitrose-loved-found-albarino', 'tesco-finest-provence-rose', 'aldi-exquisite-rioja-reserva'],
  },
  {
    id: 'ostras-pedro-valencia',
    name: 'Ostras Pedrín',
    town: 'Valencia',
    area: 'El Carmen · Carrer de Bonaire, 23',
    type: 'Oyster bar',
    note: 'Valencia travel pick',
    vibe: 'A chic, narrow oyster bar in El Carmen that combines Spanish sourcing with Japanese-influenced precision — pristine oysters, sea urchin, and fresh shellfish served on ice at a counter. The focus on product is total; the wine list is short and exactly right for the food.',
    whyAmandaLovesIt: "The ideal lunchtime stop for serious seafood in the old town. A single glass of cold mineral white with a plate of Valencia's finest oysters is one of the best value-luxury moments the city offers. Walk in, sit at the counter, and let the kitchen guide you.",
    bestFor: ['Oysters and fresh shellfish', 'Quality lunch stop', 'Counter bar experience'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Arrive early at lunch — counter seats fill fast. Open Tuesday to Sunday.',
    address: 'Carrer de Bonaire, 23, Valencia 46003',
    phone: '+34 963 76 70 54',
    stylePrompts: ['Crisp mineral white', 'Classic Chablis style', 'Sparkling aperitif', 'Bone dry'],
    wineIds: ['tesco-finest-chablis', 'bollinger-special-cuvee', 'waitrose-loved-found-albarino', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'barbaric-valencia',
    name: 'Barbaric',
    town: 'Valencia',
    area: 'Patraix · Carrer de Santander, 8',
    type: 'Natural wine bar',
    note: 'Valencia travel pick',
    vibe: "A neighbourhood natural wine bar that opened in 2024 to immediate critical notice — TheFork Award 2025 winner. The list is serious and international, the kitchen menu shifts weekly: fried oysters with mango-habanero salsa, duck tartare with gochujang, rotating market plates. The soundtrack drifts between neo-soul, funk, and indie.",
    whyAmandaLovesIt: "The best wine bar opening Valencia has seen in years. A short walk south of the old town but absolutely worth the effort — the kitchen takes real risks and the wine list rewards the same attitude. Equal parts serious and enjoyable in the way that only genuinely good wine bars manage.",
    bestFor: ['Natural wine discovery', 'Creative small plates', 'Evening destination'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead for evenings. About 10 minutes south of the old town — easily walkable or a short taxi. Closed Monday.',
    address: 'Carrer de Santander, 8, Valencia 46017',
    phone: '+34 607 55 49 21',
    stylePrompts: ['Natural and low-intervention', 'Skin-contact orange', 'Minimal sulphites', 'Discovery bottle'],
    wineIds: ['waitrose-contino-vina-del-olivo', 'waitrose-schug-carneros-pinot-noir', 'waitrose-loved-found-albarino', 'tesco-finest-provence-rose'],
  },
  {
    id: 'vivevino-valencia',
    name: 'ViveVino Natural Winebar',
    town: 'Valencia',
    area: 'Russafa · Carrer del Músic Padilla, 2',
    type: 'Natural wine bar',
    note: 'Valencia travel pick',
    vibe: 'Vibrant natural wine bar in the heart of Russafa with a vivid blue exterior and a list that dives deep into low-intervention, amphora-aged, and whole-bunch-macerated bottles. The wine notes are unusually detailed and honest — the staff genuinely know what is in every glass.',
    whyAmandaLovesIt: 'An ideal base for a Russafa evening. Russafa is the most energetic neighbourhood in Valencia and ViveVino is one of its best wine stops. The list explores Valencian naturals alongside Spanish and European selections — worth visiting just for the range of orange and amphora wines alone.',
    bestFor: ['Natural wine tasting', 'Russafa evening', 'Orange and amphora wines'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'Walk-in friendly. Best visited from 7pm as part of a Russafa evening circuit.',
    address: 'Carrer del Músic Padilla, 2, Valencia',
    stylePrompts: ['Orange and skin-contact', 'Natural and biodynamic', 'Valencian regional', 'Exploration focus'],
    wineIds: ['waitrose-loved-found-albarino', 'waitrose-contino-vina-del-olivo', 'tesco-finest-rioja-blanco', 'aldi-exquisite-rioja-reserva'],
  },
  {
    id: 'flama-valencia',
    name: 'Flama',
    town: 'Valencia',
    area: 'Eixample · Gran Via del Marquès del Túria, 63',
    type: 'Restaurant',
    note: 'Valencia travel pick',
    vibe: 'A handsome Eixample dining room built around an open wood-fire grill — quality fish and aged beef cooked over flame, executed with simplicity and conviction. The wine list covers Spanish regions well with a bias towards structured reds and mineral whites that suit the fire-cooked food.',
    whyAmandaLovesIt: 'The spot to choose when you want a proper evening dinner with a genuinely good bottle and food cooked with real conviction. The fire-cooking elevates simple ingredients and the room has the feel of a serious night out without ever feeling stiff.',
    bestFor: ['Dinner with a quality bottle', 'Fire-grilled fish or beef', 'Evening dining'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for dinner. Very much an evening restaurant. Closed Monday.',
    address: 'Gran Via del Marquès del Túria, 63, Valencia 46004',
    phone: '+34 638 73 71 72',
    stylePrompts: ['Structured Rioja', 'Aged red reserve', 'Classic old-world red', 'Mineral white alongside'],
    wineIds: ['waitrose-muga-rioja-reserva', 'baron-de-ley-rioja-reserva', 'barolo-conterno', 'tesco-finest-chablis'],
  },
  {
    id: 'goya-gallery-valencia',
    name: 'Goya Gallery',
    town: 'Valencia',
    area: 'Eixample · Carrer de Borriana, 3',
    type: 'Restaurant',
    note: 'Valencia travel pick',
    vibe: 'A refined Eixample restaurant with a strong reputation for Valencian rice dishes and fresh seafood — langoustines, clams, and market fish cooked with the confidence that comes from knowing local produce intimately. The wine list leans regional and white-forward.',
    whyAmandaLovesIt: 'The right place for a long, unhurried lunch with a quality Spanish white — the kind of afternoon meal that sets the whole day up properly. Consistent kitchen, well-judged service, and a wine list that suits the food perfectly.',
    bestFor: ['Long relaxed lunch', 'Valencian rice and seafood', 'Quality Spanish white moment'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Reservations recommended for weekend lunch. Open daily for lunch and dinner.',
    address: 'Carrer de Borriana, 3, Valencia 46005',
    phone: '+34 963 04 18 35',
    stylePrompts: ['Crisp Spanish white', 'Albariño with seafood', 'Refined lunch white', 'Rioja alongside'],
    wineIds: ['waitrose-loved-found-albarino', 'tesco-finest-chablis', 'waitrose-cune-rioja', 'tesco-finest-rioja-blanco'],
  },
  {
    id: 'rausell-valencia',
    name: 'Rausell',
    town: 'Valencia',
    area: "Eixample Nord · Carrer d'Àngel Guimerà, 61",
    type: 'Seafood restaurant',
    note: 'Valencia travel pick',
    vibe: "A family-run Valencian institution open since the 1940s, serving one of the city's finest plates of sepionet (baby cuttlefish), sautéed cigalas, and what is widely described as the best patatas bravas in Valencia. Zero pretension, total confidence.",
    whyAmandaLovesIt: "The classic Valencian lunch in a restaurant that has been doing this longer than most. Order the seafood, accept the house wine recommendation, and settle in for one of those lunches that comfortably lasts into the afternoon. Rausell is the kind of place that shows why people fall in love with eating in Spain.",
    bestFor: ['Long Valencian lunch', 'Classic seafood', 'Local institution experience'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Busy at lunch daily — book ahead, especially for weekend lunch. Primarily a lunch restaurant.',
    address: "Carrer d'Àngel Guimerà, 61, Valencia 46008",
    phone: '+34 963 84 31 93',
    stylePrompts: ['Classic Valencian white', 'Crisp mineral', 'Dry and fresh', 'Light red alongside'],
    wineIds: ['waitrose-loved-found-albarino', 'tesco-finest-rioja-blanco', 'waitrose-no1-macon-villages', 'aldi-exquisite-rioja-reserva'],
  },
  {
    id: 'casa-montana-valencia',
    name: 'Casa Montaña',
    town: 'Valencia',
    area: 'Cabanyal (near beach) · Carrer de Josep Benlliure, 69',
    type: 'Bodega + tapas bar',
    note: 'Valencia travel pick',
    vibe: "Founded in 1836, Casa Montaña is the great wine bodega of Valencia — a dark wood, marble-topped bar lined with thousands of bottles, where you eat anchovies from Santoña, Valencian clóchinas (wild mussels), salt-cod croquettes with pine nuts, and patatas bravas, and drink seriously from one of the finest lists in the city.",
    whyAmandaLovesIt: "This is the venue that defines what a Valencian evening looks like at its best. The wine list runs to thousands of references, the by-the-glass selection covers extraordinary breadth, and the food matches every glass perfectly. It sits in Cabanyal, five minutes from the beach — the combination of deep wine culture and beachside location makes it the essential Valencia evening. Book well ahead.",
    bestFor: ['The definitive Valencia wine evening', 'Tapas and serious wine', 'Special outing near the beach'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book well ahead — one of the most sought-after bookings in Valencia. Essential for weekends.',
    address: 'Carrer de Josep Benlliure, 69, Valencia 46011',
    phone: '+34 963 67 23 14',
    stylePrompts: ['Deep Spanish cellar selection', 'Aged Rioja Gran Reserva', 'Valencian whites', 'By-the-glass discovery'],
    wineIds: ['waitrose-muga-rioja-reserva', 'baron-de-ley-rioja-reserva', 'waitrose-contino-vina-del-olivo', 'waitrose-loved-found-albarino'],
  },
  {
    id: 'casa-carmela-valencia',
    name: 'Casa Carmela',
    town: 'Valencia',
    area: 'Near Malvarrosa beach · Carrer d\'Isabel de Villena, 155',
    type: 'Paella restaurant',
    note: 'Valencia travel pick',
    vibe: "A Valencia institution for authentic paella valenciana — cooked over orange and pine wood in the traditional Valencian method, with local rice, free-range chicken, rabbit, and flat green beans. The setting is relaxed and family-run, a short walk from Malvarrosa beach. One of the most respected paella addresses in the city.",
    whyAmandaLovesIt: "Come for the paella, stay for the occasion. This is the beach lunch that Valencia does better than anywhere else. Arrive hungry, order the house paella for the table, and choose a cold Spanish rosé or a light white to go with it. One of those meals you will talk about for years.",
    bestFor: ['Authentic paella valenciana', 'Beach area Saturday lunch', 'Classic Valencia experience'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead for weekends — fills from noon. Primarily lunch; very busy Saturday and Sunday. Closed Monday.',
    address: "Carrer d'Isabel de Villena, 155, Valencia 46011",
    phone: '+34 963 71 00 73',
    stylePrompts: ['Refreshing rosé', 'Crisp light white', 'Spanish fizz for aperitif', 'Beach-friendly easy drinking'],
    wineIds: ['tesco-finest-provence-rose', 'waitrose-la-vieille-ferme-rose', 'waitrose-loved-found-albarino', 'tesco-finest-rioja-blanco'],
  },
  // ── New York ──────────────────────────────────────────────────────────────
  {
    id: 'lowell-hotel-nyc',
    name: 'The Lowell Hotel',
    amandaFavourite: true,
    town: 'New York',
    area: 'Upper East Side · 28 East 63rd Street',
    type: 'Luxury hotel + restaurant',
    note: 'New York favourite',
    vibe: "One of New York's last great family-owned hotels — a discreet Upper East Side landmark since 1927, steps from Central Park and Madison Avenue. The Lowell offers the kind of unhurried, personal luxury that anonymous tower hotels cannot replicate: wood-burning fireplaces, landscaped terraces, and a sense that time moves differently here. Majorelle serves seasonal cuisine; Jacques Bar is one of the finest cocktail rooms in Manhattan.",
    whyAmandaLovesIt: "The Lowell is the New York hotel for people who would rather be somewhere that feels like a home than a lobby. The Upper East Side address, the fireplaces, the impeccable service — it earns its reputation as the #1 hotel in New York without any of the fuss. Majorelle is the right room for a long, considered dinner with a great bottle. Jacques Bar is the place for a pre-dinner Martini and something exceptional by the glass.",
    bestFor: ['The definitive New York luxury stay', 'Special occasion dinner at Majorelle', 'Pre-dinner drinks at Jacques Bar'],
    typicalSpend: 'Premium',
    reserveTip: 'Book Majorelle well in advance for dinner. Jacques Bar is more walk-in friendly. Ask for a room or suite with a terrace if available.',
    address: '28 East 63rd Street, New York, NY 10065',
    phone: '+1 212-838-1400',
    website: 'https://www.lowellhotel.com',
    stylePrompts: ['Grand Cru white', 'First Growth Bordeaux', 'Iconic Champagne', 'Napa statement bottle'],
    wineIds: ['dom-perignon-2013', 'chateau-margaux-2015', 'opus-one-2019', 'vega-sicilia-unico'],
  },
  {
    id: 'blue-box-cafe-nyc',
    name: 'Blue Box Café at Tiffany & Co.',
    town: 'New York',
    area: 'Midtown · 727 Fifth Avenue, 6th Floor',
    type: 'Luxury café + afternoon tea',
    note: 'New York travel pick',
    vibe: "The café that Breakfast at Tiffany's always deserved — located on the sixth floor of Tiffany's landmark Fifth Avenue flagship, presided over by Daniel Boulud. The room is chic and precisely beautiful, with a light, French-inflected menu across three signature experiences: breakfast, afternoon tea, and all-day dining. One of the most photographed interiors in Manhattan for good reason — but the food and Champagne hold up to the setting.",
    whyAmandaLovesIt: 'The Blue Box Café is a genuine occasion in itself — not a tourist trap dressed up in luxury, but a beautifully run room where the kitchen matches the room\'s ambition. Afternoon tea with a glass of Bollinger is one of the great New York moments, and the breakfast service is one of the most elegant ways to start a day in Manhattan. Book ahead and make it a proper event.',
    bestFor: ['Afternoon tea with Champagne', 'Celebratory breakfast', 'The quintessential New York luxury moment'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Reservations are essential — the café fills quickly at all services. Book the Afternoon Tea experience for the full occasion. Monday–Saturday 10am–8pm, Sunday 11am–7pm.',
    address: '727 Fifth Avenue, 6th Floor, New York, NY 10022',
    phone: '+1 212-605-4090',
    website: 'https://www.blueboxcafenyc.com',
    stylePrompts: ['Classic Champagne', 'Elegant sparkling rosé', 'Afternoon tea white', 'Celebration bottle'],
    wineIds: ['bollinger-special-cuvee', 'dom-perignon-2013', 'chateau-yquem-2015', 'trimbach-clos-ste-hune'],
  },
  // ── Chelmsford ────────────────────────────────────────────────────────────
  {
    id: 'galvin-green-man',
    name: 'Galvin Green Man',
    claireFavourite: true,
    town: 'Chelmsford',
    area: 'Howe Street, Great Waltham',
    type: 'Pub + restaurant',
    note: `Claire's choice`,
    vibe: 'A Grade II listed 14th-century country pub run by Michelin-starred chefs Chris & Jeff Galvin — Bib Gourmand-awarded cooking with a serious, French-leaning wine list in a beautiful Essex countryside setting.',
    whyAmandaLovesIt: `Claire's pick in Chelmsford — a proper destination pub where the Galvin brothers bring Michelin pedigree to a 1341 country inn. The wine list punches well above pub weight, with Champagne by the glass, Burgundy Grand Cru, Bordeaux First Growths, and thoughtful by-the-glass options from Uncharted Wine kegs. The Bib Gourmand award confirms what Claire already knows: serious food and wine at fair prices.`,
    bestFor: ['Sunday roast with proper wine', 'Special occasion dining', 'Champagne by the glass', 'French-led food pairing'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Restaurant open Thu–Sun; book ahead for weekend dinner. Pub menu available Mon–Wed. Five private dining rooms seat 8–16 each.',
    website: 'https://galvinrestaurants.com/pub-restaurant-chelmsford-essex-galvin-green-man/',
    address: 'Main Road, Howe Street, Great Waltham, Chelmsford, Essex CM3 1BG',
    phone: '01245 408 820',
    email: 'betty@galvinpubco.com',
    stylePrompts: ['Champagne aperitif', 'Burgundy & Bordeaux', 'French country pairings', 'Premium by-the-glass'],
    wineIds: ['bollinger-special-cuvee', 'tesco-finest-chablis', 'waitrose-no1-cdp-rouge', 'barolo-conterno'],
  },
]

const MOMENTS = [
  { id: 'seafood', label: 'Seafood & bright dishes', why: 'Prioritize acidity and minerality over power.', pairingPrompt: 'Seafood', categories: ['white', 'sparkling', 'rosé'] },
  { id: 'steak', label: 'Steak & rich meats', why: 'Choose tannin, concentration, and decanting headroom.', pairingPrompt: 'Steak', categories: ['red'] },
  { id: 'shared', label: 'Sharing plates', why: 'Use versatile sparkling or high-acid reds to bridge courses.', pairingPrompt: 'Sharing plates', categories: ['sparkling', 'white', 'red'] },
]

const BUDGET_BANDS = [
  { id: 'light', label: 'Lean spend', priceRanges: ['budget', 'mid'] },
  { id: 'mid', label: 'Comfort spend', priceRanges: ['mid', 'premium'] },
  { id: 'treat', label: 'Treat night', priceRanges: ['premium', 'luxury'] },
]

const ORDER_PACES = [
  { id: 'glass-first', label: 'Glass first' },
  { id: 'share-bottle', label: 'Share one bottle' },
  { id: 'progression', label: 'Start + finish bottles' },
]

const STYLE_MODES = [
  { id: 'fresh', label: 'Fresh & bright', categories: ['white', 'sparkling', 'rosé'] },
  { id: 'classic', label: 'Classic old-world', categories: ['white', 'red', 'sparkling'] },
  { id: 'bold', label: 'Structured & bold', categories: ['red', 'dessert', 'sparkling'] },
]

const TOWNS = ['all', ...new Set(VENUES.map(v => v.town))]

export default function Places() {
  const [searchParams] = useSearchParams()
  const selectedVenueParam = searchParams.get('venue')
  const [town, setTown] = useState('all')
  const [venueId, setVenueId] = useState(VENUES[0].id)
  const [momentId, setMomentId] = useState(MOMENTS[0].id)
  const [budgetId, setBudgetId] = useState(BUDGET_BANDS[1].id)
  const [paceId, setPaceId] = useState(ORDER_PACES[0].id)
  const [styleId, setStyleId] = useState(STYLE_MODES[1].id)
  const [venueWineSearch, setVenueWineSearch] = useState('')
  const [venueWineCategory, setVenueWineCategory] = useState('all')
  const [venueWineLimit, setVenueWineLimit] = useState(24)
  const [scrollToDetail, setScrollToDetail] = useState(false)
  const [showSourceModal, setShowSourceModal] = useState(false)
  const [sourceForm, setSourceForm] = useState({ venueName: '', town: '', sourceUrl: '', notes: '' })
  const detailRef = useRef(null)
  const { sources, addSource, removeSource, markProcessed } = useVenueSourceInbox()

  const visibleVenues = useMemo(
    () => (town === 'all' ? VENUES : VENUES.filter(v => v.town === town)),
    [town],
  )

  const venue = useMemo(
    () => visibleVenues.find(v => v.id === venueId) || visibleVenues[0] || VENUES[0],
    [visibleVenues, venueId],
  )
  const venueWineInfo = venueWineLists[venue.id]
  const venueWineItems = venueWineInfo?.items || []

  const moment = MOMENTS.find(m => m.id === momentId) || MOMENTS[0]
  const budget = BUDGET_BANDS.find(b => b.id === budgetId) || BUDGET_BANDS[1]
  const pace = ORDER_PACES.find(p => p.id === paceId) || ORDER_PACES[0]
  const styleMode = STYLE_MODES.find(s => s.id === styleId) || STYLE_MODES[1]

  useEffect(() => {
    if (!visibleVenues.some(v => v.id === venueId) && visibleVenues[0]) {
      setVenueId(visibleVenues[0].id)
    }
  }, [visibleVenues, venueId])

  useEffect(() => {
    if (!selectedVenueParam) return
    const normalizedVenueParam = selectedVenueParam === 'harriet' ? 'harritt-wine-bar' : selectedVenueParam
    const matched = VENUES.find(v => v.id === normalizedVenueParam)
    if (!matched) return
    setTown(matched.town)
    setVenueId(matched.id)
  }, [selectedVenueParam])

  useEffect(() => {
    setVenueWineSearch('')
    setVenueWineCategory('all')
    setVenueWineLimit(24)
  }, [venue.id])

  useEffect(() => {
    setVenueWineLimit(24)
  }, [venueWineCategory, venueWineSearch])

  useEffect(() => {
    if (!scrollToDetail || !detailRef.current) return
    const top = detailRef.current.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    setScrollToDetail(false)
  }, [scrollToDetail, venue.id])

  const suggestedWines = useMemo(
    () => venue.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean),
    [venue],
  )

  const helperWines = useMemo(() => {
    const shortlisted = suggestedWines.filter(w =>
      budget.priceRanges.includes(w.priceRange) &&
      styleMode.categories.includes(w.category) &&
      moment.categories.includes(w.category),
    )

    if (shortlisted.length > 0) return shortlisted.slice(0, 2)

    return wines
      .filter(w =>
        budget.priceRanges.includes(w.priceRange) &&
        styleMode.categories.includes(w.category) &&
        moment.categories.includes(w.category),
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2)
  }, [budget.priceRanges, moment.categories, styleMode.categories, suggestedWines])

  const servicePlan = useMemo(() => {
    if (pace.id === 'glass-first') return 'Start with one exploratory glass, then commit to a bottle only if the food and table mood align.'
    if (pace.id === 'share-bottle') return 'Choose one versatile bottle with acidity and enough structure to cover multiple dishes.'
    return 'Open with freshness, then move to a deeper second bottle with the main course.'
  }, [pace.id])

  const orderLine = useMemo(() => {
    const starter = styleMode.id === 'fresh'
      ? 'something bright and mineral'
      : styleMode.id === 'bold'
        ? 'something structured with real depth'
        : 'a classic old-world style'
    return `We're after ${starter}, around ${budget.label.toLowerCase()}, suited to ${moment.label.toLowerCase()}.`
  }, [budget.label, moment.label, styleMode.id])

  const venueWineCategories = useMemo(
    () => ['all', ...new Set(venueWineItems.map(item => normalizeVenueWineCategory(item.category)))],
    [venueWineItems],
  )

  const filteredVenueWineItems = useMemo(() => {
    const query = venueWineSearch.trim().toLowerCase()
    return venueWineItems
      .filter(item => {
        if (venueWineCategory !== 'all' && normalizeVenueWineCategory(item.category) !== venueWineCategory) return false
        if (!query) return true
        return (
          item.name.toLowerCase().includes(query) ||
          (item.country && item.country.toLowerCase().includes(query))
        )
      })
      .sort((a, b) => {
        const ap = typeof a.price === 'number' ? a.price : 9999
        const bp = typeof b.price === 'number' ? b.price : 9999
        if (ap !== bp) return ap - bp
        return a.name.localeCompare(b.name)
      })
  }, [venueWineCategory, venueWineItems, venueWineSearch])

  const visibleVenueWineItems = filteredVenueWineItems.slice(0, venueWineLimit)
  const hasMoreVenueWineItems = filteredVenueWineItems.length > visibleVenueWineItems.length
  const amandaFavourites = VENUES.filter(v => v.amandaFavourite).map(v => v.name)
  function handleVenueSelect(nextVenueId) {
    setVenueId(nextVenueId)
    setScrollToDetail(true)
  }

  function updateSourceForm(key, value) {
    setSourceForm(prev => ({ ...prev, [key]: value }))
  }

  function submitSourceForm(e) {
    e.preventDefault()
    const result = addSource(sourceForm)
    if (!result.ok) return
    setSourceForm({ venueName: '', town: '', sourceUrl: '', notes: '' })
    setShowSourceModal(false)
  }

  return (
    <main className="min-h-screen">
      <section className="hero-mesh pt-24 lg:pt-28 pb-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-start lg:items-center gap-10">
          <div className="flex-1">
            <p className="section-label text-gold-lt/85 mb-3">Amanda's Places Guide</p>
            <h1 className="font-display text-5xl lg:text-6xl text-white leading-[1.03] mb-4">
              Favourite venues,
              <span className="block text-gradient-gold">chosen the Amanda way.</span>
            </h1>
            <p className="font-body text-white/75 max-w-3xl text-lg leading-relaxed">
              From Sheffield to Stroud, Morpeth to Valencia and beyond — use Amanda's venue list to decide where to go and what to order.
            </p>
            <p className="font-body text-sm text-gold-lt/90 mt-3">
              Amanda favourites: {amandaFavourites.join(', ')}.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/pairing" className="btn-primary">Open Pairing Wizard</Link>
              <Link to="/shop" className="btn-secondary">Compare Retailers</Link>
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0 items-end">
            {/* Photo 1 — fades bottom and left edge into hero */}
            <div className="relative w-32 h-48 lg:w-40 lg:h-60 flex-shrink-0">
              <img
                src="/amanda-wine.png"
                alt="Amanda Holmes"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,1) 26%)',
                  WebkitMaskComposite: 'destination-in',
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,1) 26%)',
                  maskComposite: 'intersect',
                }}
              />
            </div>
            {/* Photo 2 — offset lower, fades bottom and right edge into hero */}
            <div className="relative w-32 h-48 lg:w-40 lg:h-60 flex-shrink-0 -mb-8">
              <img
                src="/amanda-holmes.png"
                alt="Amanda Holmes"
                className="w-full h-full object-cover object-top"
                style={{
                  WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,1) 26%)',
                  WebkitMaskComposite: 'destination-in',
                  maskImage: 'linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 18%), linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 10%, rgba(0,0,0,1) 26%)',
                  maskComposite: 'intersect',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="card p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Filter by town</p>
              <div className="flex flex-wrap gap-2">
                {TOWNS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTown(t)}
                    className={`chip ${town === t ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                  >
                    {t === 'all' ? 'All towns' : t}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-secondary px-4 py-2" onClick={() => setShowSourceModal(true)}>
              + Add menu source
            </button>
          </div>
          <p className="font-body text-xs text-slate-lt mt-3">
            Live wine lists sourced for {VENUES.filter(v => venueWineLists[v.id]?.items?.length).length} of {VENUES.length} venues.
          </p>
          {sources.length > 0 && (
            <div className="mt-3 border-t border-cream pt-3">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Source inbox</p>
              <div className="space-y-2">
                {sources.slice(0, 4).map(source => (
                  <div key={source.id} className="rounded-xl border border-cream bg-white/70 px-3 py-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-body text-xs text-slate-lt">
                      <strong className="text-slate">{source.venueName}</strong>
                      {source.town ? ` · ${source.town}` : ''} · {source.status}
                    </p>
                    <div className="flex gap-1.5">
                      {source.status !== 'processed' && (
                        <button onClick={() => markProcessed(source.id)} className="chip bg-slate text-white">Done</button>
                      )}
                      <button onClick={() => removeSource(source.id)} className="chip bg-white border border-cream text-slate-lt">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-8 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid md:grid-cols-2 gap-4">
          {visibleVenues.map(v => (
            <button
              key={v.id}
              onClick={() => handleVenueSelect(v.id)}
              className={`text-left card p-5 transition-all ${venue.id === v.id ? 'border-gold shadow-gold' : ''}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="section-label mb-2">{v.town} · {v.area}</p>
                <span className="chip bg-cream text-slate-lt">{v.type}</span>
              </div>
              <h2 className="font-display text-3xl text-slate">{v.name}</h2>
              <p className="font-body text-sm text-slate-lt mt-2">{v.vibe}</p>
              {venue.id === v.id && (
                <p className="font-body text-xs text-gold mt-2 font-semibold">
                  Selected: full venue details opened below ↓
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {v.bestFor.map(item => <span key={item} className="chip bg-cream text-slate-lt">{item}</span>)}
                {v.amandaFavourite && (
                  <span className="chip bg-gold text-white">Amanda favourite</span>
                )}
                <span className={`chip ${venueWineLists[v.id]?.items?.length ? 'bg-gold/15 text-gold' : 'bg-white border border-cream text-slate-lt'}`}>
                  {venueWineLists[v.id]?.items?.length
                    ? `${venueWineLists[v.id].items.length} wines sourced`
                    : 'Wine list needed'}
                </span>
              </div>
              <p className="font-body text-xs text-gold mt-2">{v.note}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div ref={detailRef} className="surface-panel p-6 lg:p-8">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
            <div>
              <p className="section-label mb-2">Amanda's read</p>
              <h3 className="font-display text-4xl text-slate mb-4">{venue.name}</h3>
              <p className="font-body text-slate-lt leading-relaxed mb-5">{venue.whyAmandaLovesIt}</p>
              <div className="card p-4 mb-5">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Venue practicals</p>
                <p className="font-body text-sm text-slate-lt mb-1"><strong className="text-slate">Town:</strong> {venue.town}</p>
                <p className="font-body text-sm text-slate-lt mb-1"><strong className="text-slate">Typical spend:</strong> {venue.typicalSpend}</p>
                <p className="font-body text-sm text-slate-lt"><strong className="text-slate">Booking tip:</strong> {venue.reserveTip}</p>
                {venue.address && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Address:</strong> {venue.address}</p>
                )}
                {venue.phone && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Phone:</strong> {venue.phone}</p>
                )}
                {venue.email && (
                  <p className="font-body text-sm text-slate-lt mt-1"><strong className="text-slate">Email:</strong> {venue.email}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <a href={mapUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-secondary">Open map ↗</a>
                  <a href={bookingUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-primary">Find booking ↗</a>
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">Official site ↗</a>
                  )}
                  {venue.instagram && (
                    <a href={venue.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary">Instagram ↗</a>
                  )}
                </div>
              </div>
              <p className="section-label mb-2">How to order there</p>
              <ul className="space-y-2.5">
                {[
                  'Pick the dish direction first, then set style and price.',
                  'Ask for one recommendation and one alternative at the same budget.',
                  'If list quality looks mixed, choose producer reliability over novelty.',
                ].map(item => (
                  <li key={item} className="font-body text-sm text-slate-lt flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="section-label mb-2">Tonight's mood</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {MOMENTS.map(m => (
                  <button key={m.id} onClick={() => setMomentId(m.id)} className={`chip ${momentId === m.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {m.label}
                  </button>
                ))}
              </div>
              <p className="font-body text-sm text-slate-lt mb-5">{moment.why}</p>

              <div className="card p-4">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Style prompts at {venue.name}</p>
                <div className="flex flex-wrap gap-2">
                  {venue.stylePrompts.map(prompt => <span key={prompt} className="chip bg-cream text-slate">{prompt}</span>)}
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Link to={`/pairing?q=${encodeURIComponent(moment.pairingPrompt)}`} className="btn-primary">
                    Match this food mood
                  </Link>
                  <Link to={`/explore?country=${encodeURIComponent('France')}`} className="btn-secondary">
                    Browse matching wines
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="surface-panel p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1">Live Data</p>
              <h3 className="font-display text-4xl text-slate">Wine List at {venue.name}</h3>
            </div>
            <div className="text-right">
              <p className="font-body text-sm text-slate-lt">
                {venueWineInfo?.items?.length ? `${venueWineInfo.items.length} wines captured` : 'No public list captured yet'}
              </p>
            </div>
          </div>

          {venueWineInfo?.items?.length ? (
            <>
              <div className="card p-4 mb-5">
                <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-1">Source</p>
                <p className="font-body text-sm text-slate-lt">
                  {venueWineInfo.source} · Checked {venueWineInfo.checkedOn}
                </p>
                <p className="font-body text-xs text-slate-lt mt-1">{venueWineInfo.priceNote}</p>
                {venueWineInfo.curatedProfile && (
                  <p className="font-body text-xs text-gold mt-1">
                    Curated profile: this is a representative structure, not a full official bottle list.
                  </p>
                )}
                <a href={venueWineInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-3 inline-flex">
                  Open source list ↗
                </a>
              </div>

              <div className="grid lg:grid-cols-[1fr_auto] gap-3 mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={venueWineSearch}
                    onChange={(e) => setVenueWineSearch(e.target.value)}
                    placeholder={`Search ${venue.name} wines...`}
                    className="w-full font-body text-sm px-4 py-2.5 pl-10 rounded-xl border border-cream bg-white focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-lt" fill="none" viewBox="0 0 20 20">
                    <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex gap-2 overflow-x-auto thin-scroll pb-1">
                  {venueWineCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setVenueWineCategory(cat)}
                      className={`chip whitespace-nowrap ${venueWineCategory === cat ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      {cat === 'all' ? 'All styles' : venueWineCategoryLabel(cat)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredVenueWineItems.length === 0 ? (
                <p className="font-body text-sm text-slate-lt">No wines match this filter yet.</p>
              ) : (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {visibleVenueWineItems.map(item => (
                      <article key={`${item.name}-${item.price || 'na'}`} className="card p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-body text-sm text-slate leading-snug">{item.name}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <span className="chip bg-cream text-slate-lt">{venueWineCategoryLabel(item.category)}</span>
                              {item.country && <span className="chip bg-white border border-cream text-slate-lt">{item.country}</span>}
                            </div>
                          </div>
                          <p className="font-body text-sm font-semibold text-gold whitespace-nowrap">{formatVenueWinePrice(item.price)}</p>
                        </div>
                        {(item.review || item.stars || item.reviewSource || item.libraryWineId) && (
                          <div className="mt-3 pt-3 border-t border-cream">
                            {item.stars && (
                              <p className="font-body text-xs text-gold font-semibold">
                                {renderStars(item.stars)} {item.stars.toFixed(1)} / 5
                              </p>
                            )}
                            {item.review && (
                              <p className="font-body text-xs text-slate-lt mt-1 leading-relaxed">{item.review}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                              {item.reviewSource && (
                                <span className="chip bg-white border border-cream text-slate-lt">{item.reviewSource}</span>
                              )}
                              {item.libraryWineId && (
                                <Link to={`/explore/${item.libraryWineId}`} className="font-body text-xs text-gold hover:text-gold/80">
                                  Open in Explorer →
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-body text-xs text-slate-lt">
                      Showing {visibleVenueWineItems.length} of {filteredVenueWineItems.length}
                    </p>
                    {hasMoreVenueWineItems && (
                      <button
                        onClick={() => setVenueWineLimit(v => v + 24)}
                        className="btn-secondary px-4 py-2"
                      >
                        Load more wines
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="card p-5">
              <p className="font-body text-sm text-slate-lt mb-3">
                We do not have a public wine list for this venue yet. If you share a menu link or PDF, we can ingest it quickly.
              </p>
              <a href={bookingUrl(venue.name, venue.town)} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                Check venue booking & menus ↗
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-8">
        <div className="surface-panel p-6 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1">Interactive</p>
              <h3 className="font-display text-4xl text-slate">Tonight's Order Helper</h3>
            </div>
            <p className="font-body text-sm text-slate-lt">Tailored for {venue.name}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Budget</p>
              <div className="flex flex-wrap gap-2">
                {BUDGET_BANDS.map(item => (
                  <button key={item.id} onClick={() => setBudgetId(item.id)} className={`chip ${budgetId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Drinking pace</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_PACES.map(item => (
                  <button key={item.id} onClick={() => setPaceId(item.id)} className={`chip ${paceId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Wine style</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_MODES.map(item => (
                  <button key={item.id} onClick={() => setStyleId(item.id)} className={`chip ${styleId === item.id ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5 mt-5">
            <div className="card p-5">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Use this line with staff</p>
              <p className="font-body text-slate leading-relaxed">"{orderLine}"</p>
              <p className="font-body text-sm text-slate-lt mt-3"><strong className="text-slate">Service plan:</strong> {servicePlan}</p>
            </div>
            <div className="card p-5">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Suggested picks now</p>
              <ul className="space-y-2">
                {helperWines.map(wine => (
                  <li key={wine.id} className="font-body text-sm text-slate-lt">
                    <Link className="text-slate hover:text-gold transition-colors" to={`/explore/${wine.id}`}>
                      {wine.name}
                    </Link>
                    <span className="ml-2 text-xs text-slate-lt/70">{wine.region} · {wine.priceRange}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="section-label mb-1">Benchmarks</p>
            <h3 className="font-display text-4xl text-slate">Amanda-style bottles to look for</h3>
          </div>
          <Link to="/explore" className="btn-ghost">Full Explorer →</Link>
        </div>
        <p className="font-body text-sm text-slate-lt mb-6">
          These style benchmarks help decision-making even when venue lists rotate frequently.
        </p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {suggestedWines.map(wine => (
            <WineCard key={wine.id} wine={wine} />
          ))}
        </div>
      </section>
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button className="absolute inset-0 bg-slate/45 backdrop-blur-sm" onClick={() => setShowSourceModal(false)} aria-label="Close source modal" />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cream flex items-center justify-between">
              <h4 className="font-display text-2xl text-slate">Add menu source</h4>
              <button onClick={() => setShowSourceModal(false)} className="w-8 h-8 rounded-full bg-cream text-slate-lt">✕</button>
            </div>
            <form onSubmit={submitSourceForm} className="p-6 space-y-4">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Venue name *</label>
                <input
                  type="text"
                  value={sourceForm.venueName}
                  onChange={(e) => updateSourceForm('venueName', e.target.value)}
                  required
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Town</label>
                <input
                  type="text"
                  value={sourceForm.town}
                  onChange={(e) => updateSourceForm('town', e.target.value)}
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Menu URL / PDF link *</label>
                <input
                  type="url"
                  value={sourceForm.sourceUrl}
                  onChange={(e) => updateSourceForm('sourceUrl', e.target.value)}
                  required
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-slate-lt block mb-1.5">Notes</label>
                <textarea
                  value={sourceForm.notes}
                  onChange={(e) => updateSourceForm('notes', e.target.value)}
                  rows={3}
                  placeholder="Opening hours, why this venue matters, anything special to capture..."
                  className="w-full rounded-xl border border-cream bg-ivory px-4 py-3 font-body text-sm resize-none"
                />
              </div>
              <button type="submit" className="btn-primary w-full">Save to source inbox</button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
