// src/utils/ourTake.js
// Generates a Tom Gilby–inspired editorial take for any wine in the database.
// To craft a bespoke take, add  ourTake: `...`  directly in wines.js — it takes priority.

// Deterministic pick — same wine always gets same phrase, no random flickering
function hash(wine, offset = 0) {
  const key = wine.id + String(offset)
  return key.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 0)
}
function pick(wine, arr, offset = 0) {
  return arr[hash(wine, offset) % arr.length]
}

export function generateOurTake(wine) {
  const verdict   = getValueVerdict(wine)
  const character = getCharacterNote(wine)
  const practical = getPracticalTip(wine)
  return [verdict, character, practical].filter(Boolean).join(' ')
}

// ── VALUE VERDICT ──────────────────────────────────────────────────────────────

function getValueVerdict(wine) {
  const r = wine.rating || 85

  if (wine.priceRange === 'budget') {
    if (r >= 90) return pick(wine, [
      `An absolute steal — this over-delivers at this price.`,
      `Genuinely remarkable value. Buy a case and don't tell everyone.`,
      `The budget shelf hero. Don't overthink it — just buy it.`,
    ], 0)
    if (r >= 87) return pick(wine, [
      `Punches well above its price tag.`,
      `Solid value and then some.`,
      `One of the better things you'll find at this price point.`,
    ], 0)
    return pick(wine, [
      `Honest, no-frills drinking at an honest price.`,
      `Does exactly what it says. Nothing wrong with that.`,
      `Good enough for a Tuesday evening, absolutely.`,
    ], 0)
  }

  if (wine.priceRange === 'mid') {
    if (r >= 91) return pick(wine, [
      `This is the sweet spot — proper quality without the eye-watering price tag.`,
      `Mid-range pricing, not-so-mid-range quality. The dinner party hero.`,
      `Exceptional value at this level. Stock up before others cotton on.`,
    ], 0)
    if (r >= 88) return pick(wine, [
      `Reliable, genuinely enjoyable, and worth keeping on rotation.`,
      `Good value for the quality on offer. No complaints whatsoever.`,
      `Hits above its weight. Exactly what you want from a mid-ranger.`,
    ], 0)
    return pick(wine, [
      `Decent everyday drinking. Nothing to write home about, but nothing to apologise for.`,
      `Solid choice for the price. Does the job and does it well.`,
      `Honest mid-range wine — reliable, unpretentious, and easy to like.`,
    ], 0)
  }

  if (wine.priceRange === 'premium') {
    if (r >= 93) return pick(wine, [
      `This is the bottle you open when you want to remember why wine is worth caring about.`,
      `Premium pricing, entirely justified. This is the real deal.`,
      `Worth every penny. The kind of bottle people remember.`,
    ], 0)
    if (r >= 90) return pick(wine, [
      `Earns its premium price tag. Buy it for a proper occasion and give it time.`,
      `Quality you can taste — and that's entirely the point.`,
      `Premium territory, and it absolutely belongs there.`,
    ], 0)
    return pick(wine, [
      `Good wine, though worth asking whether you can do better nearby for the money.`,
      `Impressive and well-made, if not quite transcendent at this price.`,
      `Solid premium choice for those who know this style.`,
    ], 0)
  }

  // luxury
  if (r >= 95) return pick(wine, [
    `This is proper wine greatness. Save it for a moment worthy of the bottle.`,
    `One of the finest things you can put in a glass. No further debate needed.`,
    `If you need convincing, try it. After that, the price stops feeling outrageous.`,
  ], 0)
  if (r >= 93) return pick(wine, [
    `Exceptional quality. The kind of wine that makes you put the phone down.`,
    `Luxury pricing matched by luxury drinking. Treat it accordingly.`,
    `Worth the investment if this style is your passion.`,
  ], 0)
  return pick(wine, [
    `You're paying for pedigree as much as the liquid. Fair enough if this producer matters to you.`,
    `Impressive credentials, wine that delivers — just be sure the occasion justifies the outlay.`,
    `Fine wine territory. Approach with reverence and a proper glass.`,
  ], 0)
}

// ── CHARACTER NOTE ─────────────────────────────────────────────────────────────

function getCharacterNote(wine) {
  const { category, grapes = [], region = '', country = '' } = wine
  const g0  = (grapes[0] || '').toLowerCase()
  const reg = region.toLowerCase()
  const cnt = country.toLowerCase()
  const sub = (wine.subcategory || '').toLowerCase()

  if (category === 'sparkling') {
    if (sub.includes('champagne') || reg.includes('champagne')) return pick(wine, [
      `The real thing — biscuity, persistent and with that unmistakable Champagne authority.`,
      `Proper Champagne. The bubbles are finer, the depth is greater, and yes, you can taste the difference.`,
      `Everything Champagne should be — elegant, complex, and worth every penny of the ritual.`,
    ], 1)
    if (sub.includes('créman') || sub.includes('cremant') || sub.includes('crémant')) return pick(wine, [
      `Crémant at its finest — all the elegance of traditional-method fizz without the Champagne surcharge.`,
      `Proof that great bubbles don't require a Champagne postcode.`,
      `The intelligent alternative. Same method, fraction of the price, all the pleasure.`,
    ], 1)
    if (sub.includes('prosecco') || reg.includes('prosecco') || reg.includes('veneto')) return pick(wine, [
      `Fresh, floral and crowd-pleasing — exactly what Prosecco should be.`,
      `Light on its feet, big on fun. Exactly what the occasion calls for.`,
      `The aperitivo essential — pour it cold, pour it generously, don't overthink it.`,
    ], 1)
    if (sub.includes('cava') || reg.includes('cava') || reg.includes('penedès')) return pick(wine, [
      `Nutty, earthy and properly made. More complex than its reputation suggests.`,
      `Cava gets less love than it deserves. This one makes a compelling case for a re-evaluation.`,
    ], 1)
    if (cnt.includes('england') || cnt.includes('uk') || reg.includes('sussex') || reg.includes('kent')) return pick(wine, [
      `English sparkling has no business being this good. But here we are.`,
      `Proof that English chalk and a cool climate were always destined for great bubbles.`,
    ], 1)
    return pick(wine, [
      `Elegant fizz with real character. The glass is always too empty.`,
      `Fine sparkling with a genuine sense of occasion.`,
    ], 1)
  }

  if (category === 'red') {
    if (g0.includes('pinot')) {
      if (reg.includes('burgundy') || reg.includes('bourgogne')) return pick(wine, [
        `Silky, nuanced and quietly magnificent — the grape that slowly ruins your appreciation of everything else.`,
        `Burgundy Pinot Noir: the wine that simultaneously empties your wallet and expands your horizons.`,
        `Delicate on the surface, devastatingly complex underneath. This is what Pinot Noir is for.`,
      ], 1)
      return pick(wine, [
        `New World Pinot done well — the fruit is riper but the elegance is completely intact.`,
        `Everything you want from Pinot Noir: silk, fruit and enough complexity to keep you thinking.`,
      ], 1)
    }
    if (g0.includes('cabernet')) {
      if (reg.includes('bordeaux') || reg.includes('médoc') || reg.includes('pauillac')) return pick(wine, [
        `Structured, serious and built for the long haul. Give it time, beef and proper respect.`,
        `Classic Bordeaux architecture — cassis, cedar and a backbone that demands something on the plate.`,
        `Bordeaux doing what Bordeaux does best: patient, commanding and worth every year of waiting.`,
      ], 1)
      return pick(wine, [
        `Big, structured Cabernet that absolutely means business. Steak would be delighted.`,
        `Cabernet in confident form — blackcurrant, structure and a finish that keeps going.`,
      ], 1)
    }
    if (g0.includes('nebbiolo')) return pick(wine, [
      `Tar, roses and a tannin structure that means serious business. Barolo doesn't apologise for being itself.`,
      `The king of Italian reds — demanding, complex and worth every penny of the patience required.`,
    ], 1)
    if (g0.includes('sangiovese')) return pick(wine, [
      `Classic Italian architecture — high acidity, firm tannins and a laser focus on food.`,
      `Chianti built for the table, not the shelf. Pour with anything tomato-based and watch it sing.`,
    ], 1)
    if (g0.includes('tempranillo')) return pick(wine, [
      `Rioja at its reliable best — vanilla, leather, dark fruit and that generous Spanish warmth.`,
      `Spain's most dependable red. Open half an hour early and pair with anything off a grill.`,
    ], 1)
    if (g0.includes('malbec')) return pick(wine, [
      `Malbec does exactly what it promises — plummy, full and generous. Argentina's gift to dinner tables.`,
      `Big, bold and brilliant with steak. No philosophical debate required.`,
    ], 1)
    if (g0.includes('syrah') || g0.includes('shiraz')) return pick(wine, [
      `Peppery, meaty and gloriously hedonistic — the wine equivalent of a slow-cooked Sunday roast.`,
      `Whether you call it Syrah or Shiraz, the result is the same: deeply, unapologetically satisfying.`,
    ], 1)
    if (g0.includes('grenache') || g0.includes('garnacha')) return pick(wine, [
      `Warm, generous and wickedly food-friendly. Grenache is the crowd-pleaser wine geeks secretly love.`,
      `Plush, approachable and brilliant with lamb. Grenache at its most agreeable.`,
    ], 1)
    return pick(wine, [
      `Well-crafted and confident. The kind of bottle you're glad you chose.`,
      `Good red wine — structured, characterful and honest about where it comes from.`,
    ], 1)
  }

  if (category === 'white') {
    if (g0.includes('chardonnay')) {
      if (reg.includes('burgundy') || reg.includes('bourgogne') || reg.includes('chablis') || reg.includes('mâcon') || reg.includes('macon')) return pick(wine, [
        `White Burgundy — the benchmark against which other Chardonnays measure themselves and often fall short.`,
        `This is what Chardonnay looks like when it genuinely has something to say.`,
      ], 1)
      return pick(wine, [
        `Chardonnay with real personality — not the bland, over-oaked version you've learned to avoid.`,
        `Modern Chardonnay done right. Restrained, precise and genuinely interesting.`,
      ], 1)
    }
    if (g0.includes('sauvignon blanc')) return pick(wine, [
      `Cut-glass acidity and freshness that immediately wakes up your palate.`,
      `Clean, precise and relentlessly drinkable. The definition of an honest crowd-pleaser.`,
    ], 1)
    if (g0.includes('riesling')) return pick(wine, [
      `Riesling — still misunderstood, still magnificent. If this doesn't convert you, nothing will.`,
      `The most underrated grape on the planet. Petrol and slate notes arrive with age. Worth every year.`,
    ], 1)
    if (g0.includes('albariño') || g0.includes('albarino')) return pick(wine, [
      `Galician summer in a glass — saline, peachy and made for fresh seafood.`,
      `Albariño that makes you wish you were eating at a harbour restaurant in Galicia right now.`,
    ], 1)
    if (g0.includes('pinot grigio') || g0.includes('pinot gris')) return pick(wine, [
      `Italian Pinot Grigio that actually has flavour — a step above the usual supermarket version.`,
      `Light, crisp and genuinely refreshing. Sometimes that's exactly what the moment demands.`,
    ], 1)
    if (g0.includes('viognier')) return pick(wine, [
      `Viognier in generous form — apricot-rich, perfumed and completely unmistakable.`,
      `The most floral of white wines. Polarising? Possibly. Magnificent? Absolutely.`,
    ], 1)
    return pick(wine, [
      `A white of real character. The sort you pour and immediately want to pour again.`,
      `Well-crafted and expressive. Exactly what a good white wine should do.`,
    ], 1)
  }

  if (category === 'rosé') {
    if (reg.includes('provence') || reg.includes('bandol')) return pick(wine, [
      `Provence rosé — the template against which all others are measured. Pale, dry and effortlessly chic.`,
      `Everything a proper dry rosé should be. Unfair competition for everything else in the category.`,
    ], 1)
    return pick(wine, [
      `Good rosé — fresh, dry and drinks beautifully in sunlight.`,
      `The kind of rosé that works whatever the occasion. Pour cold, don't overthink it.`,
    ], 1)
  }

  if (category === 'dessert') return pick(wine, [
    `The perfect ending — concentrated, sweet and with enough acidity to keep it from cloying.`,
    `Extraordinary intensity in a small glass. A little goes an enormous way.`,
  ], 1)

  return pick(wine, [
    `A wine that delivers on its promise — and then a little more.`,
    `Thoughtfully made and honestly expressed. Worth opening slowly.`,
  ], 1)
}

// ── PRACTICAL TIP ──────────────────────────────────────────────────────────────

function getPracticalTip(wine) {
  const retailers    = (wine.whereToBuy || []).map(w => w.name)
  const supermarkets = [`Tesco`, `Sainsbury's`, `Waitrose`, `Asda`, `M&S`, `Aldi`, `Lidl`, `Morrisons`]
  const isSupermarket = retailers.some(r => supermarkets.includes(r))
  const isLeBonVin    = retailers.includes('Le Bon Vin')
  const sty = (wine.style || []).map(s => s.toLowerCase())

  if (wine.category === 'sparkling') return pick(wine, [
    `Chill it properly — 45 minutes in an ice bucket, not just the fridge door.`,
    `Perfect for an aperitivo, a celebration, or a Tuesday that needs rescuing.`,
    `Serve cold, pour generously, enjoy immediately. No ceremony required.`,
  ], 2)

  if (wine.decant && typeof wine.decant === 'string' && wine.decant !== 'Not needed') return pick(wine, [
    `Decant for ${wine.decant} — this wine genuinely transforms with air.`,
    `Give it ${wine.decant} of breathing room. The patience is absolutely worth it.`,
  ], 2)

  if (isSupermarket) {
    const store = retailers.find(r => supermarkets.includes(r)) || 'the supermarket'
    return pick(wine, [
      `Pick it up next time you're in ${store} — no specialist hunt required.`,
      `A proper discovery on the supermarket shelf. Buy more than one bottle.`,
      `The kind of find that makes the weekly shop feel like a small victory.`,
    ], 2)
  }

  if (isLeBonVin) return pick(wine, [
    `Worth the trip to Le Bon Vin in Sheffield — or a very justified online order.`,
    `Le Bon Vin carry this for good reason. Exactly the sort of bottle a good specialist is made for.`,
  ], 2)

  if (sty.includes('tannic') || sty.includes('full-bodied')) return pick(wine, [
    `Open it an hour before dinner. You'll notice the difference.`,
    `This is a food wine — it fights you alone, blossoms with red meat or hard cheese.`,
  ], 2)

  return pick(wine, [
    `Buy a couple — you'll wish you had when the first bottle's gone.`,
    `Open it tonight. There's rarely a good reason to wait.`,
    `The sort of bottle you mention to people the morning after.`,
    `Trust it. Then buy it again.`,
    `Serve it to someone who claims not to like this style. Watch what happens.`,
  ], 2)
}
