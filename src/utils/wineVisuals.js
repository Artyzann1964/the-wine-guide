const RETAILER_ASSET_HINTS = [
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
]

const PRODUCER_VISUALS = [
  {
    test: /(cvne|cune)\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Haro_-_Compa%C3%B1%C3%ADa_Vin%C3%ADcola_del_Norte_de_Espa%C3%B1a_(CVNE)_08.jpg',
    label: 'CVNE winery reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bcontino\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Casa_contino_mas_vinedos_low.jpg',
    label: 'Contino vineyard reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bemilio moro\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bodegas_Emilio_Moro.jpg',
    label: 'Emilio Moro estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\broberto sarotto\b/,
    src: 'https://www.robertosarotto.com/wp-content/uploads/home-slider-01.jpg',
    label: 'Roberto Sarotto estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\b(caves d'esclans|whispering angel)\b/,
    src: 'https://www.esclans.com/wp-content/uploads/2022/04/HP_INTRO.jpg',
    label: "Caves d'Esclans estate reference",
    kind: 'equivalent-estate',
  },
  {
    test: /\bles jamelles\b/,
    src: 'https://www.les-jamelles.com/wp-content/uploads/2020/01/jamelles-nos-terroir-header-terroir-1.jpg',
    label: 'Les Jamelles terroir reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bvallee du paradis\b/,
    src: 'https://languedoc-wines.com/wp-content/uploads/2021/06/first.jpg',
    label: 'Vallee du Paradis reference',
    kind: 'equivalent-region',
  },
  {
    test: /\baglianico del vulture\b/,
    src: 'https://consorzioaglianico.it/uploads/2018/10/vigneti.jpg',
    label: 'Aglianico del Vulture reference',
    kind: 'equivalent-region',
  },
  {
    test: /\bpinotage\b/,
    src: 'https://pinotage.co.za/wp-content/uploads/2024/09/default-featured-image-2.jpg',
    label: 'Pinotage reference',
    kind: 'equivalent-region',
  },
  {
    test: /\b(minuty|chateau minuty)\b/,
    src: 'https://minuty.com/cdn/shop/files/PHOTO_HP_MOBILE_1a4f413a-deab-4519-bcbe-ebeec551a940.jpg',
    label: 'Chateau Minuty estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\b(famille perrin|la vieille ferme)\b/,
    src: 'https://www.familleperrin.com/wp-content/uploads/2021/11/home.jpg',
    label: 'Famille Perrin estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\b(jean-claude mas|jean claude mas|paul mas)\b/,
    src: 'https://www.paulmas.com/wp-content/uploads/2021/03/DPM-aerien-2.jpg',
    label: 'Paul Mas estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bcono sur\b/,
    src: 'https://www.conosur.com/wp-content/uploads/2017/08/backgroundconosur-1-2-scaled.jpg',
    label: 'Cono Sur estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bschug\b/,
    src: 'https://schugwinery.com/wp-content/uploads/2023/08/our-story-img.jpg',
    label: 'Schug winery reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\balpha estate\b/,
    src: 'https://alpha-estate.com/wp-content/uploads/2023/01/home_vineyards_1.jpg',
    label: 'Alpha Estate vineyard reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bgerard bertrand\b/,
    src: 'https://www.gerard-bertrand.com/cdn/shop/files/20191016103802_52e47945-570b-4183-ab79-7abfb7a1409d.jpg',
    label: 'Gerard Bertrand estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\b(jaboulet|paul jaboulet)\b/,
    src: 'https://jaboulet.com/storage/2024/02/Winery.jpg',
    label: 'Jaboulet winery reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bminuty\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ch%C3%A2teau_de_Miraval_02.jpg',
    label: 'Provence rose reference',
    kind: 'equivalent-bottle',
  },
  {
    test: /\b(beau-site|chateau beau-site)\b/,
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ch%C3%A2teau_Le_Boscq%2C_Gironde%2C_France_%2822281546941%29.jpg',
    label: 'Saint-Estephe chateau reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\b(poujeau|fieuzal|guiraud)\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ch%C3%A2teau%20de%20Fieuzal%202000.jpg',
    label: 'Bordeaux estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bvasse felix\b/,
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vasse%20felix.jpg',
    label: 'Vasse Felix estate reference',
    kind: 'equivalent-estate',
  },
  {
    test: /\bterre cevico\b/,
    src: 'https://www.terrecevico.com/wp-content/uploads/2022/10/Terre-Cevico_Aziende-Vinicole_5-luglio-2022-44-1.jpg',
    label: 'Terre Cevico estate reference',
    kind: 'equivalent-estate',
  },
]

const REGION_VISUALS = {
  'Chateauneuf-du-Pape': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Rayas07.jpg',
    label: 'Chateauneuf-du-Pape bottle reference',
    kind: 'equivalent-bottle',
  },
  'Grand Cru Champagne': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Grand_Cru_champagne.jpg',
    label: 'Grand Cru Champagne reference',
    kind: 'equivalent-bottle',
  },
  Epernay: {
    src: 'https://champagne.twic.pics/sites/default/files/2022-11/epernay_et_sa_region_0.jpg',
    label: 'Epernay reference',
    kind: 'equivalent-region',
  },
  Champagne: {
    src: 'https://champagne.twic.pics/sites/default/files/2024-04/Le-vignoble-champenois.jpg',
    label: 'Champagne vineyard reference',
    kind: 'equivalent-region',
  },
  Hampshire: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/92/HB_Vineyard_autumn.JPG',
    label: 'Hampshire vineyard reference',
    kind: 'equivalent-region',
  },
  Sussex: {
    src: 'https://nyetimber.com/wp-content/uploads/2025/11/Nyetimber-Menu-Our-Story.jpg',
    label: 'Sussex sparkling estate reference',
    kind: 'equivalent-estate',
  },
  Chablis: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Vineyard_near_Chablis_%28Yonne%2C_France%29.jpg/1024px-Vineyard_near_Chablis_%28Yonne%2C_France%29.jpg',
    label: 'Chablis vineyard reference',
    kind: 'equivalent-region',
  },
  'Chablis Premier Cru': {
    src: 'https://www.chablis.fr/gallery_images/site/25259/25268/25387.jpg',
    label: 'Chablis Premier Cru reference',
    kind: 'equivalent-region',
  },
  'Montee de Tonnerre': {
    src: 'https://www.chablis.fr/gallery_images/site/25259/25307/56572/56818.jpg',
    label: 'Montee de Tonnerre reference',
    kind: 'equivalent-region',
  },
  "Pays d'Oc": {
    src: 'https://www.paysdoc-wines.com/wp-content/uploads/2018/02/pays-doc-igp-vigne-indication-geographique-protegee-languedoc-roussillon-vin-cave-rouges-roses-blancs-qualite-cepage-francais-GRAPPE28.jpg',
    label: "Pays d'Oc reference",
    kind: 'equivalent-region',
  },
  'Picpoul de Pinet': {
    src: 'https://picpoul-de-pinet.com/wp-content/uploads/2022/01/VENDANG_18_CVITINOVA.png',
    label: 'Picpoul de Pinet reference',
    kind: 'equivalent-region',
  },
  'Pouilly-Fuisse': {
    src: 'https://decibelles-data.media.tourinsoft.eu/upload/dji-fly-20240323-095422-63-1711220852524-photo.jpg',
    label: 'Pouilly-Fuisse reference',
    kind: 'equivalent-region',
  },
  Maconnais: {
    src: 'https://decibelles-data.media.tourinsoft.eu/upload/dji-fly-20240323-095422-63-1711220852524-photo.jpg',
    label: 'Maconnais vineyard reference',
    kind: 'equivalent-region',
  },
  'Cote de Beaune': {
    src: 'https://www.bourgogne-wines.com/gallery_images/site/30476/72688/72760.jpg',
    label: 'Cote de Beaune reference',
    kind: 'equivalent-region',
  },
  Montagny: {
    src: 'https://www.bourgogne-wines.com/gallery_images/site/30476/30735/30738.jpg',
    label: 'Montagny reference',
    kind: 'equivalent-region',
  },
  'Saint-Estephe': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Ch%C3%A2teau_Le_Boscq%2C_Gironde%2C_France_%2822281546941%29.jpg',
    label: 'Saint-Estephe chateau reference',
    kind: 'equivalent-estate',
  },
  Cava: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Gramona-granja12.jpg',
    label: 'Cava producer reference',
    kind: 'equivalent-bottle',
  },
  Bordeaux: {
    src: '/Margaux.jpeg',
    label: 'Bordeaux chateau reference',
    kind: 'equivalent-estate',
  },
  'Burgundy & Beaujolais': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Puligny-Montrachet_bottle.jpg',
    label: 'Burgundy bottle reference',
    kind: 'equivalent-bottle',
  },
  Fleurie: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Fleurie_Rhone_France_28_May_2012.jpg',
    label: 'Fleurie village reference',
    kind: 'equivalent-region',
  },
  'Loire Valley': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Sancerre_wine_bottle_%287326544468%29.jpg',
    label: 'Loire bottle reference',
    kind: 'equivalent-bottle',
  },
  'Rhone Valley': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Guigal_La_Mouline.jpg',
    label: 'Rhone reference bottle',
    kind: 'equivalent-bottle',
  },
  Provence: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Vin_ros%C3%A9_c%C3%B4tes_de_provence.jpg',
    label: 'Provence rose reference',
    kind: 'equivalent-bottle',
  },
  'Cotes de Provence': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Vin_ros%C3%A9_c%C3%B4tes_de_provence.jpg',
    label: 'Cotes de Provence reference',
    kind: 'equivalent-bottle',
  },
  'Saint-Emilion': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/1_saint-emilion_pano_2016.jpg/1024px-1_saint-emilion_pano_2016.jpg',
    label: 'Saint-Emilion village reference',
    kind: 'equivalent-region',
  },
  Morgon: {
    src: 'https://www.beaujolais.com/wp-content/uploads/sites/2/2020/07/vineyards@2x1-scaled.jpg',
    label: 'Morgon reference',
    kind: 'equivalent-region',
  },
  Beaujolais: {
    src: 'https://www.beaujolais.com/wp-content/uploads/sites/2/2020/07/vineyards@2x1-scaled.jpg',
    label: 'Beaujolais reference',
    kind: 'equivalent-region',
  },
  Alsace: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/2009_Trimbach_Riesling_(8130797570).jpg',
    label: 'Alsace bottle reference',
    kind: 'equivalent-bottle',
  },
  'Rioja Alta': {
    src: 'https://riojawine.com/wp-content/uploads/2023/04/rioja-alta-badaran-02.jpg',
    label: 'Rioja Alta reference',
    kind: 'equivalent-region',
  },
  Rioja: {
    src: 'https://www.bodegasmuga.com/wp-content/uploads/actividades-home-visita.jpg',
    label: 'Rioja estate reference',
    kind: 'equivalent-estate',
  },
  'Ribera del Duero': {
    src: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Bodegas_Emilio_Moro.jpg',
    label: 'Ribera del Duero estate reference',
    kind: 'equivalent-estate',
  },
  Wachau: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Weinberg_in_der_Wachau.JPG',
    label: 'Wachau vineyard reference',
    kind: 'equivalent-region',
  },
  Tuscany: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Parco%20naturale%20della%20Maremma.jpg',
    label: 'Tuscan regional reference',
    kind: 'equivalent-region',
  },
  'Chianti Classico': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Vineyards_in_the_Chianti_Classico_valleys.jpg',
    label: 'Chianti Classico vineyard reference',
    kind: 'equivalent-region',
  },
  Piedmont: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Conterno_barolo_cigalo.jpeg',
    label: 'Piedmont bottle reference',
    kind: 'equivalent-bottle',
  },
  Gavi: {
    src: 'https://www.consorziogavi.com/wp-content/uploads/2020/09/territorio-1-1920.jpg',
    label: 'Gavi regional reference',
    kind: 'equivalent-region',
  },
  Manduria: {
    src: 'https://www.consorziotutelaprimitivo.com/uploads/2024/07/vigneti-reale-cover.jpg',
    label: 'Primitivo di Manduria reference',
    kind: 'equivalent-region',
  },
  'Delle Venezie': {
    src: 'https://dellevenezie.it/wp-content/uploads/2025/12/20-pinot-grigio-doc-delle-venezie-territorio-v2-1.webp',
    label: 'Delle Venezie regional reference',
    kind: 'equivalent-region',
  },
  'Venezie DOC': {
    src: 'https://dellevenezie.it/wp-content/uploads/2025/12/03-pinot-grigio-doc-delle-venezie-bottiglia-v5.webp',
    label: 'Pinot Grigio delle Venezie reference',
    kind: 'equivalent-bottle',
  },
  'Prosecco DOC': {
    src: 'https://www.prosecco.wine/wp-content/uploads/2023/10/01_SCOPRIRE-02.jpg',
    label: 'Prosecco DOC reference',
    kind: 'equivalent-region',
  },
  'Soave Classico': {
    src: 'https://www.ilsoave.com/wp-content/uploads/2018/09/TUT_3834-Modifica-2-e1537349761377.jpg',
    label: 'Soave Classico reference',
    kind: 'equivalent-region',
  },
  Veneto: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hillside%20View%20of%20Valdobbiadene.jpg',
    label: 'Veneto regional reference',
    kind: 'equivalent-region',
  },
  'Amarone & Valpolicella': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Amarone_BMK.jpg',
    label: 'Amarone bottle reference',
    kind: 'equivalent-bottle',
  },
  'Douro Valley': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Quinta%20do%20Panascal%20%28Fonseca%29%20%283913415008%29.jpg',
    label: 'Douro estate reference',
    kind: 'equivalent-estate',
  },
  Dao: {
    src: 'https://www.cvrdao.pt/media/1/MULTIMEDIA/FOTOS/image0.jpg',
    label: 'Dao reference',
    kind: 'equivalent-region',
  },
  Alentejo: {
    src: 'https://www.vinhosdoalentejo.pt/media/Topos/uvas6.jpg',
    label: 'Alentejo reference',
    kind: 'equivalent-region',
  },
  Swartland: {
    src: 'https://swartlandwineandolives.co.za/wp-content/uploads/2019/12/Swartland_FB_Banner_16.jpg',
    label: 'Swartland reference',
    kind: 'equivalent-region',
  },
  Stellenbosch: {
    src: 'https://wineroute.co.za/wp-content/uploads/2021/05/Asara-vineyardsand-mmountains-scaled-1.jpg',
    label: 'Stellenbosch reference',
    kind: 'equivalent-region',
  },
  'Vinho Verde': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Vinhas.jpg',
    label: 'Vinho Verde vineyard reference',
    kind: 'equivalent-region',
  },
  Marlborough: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Cloudy_Bay_Vineyard.jpg',
    label: 'Marlborough vineyard reference',
    kind: 'equivalent-estate',
  },
  'Awatere Valley': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Awatere_River.jpg',
    label: 'Awatere Valley reference',
    kind: 'equivalent-region',
  },
  'Wairau Valley': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Wairau_Valley_-_Marlborough.jpg',
    label: 'Wairau Valley reference',
    kind: 'equivalent-region',
  },
  'Central Otago': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Central%20Otago%20Wine.JPG',
    label: 'Central Otago regional reference',
    kind: 'equivalent-region',
  },
  'McLaren Vale': {
    src: 'https://mclarenvale.info/assets/slider/_1200x630_crop_center-center_82_none/SERIO-20190222-0730.jpeg',
    label: 'McLaren Vale regional reference',
    kind: 'equivalent-region',
  },
  Mendoza: {
    src: 'https://mendoza.tur.ar/uploads/2025/06/Vino-Mendoza.jpg',
    label: 'Mendoza vineyard reference',
    kind: 'equivalent-region',
  },
  'Lujan de Cuyo': {
    src: 'https://lujandecuyo.gob.ar/wp-content/uploads/2025/02/Lujan-de-Cuyo-capital-turistica-de-Mendoza-1080x675.jpeg',
    label: 'Lujan de Cuyo reference',
    kind: 'equivalent-region',
  },
  Barossa: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Yalumba_Winery.jpg',
    label: 'Barossa estate reference',
    kind: 'equivalent-estate',
  },
  'England (Sparkling)': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Ridgeview_and_Nyetimber.jpg',
    label: 'English sparkling reference',
    kind: 'equivalent-region',
  },
  Sauternes: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Yquem99.jpg',
    label: 'Sauternes bottle reference',
    kind: 'equivalent-bottle',
  },
  'Margaret River': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vasse%20felix.jpg',
    label: 'Margaret River estate reference',
    kind: 'equivalent-estate',
  },
  Languedoc: {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Picpoul%20de%20Pinet%20in%20glass.jpg',
    label: 'Languedoc bottle reference',
    kind: 'equivalent-bottle',
  },
  'Limoux AOC': {
    src: 'https://www.limoux-aoc.com/sites/default/files/styles/dsp_default_media/public/03_vins_4_1600x800px_sombre-optim.jpg',
    label: 'Limoux reference',
    kind: 'equivalent-region',
  },
  'Costieres de Nimes': {
    src: 'https://h1kiut.n0c.world/wp-content/uploads/Nimet3-27_web.jpg',
    label: 'Costieres de Nimes reference',
    kind: 'equivalent-region',
  },
  'Vallee du Paradis': {
    src: 'https://languedoc-wines.com/wp-content/uploads/2021/06/first.jpg',
    label: 'Vallee du Paradis reference',
    kind: 'equivalent-region',
  },
}

const COUNTRY_CATEGORY_VISUALS = {
  'Australia:red': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Yalumba_Winery.jpg',
    label: 'Australian estate reference',
    kind: 'equivalent-estate',
  },
  'Australia:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/CSIRO%20ScienceImage%2011621%20Vineyard.jpg',
    label: 'Australian vineyard reference',
    kind: 'equivalent-region',
  },
  'Austria:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Wachau%20%282%29.JPG',
    label: 'Austrian vineyard reference',
    kind: 'equivalent-region',
  },
  'Chile:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Concha%20Y%20Toro.jpg',
    label: 'Chilean estate reference',
    kind: 'equivalent-estate',
  },
  'Chile:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Concha%20Y%20Toro.jpg',
    label: 'Chilean estate reference',
    kind: 'equivalent-estate',
  },
  'France:white': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Puligny-Montrachet_bottle.jpg',
    label: 'French white bottle reference',
    kind: 'equivalent-bottle',
  },
  'France:sparkling': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Champagne%20Vineyards.jpg',
    label: 'French sparkling reference',
    kind: 'equivalent-region',
  },
  'France:red': {
    src: '/Margaux.jpeg',
    label: 'French red estate reference',
    kind: 'equivalent-estate',
  },
  'Georgia:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tbilvino%202.JPG',
    label: 'Georgian cellar reference',
    kind: 'equivalent-estate',
  },
  'Georgia:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Tbilvino%202.JPG',
    label: 'Georgian qvevri reference',
    kind: 'equivalent-estate',
  },
  'Germany:white': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Kiedrich_Weingut_Robert_Weil_Brunnen_und_Neubau.jpg',
    label: 'German estate reference',
    kind: 'equivalent-estate',
  },
  'Greece:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Old%20vines%20at%20Domaine%20Sigalas%20in%20Santorini%2C%20Greece.jpg',
    label: 'Santorini vineyard reference',
    kind: 'equivalent-region',
  },
  'Hungary:dessert': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Royal_Tokaji.jpg',
    label: 'Tokaji bottle reference',
    kind: 'equivalent-bottle',
  },
  'Italy:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hillside%20View%20of%20Valdobbiadene.jpg',
    label: 'Italian regional reference',
    kind: 'equivalent-region',
  },
  'Italy:red': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Conterno_barolo_cigalo.jpeg',
    label: 'Italian bottle reference',
    kind: 'equivalent-bottle',
  },
  'Italy:sparkling': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Hillside%20View%20of%20Valdobbiadene.jpg',
    label: 'Italian sparkling reference',
    kind: 'equivalent-region',
  },
  'Moldova:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinefield-rekash.jpg',
    label: 'Eastern European vineyard reference',
    kind: 'equivalent-region',
  },
  'New Zealand:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Central%20Otago%20Wine.JPG',
    label: 'New Zealand Pinot reference',
    kind: 'equivalent-region',
  },
  'New Zealand:white': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Cloudy_Bay_Vineyard.jpg',
    label: 'New Zealand white reference',
    kind: 'equivalent-estate',
  },
  'Portugal:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Quinta%20do%20Panascal%20%28Fonseca%29%20%283913415008%29.jpg',
    label: 'Portuguese regional reference',
    kind: 'equivalent-region',
  },
  'Portugal:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Quinta%20do%20Panascal%20%28Fonseca%29%20%283913415008%29.jpg',
    label: 'Portuguese regional reference',
    kind: 'equivalent-region',
  },
  'Romania:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinefield-rekash.jpg',
    label: 'Romanian vineyard reference',
    kind: 'equivalent-region',
  },
  'Romania:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinefield-rekash.jpg',
    label: 'Romanian vineyard reference',
    kind: 'equivalent-region',
  },
  'Bulgaria:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Vinefield-rekash.jpg',
    label: 'Balkan vineyard reference',
    kind: 'equivalent-region',
  },
  'South Africa:red': {
    src: 'https://www.wosa.co.za/Themes/Content%20Themes/WOSA/Templates/Images/home/WOSA-LaCiteDuVin-Banners-2023-06.jpg',
    label: 'South African regional reference',
    kind: 'equivalent-region',
  },
  'South Africa:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Klein%20Constantia%20wine%20farm%20-%20panoramio.jpg',
    label: 'South African estate reference',
    kind: 'equivalent-estate',
  },
  'Spain:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Haro%20-%20Bodegas%20Muga%201.JPG',
    label: 'Spanish winery reference',
    kind: 'equivalent-estate',
  },
  'Spain:sparkling': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Gramona-granja12.jpg',
    label: 'Spanish sparkling reference',
    kind: 'equivalent-bottle',
  },
  'Spain:white': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Gramona-granja12.jpg',
    label: 'Spanish white reference',
    kind: 'equivalent-bottle',
  },
  'UK:sparkling': {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Ridgeview_and_Nyetimber.jpg',
    label: 'English sparkling reference',
    kind: 'equivalent-region',
  },
  'USA:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/DSC25017%2C%20Domaine%20Carneros%20Vineyards%20%26%20Winery%2C%20Sonoma%20Valley%2C%20California%2C%20USA.jpg',
    label: 'California winery reference',
    kind: 'equivalent-region',
  },
  'USA:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/DSC25017%2C%20Domaine%20Carneros%20Vineyards%20%26%20Winery%2C%20Sonoma%20Valley%2C%20California%2C%20USA.jpg',
    label: 'California winery reference',
    kind: 'equivalent-region',
  },
  'United States:red': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/DSC25017%2C%20Domaine%20Carneros%20Vineyards%20%26%20Winery%2C%20Sonoma%20Valley%2C%20California%2C%20USA.jpg',
    label: 'California winery reference',
    kind: 'equivalent-region',
  },
  'United States:white': {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/DSC25017%2C%20Domaine%20Carneros%20Vineyards%20%26%20Winery%2C%20Sonoma%20Valley%2C%20California%2C%20USA.jpg',
    label: 'California winery reference',
    kind: 'equivalent-region',
  },
}

function normalise(value = '') {
  return String(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2010\u2011\u2012\u2013\u2014]/g, '-')
    .toLowerCase()
    .trim()
}

function canonicalCountry(country = '') {
  const key = normalise(country)
  const aliases = {
    uk: 'UK',
    'united kingdom': 'UK',
    england: 'UK',
    usa: 'USA',
    'united states': 'United States',
  }
  return aliases[key] || String(country).trim()
}

function normaliseRegionFamily(region, country = '') {
  const key = normalise(region)
  if (!key) return ''

  if (key.includes('grand cru') && key.includes('champagne')) return 'Grand Cru Champagne'
  if (key.includes('epernay')) return 'Epernay'
  if (key.includes('chateauneuf')) return 'Chateauneuf-du-Pape'
  if (key.includes('montee de tonnerre')) return 'Montee de Tonnerre'
  if (key.includes('premier cru') && key.includes('chablis')) return 'Chablis Premier Cru'
  if (key.includes('chablis')) return 'Chablis'
  if (key.includes('south of france')) return "Pays d'Oc"
  if (key.includes('pays d\'oc') || key.includes('pays doc')) return "Pays d'Oc"
  if (key.includes('picpoul')) return 'Picpoul de Pinet'
  if (key.includes('cotes de provence') || key.includes('cote de provence')) return 'Cotes de Provence'
  if (key.includes('pouilly-fuisse') || key.includes('pouilly fuisse')) return 'Pouilly-Fuisse'
  if (key.includes('maconnais') || key.includes('macon')) return 'Maconnais'
  if (key.includes('cote de beaune')) return 'Cote de Beaune'
  if (key.includes('montagny')) return 'Montagny'
  if (key.includes('saint-estephe') || key.includes('saint estephe')) return 'Saint-Estephe'
  if (key.includes('morgon')) return 'Morgon'
  if (key.includes('fleurie')) return 'Fleurie'
  if (key.includes('beaujolais')) return 'Beaujolais'
  if (key.includes('saint-emilion')) return 'Saint-Emilion'
  if (key.includes('sauternes')) return 'Sauternes'
  if (key.includes('vallee du paradis')) return 'Vallee du Paradis'
  if (key.includes('limoux')) return 'Limoux AOC'
  if (key.includes('amarone') || key.includes('valpolicella')) return 'Amarone & Valpolicella'
  if (key.includes('vinho verde')) return 'Vinho Verde'
  if (key.includes('champagne')) return 'Champagne'
  if (key.includes('cava')) return 'Cava'
  if (key.includes('bordeaux') || key.includes('medoc') || key.includes('saint-emilion') || key.includes('haut-medoc') || key.includes('moulis') || key.includes('pessac') || key.includes('sauternes')) return 'Bordeaux'
  if (key.includes('burgundy') || key.includes('chablis') || key.includes('beaune') || key.includes('macon') || key.includes('pouilly-fuisse') || key.includes('pouilly fuisse') || key.includes('montagny') || key.includes('beaune') || key.includes('hautes-cotes')) return 'Burgundy & Beaujolais'
  if (key.includes('beaujolais') || key.includes('morgon') || key.includes('regnie') || key.includes('moulin-a-vent')) return 'Burgundy & Beaujolais'
  if (key.includes('sancerre') || key.includes('pouilly-fume') || key.includes('loire') || key.includes('saumur') || key.includes('anjou')) return 'Loire Valley'
  if (key.includes('rhone') || key.includes('chateauneuf') || key.includes('cotes du rhone') || key.includes('cote rotie') || key.includes('condrieu')) return 'Rhone Valley'
  if (key.includes('provence') || key.includes('luberon')) return 'Provence'
  if (key.includes('alsace')) return 'Alsace'
  if (key.includes('rioja alta')) return 'Rioja Alta'
  if (key.includes('rioja')) return 'Rioja'
  if (key.includes('ribera del duero')) return 'Ribera del Duero'
  if (key.includes('wachau')) return 'Wachau'
  if (key.includes('chianti classico')) return 'Chianti Classico'
  if (key.includes('tuscany') || key.includes('chianti') || key.includes('maremma') || key.includes('toscana')) return 'Tuscany'
  if (key.includes('gavi')) return 'Gavi'
  if (key.includes('manduria')) return 'Manduria'
  if (key.includes('venezie doc')) return 'Venezie DOC'
  if (key.includes('delle venezie') || key.includes('venezie doc')) return 'Delle Venezie'
  if (key.includes('soave')) return 'Soave Classico'
  if (key.includes('piedmont') || key.includes('barolo') || key.includes('langhe') || key.includes('gavi')) return 'Piedmont'
  if (key.includes('prosecco')) return 'Prosecco DOC'
  if (key.includes('veneto') || key.includes('prosecco') || key.includes('valdobbiadene') || key.includes('ripasso') || key.includes('amarone') || key.includes('soave')) return 'Veneto'
  if (key.includes('dao')) return 'Dao'
  if (key.includes('alentejo')) return 'Alentejo'
  if (key.includes('swartland')) return 'Swartland'
  if (key.includes('stellenbosch')) return 'Stellenbosch'
  if (key.includes('douro') || key.includes('vinho verde') || key.includes('dao') || key.includes('alentejo')) return 'Douro Valley'
  if (key.includes('awatere')) return 'Awatere Valley'
  if (key.includes('wairau')) return 'Wairau Valley'
  if (key.includes('marlborough')) return 'Marlborough'
  if (key.includes('central otago')) return 'Central Otago'
  if (key.includes('mclaren vale')) return 'McLaren Vale'
  if (key.includes('lujan de cuyo')) return 'Lujan de Cuyo'
  if (key.includes('mendoza') || key.includes('uco')) return 'Mendoza'
  if (key.includes('barossa') || key.includes('mclaren vale')) return 'Barossa'
  if (key.includes('hampshire')) return 'Hampshire'
  if (key.includes('sussex')) return 'Sussex'
  if (key.includes('hampshire') || key.includes('english') || key.includes('southern england') || key.includes('sussex')) return 'England (Sparkling)'
  if (key.includes('margaret river')) return 'Margaret River'
  if (key.includes('costieres de nimes') || key.includes('costieres-de-nimes')) return 'Costieres de Nimes'
  if (key.includes('languedoc') || key.includes('picpoul')) return 'Languedoc'
  if (key.includes('santorini') || key.includes('assyrtiko')) return 'Santorini'

  const countryKey = normalise(country)
  if (countryKey === 'england' || countryKey === 'uk' || countryKey === 'united kingdom') return 'England (Sparkling)'
  return ''
}

function classifyDirectImage(src = '') {
  const key = normalise(src)
  if (!key) return 'bottle'
  if (key.includes('logo') || key.endsWith('.svg') || key.includes('seeklogo')) return 'producer-mark'
  if (
    key.includes('vineyard') ||
    key.includes('winery') ||
    key.includes('estate') ||
    key.includes('valley') ||
    key.includes('farm') ||
    key.includes('chateau') ||
    key.includes('hillside') ||
    key.includes('pass') ||
    key.includes('view') ||
    key.includes('villa') ||
    key.includes('country house')
  ) return 'estate'
  return 'bottle'
}

function findProducerEquivalent(wine) {
  const haystack = normalise(`${wine.producer || ''} ${wine.name || ''}`)
  return PRODUCER_VISUALS.find(entry => entry.test.test(haystack)) || null
}

function findEquivalentVisual(wine) {
  const producerMatch = findProducerEquivalent(wine)
  if (producerMatch) return producerMatch

  const family = normaliseRegionFamily(
    `${wine.subregion || ''} ${wine.region || ''}`.trim(),
    wine.country
  )
  if (family && REGION_VISUALS[family]) return REGION_VISUALS[family]

  const countryKey = canonicalCountry(wine.country)
  const categoryKey = `${countryKey}:${wine.category}`
  if (COUNTRY_CATEGORY_VISUALS[categoryKey]) return COUNTRY_CATEGORY_VISUALS[categoryKey]

  return null
}

function buildEquivalentSummary(wine, visual) {
  if (visual.kind === 'equivalent-bottle') {
    return `Retailer-exclusive listing, so the guide uses ${visual.label.toLowerCase()} instead of the shop logo.`
  }
  if (visual.kind === 'equivalent-estate') {
    return `Retailer-exclusive listing, so this switches to ${visual.label.toLowerCase()} rather than showing store branding.`
  }
  return `Retailer-exclusive listing, so this uses ${visual.label.toLowerCase()} as an honest visual stand-in.`
}

export function isRetailerAsset(src = '') {
  return RETAILER_ASSET_HINTS.some(hint => String(src).includes(hint))
}

export function getWineVisual(wine) {
  const src = String(wine?.labelImage || '')
  if (!src) return null

  if (!isRetailerAsset(src)) {
    const kind = classifyDirectImage(src)
    return {
      src,
      alt: `${wine.name} visual`,
      kind,
      isEquivalent: false,
    }
  }

  const equivalent = findEquivalentVisual(wine)
  if (!equivalent) return null

  return {
    src: equivalent.src,
    alt: `${wine.name} equivalent visual`,
    kind: equivalent.kind,
    label: equivalent.label,
    isEquivalent: true,
  }
}

export function getWineVisualTreatment(wine) {
  const visual = getWineVisual(wine)
  if (!visual) {
    return {
      badge: 'Cellar pick',
      shortBadge: 'Guide',
      kicker: 'Cellar visual',
      title: 'Wine portrait',
      summary: 'Ready for a more visual feature treatment.',
      note: 'A visual anchor for this bottle in the guide.',
    }
  }

  if (visual.isEquivalent) {
    const summary = buildEquivalentSummary(wine, visual)
    const shared = {
      summary,
      note: summary,
      shortBadge: 'Equivalent',
    }
    if (visual.kind === 'equivalent-bottle') {
      return {
        ...shared,
        badge: 'Equivalent bottle',
        kicker: 'Equivalent bottle',
        title: 'Producer-led stand-in',
      }
    }
    if (visual.kind === 'equivalent-estate') {
      return {
        ...shared,
        badge: 'Equivalent estate',
        kicker: 'Equivalent estate',
        title: 'Estate reference',
      }
    }
    return {
      ...shared,
      badge: 'Equivalent region',
      kicker: 'Equivalent region',
      title: 'Regional reference',
    }
  }

  if (visual.kind === 'producer-mark') {
    return {
      badge: 'Producer mark',
      shortBadge: 'Producer',
      kicker: 'Producer visual',
      title: 'House mark',
      summary: 'A producer-led visual that keeps the bottle tied to the winery rather than a retailer.',
      note: 'A producer-led visual that keeps the bottle tied to the winery rather than a retailer.',
    }
  }

  if (visual.kind === 'estate') {
    return {
      badge: 'Estate image',
      shortBadge: 'Estate',
      kicker: 'Estate visual',
      title: 'Place and producer',
      summary: 'A winery, vineyard, or producer-led image that adds place and atmosphere.',
      note: 'This image leans into winery, vineyard, or producer identity to give the wine more sense of origin.',
    }
  }

  return {
    badge: 'Bottle label',
    shortBadge: 'Bottle',
    kicker: 'Bottle visual',
    title: 'Label focus',
    summary: 'A stronger bottle-led visual that gives this wine real shelf presence.',
    note: 'A bottle-led image that gives this wine strong visual identity in the guide.',
  }
}
