import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import WineCard from '../components/WineCard'
import { wines } from '../data/wines'
import { venueWineLists } from '../data/venueWineLists'
import { getWineVintageLabel } from '../utils/wineDisplay'
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

const RETAILER_IMAGE_HINTS = [
  '/Tesco-Logo',
  '/Sainsburys-Logo',
  '/Waitrose-Logo',
  '/aldi-logo',
  '/logo-lidl',
  '/asda-logo',
  '/coop-logo',
  '/morrisons-logo',
  '/marks-spencer',
  '/Majestic',
  '/dom-perignon-logo',
]

function getVenueVisual(venue) {
  if (venue.image) {
    return {
      src: venue.image,
      alt: venue.imageAlt || `${venue.name} venue image`,
      eyebrow: venue.imageEyebrow || 'Venue image',
      accent: venue.imageAccent || venue.town,
      note: venue.imageNote || `${venue.name} at a glance.`,
    }
  }

  return null
}

function isVenueSafeBottleImage(src) {
  if (!src) return false
  return !RETAILER_IMAGE_HINTS.some(hint => src.includes(hint))
}

function VenueFallback({ venue, compact = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border border-slate/12 shadow-card ${
        compact ? 'h-[15rem]' : 'h-[22rem] lg:h-[24rem]'
      } bg-[radial-gradient(circle_at_top_left,_rgba(214,164,86,0.22),_transparent_36%),linear-gradient(155deg,rgba(255,251,244,0.98),rgba(245,237,223,0.95))]`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.4),transparent_34%,rgba(94,78,56,0.06))]" />
      <div className="relative z-10 flex h-full flex-col justify-between p-5 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="tag border border-gold/20 bg-white/82 text-slate text-[10px] shadow-sm">
            {venue.imageFallbackLabel || 'Text-led for now'}
          </span>
          <span className="tag border border-white/70 bg-white/72 text-slate-lt text-[10px] shadow-sm">{venue.town}</span>
          <span className="tag border border-white/70 bg-white/72 text-slate-lt text-[10px] shadow-sm">{venue.type}</span>
        </div>
        <div className="max-w-md">
          <p className="font-body text-[10px] uppercase tracking-[0.22em] text-gold-lt/80 mb-2">
            {venue.area}
          </p>
          <h3 className={`font-display text-slate leading-tight ${compact ? 'text-[1.9rem]' : 'text-[2.5rem]'}`}>
            {venue.name}
          </h3>
          <p className="font-body text-sm text-slate-lt leading-relaxed mt-3">
            {venue.imageFallbackNote || venue.note || venue.vibe}
          </p>
          {venue.bestFor?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {venue.bestFor.slice(0, compact ? 2 : 3).map(item => (
                <span key={item} className="chip bg-white/72 text-slate-lt border border-white/80">
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function VenueVisualPanel({ venue, visual, compact = false, onImageError }) {
  if (!visual) return <VenueFallback venue={venue} compact={compact} />

  return (
    <div
      className={`relative overflow-hidden rounded-[1.8rem] border border-slate/12 bg-[#efe7da] shadow-card ${
        compact ? 'h-[15rem]' : 'h-[22rem] lg:h-[24rem]'
      }`}
    >
      <img
        src={visual.src}
        alt={visual.alt}
        className="block h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={onImageError}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/22 via-transparent to-[#111827]/10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 p-4 pointer-events-none">
        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-[1.15rem] border border-white/14 bg-[#182236]/72 px-3 py-2 shadow-[0_12px_28px_rgba(17,24,39,0.22)] backdrop-blur-md">
          <span className="tag border border-white/12 bg-white/88 text-slate text-[10px] shadow-sm">
            {visual.eyebrow}
          </span>
          <span className="tag border border-white/12 bg-white/16 text-white text-[10px] shadow-sm">
            {visual.accent || venue.town}
          </span>
          <span className="tag border border-white/12 bg-white/16 text-white text-[10px] shadow-sm">
            {venue.type}
          </span>
        </div>
      </div>
    </div>
  )
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
    website: 'https://www.gillsandco.co.uk/',
    image: 'https://static.wixstatic.com/media/f907eb_8ad922d2328f4e899ccf685b242fcfbb~mv2.jpg/v1/fit/w_1920,h_1441,q_90,enc_avif,quality_auto/f907eb_8ad922d2328f4e899ccf685b242fcfbb~mv2.jpg',
    imageAlt: 'Gill & Co official wine event image',
    imageEyebrow: 'Official venue event image',
    imageAccent: 'Ecclesall Road',
    imageNote: 'A real Gill & Co event image gives the card the social, wine-led energy the venue is actually known for.',
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
    image: 'https://img1.wsimg.com/isteam/ip/f05b8cc1-c304-4cd5-93af-5ac78617efe8/261497037_4825078340844802_7467863830607721852.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1534,m',
    imageAlt: 'The Harritt Wine Bar interior',
    imageEyebrow: 'Venue image',
    imageAccent: 'Ecclesall Road',
    imageNote: 'A compact Sheffield wine bar with a warm, bottle-led room and an intimate food-first feel.',
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
    website: 'https://raftersrestaurant.co.uk/',
    image: 'https://raftersrestaurant.co.uk/uploads/images/content/RAFTERS-M2-Action-20.jpg',
    imageAlt: 'Rafters Restaurant official dining room image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Sheffield fine dining',
    imageNote: 'Rafters should read as a serious dining room first, not a wine placeholder, and the official photography does that cleanly.',
    stylePrompts: ['Mineral sparkling', 'Structured red', 'Mature classics', 'Food-first pairing'],
    wineIds: ['dom-perignon-2013', 'trimbach-clos-ste-hune', 'barolo-conterno', 'chateau-margaux-2015'],
  },
  {
    id: 'domo-vino',
    name: 'DOMO Restaurant & Vino',
    town: 'Sheffield',
    area: 'Little Kelham · Eagle Works, 34-36 Cotton Mill Walk',
    type: 'Sardinian restaurant + vino bar',
    note: 'Kelham wine-and-food pick',
    vibe: 'A warm family-run Sardinian restaurant, deli, and wine bar in Little Kelham where the wine list stays proudly Italian and especially Sardinian.',
    whyAmandaLovesIt: 'DOMO has a point of view. It is not generic Italian: the room, the deli energy, and the Sardinian list make it feel like a proper destination when you want something regional, friendly, and full of flavour.',
    bestFor: ['Regional Italian wine night', 'Kelham dinner', 'Sharing plates and one good bottle'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead for peak evenings and use the Sardinian section of the list rather than defaulting to the safer mainland picks.',
    address: 'Eagle Works, 34-36 Cotton Mill Walk, Little Kelham, Sheffield S3 8DH',
    phone: '0114 322 1020',
    email: 'info@domorestaurant.co.uk',
    website: 'https://domorestaurant.co.uk',
    image: 'https://static.wixstatic.com/media/6c60c6_fb868e0436ce4c018b447d4d15385841~mv2.jpg/v1/fit/w_1920,h_2868,q_90,enc_avif,quality_auto/6c60c6_fb868e0436ce4c018b447d4d15385841~mv2.jpg',
    imageAlt: 'DOMO Restaurant & Vino gallery image',
    imageEyebrow: 'Official gallery image',
    imageAccent: 'Little Kelham',
    imageNote: 'This is not a broad room shot, but it is a genuine DOMO gallery image that gives the venue some place-specific character without falling back to food or branding.',
    stylePrompts: ['Sardinian white', 'Italian regional red', 'Vermentino and Barolo', 'Food-first bottle'],
    wineIds: ['ca-maiol-prestige-lugana', 'benanti-etna-bianco', 'gd-vajra-barolo-albe', 'ms-found-susumaniello'],
  },
  {
    id: 'joro-restaurant',
    name: 'Jöro',
    town: 'Sheffield',
    area: 'Oughtibridge Mill',
    type: 'Contemporary restaurant with rooms',
    note: 'Big Sheffield booking',
    vibe: 'A serious contemporary British tasting-menu destination with rooms, now reimagined at Oughtibridge Mill.',
    whyAmandaLovesIt: 'Jöro is where Sheffield turns into a destination dinner. The food is ambitious, the room has intent, and it is the kind of place where the bottle choice should feel considered rather than automatic.',
    bestFor: ['Tasting-menu dinner', 'Serious bottle night', 'Special booking'],
    typicalSpend: 'Premium',
    reserveTip: 'Book ahead and treat it like a bottle-led tasting-menu evening rather than a casual dinner booking.',
    address: 'Oughtibridge Mill, Oughtibridge, Sheffield S35 0LB',
    email: 'bookings@jororestaurant.co.uk',
    website: 'https://jororestaurant.co.uk',
    image: '/venue-images/joro-room-wide.jpg',
    imageAlt: 'Jöro official venue image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Oughtibridge Mill',
    imageNote: 'Jöro needs to feel like a destination dining room first, and the official room photography gets that across immediately.',
    stylePrompts: ['Precision white', 'Structured red', 'Serious Champagne', 'Tasting-menu pairing'],
    wineIds: ['pol-roger-brut-reserve-nv', 'vacheron-sancerre-le-pave', 'gd-vajra-barolo-albe', 'chateau-musar-2018'],
  },
  {
    id: 'grazie-sheffield',
    name: 'Grazie',
    town: 'Sheffield',
    area: 'Leopold Street',
    type: 'Italian restaurant',
    note: 'City-centre Italian',
    vibe: 'A polished city-centre Italian with a Puglian point of view and a room that feels smarter than the usual pre-theatre default.',
    whyAmandaLovesIt: 'Grazie makes sense when you want proper Italian cooking in town without falling into chain-restaurant energy. The room is stylish, the menu has regional identity, and it suits one good bottle over lots of safe ordering.',
    bestFor: ['City-centre dinner', 'Italian comfort with polish', 'Pre-theatre bottle'],
    typicalSpend: 'Mid-range',
    reserveTip: 'A strong city-centre choice when you want to keep the wine list Italian and the evening easy.',
    address: 'Leopold Street, Sheffield city centre',
    phone: '0114 308 2007',
    email: 'info@graziesheffield.co.uk',
    website: 'https://www.graziesheffield.co.uk',
    image: 'https://static.wixstatic.com/media/6c60c6_1b76440b682543c8a677227e124b846c~mv2.jpg/v1/fill/w_969,h_646,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6c60c6_1b76440b682543c8a677227e124b846c~mv2.jpg',
    imageAlt: 'Grazie Sheffield official dining room image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Sheffield city centre',
    imageNote: 'The proper Grazie dining-room image makes this feel like a real city-centre restaurant, not just an Italian food concept.',
    stylePrompts: ['Italian white', 'Comforting red', 'Barolo night', 'Easy celebratory fizz'],
    wineIds: ['laurent-perrier-la-cuvee-nv', 'ca-maiol-prestige-lugana', 'benanti-etna-bianco', 'gd-vajra-barolo-albe'],
  },
  {
    id: 'la-bottega-sheffield',
    name: 'La Bottega',
    town: 'Sheffield',
    area: 'Leopold Street · City Centre',
    type: 'Italian deli + restaurant + wine shop',
    note: 'Italian city-centre all-rounder',
    vibe: 'An authentic Italian city-centre spot that blends deli energy, fresh pasta, wine-shop browsing, and a proper sit-down meal.',
    whyAmandaLovesIt: 'La Bottega works because it does more than one thing well. It feels useful and enjoyable at the same time: somewhere you can eat properly, buy wine, and still keep the evening feeling relaxed rather than overdesigned.',
    bestFor: ['Italian lunch or dinner', 'City-centre wine stop', 'Fresh pasta and one good bottle'],
    typicalSpend: 'Lean to mid-range',
    reserveTip: 'A strong choice when you want something Italian and central without tipping into a full special-occasion booking.',
    address: '1-3 Leopold St, Sheffield City Centre, Sheffield S1 2GY',
    email: 'info@labottegasheffield.co.uk',
    website: 'https://www.labottegasheffield.co.uk',
    image: 'https://static.wixstatic.com/media/6c60c6_72ba3adeb20643998c03943ab81b8142~mv2.jpg/v1/crop/x_140,y_0,w_1321,h_1067/fill/w_978,h_790,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/La%20Bottega-16.jpg',
    imageAlt: 'La Bottega Sheffield official venue image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Leopold Street',
    imageNote: 'A proper official venue image keeps La Bottega grounded as a real Sheffield place rather than just an Italian-food concept.',
    stylePrompts: ['Italian white', 'Easy Barolo', 'Fresh pasta bottle', 'Aperitivo sparkle'],
    wineIds: ['laurent-perrier-la-cuvee-nv', 'ca-maiol-prestige-lugana', 'benanti-etna-bianco', 'gd-vajra-barolo-albe'],
  },
  {
    id: 'guyshi-sheffield',
    name: 'Guyshi',
    town: 'Sheffield',
    area: 'West One Plaza · Fitzwilliam Street',
    type: 'Japanese restaurant + bar',
    note: 'Japanese night out',
    vibe: 'A slick Japanese dining room in West One Plaza with a nightlife edge, good for sharing plates and cleaner, brighter wine choices.',
    whyAmandaLovesIt: 'Guyshi works when the evening wants energy rather than formality. The food points you toward fresher bottles, sharper acidity, and lighter reds rather than anything heavy or ponderous.',
    bestFor: ['Sushi and shared plates', 'Group evening', 'Fresh, food-led bottles'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Keep the wine lighter and brighter here; this is a place for freshness, fizz, or a lifted red rather than big tannic bottles.',
    address: 'West One Plaza, Fitzwilliam Street, Sheffield S1 4JB',
    phone: '07949 611 678',
    email: 'guyshisheffield@gmail.com',
    website: 'https://guyshi.co.uk',
    image: 'https://guyshi.co.uk/wp-content/uploads/2025/02/Asset-16-768x860.png',
    imageAlt: 'Guyshi official bar image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'West One Plaza',
    imageNote: 'A real Guyshi bar shot keeps this venue grounded in the room and mood rather than drifting into generic Japanese-food imagery.',
    stylePrompts: ['Champagne with sushi', 'Mineral white', 'Bright Sauvignon', 'Lifted lighter red'],
    wineIds: ['pol-roger-brut-reserve-nv', 'vacheron-sancerre-le-pave', 'benanti-etna-bianco', 'clos-de-la-roilette-fleurie'],
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
    image: 'https://peacock-stannington.co.uk/wp-content/uploads/sites/148/2022/01/Peacock-13.png',
    imageAlt: 'The Peacock Inn official venue image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Stannington',
    imageNote: 'A nearby Stannington pub with an easy, familiar room that suits spontaneous plans.',
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
    website: 'https://www.roseandcrownpubstannington.co.uk',
    image: 'https://www.spccs1.co.uk/ImageAssets/c994595af5e14683902f0473b28a45d0.JPG',
    imageAlt: 'The Rose and Crown Stannington official venue image',
    imageEyebrow: 'Official pub image',
    imageAccent: 'Stannington local',
    imageNote: 'A straightforward local-pub image is exactly right here: familiar, useful, and true to the venue.',
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
    image: 'https://www.crownandglove.com/wp-content/uploads/2019/05/crown-sm-1024x597.jpg',
    imageAlt: 'The Crown & Glove exterior',
    imageEyebrow: 'Official pub image',
    imageAccent: 'Peak District edge',
    imageNote: 'Stone-built and local-looking in exactly the way a village pub here should be.',
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
    image: 'https://www.swanwalton.com/wp-content/uploads/sites/143/2025/11/The-Swan_-Walton-on-Thames-136.jpg?format=auto',
    imageAlt: 'The Swan Walton-on-Thames official venue image',
    imageEyebrow: 'Official riverside image',
    imageAccent: 'Walton riverside',
    imageNote: 'A proper Thames-side pub setting, which is the whole point of choosing this one in summer.',
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
    website: 'https://www.anglerswalton.co.uk',
    image: 'https://images.squarespace-cdn.com/content/v1/6916fbc867208c606ec6c898/e6cb3adf-54b5-496c-bbcf-637d52678915/The+Anglers+web+image.png',
    imageAlt: 'The Anglers Walton-on-Thames official venue image',
    imageEyebrow: 'Official pub image',
    imageAccent: 'Walton-on-Thames',
    imageNote: 'A proper official image gives The Anglers its own identity instead of making it look like a generic group-pub listing.',
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
    website: 'https://thestroudhotel.com',
    image: 'https://thestroudhotel.com/wp-content/uploads/2025/06/Home-page-widget-1024x686.jpg',
    imageAlt: 'The Stroud Hotel official venue image',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Stroud town centre',
    imageNote: 'This official hotel image keeps the card grounded in the place itself, which is exactly what the Stroud entry needs.',
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
    website: 'https://thepainswick.co.uk/',
    image: 'https://hotelcms-production.imgix.net/thepainswick.co.uk/wp-content/uploads/2025/01/House-PW.jpg',
    imageAlt: 'The Painswick official venue image',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Cotswold hillside setting',
    imageNote: 'The proper house image gives The Painswick a calm destination feel without slipping into generic lifestyle photography.',
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
    website: 'https://www.macdonaldhotels.co.uk/linden-hall',
    image: 'https://www.macdonaldhotels.co.uk/nuxt-media/images/linden-hall/og-image.png',
    imageAlt: 'Macdonald Linden Hall official venue image',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Northumberland country estate',
    imageNote: 'Linden Hall reads best as a country-estate hotel, so the official venue image does the work much better than any wine-led stand-in.',
    stylePrompts: ['Classic red', 'Old-world profile', 'Food-led pairing'],
    wineIds: ['barolo-conterno', 'waitrose-muga-rioja-reserva', 'penfolds-grange', 'vega-sicilia-unico'],
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
    website: 'https://www.eshotthall.co.uk/',
    image: 'https://hotelcms-production.imgix.net/wildhive.uk/wp-content/uploads/2026/01/IMG_9318_crop_banner.jpg',
    imageAlt: 'Eshott Hall official venue image',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Northumberland country house',
    imageNote: 'A country-house hotel should look like a destination in its own right, and this official image gives it that weight.',
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
    image: 'https://floresraras.com/wp-content/uploads/2026/01/Flores-Raras-Restaurante-Quique-Dacosta-1024x585.jpg',
    imageAlt: 'El Poblet official restaurant image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Valencia old town',
    imageNote: 'A polished Michelin dining room image fits this venue far better than any generic wine cue ever could.',
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
    website: 'https://forasterarestaurant.es/',
    imageFallbackLabel: 'Awaiting official room shot',
    imageFallbackNote: 'Forastera’s official site currently exposes still-life and food-led imagery rather than a proper room photograph, so this venue is cleaner and more honest as a text-led card.',
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
    image: 'https://www.lovevalencia.com/wp-content/uploads/2013/02/tinto-fino-ultramarino-valencia-1.jpg',
    imageAlt: 'Tinto Fino Ultramarino interior image',
    imageEyebrow: 'Venue guide image',
    imageAccent: 'El Carmen',
    imageNote: 'A proper view into the room is better here than leaving the card empty, even if the source image is modest rather than glossy.',
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
    website: 'https://tabernalasamorra.com/',
    imageFallbackLabel: 'Awaiting official room shot',
    imageFallbackNote: 'Taberna La Samorra’s official assets are dishes and bottle shots rather than a real bar or dining-room view, so the better move here is to stay text-led.',
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
    website: 'https://www.ostraspedrin.es/valencia-bonaire',
    image: 'https://www.ostraspedrin.es/wp-content/uploads/2019/08/Ostras_Pedrin_Home_Valencia.jpg',
    imageAlt: 'Ostras Pedrin Valencia official venue image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'El Carmen',
    imageNote: 'A genuine Ostras Pedrin venue image gives this oyster bar its own sharp Valencia identity instead of relying on generic seafood cues.',
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
    image: 'https://theforkrestaurantsawards.es/wp-content/uploads/2025/08/barbaric-2-1400x600.jpg',
    imageAlt: 'Barbaric Valencia interior image',
    imageEyebrow: 'Venue image',
    imageAccent: 'Patraix',
    imageNote: 'A genuine room image gives Barbaric much more credibility than the old logo treatment.',
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
    website: 'https://vivevinoshop.es/',
    image: 'https://vivevinoshop.es/wp-content/uploads/2024/09/viveClub_1.jpg',
    imageAlt: 'ViveVino official venue image',
    imageEyebrow: 'Official wine bar image',
    imageAccent: 'Russafa',
    imageNote: 'The official ViveVino room image gives Russafa some visual energy without slipping into bottle or retailer territory.',
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
    website: 'https://www.restauranteflama.com/en/',
    imageFallbackLabel: 'Awaiting official room shot',
    imageFallbackNote: 'Flama’s official visual assets are currently slogan and flame graphics instead of a usable dining-room image, so the text-led card is the more professional choice.',
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
    website: 'https://goyagalleryrestaurant.com/',
    image: 'https://goyagalleryrestaurant.com/wp-content/uploads/2022/01/DSC_1557-scaled.jpg',
    imageAlt: 'Goya Gallery official venue image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Eixample',
    imageNote: 'A calm, polished room image suits Goya Gallery far better than any wine-led placeholder would.',
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
    website: 'https://www.rausell.es/',
    imageFallbackLabel: 'Awaiting official room shot',
    imageFallbackNote: 'Rausell’s official site currently surfaces menus, food, and promotional graphics rather than a convincing room shot, so this entry stays deliberately text-led for now.',
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
    website: 'https://www.emilianobodega.com/',
    image: 'https://www.emilianobodega.com/wp-content/uploads/2021/04/7P8A0056.jpg',
    imageAlt: 'Casa Montana official venue image',
    imageEyebrow: 'Official bodega image',
    imageAccent: 'Cabanyal',
    imageNote: 'Casa Montana needs to look like a real Valencia bodega, and this official bar image finally gives it that sense of place.',
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
    website: 'https://www.casa-carmela.com/es/en/home/',
    image: 'https://www.casa-carmela.com/es/wp-content/uploads/Casa_Carmela_Galeria_17.jpg',
    imageAlt: 'Casa Carmela official dining room image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Malvarrosa',
    imageNote: 'Casa Carmela should feel unmistakably like a real paella institution by the beach, and the official room photography gets that across.',
    stylePrompts: ['Refreshing rosé', 'Crisp light white', 'Spanish fizz for aperitif', 'Beach-friendly easy drinking'],
    wineIds: ['tesco-finest-provence-rose', 'waitrose-la-vieille-ferme-rose', 'waitrose-loved-found-albarino', 'tesco-finest-rioja-blanco'],
  },
  // ── London ────────────────────────────────────────────────────────────────
  {
    id: 'hawksmoor-air-street',
    name: 'Hawksmoor Air Street',
    town: 'London',
    area: 'Piccadilly · 5a Air Street',
    type: 'Steakhouse + seafood restaurant',
    note: 'London classic',
    vibe: 'A polished West End Hawksmoor that balances serious steak with seafood, cocktails, and a room that can handle both pre-theatre ease and proper dinner energy.',
    whyAmandaLovesIt: 'Air Street is useful in the best possible way: central, dependable, and genuinely good. It suits that classic London dinner mood where you want oysters or a chop, a strong bottle, and no risk of the room feeling flat.',
    bestFor: ['Steak and seafood', 'Pre-theatre dinner', 'Classic London bottle night'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for evening tables. The seafood start + serious red finish route makes the most sense here.',
    address: '5a Air Street, London W1J 0AD',
    phone: '020 7406 3980',
    email: 'airstreet@thehawksmoor.com',
    website: 'https://thehawksmoor.com/locations/airstreet/food/menu/',
    image: 'https://thehawksmoor.com/wp-content/uploads/2022/03/air-street-03-X3.jpeg',
    imageAlt: 'Hawksmoor Air Street official venue image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Piccadilly',
    imageNote: 'This is the right kind of London dining-room image for Hawksmoor Air Street: confident, polished, and grounded in the actual room.',
    stylePrompts: ['Oysters and Champagne', 'Classic steak red', 'Chablis with seafood', 'Big-night bottle'],
    menuHighlights: [
      {
        dish: 'Oysters',
        note: 'The cleanest possible Hawksmoor opener, and one that really wants lift, salt, and a cold first glass.',
        pour: 'Start with Charles Heidsieck by the glass if you want the full Hawksmoor move; Prosecco if you want to keep the start lighter.',
        wineId: 'pol-roger-brut-reserve-nv',
      },
      {
        dish: 'Roasted scallops',
        note: 'The white port and garlic butter ask for freshness and mineral shape rather than anything broad or oaky.',
        pour: 'Go Chablis or one of the sharper white-glass options before moving heavier.',
        wineId: 'tesco-finest-chablis',
      },
      {
        dish: 'Rib-eye',
        note: 'A Hawksmoor classic that wants concentration and generosity, but not a dead-handed blockbuster.',
        pour: 'Their Hawksmoor Blend Malbec by the glass is the obvious house move; a serious claret-style red also works.',
        wineId: 'catena-alta-malbec',
      },
      {
        dish: 'Monkfish',
        note: 'Grilled monkfish can take more shape than a delicate white, but it still rewards brightness and precision.',
        pour: 'Choose Chablis first, or move up to a more textural white if you want something broader.',
        wineId: 'tesco-finest-chablis',
      },
      {
        dish: 'Porterhouse',
        note: 'This is the cut where the evening should feel a little more serious and the red should have real structure.',
        pour: 'Move into Barolo, Saint-Julien, or one of the more structured reds by the glass if you are staying flexible.',
        wineId: 'chateau-musar-2018',
      },
    ],
    wineIds: ['pol-roger-brut-reserve-nv', 'tesco-finest-chablis', 'catena-alta-malbec', 'chateau-musar-2018'],
  },
  {
    id: 'fallow-london',
    name: 'Fallow',
    town: 'London',
    area: "St James's · 52 Haymarket",
    type: 'Modern British restaurant',
    note: 'Modern London favourite',
    vibe: 'A smart Haymarket dining room built around creative, sustainability-minded cooking that still feels lively rather than worthy.',
    whyAmandaLovesIt: 'Fallow is the sort of modern London restaurant that actually earns the attention. The cooking is inventive without losing the pleasure of dinner, and the bottle choice wants to stay bright, precise, and a touch more interesting than the obvious pick.',
    bestFor: ['Modern British cooking', 'Creative dinner', 'Interesting bottle with food'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'A good choice for central London when you want serious cooking but not a hushed tasting-room atmosphere.',
    address: "52 Haymarket, London SW1Y 4RP",
    email: 'info@fallowrestaurant.com',
    website: 'https://fallowrestaurant.com',
    image: '/venue-images/fallow-room.jpg',
    imageAlt: 'Fallow official venue image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: "St James's",
    imageNote: 'Fallow’s official room photography gives it the modern-London identity it needs without leaning on food glamour shots.',
    stylePrompts: ['Precision white', 'Textured white', 'Lifted red', 'Creative food pairing'],
    wineIds: ['vacheron-sancerre-le-pave', 'benanti-etna-bianco', 'clos-de-la-roilette-fleurie', 'gd-vajra-barolo-albe'],
  },
  {
    id: 'scotts-mayfair',
    name: "Scott's Mayfair",
    town: 'London',
    area: 'Mayfair · 20 Mount Street',
    type: 'Seafood restaurant',
    note: 'Mayfair institution',
    vibe: 'A glamorous Mayfair seafood institution where shellfish towers, Champagne, and polished service are all part of the point.',
    whyAmandaLovesIt: "Scott's is for classic Mayfair theatre: seafood first, Champagne early, and a room that knows exactly what it is. If you want old-school London confidence done properly, this is one of the obvious places to go.",
    bestFor: ['Seafood lunch', 'Champagne and oysters', 'Classic Mayfair evening'],
    typicalSpend: 'Premium',
    reserveTip: 'Book ahead, especially for the terrace or prime lunch slots. Lean into seafood and mineral whites rather than over-ordering red too early.',
    address: '20 Mount Street, London W1K 2HE',
    phone: '020 7495 7309',
    website: 'https://scotts-mayfair.com',
    image: '/venue-images/scotts-mayfair-room.png',
    imageAlt: "Scott's Mayfair private dining room image",
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Mayfair',
    imageNote: 'Scott’s should look unmistakably like a Mayfair destination, and this official interior image gives it more character than the terrace banner.',
    stylePrompts: ['Seafood Champagne', 'Grand white', 'Chablis line', 'Luxury lunch bottle'],
    wineIds: ['laurent-perrier-grand-siecle-no-26', 'tesco-finest-chablis', 'vacheron-sancerre-le-pave', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'bob-bob-ricard-soho',
    name: 'Bob Bob Ricard',
    town: 'London',
    area: 'Soho · 1 Upper James Street',
    type: 'British-French restaurant',
    note: 'Soho icon',
    vibe: 'An iconic Soho dining room built around booths, glamour, and the famous Press for Champagne button at every table.',
    whyAmandaLovesIt: 'Bob Bob Ricard is unapologetically theatrical in exactly the right way. It is one of those rooms where Champagne makes sense immediately and the whole evening should feel a little more glamorous than strictly necessary.',
    bestFor: ['Celebratory dinner', 'Champagne-first evening', 'Classic Soho glamour'],
    typicalSpend: 'Premium',
    reserveTip: 'Go in ready to lean into the house style: booths, Champagne, richer classics, and a touch of theatre.',
    address: '1 Upper James Street, Soho, London W1F 9DF',
    phone: '+44 203 145 1000',
    email: 'soho.reservations@bobbobricard.com',
    website: 'https://www.bobbobricard.com/soho/',
    image: 'https://www.bobbobricard.com/src/img/bobbobricard-soho-dining-room.jpg',
    imageAlt: 'Bob Bob Ricard Soho official dining room image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Soho',
    imageNote: 'Bob Bob Ricard needs to look like Bob Bob Ricard: booths, drama, and unmistakable Soho glamour.',
    stylePrompts: ['Champagne-led', 'Luxury old-world red', 'Theatrical occasion bottle', 'Rich classic pairing'],
    wineIds: ['pol-roger-brut-reserve-nv', 'laurent-perrier-la-cuvee-nv', 'chateau-margaux-2015', 'gd-vajra-barolo-albe'],
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
    vibe: "One of New York's last great family-owned hotels — a discreet Upper East Side landmark since 1927, steps from Central Park and Madison Avenue. The Lowell offers the kind of unhurried, personal luxury that anonymous tower hotels cannot replicate: wood-burning fireplaces, landscaped terraces, and a sense that time moves differently here. Majorelle serves seasonal cuisine; Jacques Bar is one of the finest cocktail rooms in Manhattan; The Club Room gives you the same polish in a softer, more all-day setting.",
    whyAmandaLovesIt: "The Lowell is the New York hotel for people who would rather be somewhere that feels like a home than a lobby. The Upper East Side address, the fireplaces, the impeccable service — it earns its reputation as the #1 hotel in New York without any of the fuss. Majorelle is the right room for a long, considered dinner with a great bottle. Jacques Bar is the place for a pre-dinner Martini and something exceptional by the glass. The Club Room is the quieter move when you want that same standard over lunch, a lighter supper, or a composed glass-and-snack stop.",
    bestFor: ['The definitive New York luxury stay', 'Special occasion dinner at Majorelle', 'Club Room lunch or light supper', 'Pre-dinner drinks at Jacques Bar'],
    typicalSpend: 'Premium',
    reserveTip: 'Book Majorelle well in advance for dinner. Jacques Bar is more walk-in friendly. The Club Room works well for a quieter lunch or early-evening glass. Ask for a room or suite with a terrace if available.',
    address: '28 East 63rd Street, New York, NY 10065',
    phone: '+1 212-838-1400',
    website: 'https://www.lowellhotel.com',
    image: 'https://scdn.aro.ie/Sites/50/lowellhotel/uploads/images/FullLengthImages/Large/Exterior_The_Lowell.jpg',
    imageAlt: 'Exterior of The Lowell Hotel in New York',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Upper East Side',
    imageNote: 'A discreet Upper East Side landmark with the old-school polish that defines the Lowell experience.',
    stylePrompts: ['Grand Cru white', 'First Growth Bordeaux', 'Iconic Champagne', 'Napa statement bottle'],
    menuHighlights: [
      {
        dish: 'Scottish smoked salmon royal',
        note: 'A polished Upper East Side classic that wants freshness and precision rather than oak or weight.',
        pour: 'Start with Delamotte or William Fèvre Chablis by the glass.',
        wineId: 'tesco-finest-chablis',
      },
      {
        dish: 'Crab cakes',
        note: 'The sweet shellfish and crisp crumb need acidity, lift, and a clean finish.',
        pour: 'Chablis is the safest call; Champagne if you want the room to feel more celebratory.',
        wineId: 'dom-perignon-2013',
      },
      {
        dish: 'Sautéed salmon with salsify',
        note: 'A slightly richer fish dish that still rewards mineral whites over broad, buttery styles.',
        pour: 'Go William Fèvre Chablis or Elena Walch Pinot Grigio.',
        wineId: 'tesco-finest-chablis',
      },
      {
        dish: 'Chicken curry with mango chutney',
        note: 'The fruit and spice make this a by-the-glass trap unless you keep the wine bright and controlled.',
        pour: 'Choose Elena Walch Pinot Grigio first; Whispering Angel if you want something softer.',
        wineId: 'ms-whispering-angel-rose',
      },
      {
        dish: 'Lamb tajine with vegetables and couscous',
        note: 'This is where the list can finally lean red without getting too heavy for the room.',
        pour: 'Ask for Domaine Vallot Le Coriançon Côtes du Rhône by the glass.',
        wineId: 'sainsburys-ttd-cotes-du-rhone',
      },
      {
        dish: 'Lebanese mujaddara',
        note: 'Earthy, spiced, and quieter than the richer mains, so the pairing should stay gentle and lifted.',
        pour: 'Provence rosé works beautifully; Sancerre is the sharper white route.',
        wineId: 'sainsburys-ttd-sancerre',
      },
    ],
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
    image: 'https://images.prismic.io/blue-box-cafe/4ef094ad-c912-41e9-adc0-c734a30d663a_23037_press_tiffany_nyc_4-18-22_Cafe_Shot02_layered_cvPR.jpg?rect=493,909,2011,950&w=1843&h=850&auto=format&dpr=2&q=70',
    imageAlt: 'Blue Box Cafe dining room at Tiffany & Co.',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Fifth Avenue',
    imageNote: 'The Tiffany blue room is part of the occasion here, so the venue image needs to do as much work as the copy.',
    stylePrompts: ['Classic Champagne', 'Elegant sparkling rosé', 'Afternoon tea white', 'Celebration bottle'],
    wineIds: ['bollinger-special-cuvee', 'dom-perignon-2013', 'chateau-yquem-2015', 'trimbach-clos-ste-hune'],
  },
  // ── Sheffield (additional) ────────────────────────────────────────────────
  {
    id: 'west-10-sheffield',
    name: 'West 10 Bar & Kitchen',
    amandaFavourite: true,
    town: 'Sheffield',
    area: 'Ranmoor · 376 Fulwood Road',
    type: 'Wine bar + tasting-menu restaurant',
    note: 'Sheffield fine dining gem',
    vibe: 'A quietly serious Ranmoor address that works on two levels: a relaxed wine bar on the ground floor and a seven-course blind tasting menu restaurant upstairs, with the wine flight curated by Mitchell\'s Wine Merchants. The kitchen is led by chef Scott Philliskirk, who brings fourteen years of fine-dining experience to cooking that is rooted in seasonal British produce and executed with precision.',
    whyAmandaLovesIt: 'West 10 fills the space between a casual wine bar evening and a full Jöro booking — it is the Sheffield choice when you want a proper tasting menu without treating it as a twice-a-year event. The Mitchell\'s wine pairing gives the evening real cellar credibility, and the Ranmoor neighbourhood gives it a calm, unhurried atmosphere that the city centre rarely manages.',
    bestFor: ['Tasting-menu dinner', 'Wine flight pairing', 'Considered bottle night'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for the tasting menu. The wine flight (£54pp) is worth committing to alongside the seven courses (£65pp).',
    address: '376 Fulwood Road, Ranmoor, Sheffield S10 3GD',
    phone: '0114 230 9190',
    website: 'https://www.west10sheffield.co.uk',
    image: 'https://www.west10sheffield.co.uk/wp-content/uploads/2023/03/West10-Interior-2-scaled.jpg',
    imageAlt: 'West 10 Bar & Kitchen official interior image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Ranmoor',
    imageNote: 'West 10 needs to read as a serious dining room first and a wine bar second — the interior image gets that balance right.',
    stylePrompts: ['Precision tasting-menu pairing', 'Seasonal wine flight', 'Structured white', 'Old-world red'],
    wineIds: ['pol-roger-brut-reserve-nv', 'trimbach-clos-ste-hune', 'barolo-conterno', 'vacheron-sancerre-le-pave'],
  },
  // ── Yorkshire ─────────────────────────────────────────────────────────────
  {
    id: 'bavette-bistro-leeds',
    name: 'Bavette Bistro',
    town: 'Leeds',
    area: 'Horsforth · 4–6 Town Street',
    type: 'French bistro',
    note: 'UK Best Local Restaurant 2024',
    vibe: 'A warmly lit French bistro in Horsforth run by Sandy Jarvis and Clément Cousin, whose family owns a Loire vineyard. Classic bistro cooking — steak frites, duck confit, soupe de poisson — done with conviction and without a trace of irony. The wine list is personal, organic, and Loire-weighted, sourced partly from direct producer relationships.',
    whyAmandaLovesIt: 'Bavette is the kind of neighbourhood bistro that wins awards because it earns them meal after meal rather than through spectacle. The wine list reflects genuine producer knowledge and the Loire bias gives it an identity you rarely find outside France itself. UK Best Local Restaurant (Good Food Guide 2024), Michelin Bib Gourmand 2025 — the recognition has not changed what makes it special.',
    bestFor: ['French bistro classics', 'Loire wine evening', 'Neighbourhood dinner worth travelling to'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead — it fills quickly and the Bib Gourmand recognition has made walk-ins difficult at weekends. Worth the short Horsforth journey from Leeds centre.',
    address: '4–6 Town Street, Horsforth, Leeds LS18 4RJ',
    website: 'https://www.bavettebistro.com',
    image: 'https://www.bavettebistro.com/wp-content/uploads/2024/02/bavette-bistro-interior.jpg',
    imageAlt: 'Bavette Bistro official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Horsforth',
    imageNote: 'A warmly lit bistro interior is exactly the right card image here — it communicates the French neighbourhood feel before a word is read.',
    stylePrompts: ['Loire organic', 'Natural and low-intervention', 'Bistro classic pairing', 'Producer-direct discovery'],
    wineIds: ['vacheron-sancerre-le-pave', 'clos-de-la-roilette-fleurie', 'tesco-finest-chablis', 'benanti-etna-bianco'],
  },
  {
    id: 'latitude-wine-bar-leeds',
    name: 'Latitude Wine Bar',
    town: 'Leeds',
    area: 'The Calls · 46 The Calls',
    type: 'Wine shop + bar',
    note: 'Leeds wine discovery destination',
    vibe: 'Over 2,000 wines and spirits on the shelves — and you choose any bottle, pay corkage, and drink it at the table with cheese and small plates. Opened 2024 at The Calls after sixteen years as an independent merchant. The format removes the separation between buying and drinking in a way that works beautifully for anyone who wants to explore seriously without paying restaurant bottle margins.',
    whyAmandaLovesIt: 'The shop-plus-corkage model is genuinely freeing: no wine list to navigate, no pressure to stay in a particular bracket, just the full merchant range available to open and drink. For anyone who already knows what they like or wants to make an evening of discovery, Latitude is the best wine space in Leeds city centre.',
    bestFor: ['Wine discovery at merchant prices', 'Bottle-led evening with small plates', 'Birthday bottle from the cellar'],
    typicalSpend: 'Flexible — you set the price point',
    reserveTip: 'Walk-in friendly but book ahead for larger groups. Bring appetite for browsing the shelves before choosing.',
    address: 'Unit 31, 46 The Calls, Leeds LS2 7EY',
    website: 'https://www.latitudewine.co.uk',
    image: 'https://www.latitudewine.co.uk/cdn/shop/files/latitude-the-calls-interior.jpg',
    imageAlt: 'Latitude Wine Bar official interior image',
    imageEyebrow: 'Official wine bar image',
    imageAccent: 'The Calls',
    imageNote: 'The retail-wall-meets-bar-table image is the whole story here: it communicates the format more efficiently than any description.',
    stylePrompts: ['Any bottle at merchant pricing', 'Cellar exploration', 'Discovery over a long evening', 'Old-world depth'],
    wineIds: ['trimbach-clos-ste-hune', 'gd-vajra-barolo-albe', 'vacheron-sancerre-le-pave', 'chateau-musar-2018'],
  },
  {
    id: 'tannin-level-harrogate',
    name: 'The Tannin Level',
    town: 'Harrogate',
    area: '5 Raglan Street',
    type: 'Restaurant + wine bar',
    note: 'Harrogate institution since 1985',
    vibe: 'A cellar-level Victorian room that has been doing this since 1985 and has the wine list to prove it. Exposed stone, warm lighting, and a serious approach to matching British seasonal cooking with a range that covers Champagne, Burgundy, Bordeaux, and some genuinely interesting by-the-glass options. Forty years of local loyalty are the most reliable endorsement a restaurant can have.',
    whyAmandaLovesIt: 'The Tannin Level is the Harrogate answer to all the overdesigned venues that have come and gone since 1985. The room, the list, and the cooking have a settled confidence that can only come from decades of knowing exactly what you are doing. When you are in Harrogate and want a proper wine evening rather than a safe hotel bar, this is the clear choice.',
    bestFor: ['Classic wine evening', 'Harrogate occasion dinner', 'Vintage wine list browsing'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for weekends — it has a loyal local following that fills the room. Ask about the wine list before ordering rather than defaulting to the first page.',
    address: '5 Raglan Street, Harrogate HG1 1LE',
    website: 'https://www.tanninlevel.co.uk',
    imageFallbackLabel: 'Cellar dining room · since 1985',
    imageFallbackNote: "Harrogate's wine institution since 1985 — forty years of Burgundy, Champagne, and British seasonal cooking in a cellar-level Victorian room with a serious list to match.",
    stylePrompts: ['Classic old-world red', 'Champagne aperitif', 'Aged Burgundy', 'Serious food pairing'],
    wineIds: ['bollinger-special-cuvee', 'barolo-conterno', 'trimbach-clos-ste-hune', 'chateau-margaux-2015'],
  },
  {
    id: 'skosh-york',
    name: 'Skosh',
    town: 'York',
    area: 'Micklegate · 98 Micklegate',
    type: 'Small plates restaurant',
    note: 'York\'s Michelin Bib Gourmand',
    vibe: 'Chef-owner Neil Bentinck\'s eclectic small-plates restaurant on Micklegate has held a Michelin Bib Gourmand since 2018 and earned a review from Jancis Robinson in the process. Every wine on the list is available by the glass. The cooking draws from wherever it wants — Pacific influences, Japanese technique, European produce — and the bottle choice follows the same logic: buy what works with the food, not what fits a conventional list structure.',
    whyAmandaLovesIt: 'Skosh is the York restaurant that actually makes you want to drink curiously rather than safely. Every bottle by the glass is not a gimmick here — it is a commitment to the way the food works, dish by dish. The Bib Gourmand is well deserved and the Jancis Robinson review says everything about the seriousness of the list.',
    bestFor: ['Every-wine-by-the-glass exploration', 'Small plates and experimental pairing', 'York special evening'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead — it fills consistently. Ask the team which glasses are working especially well that week; the list rotates with the menu.',
    address: '98 Micklegate, York YO1 6JX',
    website: 'https://www.skoshyork.co.uk',
    image: 'https://www.skoshyork.co.uk/wp-content/uploads/2018/12/skosh-gallery1.jpg',
    imageAlt: 'Skosh official dining room image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Micklegate',
    imageNote: 'Skosh reads best as a lively, modern dining room rather than a formal restaurant — and that is exactly what the image should communicate.',
    stylePrompts: ['All bottles by the glass', 'Eclectic food pairing', 'Pacific and Asian-inflected', 'Discovery-led evening'],
    wineIds: ['benanti-etna-bianco', 'clos-de-la-roilette-fleurie', 'vacheron-sancerre-le-pave', 'gd-vajra-barolo-albe'],
  },
  // ── South Yorkshire ───────────────────────────────────────────────────────
  {
    id: 'old-smythie-wentworth',
    name: 'Old Smythie Restaurant',
    town: 'Wentworth',
    area: 'Main Street · Wentworth Village',
    type: 'Restaurant',
    note: 'Destination dining in a remarkable heritage village',
    vibe: "Set in the village of Wentworth — home to Wentworth Woodhouse, one of the largest privately owned houses in Europe and the centrepiece of a genuinely extraordinary South Yorkshire heritage landscape. The Old Smythie occupies a characterful building in the village itself, delivering the kind of unpretentious but carefully executed cooking that a setting this particular demands. Wentworth village is the kind of place that rewards the detour, and the Old Smythie is the reason to make the journey a meal.",
    whyAmandaLovesIt: "Wentworth is one of those English villages that feels like a private discovery even when everyone local already knows it. The Woodhouse estate, the estate cottages, the ancient church — the whole village has an intactness that is rare in South Yorkshire. The Old Smythie sits comfortably inside that context, and the cooking makes it a complete destination rather than just a backdrop.",
    bestFor: ['Destination village dining', 'South Yorkshire occasion lunch', 'Wentworth estate visit combined with dinner'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for weekend evenings and Sunday lunch. Worth combining with a walk around the Wentworth estate grounds.',
    address: 'Main Street, Wentworth, Rotherham S62 7TH',
    website: 'https://oldsmythie.co.uk',
    image: 'https://oldsmythie.co.uk/wp-content/uploads/2023/05/old-smythie-restarant-front.jpg',
    imageAlt: 'Old Smythie Restaurant official exterior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Wentworth village',
    imageNote: "The Old Smythie exterior sits directly inside Wentworth village — the heritage stone building communicates the setting as much as any interior shot would.",
    imageFallbackLabel: 'Village restaurant · Wentworth',
    imageFallbackNote: "Wentworth is one of England's most architecturally significant villages — the Old Smythie sits inside that heritage landscape, making the setting as much the draw as the kitchen.",
    stylePrompts: ['Classic red with village dinner', 'Old-world occasion bottle', 'English countryside pairing', 'Yorkshire welcome'],
    wineIds: ['barolo-conterno', 'trimbach-clos-ste-hune', 'vacheron-sancerre-le-pave', 'chateau-margaux-2015'],
  },
  {
    id: 'george-dragon-wentworth',
    name: 'George & Dragon',
    town: 'Wentworth',
    area: 'Main Street · Wentworth Village',
    type: 'Village pub + restaurant',
    note: 'Wentworth village institution',
    vibe: "The village pub of Wentworth — a proper stone-built country pub in the same remarkable heritage village as Wentworth Woodhouse, one of Europe's largest privately owned houses. The George & Dragon has been serving the village and visitors for generations, and its position in one of South Yorkshire's most beautiful estate villages gives it a character that cannot be manufactured. Real ales, seasonal cooking, and the kind of settled atmosphere that belongs to a village pub that has been doing this for a long time.",
    whyAmandaLovesIt: "Every visit to Wentworth should include a stop at the George & Dragon. Whether before or after a walk around the Woodhouse estate grounds, the pub provides exactly the uncomplicated pleasure that a village of this quality deserves. Honest food, good ales, and a room that has the confidence of genuine age rather than manufactured heritage.",
    bestFor: ['Village pub lunch after the Wentworth estate walk', 'Relaxed South Yorkshire afternoon', 'Classic British pub food with a proper glass'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Walk-in for weekday lunch. Book for Sunday lunch and weekend evenings when the village is at its busiest.',
    address: 'Main Street, Wentworth, Rotherham S62 7TH',
    website: 'https://georgeanddragonwentworth.com',
    image: 'https://georgeanddragonwentworth.com/wp-content/uploads/2025/07/504263171_18410207095099268_647937770263650071_n-e1753706770161.jpg',
    imageAlt: 'George & Dragon Wentworth official venue image',
    imageEyebrow: 'Official pub image',
    imageAccent: 'Wentworth village',
    imageNote: 'The George & Dragon in Wentworth village — stone-built and settled, exactly what a pub this old in a village this beautiful should look like.',
    imageFallbackLabel: 'Stone village pub · Wentworth',
    imageFallbackNote: 'A proper stone-built village pub in one of South Yorkshire\'s finest heritage villages — the setting does half the work before you sit down.',
    stylePrompts: ['Real ale in a stone pub', 'Easy mid-week red', 'Sunday lunch white', 'Village pub occasion'],
    wineIds: ['clos-de-la-roilette-fleurie', 'tesco-finest-chablis', 'baron-de-ley-rioja-reserva', 'bollinger-special-cuvee'],
  },
  {
    id: 'the-vault-penistone',
    name: 'The Vault Bistro & Speakeasy',
    town: 'Penistone',
    area: 'Market Street · Penistone Town Centre',
    type: 'Bistro + wine bar',
    note: 'Penistone\'s standout dining room',
    vibe: "A bistro and speakeasy-style wine bar in the centre of Penistone — the market town at the western edge of South Yorkshire where the Pennines begin. The Vault occupies a characterful room that has carved out a serious reputation for cooking and wine well above what the postcode might suggest. The speakeasy element gives the evening an intimacy that the more conventional South Yorkshire dining rooms lack, and the wine focus makes it a genuine destination rather than simply the best option locally.",
    whyAmandaLovesIt: "The Vault is the South Yorkshire venue that surprises people. Penistone is not the first place that comes to mind for a serious wine evening, but the Vault delivers one — a well-chosen list, cooking that earns its following, and the kind of atmospheric room that makes a mid-week dinner feel like a proper occasion. It has built its reputation entirely on merit, which in a market town like Penistone is the most reliable endorsement there is.",
    bestFor: ['Penistone occasion dinner', 'Speakeasy evening with a curated list', 'South Yorkshire wine evening away from Sheffield city centre'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for weekend evenings — the room is not large and the reputation fills it. The speakeasy bar is worth arriving early for.',
    address: 'Market Street, Penistone, Sheffield S36 6BZ',
    website: 'https://vaultpenistone.com',
    image: 'https://images.squarespace-cdn.com/content/v1/62bc4fd446252026769f838a/51a9410d-6b53-4e30-88f5-2ea359d5fea8/new-inn-vault-7906.jpg',
    imageAlt: 'The Vault Bistro official venue image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Penistone',
    imageNote: 'The Vault interior — a proper bistro room with the warmth and intimacy that the speakeasy concept requires.',
    imageFallbackLabel: 'Bistro + speakeasy · Penistone',
    imageFallbackNote: "A characterful bistro and speakeasy wine bar in Penistone market town — the South Yorkshire dining room that earns its reputation on merit alone.",
    stylePrompts: ['Speakeasy wine evening', 'Curated bistro bottle', 'South Pennine occasion', 'Intimate dining pairing'],
    wineIds: ['vacheron-sancerre-le-pave', 'clos-de-la-roilette-fleurie', 'barolo-conterno', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'rockingham-arms-wentworth',
    name: 'The Rockingham Arms',
    town: 'Wentworth',
    area: 'Main Street · Wentworth Village',
    type: 'Historic pub + restaurant',
    note: 'Listed building · Wentworth estate village',
    vibe: "The oldest pub in Wentworth village — a listed building at the heart of one of South Yorkshire's most remarkable estate settlements. The Rockingham Arms sits directly opposite the imposing Wentworth estate wall, steps from the ancient Church of the Holy Trinity and a walk from Wentworth Woodhouse itself. The room has the low ceilings and stone flags of genuine age rather than pastiche, and the cooking is seasonal British with enough seriousness to match the surroundings.",
    whyAmandaLovesIt: "Wentworth has three pubs and a restaurant, which is extraordinary for a village of its size — a direct consequence of the Wentworth Woodhouse estate history and the quality of the village architecture that has attracted a loyal dining following. The Rockingham Arms is the most characterful of the three, with a room that communicates the history of the place without any effort at all. The wine list is unpretentious and the food is honest. Sometimes that is exactly what you need.",
    bestFor: ['Historic pub atmosphere', 'Post-Wentworth Woodhouse visit', 'Honest seasonal British cooking'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book for Sunday lunch when the village is busiest. Walk-in friendly for weekday evenings.',
    address: 'Main Street, Wentworth, Rotherham S62 7TH',
    website: 'https://www.greeneking.co.uk/pubs/south-yorkshire/rockingham-arms',
    imageFallbackLabel: 'Listed pub · Wentworth village',
    imageFallbackNote: "The oldest pub in Wentworth, opposite the estate wall — stone flags, low ceilings, and an atmosphere that belongs entirely to the village rather than to any hospitality formula.",
    stylePrompts: ['Village pub house red', 'Easy British pub white', 'Sunday roast Claret', 'Unpretentious seasonal pairing'],
    wineIds: ['baron-de-ley-rioja-reserva', 'tesco-finest-chablis', 'bollinger-special-cuvee', 'clos-de-la-roilette-fleurie'],
  },
  {
    id: 'dn1-doncaster',
    name: 'DN1 Delicatessen & Dining',
    town: 'Doncaster',
    area: 'High Fisher Gate · City Centre',
    type: 'Fine dining restaurant + deli wine bar',
    note: 'Doncaster fine dining · 2 AA Rosettes',
    vibe: "A 2 AA Rosette tasting menu restaurant beneath Doncaster city centre, pairing five- and eight-course Modern British menus with a curated list of 130+ wines and freshly shucked oysters at the deli counter. Chef-patron Marcus Ashton-Simpson has built a genuine reputation here — twice semi-finalist at National Chef of the Year — and the wine room is a proper cellar rather than an afterthought. DN1 is the strongest argument that Doncaster can genuinely surprise you.",
    whyAmandaLovesIt: "This is not what you expect when you arrive in Doncaster city centre. The wine list has over 130 references and the kitchen earns those rosettes rather than coasting on them. The oyster and champagne counter is a brilliant touch — the kind of thing that belongs in a Mayfair wine bar, not a South Yorkshire city centre. That is precisely why DN1 is worth a special journey.",
    bestFor: ['Tasting menu occasion', 'Fine dining in a surprising location', 'Champagne and oysters at the bar'],
    typicalSpend: 'Premium (tasting menus £65–£95 per head)',
    reserveTip: 'Book the 8-course menu if the whole evening is free. Oyster bar counter is available for walk-ins.',
    address: '3 High Fisher Gate, Doncaster DN1 1QZ',
    website: 'https://www.dn1online.co.uk',
    image: 'https://www.dn1online.co.uk/cdn/shop/files/0029-03-2025-DN1-3856.jpg?v=1745582984&width=1200',
    imageAlt: 'DN1 Delicatessen & Dining official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Doncaster city centre',
    imageNote: 'The DN1 dining room — this is not what you expect in Doncaster city centre, which is precisely the point.',
    imageFallbackLabel: 'Fine dining room · Doncaster',
    imageFallbackNote: "DN1 is Doncaster's most serious dining room — 2 AA Rosettes, tasting menus, and a 130-wine list in the city's historic heart.",
    stylePrompts: ['Aged Burgundy tasting menu', 'Mature Bordeaux with the cellar list', 'Champagne with oysters', 'Grower fizz at the bar'],
    wineIds: ['bollinger-special-cuvee', 'barolo-conterno', 'vacheron-sancerre-le-pave', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'beatson-house-cawthorne',
    name: 'Beatson House',
    town: 'Barnsley',
    area: 'Cawthorne village · Cannon Hall estate',
    type: 'Fine dining restaurant',
    note: 'Countryside destination · Lightfoot Wines connection',
    vibe: "An 18th-century stone cottage cluster in the estate village of Cawthorne — tucked into the Cannon Hall countryside just outside Barnsley — converted into four distinctive candlelit dining rooms. Modern British cooking led by Lee Haigh, with wine pairings sourced through the Lightfoot Wines sister operation, which means the list is consistently more interesting than the postcode suggests. The setting is quietly exceptional: proper Yorkshire stone, low beams, and the kind of atmosphere that belongs to old buildings rather than to anyone's interior design choices.",
    whyAmandaLovesIt: "Beatson House is the only genuinely fine restaurant in the Barnsley hinterland that earns the label without compromise. The Lightfoot Wines connection elevates the list well above what you would expect, and the four individual rooms give the building a character that a single dining room could never manufacture. It is the countryside occasion restaurant that this part of South Yorkshire has always deserved.",
    bestFor: ['Countryside occasion dinner', 'Yorkshire fine dining with proper wine', 'Special booking near Cannon Hall'],
    typicalSpend: 'Premium (£55–£80 per head with wine)',
    reserveTip: 'Dinner Wednesday–Saturday from 18:30; Sunday lunch also. Book well ahead at weekends — it fills from across the region.',
    address: 'Church Street, Cawthorne, Barnsley S75 4HQ',
    website: 'https://beatsonhouse.co.uk',
    imageFallbackLabel: 'Country dining rooms · Cawthorne',
    imageFallbackNote: 'An 18th-century cottage restaurant with four distinctive rooms — the only genuinely fine dining destination in the Barnsley countryside.',
    stylePrompts: ['Textured white with fine dining', 'Classic old-world red', 'Yorkshire countryside occasion bottle', 'Dessert wine finish'],
    wineIds: ['trimbach-clos-ste-hune', 'barolo-conterno', 'vacheron-sancerre-le-pave', 'bollinger-special-cuvee'],
  },
  {
    id: 'seasons-wickersley',
    name: 'Seasons Restaurant',
    town: 'Rotherham',
    area: 'Wickersley village · Bawtry Road',
    type: 'Fine bistro restaurant',
    note: 'Rotherham destination dining',
    vibe: "A polished independent bistro in the Rotherham suburb of Wickersley, serving seasonal modern British food with an emphasis on fresh, local produce. The same team runs The Courtyard wine bar next door, which means the wine list punches well above its suburban surroundings — it is curated rather than generic, changed regularly, and backed by genuine enthusiasm for matching food and wine well. The room has been properly invested in, with a warmth and confidence that marks it out from the Rotherham dining norm.",
    whyAmandaLovesIt: "Seasons makes a strong case for Wickersley as a Rotherham dining destination on its own terms. The Courtyard connection means the wine list is worth choosing from rather than just navigating around, the cooking changes genuinely with the seasons, and the room has the feel of somewhere that takes the whole experience seriously. A brilliant neighbourhood find for anyone in the Rotherham orbit.",
    bestFor: ['Neighbourhood fine dining', 'Seasonal tasting with excellent wine', 'Rotherham date night destination'],
    typicalSpend: 'Mid to premium (£40–£65 per head)',
    reserveTip: 'Book Thursday–Saturday dinner; Sunday lunch also available. Ask about the wine flight when booking.',
    address: '151 Bawtry Road, Wickersley, Rotherham S66 2BW',
    website: 'https://www.seasonswickersley.co.uk',
    imageFallbackLabel: 'Bistro dining room · Wickersley',
    imageFallbackNote: "Wickersley's most serious restaurant — invested interiors, seasonal British cooking, and wine led by The Courtyard team next door.",
    stylePrompts: ['Seasonal white with the market menu', 'Lighter red bistro bottle', 'Grower champagne aperitif', 'Classic pairing with the tasting menu'],
    wineIds: ['vacheron-sancerre-le-pave', 'clos-de-la-roilette-fleurie', 'tesco-finest-chablis', 'baron-de-ley-rioja-reserva'],
  },
  // ── Munich ────────────────────────────────────────────────────────────────
  {
    id: 'tantris-munich',
    name: 'Tantris',
    amandaFavourite: true,
    town: 'Munich',
    area: 'Schwabing · Johann-Fichte-Str. 7',
    type: 'Fine dining restaurant',
    note: 'Amanda favourite — Munich legend',
    vibe: 'One of the great European restaurant institutions — two Michelin stars held for nearly four decades, a cellar of 30,000 bottles spanning 1,593 labels, and a history that begins in 1971 when Eckart Witzigmann made it one of the first German restaurants to win three Michelin stars. The iconic 1970s design by Justus Dahinden — all angular geometry, amber light, and floating staircase — was protected as a design monument and meticulously restored in 2021. The Tantris complex now includes the main restaurant, the more accessible Tantris DNA, and Bar Tantris.',
    whyAmandaLovesIt: 'Tantris is one of those rare places that has earned its reputation over more than fifty years without ever resting on it. The cellar is extraordinary — Burgundy depth that rivals dedicated négociants, Champagne breadth that covers most of the grandes maisons across multiple vintages, and a by-the-glass programme that lets you explore seriously without committing to a full bottle. The restored interior is one of the most beautiful dining rooms in Europe.',
    bestFor: ['The Munich wine evening above all others', 'Serious tasting-menu bottle pairing', 'Grand Burgundy or Champagne occasion'],
    typicalSpend: 'Premium',
    reserveTip: 'Book the main restaurant as far ahead as possible. Tantris DNA is more accessible and easier to book at shorter notice. Bar Tantris is walk-in friendly for an aperitif before dinner.',
    address: 'Johann-Fichte-Str. 7, 80805 München',
    phone: '+49 89 36 19 59 0',
    website: 'https://www.tantris.de/en/',
    image: 'https://tantris.de/wp-content/uploads/2021/11/Restaurant_Tantris_01_bearb.jpg',
    imageAlt: 'Tantris Munich official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Schwabing',
    imageNote: 'The iconic Tantris interior — amber light, geometric architecture, floating staircase — is one of the most recognisable dining rooms in the world and must be the card image.',
    stylePrompts: ['Grand Burgundy cellar', 'Champagne first growth', 'Classic German white', 'Tasting-menu precision pairing'],
    wineIds: ['chateau-margaux-2015', 'trimbach-clos-ste-hune', 'barolo-conterno', 'dom-perignon-2013'],
  },
  {
    id: 'brenner-operngrill-munich',
    name: 'Brenner Operngrill',
    richardFavourite: true,
    town: 'Munich',
    area: 'Maximilianstrasse · Maximilianstr. 15',
    type: 'Grill restaurant + bar',
    note: "Richard's favourite — Maximilianstrasse classic",
    vibe: 'Set inside the historic Marstall — the royal stables built in the early 19th century, steps from the Bavarian State Opera and the luxury house row on Maximilianstrasse. The space splits across three zones: an open fireplace grill room, a pasta counter where fresh pasta is made by hand daily, and a lounge bar that is a destination in its own right. Steaks, truffle-dressed ravioli, grilled fish, and a cocktail programme that punches well above its weight.',
    whyAmandaLovesIt: "Richard's absolute Munich favourite. Brenner is the choice when the evening wants confidence and warmth rather than hushed formality — high ceilings, stone columns, modern design laid over protected 19th-century architecture that seats nearly three hundred without ever feeling impersonal. The pasta counter alone is worth the visit, and the bar stays genuinely lively long after dinner. A Barolo with the steak in that room is one of his standard-setters.",
    bestFor: ['Munich steak night', 'Pasta and Italian bottle', 'Pre-opera or post-opera dinner'],
    typicalSpend: 'Upper-mid to premium',
    reserveTip: 'Essential for evenings, especially pre-opera or weekend slots. The bar takes walk-ins. Ask to sit in the grill room for the open-fire atmosphere.',
    address: 'Maximilianstrasse 15, 80539 München',
    phone: '+49 89 452 2880',
    website: 'https://www.brennergrill.de/en/',
    image: 'https://www.brennergrill.de/wp-content/uploads/2024/03/2024-02-26-Brenner_Grill0972.jpg',
    imageAlt: 'Brenner Operngrill official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Maximilianstrasse',
    imageNote: 'The Marstall grill room — stone columns, warm fire light, historic architecture — gives Brenner an unmistakable Munich character that no food shot could replace.',
    stylePrompts: ['Barolo with the steak', 'Fresh pasta and Italian white', 'Classic red with grilled beef', 'Aperitivo Champagne at the bar'],
    wineIds: ['barolo-conterno', 'gd-vajra-barolo-albe', 'ca-maiol-prestige-lugana', 'dom-perignon-2013'],
  },
  {
    id: 'sticks-and-stones-munich',
    name: 'Sticks & Stones Weinbar',
    town: 'Munich',
    area: 'Schwabing · Clemensstraße 7',
    type: 'Wine bar',
    note: 'World\'s Best Wine Bar 2025',
    vibe: "Named World's Best Wine Bar (World of Fine Wine 2025) and Best New Wine Program in Europe in its opening year, Sticks & Stones is founded by Justin Leone in a compact Schwabing room that punches far beyond its size. Over 900 wines are accessible by the glass via Coravin — not a curated shortlist, but the actual cellar range including magnums, large formats, and bottles from the world's greatest producers and most celebrated vintages. The list arrives without the usual markup architecture of fine dining.",
    whyAmandaLovesIt: "There is nowhere else in Europe where you can order a glass of DRC, a Champagne from 2002, a Barolo from 1990, and a German Spätburgunder from a single-vineyard, all in the same sitting, all without buying full bottles. Sticks & Stones makes the finest wines in the world accessible in a way that almost no other venue on the planet achieves. The recognition is deserved, and the experience delivers.",
    bestFor: ['The great Coravin-by-the-glass exploration', 'Once-in-a-lifetime glass of something extraordinary', 'Munich wine evening without equal'],
    typicalSpend: 'Varies widely — a single exceptional glass can be the whole event',
    reserveTip: 'Book ahead — the Schwabing room is small and the reputation now fills it. Come with an open mind about what to drink; ask Leone or the team what they are excited about.',
    address: 'Clemensstraße 7, 80803 München',
    website: 'https://www.sticksandstonesbar.com',
    imageFallbackLabel: 'World\'s Best Wine Bar 2025 · Schwabing',
    imageFallbackNote: 'Over 900 wines by the glass via Coravin — including DRC, Barolo from 1990, and Champagne across multiple decades. The most extraordinary by-the-glass programme in Europe.',
    stylePrompts: ['Grand cru by the glass', 'Coravin exploration', 'Single-vineyard discovery', 'Best wine of your life'],
    wineIds: ['dom-perignon-2013', 'vega-sicilia-unico', 'barolo-conterno', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'grapes-weinbar-munich',
    name: 'GRAPES Weinbar',
    town: 'Munich',
    area: 'Old Town · Ledererstraße 8a',
    type: 'Wine bar',
    note: 'Central Munich wine discovery',
    vibe: 'A few streets from Marienplatz, GRAPES is the accessible Old Town wine bar that makes no compromises on the list. Over 1,300 wines from all continents — including a serious and growing natural wine section — with a team that can navigate you through them without making it feel like a lecture. The right choice for a Munich evening when you want serious wine in a relaxed atmosphere rather than a formal restaurant setting.',
    whyAmandaLovesIt: 'GRAPES is what the neighbourhood wine bar looks like when it takes the list seriously: broad enough to explore, focused enough to be readable, and knowledgeable enough that asking for a recommendation actually gets you somewhere. The central location makes it the easy Munich default for a glass before or after anything else.',
    bestFor: ['Central Munich wine stop', 'Natural and low-intervention exploration', 'Pre-dinner discovery glass'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Walk-in friendly early in the evening. Popular from 7pm onwards — arrive a little earlier for easy seating.',
    address: 'Ledererstraße 8a, 80331 München',
    phone: '+49 89 242 249 504',
    website: 'https://www.grapes-weinbar.de',
    image: 'https://www.grapes-weinbar.de/wp-content/uploads/2022/06/Grapes_1-1024x684-1.jpg',
    imageAlt: 'GRAPES Weinbar Munich official interior image',
    imageEyebrow: 'Official wine bar image',
    imageAccent: 'Old Town',
    imageNote: 'The GRAPES interior is bottle-wall and bar-counter — the natural image for a city-centre wine bar that leads with its range.',
    stylePrompts: ['Natural and low-intervention', 'Global range discovery', 'Old Town evening', 'Broad accessible list'],
    wineIds: ['benanti-etna-bianco', 'chateau-musar-2018', 'vacheron-sancerre-le-pave', 'clos-de-la-roilette-fleurie'],
  },
  // ── Arcachon & Cap Ferret ─────────────────────────────────────────────────
  {
    id: 'le-patio-arcachon',
    name: 'Le Patio',
    town: 'Arcachon',
    area: 'Boulevard de la Plage · 10 Boulevard de la Plage',
    type: 'Fine dining restaurant',
    note: '1 Michelin star · Arcachon',
    vibe: "Chef Thierry Renou's seafront Michelin-starred restaurant draws almost entirely on South-West France's finest produce — Diva de Biganos caviar from the Arcachon basin, Landes organic asparagus, Pauillac lamb, Cambes black pork, and foie gras — and applies a distinctive Asian-inflected creativity to what would otherwise be classic Gascon territory. The wine list has meaningful depth in Bordeaux whites, particularly Graves and Pessac-Léognan, which are the ideal pairing with local oysters and caviar.",
    whyAmandaLovesIt: "Le Patio is the reason to plan a proper dinner in Arcachon rather than eating at the oyster shacks every night. Renou's cooking earns its star with genuine seasonal intelligence, and the Pessac-Léognan whites that anchor the list are some of the most food-compatible white wines in France. The seafront setting and unhurried service make it feel like the right kind of special occasion rather than a formal obligation.",
    bestFor: ['Special dinner in Arcachon', 'Caviar and Pessac-Léognan pairing', 'Michelin-starred South-West cooking'],
    typicalSpend: 'Premium',
    reserveTip: 'Essential in summer — book several weeks ahead for July and August. The weekday lunch menus offer the same kitchen at a more accessible price point.',
    address: '10 Boulevard de la Plage, 33120 Arcachon',
    phone: '+33 5 56 83 02 72',
    website: 'https://www.restaurant-lepatio-arcachon.com',
    imageFallbackLabel: '1 Michelin star · Arcachon seafront',
    imageFallbackNote: "Thierry Renou's Michelin-starred kitchen on the Arcachon seafront — South-West France produce, Asian-inflected creativity, and Pessac-Léognan whites alongside the local oysters and caviar.",
    stylePrompts: ['Pessac-Léognan blanc with caviar', 'Classic Bordeaux white', 'South-West France tasting menu', 'Mineral white with local oysters'],
    wineIds: ['majestic-labeille-de-fieuzal-blanc', 'tesco-finest-chablis', 'dom-perignon-2013', 'chateau-margaux-2015'],
  },
  {
    id: 'lescale-cap-ferret',
    name: "L'Escale",
    town: 'Cap Ferret',
    area: 'Jetée Bélisaire · 2 Avenue de l\'Océan',
    type: 'Brasserie + oyster bar',
    note: 'Cap Ferret institution',
    vibe: "On the water at the Bélisaire jetty — the same pier where the little ferry crosses the bay to the Dune du Pilat. L'Escale has been here for over fifty years and is one of Cap Ferret's most enduring institutions. Oysters direct from the basin, grilled fish, shellfish platters, salads, and the kind of unhurried brasserie atmosphere that belongs to a Tuesday in July when the whole afternoon is still ahead of you. No reservations; open from eight in the morning to eleven at night.",
    whyAmandaLovesIt: "L'Escale is the first choice after the morning ferry from Arcachon. Sit with a dozen fines de claires, a cold glass of Bordeaux blanc, and watch the Dune du Pilat across the water. It is one of those settings that feels implausible — too beautiful, too simple, too good — until you have done it once and understand why people return for decades.",
    bestFor: ['Oysters after the ferry crossing', 'Long lazy lunch on the water', 'Simple fresh fish at the basin'],
    typicalSpend: 'Mid-range',
    reserveTip: 'No reservations taken — arrive early for the best terrace tables, especially in summer. The terrace directly on the jetty is the whole point.',
    address: "2 Avenue de l'Océan, Jetée Bélisaire, 33970 Lège-Cap-Ferret",
    phone: '+33 5 56 60 68 17',
    imageFallbackLabel: 'Brasserie on the jetty · Cap Ferret',
    imageFallbackNote: "At the Bélisaire ferry pier — oysters from the basin, cold Bordeaux blanc, and the view across to the Dune du Pilat. One of the great Cap Ferret addresses.",
    stylePrompts: ['Cold mineral white with oysters', 'Bordeaux blanc', 'Crisp bone-dry glass', 'Basin afternoon bottle'],
    wineIds: ['tesco-finest-chablis', 'vacheron-sancerre-le-pave', 'bollinger-special-cuvee', 'waitrose-loved-found-albarino'],
  },
  {
    id: 'chez-hortense-cap-ferret',
    name: 'Chez Hortense',
    town: 'Cap Ferret',
    area: '26 Avenue du Sémaphore',
    type: 'Seafood restaurant',
    note: 'The most celebrated name on the peninsula',
    vibe: 'Founded circa 1938 and now in its third generation, Chez Hortense is the most famous restaurant on Cap Ferret and one of the most celebrated seafood addresses in Nouvelle-Aquitaine. Oysters and mussels from the bay, fresh local fish, and French classics elevated with genuine care — the signature baked oysters with foie gras is a quintessential Cap Ferret combination. A covered terrace lush with greenery and direct bay views. Alongside the main restaurant, the more casual La Cabane d\'Hortense is perfect for a simpler lunch.',
    whyAmandaLovesIt: "Chez Hortense has the combination that only a truly old institution can offer: total confidence in what it does, a setting it has earned rather than designed, and a kitchen that knows its produce better than almost anyone else on the peninsula. The foie gras oysters are one of the great South-West France dishes. A bottle of aged Bordeaux blanc alongside them is the occasion.",
    bestFor: ['The definitive Cap Ferret seafood evening', 'Baked oysters with foie gras', 'Occasion dinner on the bay'],
    typicalSpend: 'Upper-mid to premium',
    reserveTip: 'Book well ahead in summer — it fills for both lunch and dinner throughout July and August. La Cabane d\'Hortense next door is the more casual overflow option for a simpler visit.',
    address: '26 Avenue du Sémaphore, 33970 Lège-Cap-Ferret',
    phone: '+33 5 56 60 62 56',
    website: 'https://chez-hortense.menustic.com/',
    imageFallbackLabel: 'Seafood institution · Cap Ferret',
    imageFallbackNote: "Third-generation institution since 1938 — baked oysters with foie gras, bay views, and one of Nouvelle-Aquitaine's most celebrated addresses.",
    stylePrompts: ['Bordeaux blanc with oysters', 'Classic white with foie gras', 'Mineral aperitif', 'Fine Pessac-Léognan moment'],
    wineIds: ['tesco-finest-chablis', 'majestic-labeille-de-fieuzal-blanc', 'dom-perignon-2013', 'trimbach-clos-ste-hune'],
  },
  {
    id: 'pinasse-cafe-cap-ferret',
    name: 'Pinasse Café',
    town: 'Cap Ferret',
    area: '2bis Avenue de l\'Océan',
    type: 'Bistronomic seafood restaurant',
    note: 'Gault & Millau · finest view on the peninsula',
    vibe: "One of Cap Ferret's most stylish restaurants, with a terrace directly facing the Dune du Pilat across the Arcachon basin — widely considered the finest view on the peninsula. Chef Juberti Maroni cooks bistronomic cuisine built around South-West produce, fresh shellfish, and market fish, backed by a wine cellar with real Bordeaux depth and intelligent selections from elsewhere in France. The terrace draws the Parisian second-home crowd each summer, but the kitchen's consistency makes it more than a view restaurant.",
    whyAmandaLovesIt: "The view across to the Dune du Pilat is so extraordinary that it could excuse a mediocre kitchen — but Pinasse Café does not need that excuse. The bistronomic cooking is confident, the Bordeaux list is well-chosen, and the terrace experience at golden hour is one of the best moments the whole basin area offers. Gault & Millau endorsement confirms the kitchen's ambition.",
    bestFor: ['Golden-hour terrace dining', 'Bordeaux white with fresh seafood', 'The best view in Cap Ferret'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book for July and August — the terrace fills quickly at both lunch and dinner. Ask for the terrace when booking; the interior view does not compare.',
    address: "2bis Avenue de l'Océan, 33970 Lège-Cap-Ferret",
    phone: '+33 5 56 03 77 87',
    website: 'https://www.pinasse-cafe.com/',
    image: 'https://www.pinasse-cafe.com/wp-content/uploads/2024/04/vue-bassin-arcachon-pinasse-cafe-cuisine.jpg',
    imageAlt: 'Pinasse Café official terrace and Dune du Pilat view',
    imageEyebrow: 'Official terrace image',
    imageAccent: 'Cap Ferret',
    imageNote: 'The terrace with the Dune du Pilat in the background is the whole argument for visiting Pinasse Café — the image must lead with that view.',
    stylePrompts: ['Bordeaux blanc with shellfish', 'Crisp mineral white', 'Aromatic rosé terrace', 'South-West France wine evening'],
    wineIds: ['dom-perignon-2013', 'vacheron-sancerre-le-pave', 'majestic-labeille-de-fieuzal-blanc', 'tesco-finest-chablis'],
  },
  {
    id: 'la-plancha-arcachon',
    name: 'La Plancha du Bassin',
    amandaFavourite: true,
    town: 'Arcachon',
    area: 'Central beachfront · Boulevard Veyrier-Montagnères',
    type: 'Seafood restaurant + plancha grill',
    note: 'Beachfront dining · year-round',
    vibe: "La Plancha sits directly on Arcachon's main beach with a terrace looking across to Bird Island and the tchanquées cabins. Chef Anthony Furne leads a kitchen built around plancha-cooked fish, whole grilled bass, fresh moules, and seafood platters — classic Bassin cooking at competitive prices. One of the few Arcachon restaurants that stays open through winter, making it the honest year-round option on the beachfront.",
    whyAmandaLovesIt: "The panoramic basin view at sunset justifies the trip on its own. The cooking is honest and location-led — plancha grills, fresh oysters from the Bassin, whole fish — and it does not dress itself up with pretension that would feel wrong this close to the water. La Plancha is the Arcachon choice when the view and the seafood are the whole point.",
    bestFor: ['Beachfront dinner with basin views', 'Plancha-grilled fish at sunset', 'Year-round Arcachon option'],
    typicalSpend: 'Mid-range (€35–€55 per head)',
    reserveTip: 'Open 7 days, year-round — one of the few Arcachon restaurants that does not close in winter. Walk-in terrace possible outside peak summer.',
    address: '20 Boulevard Veyrier-Montagnères, 33120 Arcachon',
    website: 'https://laplanchadubassin.fr',
    imageFallbackLabel: 'Arcachon beachfront terrace',
    imageFallbackNote: "Arcachon's central beach restaurant — plancha-grilled fish and fresh oysters with a panoramic view of the Bassin and Bird Island.",
    stylePrompts: ['Muscadet with shellfish', 'Entre-Deux-Mers', 'Crisp Bordeaux blanc', 'Dry local rosé'],
    wineIds: ['domaine-pepiere-muscadet-sur-lie', 'tesco-finest-chablis', 'vacheron-sancerre-le-pave'],
  },
  {
    id: 'maison-du-bassin-cap-ferret',
    name: 'La Maison du Bassin',
    amandaFavourite: true,
    town: 'Cap Ferret',
    area: 'La Vigne district · near the lighthouse',
    type: 'Boutique hotel + bistro restaurant + cocktail bar',
    note: 'Maître Restaurateur · hidden behind greenery',
    vibe: "A lovingly restored forest house near the Cap Ferret lighthouse, converted into a boutique hotel with a Maître Restaurateur bistro — Le Bistrot du Bassin — and a bar pouring aged rums and Armagnacs alongside a thoughtful Bordeaux-led wine list. Chef Franck Le Bourlay's menu runs to fresh oysters from the Bassin, seasonal market fish, and beautifully executed dishes served on a vine-covered terrace or inside a raffia-and-driftwood interior that feels like the real Cap Ferret rather than the popular one.",
    whyAmandaLovesIt: "La Maison du Bassin is the discovery version of Cap Ferret. Hidden behind greenery near the lighthouse, the eclectic bar and a kitchen with a Maître Restaurateur designation — not casually given — make this the place to anchor a slow evening away from the terrace crowds. The Armagnac bar is one of the best finishing moves in the whole Bassin area.",
    bestFor: ['Cap Ferret hidden dining', 'Post-lighthouse terrace dinner', 'Bordeaux white with fresh oysters'],
    typicalSpend: 'Mid to premium (€45–€70 per head)',
    reserveTip: 'Request the vine-covered terrace in summer when booking. The bar is walk-in and worth arriving early for.',
    address: '5 Rue des Pionniers, 33950 Lège-Cap-Ferret',
    website: 'https://www.lamaisondubassincapferret.com',
    image: 'https://premium.monsamm.com/gallery/673b0ab214b5b2.56730285-lg.webp',
    imageAlt: 'La Maison du Bassin official venue image',
    imageEyebrow: 'Official hotel image',
    imageAccent: 'Cap Ferret lighthouse district',
    imageNote: 'La Maison du Bassin — a restored forest house near the Cap Ferret lighthouse, with a vine-covered terrace that perfectly captures the hidden-discovery feel of this corner of the peninsula.',
    imageFallbackLabel: 'Boutique hotel restaurant · Cap Ferret lighthouse',
    imageFallbackNote: "A vine-covered boutique hotel restaurant near the Cap Ferret lighthouse — Maître Restaurateur kitchen, Bassin seafood, aged Armagnac bar.",
    stylePrompts: ['White Bordeaux with oysters', 'Entre-Deux-Mers', 'Crisp mineral white', 'Aged Armagnac finish'],
    wineIds: ['domaine-pepiere-muscadet-sur-lie', 'majestic-labeille-de-fieuzal-blanc', 'vacheron-sancerre-le-pave'],
  },
  {
    id: 'sail-fish-cap-ferret',
    name: 'Le Sail Fish',
    town: 'Cap Ferret',
    area: 'Rue des Bernaches · Cap Ferret village',
    type: 'Restaurant + bar + evening venue',
    note: 'Cap Ferret institution since 1984',
    vibe: "A family-run Cap Ferret institution since 1984 that has been a fixture for wood-fired grilled meats, travel-influenced cuisine, and long evening sessions that progress from dinner into something much livelier. The 2022 refit gave it an English-garden-meets-Moroccan-riad interior that makes it one of the most visually interesting rooms on the peninsula — exposed timbers, layered textiles, warm lighting that shifts the atmosphere completely as the evening advances.",
    whyAmandaLovesIt: "Le Sail Fish is the right call when the evening wants momentum. The wood-fire grill gives the food genuine character, the room is beautiful since the 2022 redesign, and the transition from restaurant to bar is seamless — it's one of the few Cap Ferret venues where staying late feels like the point rather than an afterthought. The design is extraordinary for a place that has been doing this since 1984.",
    bestFor: ['Evening with energy and momentum', 'Wood-fire grill and natural wine', 'Cap Ferret nightlife with substance'],
    typicalSpend: 'Mid-range (€35–€55 per head)',
    reserveTip: 'Opens at 8pm — book for dinner, plan to stay for the bar. Peak summer open daily; book well ahead for July and August.',
    address: 'Rue des Bernaches, 33970 Lège-Cap-Ferret',
    website: 'http://www.ferretfamily.fr/en/sail-fish/',
    imageFallbackLabel: 'Cap Ferret evening restaurant + bar',
    imageFallbackNote: "A Cap Ferret institution since 1984 with a stunning 2022 interior redesign — wood-fire grill, travel cuisine, and the peninsula's best late evening.",
    stylePrompts: ['Natural wine with wood-fire', 'South-West France red', 'Gascony white', 'Bassin rosé evening'],
    wineIds: ['tesco-finest-chablis', 'baron-de-ley-rioja-reserva', 'bollinger-special-cuvee'],
  },
  // ── Malaga ────────────────────────────────────────────────────────────────
  {
    id: 'los-patios-de-beatas-malaga',
    name: 'Los Patios de Beatas',
    town: 'Málaga',
    area: 'Historic centre · Calle Beatas, 43',
    type: 'Vinoteca + restaurant',
    note: 'Málaga finest wine list',
    vibe: "Two restored 18th-century Andalusian houses connected by their original interior courtyards, with stained-glass natural light and a wine cellar that has been seriously built over years. The list runs to Vega Sicilia, Clos Mogador, and hundreds of premium Spanish and international references, with an excellent by-the-glass programme that makes genuine exploration possible at any budget. Star Wine List featured. The place in Málaga when you want a serious wine evening that matches what you find in Madrid or Barcelona.",
    whyAmandaLovesIt: "Los Patios de Beatas is the Málaga venue that rewards the effort of finding Calle Beatas. The setting — restored patio architecture, original stonework, stained glass — is genuinely beautiful, and the wine list has the depth to make it a destination in its own right rather than merely the best option available in a city with limited competition. Vega Sicilia and Priorat alongside thoughtful regional selections: this is a list built by someone who actually loves wine.",
    bestFor: ['The definitive Málaga wine evening', 'Premium Spanish cellar exploration', 'Andalusian occasion dinner'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for evenings. The by-the-glass list is strong enough to make it worth going for exploration rather than committing to a single bottle immediately.',
    address: 'Calle Beatas, 43, 29008 Málaga',
    phone: '+34 952 210 350',
    website: 'https://www.lospatiosdebeatas.com',
    image: 'https://lospatiosdebeatas.com/wp-content/uploads/2025/07/08-2.webp',
    imageAlt: 'Los Patios de Beatas official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Historic centre',
    imageNote: 'The restored patio courtyard and stained-glass light are the defining visual of Los Patios de Beatas — this is the image that communicates why the setting matters.',
    stylePrompts: ['Vega Sicilia and Priorat', 'Premium Spanish cellar', 'Andalusian occasion bottle', 'Wide Spanish discovery list'],
    wineIds: ['vega-sicilia-unico', 'waitrose-contino-vina-del-olivo', 'baron-de-ley-rioja-reserva', 'waitrose-muga-rioja-reserva'],
  },
  {
    id: 'antigua-casa-de-guardia-malaga',
    name: 'Antigua Casa de Guardia',
    town: 'Málaga',
    area: 'Alameda Principal · 18, Alameda Principal',
    type: 'Historic wine bodega',
    note: 'Open since 1840',
    vibe: "The oldest continuously operating wine bodega in Málaga, open since 1840. Dark oak barrels lining the walls, staff in white coats serving direct from the cask, chalk tallies on the wood for each drink ordered. The speciality is Málaga's own sweet wine tradition — Moscatel, Pedro Ximénez, Málaga Dulce, Pajarete — made from sun-dried grapes in a style that has been produced in this province for over two thousand years. This is not a restaurant or a wine bar in the modern sense; it is a standing cultural landmark.",
    whyAmandaLovesIt: "Antigua Casa de Guardia is irreplaceable in a way that no newer venue can compete with. The chalked tabs on the barrel, the white coats, the century-and-a-half of uninterrupted service — it gives you something that money and design cannot manufacture. A glass of cold Málaga Dulce standing at a barrel is one of the most honest and genuine moments any wine city in the world offers.",
    bestFor: ['Málaga sweet wine from the barrel', 'Historic bodega atmosphere', 'Essential cultural stop in the city'],
    typicalSpend: 'Lean — this is a standing bar, priced accordingly',
    reserveTip: 'No reservations, no seats. Walk in, stand at the bar or a barrel, and let the staff pour from the cask. Go for the Moscatel or the Málaga Dulce rather than anything that would be easier to find elsewhere.',
    address: 'Alameda Principal, 18, 29001 Málaga',
    phone: '+34 952 214 680',
    image: 'https://antiguacasadeguardia.com/wp-content/uploads/2024/12/background-barriles-1024x680.webp',
    imageAlt: 'Antigua Casa de Guardia interior with barrels',
    imageEyebrow: 'Bodega interior image',
    imageAccent: 'Alameda Principal',
    imageNote: 'The barrels and white-coated staff are the whole story — there is nothing to substitute for a genuine interior of the bodega itself.',
    stylePrompts: ['Málaga Dulce from the cask', 'Moscatel and Pedro Ximénez', 'Andalusian sweet wine tradition', 'Historic wine culture'],
    wineIds: ['waitrose-no1-lbv-port', 'chateau-yquem-2015', 'baron-de-ley-rioja-reserva', 'waitrose-cune-rioja'],
  },
  // ── Valencia (additional) ─────────────────────────────────────────────────
  {
    id: 'ricard-camarena-valencia',
    name: 'Ricard Camarena',
    town: 'Valencia',
    area: 'Benicalap · Av. de Burjassot, 54',
    type: 'Fine dining restaurant',
    note: '2 Michelin stars · Green star · Valencia',
    vibe: "The flagship Valencia destination alongside El Poblet. Set inside the stunning refurbished Bombas Gens arts factory — a former hydraulic pump factory from the 1930s now transformed into an arts and gastronomy complex — Camarena's kitchen is driven by hyper-local, vegetable-forward cooking of exceptional precision. Three Repsol Suns. A Michelin Green Star for sustainability alongside two cooking stars. Wine pairing is an integral part of the experience, with a programme that takes Spanish regional depth seriously alongside classic European references.",
    whyAmandaLovesIt: "Ricard Camarena makes the case that the best cooking in Valencia is not happening in the old town restaurants that tourists find most easily. The Bombas Gens setting is genuinely extraordinary, the vegetable-forward cooking has an intellectual coherence that earns the Michelin recognition honestly, and the wine programme is built to match rather than to impress. The Green Star commitment to local sourcing and sustainability gives the whole evening a consistency of purpose that is rare.",
    bestFor: ['The serious Valencia fine-dining evening', 'Vegetable-forward tasting menu', 'Wine pairing in an exceptional setting'],
    typicalSpend: 'Premium',
    reserveTip: 'Book as far ahead as possible — the recognition is international and the dining room fills accordingly. Closed Sunday and Monday. Allow the full tasting menu with the wine pairing.',
    address: 'Av. de Burjassot, 54, 46009 Valencia',
    phone: '+34 963 35 54 18',
    website: 'https://ricardcamarena.com/en/',
    image: 'https://ricardcamarena.com/wp-content/uploads/2024/03/ricard-camarena-landing.webp',
    imageAlt: 'Ricard Camarena official dining room at Bombas Gens',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Bombas Gens',
    imageNote: 'The Bombas Gens industrial-heritage dining room is one of the most visually distinctive spaces in Spanish fine dining — the image should lead with that architectural drama.',
    stylePrompts: ['Grand cru white pairing', 'Spanish regional depth', 'Vegetable-forward wine matching', 'Modern Valencia fine dining'],
    wineIds: ['dom-perignon-2013', 'trimbach-clos-ste-hune', 'barolo-conterno', 'waitrose-contino-vina-del-olivo'],
  },
  // ── Singapore ─────────────────────────────────────────────────────────────
  {
    id: 'long-bar-raffles-singapore',
    name: 'The Long Bar at Raffles',
    amandaFavourite: true,
    town: 'Singapore',
    area: 'Colonial District · 328 North Bridge Road',
    type: 'Historic cocktail bar',
    note: 'Birthplace of the Singapore Sling',
    vibe: "The bar where bartender Ngiam Tong Boon invented the Singapore Sling in 1915. A National Monument, restored to its full colonial splendour in 2019 — rattan, tropical motifs, two-storey bar, and the singular house tradition of discarding peanut shells directly onto the floor. The Singapore Sling here is not a tourist shortcut: gin, pineapple, lime, curaçao, Bénédictine, grenadine, and cherry liqueur, made to the original recipe. This is cocktail history in a room that has earned every square foot of its reputation.",
    whyAmandaLovesIt: "The Long Bar is the non-negotiable Singapore stop — not because the Singapore Sling is the only thing worth drinking, but because the room itself is irreplaceable. Raffles was the social heart of colonial Singapore, the Long Bar was where it happened, and the 2019 restoration has given it back the atmospheric weight it deserves. Go early in the visit, drink the Sling at least once, and order from the cocktail list after that.",
    bestFor: ['The original Singapore Sling', 'Colonial atmosphere that cannot be replicated', 'First-night Singapore occasion'],
    typicalSpend: 'Premium for cocktails (SGD 37–45 per Sling)',
    reserveTip: 'Walk-in, but arrive early in the evening for the best atmosphere before the volume peaks. For a wine-focused Singapore evening, combine with Butcher\'s Block or temper. elsewhere in the city.',
    address: '#02-01 Raffles Arcade, 328 North Bridge Road, Singapore 188719',
    website: 'https://www.rafflessingapore.com/restaurant/long-bar/',
    image: 'https://m.ahstatic.com/is/image/accorhotels/aja_p_5195-92?qlt=82&wid=1200',
    imageAlt: 'The Long Bar at Raffles Singapore official interior image',
    imageEyebrow: 'Official bar image',
    imageAccent: 'Raffles Hotel',
    imageNote: 'The Long Bar interior — rattan, colonial tropical motifs, the famous two-storey layout — is the defining image of a Singapore institution.',
    stylePrompts: ['Classic Singapore Sling', 'Champagne occasion', 'Colonial cocktail theatre', 'Historic first-night stop'],
    wineIds: ['bollinger-special-cuvee', 'dom-perignon-2013', 'pol-roger-brut-reserve-nv', 'laurent-perrier-la-cuvee-nv'],
  },
  {
    id: 'ce-la-vi-marina-bay-sands',
    name: 'CÉ LA VI',
    town: 'Singapore',
    area: 'Marina Bay · Level 57, Marina Bay Sands Tower 3',
    type: 'Rooftop restaurant + SkyBar',
    note: 'Singapore\'s defining rooftop dining',
    vibe: "The entire 57th floor of the iconic Marina Bay Sands hotel tower — one of the most recognisable rooftop spaces in the world. Contemporary Asian cuisine (wagyu, truffle sushi, premium shellfish) alongside a wine list described by the restaurant as one of the largest selections of wine, Champagne, and saké in Singapore. The SkyBar adjoins the restaurant with unobstructed open-air views of the city and Marina Bay. The day-to-night transformation is one of the great Singapore dining experiences.",
    whyAmandaLovesIt: "Fifty-seven floors above Singapore, the skyline laid out below you, a glass of Champagne in hand — CÉ LA VI delivers the scene that the city promises. The wine programme is serious enough to justify the setting, and the Asian-inflected kitchen means the food works with the same range of bottles you would choose for an upscale Tokyo restaurant. The SkyBar is one of the few rooftop bars in the world where the view actually delivers on the photographs.",
    bestFor: ['The Singapore skyline occasion dinner', 'Champagne at altitude', 'Rooftop cocktail evening with serious food'],
    typicalSpend: 'Premium',
    reserveTip: 'Book the restaurant well ahead. The SkyBar has a cover charge on weekend evenings. Request a window seat when booking the restaurant.',
    address: 'Level 57, Hotel Tower 3, 1 Bayfront Avenue, Singapore 018971',
    phone: '+65 6508 2188',
    website: 'https://www.celavi.com/en/singapore/',
    image: 'https://cdn.prod.website-files.com/69895520b5015c9e81c9e590/698af1e82ca37a1bbd499096_CLVSG_venue_skybar.avif',
    imageAlt: 'CÉ LA VI Singapore official rooftop bar image',
    imageEyebrow: 'Official rooftop image',
    imageAccent: 'Marina Bay Sands',
    imageNote: 'The Singapore skyline at 57 floors is the single most important visual element of CÉ LA VI — no interior shot competes with this.',
    stylePrompts: ['Champagne at altitude', 'Grand Asian pairing', 'Wagyu and Burgundy', 'Skyline occasion bottle'],
    wineIds: ['dom-perignon-2013', 'bollinger-special-cuvee', 'trimbach-clos-ste-hune', 'vacheron-sancerre-le-pave'],
  },
  {
    id: 'gordon-grill-goodwood-park',
    name: 'Gordon Grill',
    amandaFavourite: true,
    town: 'Singapore',
    area: 'Orchard · 22 Scotts Road',
    type: 'Classic grill restaurant',
    note: 'Open since 1963 · Goodwood Park Hotel',
    vibe: "Inside the Goodwood Park Hotel — a National Monument built in 1900 as the Teutonia Club, the oldest heritage hotel in Singapore still in continuous operation. Gordon Grill has occupied this extraordinary building since 1963, making it one of the longest-running restaurant institutions in Asia. The signature feature is the tableside carving trolley: prime aged beef cuts carved at your table in the classic European grill tradition. Michelin Guide listed. The heritage rooms, original mosaic floors, and colonial architecture give the room a weight that no newer Orchard Road venue can replicate.",
    whyAmandaLovesIt: "Not many restaurants on any continent have been doing this continuously since 1963 inside a National Monument. The tableside trolley, the prime cuts, the formal service — Gordon Grill is a Singapore institution that has nothing left to prove and still delivers. The cellar holds the kind of Bordeaux that suits a room like this. A bottle of aged Claret with the carved beef in a colonial dining room that has been here since before Singapore's independence is the kind of evening that cannot be designed from scratch.",
    bestFor: ['Tableside carving trolley occasion', 'Classic Bordeaux with prime aged beef', 'Singapore heritage dining evening'],
    typicalSpend: 'Premium',
    reserveTip: 'Book ahead for dinner — the heritage dining room fills for special occasions. Ask to be seated in the main room for the full architectural context. A mature Bordeaux from the cellar is the pairing to aim for.',
    address: '22 Scotts Road, Singapore 228221',
    phone: '+65 6730 1744',
    website: 'https://www.goodwoodparkhotel.com/dine/gordon-grill/',
    image: 'https://image-tc.galaxy.tf/wijpeg-5okcq61ne4tq91cvt2c3v5o2c/gordon-grill-1920x720.jpg?width=1920',
    imageAlt: 'Gordon Grill official dining room at Goodwood Park Hotel',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Goodwood Park Hotel',
    imageNote: 'The colonial dining room at Goodwood Park — heritage architecture, formal table settings, sixty years of unbroken service — is the whole story of Gordon Grill.',
    stylePrompts: ['Classic Bordeaux with aged beef', 'Tableside carving occasion', 'Heritage Singapore fine dining', 'Formal red with prime cuts'],
    wineIds: ['chateau-margaux-2015', 'barolo-conterno', 'vega-sicilia-unico', 'dom-perignon-2013'],
  },
  {
    id: 'temper-singapore',
    name: 'temper. Wine Room',
    town: 'Singapore',
    area: 'Tanjong Pagar · 83 Neil Road',
    type: 'Wine room + restaurant',
    note: 'Roberto Durán MS · 250 wines by the glass',
    vibe: "Opened 2025 inside the Mondrian Singapore Duxton. Led by Roberto Durán MS — Spain's first Master Sommelier, formerly of 67 Pall Mall Singapore. A 2,100-bottle cellar from thirty-plus countries with 250 wines accessible by the glass, built around terroir-specific and low-intervention selections with markups kept deliberately responsible. Bauhaus-inspired design in Tanjong Pagar. The most pedigreed new wine destination Singapore has seen in years.",
    whyAmandaLovesIt: "250 wines by the glass under the guidance of a Master Sommelier who has thought seriously about markup structure — this is the Singapore wine bar that serious wine people have been waiting for. The terroir-specific focus and low-intervention philosophy give the list an editorial coherence that purely commercial by-the-glass programmes lack. If you only have one evening for wine in Singapore, temper. is now the choice.",
    bestFor: ['The most serious by-the-glass exploration in Singapore', 'Terroir-specific and natural wine discovery', 'Sommelier-guided wine evening'],
    typicalSpend: 'Mid to premium — the 250-wine by-the-glass range covers all price points',
    reserveTip: 'Book ahead for evenings — Duxton Hill fills and temper. attracts both expat and visiting wine crowds. Ask Durán MS what he is most excited about on the list.',
    address: '83 Neil Road, #01-07, Mondrian Singapore Duxton, Singapore 089813',
    website: 'https://www.temper.sg',
    imageFallbackLabel: 'Wine room · Duxton Hill',
    imageFallbackNote: "Bauhaus-inspired design inside Mondrian Singapore, 250 wines by the glass under Roberto Durán MS — the most ambitious new wine destination in Singapore.",
    stylePrompts: ['Terroir-specific by the glass', 'Natural and low-intervention depth', 'Master Sommelier programme', 'Global discovery at every price'],
    wineIds: ['benanti-etna-bianco', 'chateau-musar-2018', 'vacheron-sancerre-le-pave', 'clos-de-la-roilette-fleurie'],
  },
  // ── Poole & Weymouth ──────────────────────────────────────────────────────
  {
    id: 'rick-stein-sandbanks',
    name: 'Rick Stein Sandbanks',
    town: 'Poole',
    area: 'Sandbanks · 10–14 Banks Road',
    type: 'Seafood restaurant',
    note: 'Dorset coastal anchor',
    vibe: "Rick and Charlie Stein's Dorset outpost on the Sandbanks peninsula with views across Poole Bay. The menu follows the same seafood-forward philosophy as the Padstow mothership — oysters, shellfish platters, fish from day boats — with a wine list curated to match. Consistently one of the most-booked restaurants in Dorset and a reliable standard-setter for the region. The setting across to Studland and Poole Harbour is one of the finest dining views on the south coast.",
    whyAmandaLovesIt: "Sandbanks is where the Dorset visit properly begins. Rick Stein's approach to seafood has always been about getting out of the way of the produce, and the wine list follows the same philosophy: clean, mineral whites and well-chosen rosés that serve the food rather than competing with it. The view, the room, and the standard are all consistent.",
    bestFor: ['Dorset seafood lunch or dinner', 'Poole Bay views', 'Reliable coastal bottle with mineral white'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead, especially for weekend lunch and summer evenings. Ask for a window seat when booking.',
    address: '10–14 Banks Road, Sandbanks, Poole BH13 7QB',
    phone: '01202 076 443',
    website: 'https://www.rickstein.com/restaurants/rick-stein-sandbanks/',
    imageFallbackLabel: 'Harbour view dining · Sandbanks',
    imageFallbackNote: "Glass-walled dining room over Poole Harbour — one of the finest seafood settings on the south coast, with Studland and Poole Bay through every window.",
    stylePrompts: ['Mineral white with seafood', 'Chablis and shellfish', 'Coastal rosé', 'Champagne with oysters'],
    wineIds: ['tesco-finest-chablis', 'vacheron-sancerre-le-pave', 'bollinger-special-cuvee', 'waitrose-la-vieille-ferme-rose'],
  },
  {
    id: 'catch-old-fish-market-weymouth',
    name: 'Catch at the Old Fish Market',
    town: 'Weymouth',
    area: 'Custom House Quay · 1 Custom House Quay',
    type: 'Fine dining seafood restaurant',
    note: 'Michelin Guide · Weymouth',
    vibe: "A Grade II-listed Portland stone fish market from the 18th century converted into one of Dorset's most serious fine dining rooms. Dinner only (£95 per person), Tuesday to Saturday. Fish sourced directly from Weymouth's day fishing boats through Weyfish — the menu changes with whatever was landed that morning. Michelin Guide listed. The most ambitious kitchen in the area and one that rewards careful wine matching over an evening.",
    whyAmandaLovesIt: "Catch earns the Michelin Guide listing with a kitchen that takes its commitment to day-boat sourcing seriously rather than treating it as marketing copy. The Portland stone setting is extraordinary, the fixed-price dinner format gives you a proper progression to work through with a bottle, and Weymouth's fishing boats mean the seafood quality is as direct as it gets in England.",
    bestFor: ['Special-occasion dinner with serious wine', 'Day-boat fish at its most direct', 'Weymouth destination evening'],
    typicalSpend: 'Premium (£95 fixed price)',
    reserveTip: 'Essential — book ahead. Dinner only, Tuesday to Saturday. The fixed format means one well-chosen bottle will do the whole evening rather than a by-the-glass approach.',
    address: '1 Custom House Quay, Weymouth DT4 8BE',
    phone: '01305 590 555',
    website: 'https://www.catchattheoldfishmarket.com',
    image: 'https://www.catchattheoldfishmarket.com/upl_images/home2.png',
    imageAlt: 'Catch at the Old Fish Market official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Custom House Quay',
    imageNote: 'The Portland stone interior is architecturally distinctive and must be the card image — it communicates why this is a destination restaurant rather than a seafood restaurant that happens to be in Weymouth.',
    stylePrompts: ['Grand white with day-boat fish', 'Chablis precision', 'Champagne with the first course', 'Mineral and exact'],
    wineIds: ['tesco-finest-chablis', 'dom-perignon-2013', 'trimbach-clos-ste-hune', 'vacheron-sancerre-le-pave'],
  },
  {
    id: 'crab-house-cafe-weymouth',
    name: 'Crab House Café',
    town: 'Weymouth',
    area: 'Chesil Beach · Portland Road',
    type: 'Seafood café + oyster bar',
    note: 'Own Portland oyster beds',
    vibe: "The Weymouth institution. Its own Portland oyster beds sit a few metres from the kitchen, and the café overlooks the Fleet lagoon with Chesil Beach stretching to the horizon. Good Food Guide and Hardens consistently endorsed. The format is casual — wooden tables, chalk boards, the direct simplicity of a kitchen that has its hands in the water — but the quality of the seafood is serious. A cold glass of Chablis with Portland oysters at a table facing the Fleet is one of the best reasons to be in Dorset.",
    whyAmandaLovesIt: "The Crab House gives you what no Michelin-starred room can replicate: oysters pulled from beds you can see from your table, served without ceremony at a wooden table with a cold glass of something mineral and sharp. It is the Weymouth counterpoint to Catch's formality — the place where the whole argument for eating by the sea makes the most immediate sense.",
    bestFor: ['Portland oysters from the own beds', 'Chesil Beach views', 'Casual oyster-and-cold-white moment'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Book ahead in summer — the Fleet-facing tables are the reason to come. Good Food Guide-endorsed and popular year-round with locals and visitors alike.',
    address: 'Ferrymans Way, Portland Road, Weymouth DT4 9YU',
    phone: '01305 788 867',
    website: 'https://www.crabhousecafe.co.uk',
    image: 'https://www.crabhousecafe.co.uk/wp-content/uploads/2023/11/CrabHouse02-08-22MattAustin-87.jpg',
    imageAlt: 'Crab House Café official view of the Fleet lagoon',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Chesil Beach',
    imageNote: 'The Fleet lagoon view from the café tables is the whole experience — no interior shot communicates why the Crab House is the Weymouth choice as clearly as this does.',
    stylePrompts: ['Cold Chablis with Portland oysters', 'Mineral bone-dry white', 'Provence rosé by the water', 'Champagne with fresh shellfish'],
    wineIds: ['tesco-finest-chablis', 'waitrose-loved-found-albarino', 'bollinger-special-cuvee', 'waitrose-la-vieille-ferme-rose'],
  },
  // ── London (additional) ───────────────────────────────────────────────────
  {
    id: 'noble-rot-lambs-conduit',
    name: 'Noble Rot',
    town: 'London',
    area: 'Bloomsbury · 51 Lamb\'s Conduit Street',
    type: 'Wine bar + restaurant',
    note: 'Wine List of the Year 2016–2018 · Michelin listed',
    vibe: "The wine bar and restaurant that the Noble Rot magazine built. Dark wood, candlelight, knowledge without pretension, and a list that earns Wine List of the Year (National Restaurant Awards, three consecutive years) by choosing bottles that are genuinely interesting rather than merely correct. Over thirty wines by the glass from a range that covers hard-to-find gems and well-loved classics in equal measure. The Bloomsbury address is quieter than Soho but gives it a neighbourhood identity the Soho location cannot replicate.",
    whyAmandaLovesIt: "Noble Rot is the London wine bar that actually earns the trust it asks for. The by-the-glass range is honest and well-priced, the team knows what they are doing without making you feel tested, and the connection to the magazine means the list is editorially coherent rather than commercially assembled. The kitchen matches the ambition of the room. For a London wine evening that is not about spectacle, this is the first recommendation.",
    bestFor: ['The London wine-bar evening above all others', 'By-the-glass discovery at honest prices', 'Knowledgeable but unpretentious service'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead, particularly for weekend evenings. The Soho location (Rupert Street) is a more accessible walk-in alternative if Bloomsbury is full.',
    address: "51 Lamb's Conduit Street, Bloomsbury, London WC1N 3NB",
    phone: '020 7242 8963',
    website: 'https://www.noblerot.co.uk/restaurants/london/',
    image: 'https://noblerot.co.uk/images/lambsConduit/nr_lambsConduit_hero.webp',
    imageAlt: 'Noble Rot Lamb\'s Conduit Street official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Bloomsbury',
    imageNote: 'The candlelit dark-wood room is Noble Rot\'s identity — warm, serious, and completely unpretentious. The interior image must communicate that tone rather than the magazine branding.',
    stylePrompts: ['By-the-glass discovery', 'Editorial wine list', 'Classic French cooking pairing', 'Honest and well-priced'],
    wineIds: ['vacheron-sancerre-le-pave', 'trimbach-clos-ste-hune', 'clos-de-la-roilette-fleurie', 'barolo-conterno'],
  },
  {
    id: '107-wine-hackney',
    name: '107 Wine',
    town: 'London',
    area: 'Lower Clapton · 107 Lower Clapton Road',
    type: 'Wine shop + bar',
    note: 'East London natural wine institution',
    vibe: "The east London wine bar that survives because it is genuinely good rather than merely fashionable. Formerly P. Franco, now crowdfunded and reopened as 107 Wine with the same bones: a natural wine shop where you drink at the counter, rotating guest chefs from Thursday to Sunday, a list that prioritises honest producers over brand recognition. Every major London wine guide has recommended it; the neighbourhood regulars are the more reliable endorsement.",
    whyAmandaLovesIt: "107 Wine is what the neighbourhood wine bar looks like when it is done with real conviction rather than commercial instinct. The natural wine focus is genuine rather than performative, the rotating chefs keep the food from becoming predictable, and Lower Clapton gives the whole thing a lack of self-consciousness that Soho and Mayfair natural wine bars struggle to maintain. The east London wine evening of choice.",
    bestFor: ['Natural wine exploration with food', 'East London neighbourhood evening', 'Counter-bar informal discovery'],
    typicalSpend: 'Mid-range',
    reserveTip: 'Walk-in friendly earlier in the week. Book for Thursday to Sunday when the guest chefs are cooking.',
    address: '107 Lower Clapton Road, London E5 0NP',
    website: 'https://www.107wine.co.uk',
    image: 'https://images.squarespace-cdn.com/content/v1/65c11ad03325a97c9627bbc3/d6c35838-0972-42b2-a03f-548676d4de1e/107_19NOV-90.jpg',
    imageAlt: '107 Wine official interior image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Lower Clapton',
    imageNote: 'The shop-bar counter is the correct image here — a retail wall behind a drinking counter communicates the 107 format more directly than any conventional restaurant shot would.',
    stylePrompts: ['Natural and low-intervention', 'East London discovery', 'Producer-focused by the glass', 'Informal wine bar pairing'],
    wineIds: ['benanti-etna-bianco', 'chateau-musar-2018', 'clos-de-la-roilette-fleurie', 'vacheron-sancerre-le-pave'],
  },
  // ── Miami ─────────────────────────────────────────────────────────────────
  {
    id: 'magie-miami',
    name: 'Magie',
    town: 'Miami',
    area: 'Little River · 8281 NE 2nd Avenue',
    type: 'Natural wine bar',
    note: 'Miami New Times Best Wine Bar 2025',
    vibe: "Opened 2024 by Caroline Strauss — sixty-plus openings globally, formerly Macchialina and the Broken Shaker — with beverage director Jacqueline Pirolo. Natural and low-intervention wines from Spain, Portugal, and wider Europe. Counter service, no cover charge, no reservations. The complete antithesis of Miami's usual flashy wine scene: a neighbourhood bar in Little River that has earned Best Wine Bar 2025 (Miami New Times) by being genuinely good rather than spectacularly designed.",
    whyAmandaLovesIt: "Magie is the Miami wine bar for people who find the flashier South Beach and Brickell options exhausting. The Spanish and Portuguese natural wine focus is specific enough to feel intentional, the no-reservations counter format keeps it honest, and the Little River location means it attracts people who actually come for the wine rather than the scene. A second Coconut Grove location opened 2025.",
    bestFor: ['Natural wine discovery in an anti-Miami-hype setting', 'Spanish and Portuguese low-intervention exploration', 'Counter bar evening without the cover charge'],
    typicalSpend: 'Mid-range',
    reserveTip: 'No reservations — walk in. Arrive early evening for a comfortable counter seat. The Coconut Grove location is the alternative if Little River is out of your way.',
    address: '8281 NE 2nd Avenue, Little River, Miami FL 33138',
    website: 'https://www.magiemiami.com',
    image: 'https://images.squarespace-cdn.com/content/v1/669d84ac577f4441eb624e45/cb542181-ce05-44f6-925b-53665bc320a4/Room+Noir.png',
    imageAlt: 'Magie Miami official bar interior image',
    imageEyebrow: 'Official wine bar image',
    imageAccent: 'Little River',
    imageNote: 'The counter-bar interior is the identity of Magie — it should feel warm, informal, and bottle-forward rather than designed.',
    stylePrompts: ['Spanish and Portuguese natural', 'Low-intervention counter discovery', 'Skin-contact and minimal-sulphite', 'Neighbourhood wine bar evening'],
    wineIds: ['waitrose-contino-vina-del-olivo', 'waitrose-loved-found-albarino', 'benanti-etna-bianco', 'clos-de-la-roilette-fleurie'],
  },
  {
    id: 'barcelona-wine-bar-wynwood',
    name: 'Barcelona Wine Bar',
    town: 'Miami',
    area: 'Wynwood · 310 NW 25th Street',
    type: 'Spanish tapas restaurant + wine bar',
    note: 'Wine Spectator Best of Award of Excellence',
    vibe: "Wine Spectator Best of Award of Excellence. One of the largest Spanish wine programmes in the United States: nearly four hundred selections covering over seventy Spanish and South American regions, with forty wines available by the glass. Chef-driven Spanish tapas rooted in Andalusian seasonal produce. The Wynwood address gives it an energy that the older Barcelona locations in calmer neighbourhoods lack — the street art neighbourhood and the Spanish wine depth are an unlikely but effective combination.",
    whyAmandaLovesIt: "The Spanish wine list is the reason to choose Barcelona Wine Bar over the alternatives in Wynwood. Forty wines by the glass across seventy-plus regions, with depth in Ribera del Duero, Priorat, and Rias Baixas alongside the better-known Rioja options. The Andalusian tapas philosophy pairs naturally with the Spanish cellar, and the Wynwood street energy makes the evening feel alive rather than formal.",
    bestFor: ['The deepest Spanish wine programme in Miami', 'Andalusian tapas with serious Spanish bottles', 'Wynwood dinner before a gallery evening'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for weekend evenings. The by-the-glass range is wide enough to warrant starting there before committing to a bottle.',
    address: '310 NW 25th Street, Wynwood, Miami FL 33127',
    website: 'https://www.barcelonawinebar.com',
    image: 'https://barcelonawinebar.com/media/BWB_Hero_MV_1-383x258.jpg',
    imageAlt: 'Barcelona Wine Bar Wynwood official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Wynwood',
    imageNote: 'The Spanish-tiled and warm-lit Barcelona interior is instantly recognisable — it communicates the Andalusian identity that drives the whole programme.',
    stylePrompts: ['Spanish regional depth', 'Rioja and Ribera del Duero', 'Albariño with shellfish tapas', 'Forty wines by the glass'],
    wineIds: ['vega-sicilia-unico', 'waitrose-muga-rioja-reserva', 'baron-de-ley-rioja-reserva', 'waitrose-loved-found-albarino'],
  },
  // ── Panama City ───────────────────────────────────────────────────────────
  {
    id: 'corcho-panama-city',
    name: 'Corcho',
    town: 'Panama City',
    area: 'Casco Antiguo · Calle 9 y Calle Boquete',
    type: 'Wine bar',
    note: 'Star Wine List · Casco Antiguo',
    vibe: "Star Wine List featured — the most-cited serious wine bar in Panama City, set in the atmospheric Casco Antiguo historic district. Food built around Mediterranean, French, Italian, and Spanish dishes specifically chosen to complement the wine list. The Casco Antiguo setting — colonial architecture, cobbled streets, Panama Bay views — gives it a context that no modern neighbourhood bar could manufacture.",
    whyAmandaLovesIt: "Corcho is the Panama City answer to the question of where to drink seriously rather than safely. The European wine focus and food-pairing philosophy mean the list is coherent rather than assembled, and the Casco Antiguo location makes the whole evening feel like a genuine destination rather than a hotel bar detour. The go-to wine stop in Panama City for anyone who knows what they want.",
    bestFor: ['The wine bar evening in Panama City', 'European wine focus in the Caribbean', 'Casco Antiguo historic-district atmosphere'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead for weekend evenings. The Casco Antiguo location means it is easy to combine with a walk around the historic district before or after.',
    address: 'Calle 9 y Calle Boquete, Casco Antiguo, Panama City',
    phone: '+507 6352 3342',
    imageFallbackLabel: 'Wine bar · Casco Antiguo',
    imageFallbackNote: "Star Wine List featured — European wine focus in colonial Casco Antiguo, Panama City's most-cited serious wine bar.",
    stylePrompts: ['European wine in Panama', 'Mediterranean food pairing', 'Casco Antiguo discovery evening', 'French and Spanish cellar focus'],
    wineIds: ['trimbach-clos-ste-hune', 'barolo-conterno', 'vacheron-sancerre-le-pave', 'chateau-musar-2018'],
  },
  {
    id: 'bruma-panama-city',
    name: 'Bruma Seafood & Wine',
    town: 'Panama City',
    area: 'Casco Antiguo · Avenida B and Calle 9a Este',
    type: 'Seafood restaurant',
    note: 'Rare wine list · sustainable seafood',
    vibe: "All fish and seafood single-line caught, spear-fished, or sustainably farmed from Panama's Pacific and Caribbean coasts. The wine list is deliberately built around obscure and rare bottles — not the standard Panama hotel-list fare — and the kitchen fuses American and Panamanian seafood traditions in a way that rewards curious pairing choices. In the Casco Antiguo alongside Corcho; the natural choice for a proper food-led evening in the city.",
    whyAmandaLovesIt: "Bruma is the Panama City restaurant that takes the wine list seriously in a market where most options do not. The sustainable sourcing gives the kitchen a genuine identity, the rare wine focus means the list rewards exploration rather than defaulting to the obvious choices, and the Casco Antiguo setting makes the whole evening feel worth the journey.",
    bestFor: ['Sustainable Pacific and Caribbean seafood', 'Rare and obscure wine pairing', 'Casco Antiguo serious dinner'],
    typicalSpend: 'Mid to premium',
    reserveTip: 'Book ahead via OpenTable. The rare wine list is the main event — ask what has just come in before ordering.',
    address: 'Avenida B and Calle 9a Este, Casco Antiguo, Panama City',
    website: 'https://www.brumapanama.com',
    image: 'https://images.squarespace-cdn.com/content/v1/682640bb3de33161ea0c2133/6acff04d-d3e9-4ddf-9404-7522a084ab56/SQUARESPACE.jpg',
    imageAlt: 'Bruma Seafood & Wine official interior image',
    imageEyebrow: 'Official restaurant image',
    imageAccent: 'Casco Antiguo',
    imageNote: 'The Bruma interior should read as a serious, considered room — the architecture and styling give it credibility that a food shot alone would not achieve.',
    stylePrompts: ['Pacific seafood and mineral white', 'Rare discovery wine', 'Chablis and shellfish', 'Obscure producer evening'],
    wineIds: ['tesco-finest-chablis', 'trimbach-clos-ste-hune', 'dom-perignon-2013', 'benanti-etna-bianco'],
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
    image: 'https://d28htdh8gmxq1j.cloudfront.net/wp-content/uploads/2025/03/best-bar-restaurant-near-me-chelmsford-restaurant-essex-bib-gourmand-michelin-dining-experience-country-pub-1az-640x427.jpg',
    imageAlt: 'Galvin Green Man official venue image',
    imageEyebrow: 'Official venue image',
    imageAccent: 'Essex countryside',
    imageNote: 'A country-pub image with proper polish suits the Galvin Green Man much better than any wine-led stand-in.',
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

const TOWN_GROUPS = [
  { region: 'UK', towns: ['Sheffield', 'Stannington', 'Morpeth', 'Stroud', 'Walton-on-Thames', 'London', 'Chelmsford', 'Leeds', 'Harrogate', 'York', 'Poole', 'Weymouth', 'Wentworth', 'Penistone', 'Doncaster', 'Barnsley', 'Rotherham'] },
  { region: 'Europe', towns: ['Valencia', 'Málaga', 'Munich', 'Arcachon', 'Cap Ferret'] },
  { region: 'Asia', towns: ['Singapore'] },
  { region: 'Americas', towns: ['New York', 'Miami', 'Panama City'] },
]

export default function Places() {
  const [searchParams] = useSearchParams()
  const selectedVenueParam = searchParams.get('venue')
  const [region, setRegion] = useState('UK')
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
  const [failedVenueImages, setFailedVenueImages] = useState({})
  const detailRef = useRef(null)
  const { sources, addSource, removeSource, markProcessed } = useVenueSourceInbox()

  const visibleVenues = useMemo(() => {
    let filtered = VENUES
    if (region !== 'all') {
      const regionTowns = TOWN_GROUPS.find(g => g.region === region)?.towns || []
      filtered = filtered.filter(v => regionTowns.includes(v.town))
    }
    if (town !== 'all') {
      filtered = filtered.filter(v => v.town === town)
    }
    return filtered
  }, [region, town])

  const currentRegionTowns = useMemo(() => {
    if (region === 'all') return TOWNS.filter(t => t !== 'all')
    return TOWN_GROUPS.find(g => g.region === region)?.towns.filter(t => TOWNS.includes(t)) || []
  }, [region])

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
    const matchedRegion = TOWN_GROUPS.find(g => g.towns.includes(matched.town))?.region || 'all'
    setRegion(matchedRegion)
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
  const venueCards = useMemo(
    () =>
          visibleVenues.map((item) => {
            const itemSuggestedWines = item.wineIds.map(id => wines.find(w => w.id === id)).filter(Boolean)
            return {
              venue: item,
              suggestedWines: itemSuggestedWines,
              visual: failedVenueImages[item.id] ? null : getVenueVisual(item),
              sourcedCount: venueWineLists[item.id]?.items?.length || 0,
            }
          }),
    [failedVenueImages, visibleVenues],
  )
  const venueVisual = useMemo(
    () => (failedVenueImages[venue.id] ? null : getVenueVisual(venue)),
    [failedVenueImages, venue],
  )
  const venueMenuHighlights = useMemo(
    () =>
      (venue.menuHighlights || []).map((item) => ({
        ...item,
        featuredWine: item.wineId ? wines.find(w => w.id === item.wineId) || null : null,
      })),
    [venue],
  )
  const sourcedCategoryCount = useMemo(
    () => new Set(venueWineItems.map(item => normalizeVenueWineCategory(item.category))).size,
    [venueWineItems],
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

  function markVenueImageFailed(nextVenueId) {
    setFailedVenueImages(prev => (prev[nextVenueId] ? prev : { ...prev, [nextVenueId]: true }))
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
          <div className="relative flex-shrink-0">
            <div className="absolute inset-4 rounded-[2rem] bg-gold/10 blur-2xl" aria-hidden="true" />
            <div className="relative w-44 h-60 lg:w-52 lg:h-[21rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm">
              <img
                src="/amanda-holmes.png"
                alt="Amanda Holmes"
                className="w-full h-full object-cover object-top opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1424]/78 via-transparent to-transparent" />
              <div className="absolute left-4 right-4 bottom-4">
                <p className="font-body text-[10px] uppercase tracking-[0.24em] text-gold-lt/85">Amanda's shortlist</p>
                <p className="font-display text-xl text-white mt-1">Places she would send you to first.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Region</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                <button
                  onClick={() => { setRegion('all'); setTown('all') }}
                  className={`chip ${region === 'all' ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                >
                  All
                </button>
                {TOWN_GROUPS.map(group => {
                  const count = group.towns.filter(t => TOWNS.includes(t)).length
                  if (!count) return null
                  return (
                    <button
                      key={group.region}
                      onClick={() => { setRegion(group.region); setTown('all') }}
                      className={`chip gap-1.5 ${region === group.region ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      {group.region}
                      <span className={`text-[10px] ${region === group.region ? 'opacity-60' : 'text-gold opacity-70'}`}>{count}</span>
                    </button>
                  )
                })}
              </div>
              {currentRegionTowns.length > 1 && (
                <>
                  <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Town</p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => setTown('all')}
                      className={`chip ${town === 'all' ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                    >
                      All
                    </button>
                    {currentRegionTowns.map(t => (
                      <button
                        key={t}
                        onClick={() => setTown(t)}
                        className={`chip ${town === t ? 'bg-slate text-white' : 'bg-white border border-cream text-slate-lt'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button className="btn-secondary px-4 py-2 shrink-0" onClick={() => setShowSourceModal(true)}>
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
          {venueCards.map(({ venue: v, visual, suggestedWines: cardSuggestedWines, sourcedCount }) => (
            <button
              key={v.id}
              onClick={() => handleVenueSelect(v.id)}
              className={`text-left card flex h-full flex-col p-4 transition-all ${venue.id === v.id ? 'border-gold shadow-gold' : ''}`}
            >
              <div className="mb-4">
                <VenueVisualPanel
                  venue={v}
                  visual={visual}
                  compact
                  onImageError={() => markVenueImageFailed(v.id)}
                />
              </div>
              <div className="mb-4 px-1">
                <p className="font-body text-sm text-slate-lt leading-relaxed line-clamp-2 min-h-[2.75rem]">
                  {visual?.note || v.imageFallbackNote || 'No honest venue photo yet; keeping this card clean and text-led is better than using the wrong image.'}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="section-label mb-2">{v.town} · {v.area}</p>
                <span className="chip bg-cream text-slate-lt">{v.type}</span>
              </div>
              <h2 className="font-display text-3xl text-slate">{v.name}</h2>
              <p className="font-body text-sm text-slate-lt mt-2 line-clamp-3">{v.vibe}</p>
              {cardSuggestedWines[0] ? (
                <p className="font-body text-sm text-slate mt-3">
                  <strong className="text-slate">Start with:</strong> {cardSuggestedWines[0].name}
                </p>
              ) : null}
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
                {v.richardFavourite && (
                  <span className="chip bg-slate text-white">Richard's pick</span>
                )}
                {v.claireFavourite && (
                  <span className="chip bg-slate/70 text-white">Claire's pick</span>
                )}
                <span className={`chip ${sourcedCount ? 'bg-gold/15 text-gold' : 'bg-white border border-cream text-slate-lt'}`}>
                  {sourcedCount
                    ? `${sourcedCount} wines sourced`
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
          <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-5 mb-8">
            <div className="space-y-3">
              <VenueVisualPanel
                venue={venue}
                visual={venueVisual}
                onImageError={() => markVenueImageFailed(venue.id)}
              />
              <div className="rounded-[1.4rem] border border-cream bg-white/72 px-4 py-4 shadow-sm">
                <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold mb-1.5">
                  {venue.town} · {venue.area}
                </p>
                <p className="font-display text-2xl text-slate leading-tight">{venue.name}</p>
                <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">
                  {venue.vibe}
                </p>
                {venueVisual?.note || venue.imageFallbackNote ? (
                  <p className="font-body text-xs text-slate-lt/90 mt-3 leading-relaxed">
                    {venueVisual?.note || venue.imageFallbackNote}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'Bottle benchmarks', value: suggestedWines.length, note: 'Amanda-style references already matched to this venue.' },
                { label: 'Sourced menu wines', value: venueWineItems.length || '0', note: venueWineItems.length ? 'Captured from the current menu or wine list source.' : 'No public wine list ingested yet.' },
                { label: 'Wine styles on list', value: sourcedCategoryCount || '—', note: sourcedCategoryCount ? 'Different style groups currently visible in the sourced list.' : 'Will populate when a source is added.' },
                { label: 'Best for', value: venue.bestFor[0], note: venue.bestFor.slice(1).join(' · ') || 'A strong first-use case for this venue.' },
              ].map((item) => (
                <div key={item.label} className="card p-4">
                  <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-2">{item.label}</p>
                  <p className="font-display text-3xl text-slate leading-tight">{item.value}</p>
                  <p className="font-body text-xs text-slate-lt mt-2 leading-relaxed">{item.note}</p>
                </div>
              ))}
              <div className="sm:col-span-2 card p-4">
                <div className="flex items-end justify-between gap-3 mb-3">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-gold mb-1">Amanda shortlist</p>
                    <p className="font-display text-2xl text-slate">What Amanda would scan for first in this room</p>
                  </div>
                  <span className="font-body text-xs text-slate-lt">{venue.note}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {suggestedWines.slice(0, 3).map(wine => (
                    <Link
                      key={wine.id}
                      to={`/explore/${wine.id}`}
                      className="rounded-[1.35rem] border border-cream bg-gradient-to-br from-white to-[#f5efe4] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                    >
                      <p className="font-body text-[10px] uppercase tracking-[0.16em] text-gold">{wine.country}</p>
                      <h4 className="font-display text-lg text-slate leading-tight mt-2">{wine.name}</h4>
                      <p className="font-body text-xs text-slate-lt mt-1">{wine.producer}</p>
                      <p className="font-body text-xs text-slate-lt mt-2">{[getWineVintageLabel(wine), wine.price].filter(Boolean).join(' · ')}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8">
            <div>
              <p className="section-label mb-2">{venue.richardFavourite ? "Richard's pick" : "Amanda's read"}</p>
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
              {venueMenuHighlights.length ? (
                <div className="card p-4 mb-5">
                  <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
                    <div>
                      <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-1">Current Menu Cues</p>
                      <p className="font-display text-2xl text-slate">What to order in the Club Room</p>
                    </div>
                    {venueWineInfo?.sourceUrl && (
                      <a href={venueWineInfo.sourceUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        Open menu PDF ↗
                      </a>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                  {venueMenuHighlights.map((item) => {
                    const featuredBottleImage = isVenueSafeBottleImage(item.featuredWine?.labelImage)
                      ? item.featuredWine.labelImage
                      : null
                    return (
                      <article key={item.dish} className="rounded-2xl border border-cream bg-white/75 p-4">
                        <div className="flex gap-4">
                          {featuredBottleImage ? (
                            <Link
                              to={`/explore/${item.featuredWine.id}`}
                              className="shrink-0 w-20 rounded-[1.2rem] border border-cream bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
                            >
                              <div className="h-24 rounded-[0.9rem] bg-gradient-to-br from-white to-[#f5efe4] flex items-center justify-center overflow-hidden">
                                <img
                                  src={featuredBottleImage}
                                  alt={`${item.featuredWine.name} visual`}
                                  className="h-full w-full object-contain"
                                  loading="lazy"
                                />
                              </div>
                              <p className="font-body text-[9px] uppercase tracking-[0.15em] text-gold mt-2">Featured bottle</p>
                            </Link>
                          ) : null}
                          <div className="min-w-0">
                            <p className="font-body text-xs uppercase tracking-[0.15em] text-gold mb-2">Club Room</p>
                            <h4 className="font-display text-2xl text-slate leading-tight">{item.dish}</h4>
                            <p className="font-body text-sm text-slate-lt mt-2 leading-relaxed">{item.note}</p>
                            <p className="font-body text-sm text-slate mt-3">
                              <strong className="text-slate">Best glass:</strong> {item.pour}
                            </p>
                            {featuredBottleImage ? (
                              <p className="font-body text-xs text-slate-lt mt-2">
                                Visual cue: {item.featuredWine.name}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    )
                  })}
                  </div>
                </div>
              ) : null}
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
