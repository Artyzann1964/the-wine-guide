// Venue wine lists harvested from provided/public sources.
// Keep IDs aligned with src/pages/Sheffield.jsx venue IDs.

export const venueWineLists = {
  "hawksmoor-air-street": {
    "source": "Hawksmoor Air Street wine list PDF from official site",
    "sourceUrl": "https://thehawksmoor.com/wp-content/uploads/2025/12/AS-WINE-291225-BJ.pdf",
    "checkedOn": "2026-03-13",
    "priceNote": "By-the-glass prices and bottle prices taken from the Air Street wine PDF. Wines and vintages may vary at venue.",
    "items": [
      { "name": "Prosecco Superiore Spumante Asolo DOCG, Ca’ Morlin NV", "price": 59, "category": "sparkling", "country": "Italy", "region": "Veneto", "page": 2, "note": "Also £11 by the glass (125ml)" },
      { "name": "Classic Cuvée Brut, Culver, Langham Wine Estate NV", "price": 96, "category": "sparkling", "country": "England", "region": "Dorset", "page": 2, "note": "Also £16 by the glass (125ml)" },
      { "name": "Rosé Brut, Rathfinny Wine Estate 2019", "price": 99, "category": "sparkling-rosé", "country": "England", "region": "Sussex", "page": 2, "note": "Also £17 by the glass (125ml)" },
      { "name": "Champagne Brut Réserve, Charles Heidsieck NV", "price": 120, "category": "sparkling", "country": "France", "region": "Champagne", "page": 2, "note": "Also £20 by the glass (125ml)" },

      { "name": "Luberon Rosé, Famille Perrin 2024", "price": 49, "category": "rosé", "country": "France", "region": "Southern Rhône", "page": 2, "note": "Also £9 / £12 by the glass (125ml / 175ml)" },
      { "name": "Coteaux d’Aix-en-Provence Rosé, Château Beaulieu 2024", "price": 69, "category": "rosé", "country": "France", "region": "Provence", "page": 2, "note": "Also £12 / £17 by the glass (125ml / 175ml)" },

      { "name": "Vinho Verde, Loureiro / Alvarinho, Quinta de Azevedo 2024", "price": 46, "category": "white", "country": "Portugal", "region": "Minho", "page": 2, "note": "Also £8 / £11 by the glass (125ml / 175ml)" },
      { "name": "Riesling Feinherb, Generations, Axel Pauly 2024", "price": 55, "category": "white", "country": "Germany", "region": "Mosel", "page": 2, "note": "Also £9 / £13 by the glass (125ml / 175ml)" },
      { "name": "Sauvignon Blanc, Framingham 2024", "price": 64, "category": "white", "country": "New Zealand", "region": "Marlborough", "page": 2, "note": "Also £11 / £15 by the glass (125ml / 175ml)" },
      { "name": "Bourgogne Chardonnay, Les Ursulines, Jean-Claude Boisset 2024", "price": 69, "category": "white", "country": "France", "region": "Burgundy", "page": 2, "note": "Also £12 / £16 by the glass (125ml / 175ml)" },
      { "name": "Soave Classico, Calvarino, Pieropan 2023", "price": 84, "category": "white", "country": "Italy", "region": "Veneto", "page": 2, "note": "Also £14 / £20 by the glass (125ml / 175ml)" },
      { "name": "Valdeorras Godello, Louro Do Bolo, Rafael Palacios 2023", "price": 94, "category": "white", "country": "Spain", "region": "Galicia", "page": 2, "note": "Also £16 / £22 by the glass (125ml / 175ml)" },
      { "name": "Chardonnay, Russian River Valley, De Loach 2022", "price": 99, "category": "white", "country": "United States", "region": "California", "page": 2, "note": "Also £17 / £23 by the glass (125ml / 175ml)" },

      { "name": "Vinho Tinto, Hawksmoor x La Rosa, Quinta de la Rosa 2023", "price": 49, "category": "red", "country": "Portugal", "region": "Douro", "page": 3, "note": "Also £9 / £13 by the glass (125ml / 175ml)" },
      { "name": "Ribera del Duero, Hawksmoor x Telmo Rodriguez 2024", "price": 66, "category": "red", "country": "Spain", "region": "Ribeira", "page": 3, "note": "Also £11 / £16 by the glass (125ml / 175ml)" },
      { "name": "Malbec, Hawksmoor Blend, Pulenta Estate 2023", "price": 69, "category": "red", "country": "Argentina", "region": "Mendoza", "page": 3, "note": "Also £14 / £17 by the glass (125ml / 175ml)" },
      { "name": "Cabernet Sauvignon, Hawksmoor x Hartenberg 2024", "price": 72, "category": "red", "country": "South Africa", "region": "Stellenbosch", "page": 3, "note": "Also £12 / £17 by the glass (125ml / 175ml)" },
      { "name": "Bourgogne Pinot Noir, Vieilles Vignes, Philippe le Hardi 2023", "price": 79, "category": "red", "country": "France", "region": "Burgundy", "page": 3, "note": "Also £14 / £19 by the glass (125ml / 175ml)" },
      { "name": "Rioja Gran Reserva, Coto de Imaz 2018", "price": 86, "category": "red", "country": "Spain", "region": "Rioja Alavesa", "page": 3, "note": "Also £15 / £21 by the glass (125ml / 175ml)" },
      { "name": "Cabernet Sauvignon, Lodi, No Fine Print 2023", "price": 92, "category": "red", "country": "United States", "region": "California", "page": 3, "note": "Also £15 / £21 by the glass (125ml / 175ml)" },
      { "name": "Chianti Classico, Fontodi 2022", "price": 98, "category": "red", "country": "Italy", "region": "Tuscany", "page": 3, "note": "Also £18 / £24 by the glass (125ml / 175ml)" },
      { "name": "Pinot Noir, Danbury Ridge 2023", "price": 120, "category": "red", "country": "England", "region": "Essex", "page": 3, "note": "Also £20 / £28 by the glass (125ml / 175ml)" },
      { "name": "Saint-Julien, M de Moulin Riche, Château Moulin Riche 2017", "price": 120, "category": "red", "country": "France", "region": "Bordeaux", "page": 3, "note": "Also £20 / £28 by the glass (125ml / 175ml)" },
      { "name": "Barolo La Morra, Corino Giovanni di Corino Giuliano 2021", "price": 145, "category": "red", "country": "Italy", "region": "Piedmont", "page": 3, "note": "Also £25 / £34 by the glass (125ml / 175ml)" },
      { "name": "Amarone della Valpolicella Classico, Sant’Urbano, Speri 2020", "price": 145, "category": "red", "country": "Italy", "region": "Veneto", "page": 3, "note": "Also £25 / £34 by the glass (125ml / 175ml)" },
      { "name": "Rioja Gran Reserva, Imperial, C.V.N.E. 2015", "price": 146, "category": "red", "country": "Spain", "region": "Rioja", "page": 3, "note": "Also £24 / £35 by the glass (125ml / 175ml)" },
      { "name": "Chateauneuf du Pape, Signature, Domaine La Barroche 2022", "price": 150, "category": "red", "country": "France", "region": "Rhone", "page": 3, "note": "Also £25 / £35 by the glass (125ml / 175ml)" }
    ]
  },
  "domo-vino": {
    "source": "DOMO Vino wine list PDF shared by user",
    "sourceUrl": "https://ef2b59f3-dcd1-4417-ace0-48a9254fd1d2.filesusr.com/ugd/6c60c6_c4b8c25fac464a1dbeb7816f4a4ff8e6.pdf",
    "checkedOn": "2026-03-13",
    "priceNote": "Bottle prices from the DOMO Vino PDF. Many wines are also offered by the glass on the menu.",
    "items": [
      { "name": "Aragosta, Vermentino di Sardegna DOC, Cantina Santa Maria La Palma", "price": 27.5, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Isola del Sole Bianco, Isola dei Nuraghi IGT, Argiolas", "price": 31.25, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "S'elegas, Nuragus di Cagliari DOC, Argiolas", "price": 35, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Akénta Cuvée 71, Vermentino di Sardegna DOC, Cantina Santa Maria La Palma", "price": 35, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Costamolino, Vermentino di Sardegna DOC, Argiolas", "price": 38.5, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Is Argiolas, Vermentino di Sardegna DOC, Argiolas", "price": 42.5, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Iselis, Nasco di Cagliari DOC, Argiolas", "price": 45.5, "category": "white", "country": "Italy", "region": "Sardinia", "page": 4 },
      { "name": "Kebrilla, Organic Grillo DOC, Fina", "price": 28, "category": "white", "country": "Italy", "region": "Sicily", "page": 5 },
      { "name": "Pecorino Terre di Chieti IGP, Colle Cavalieri, Cantina Tollo", "price": 32.5, "category": "white", "country": "Italy", "region": "Abruzzo", "page": 5 },
      { "name": "Gavi DOCG, Dezzani", "price": 38, "category": "white", "country": "Italy", "region": "Piedmont", "page": 5 },
      { "name": "Lugana DOC, San Benedetto, Zenato", "price": 39.5, "category": "white", "country": "Italy", "region": "Veneto", "page": 5 },

      { "name": "Isola del Sole Rosso, Isola dei Nuraghi IGT, Argiolas", "price": 31.25, "category": "red", "country": "Italy", "region": "Sardinia", "page": 6 },
      { "name": "Perdera, Monica di Sardegna DOC, Argiolas", "price": 35, "category": "red", "country": "Italy", "region": "Sardinia", "page": 6 },
      { "name": "Cardanera, Carignano del Sulcis, Argiolas", "price": 39.5, "category": "red", "country": "Italy", "region": "Sardinia", "page": 6 },
      { "name": "Costera, Cannonau di Sardegna, Argiolas", "price": 40, "category": "red", "country": "Italy", "region": "Sardinia", "page": 6 },
      { "name": "Turriga, Isola dei Nuraghi IGT 2019, Argiolas", "price": 130, "category": "red", "country": "Italy", "region": "Sardinia", "page": 6 },
      { "name": "Montepulciano Rubi DOP, Colle Secco, Cantina Tollo", "price": 31.5, "category": "red", "country": "Italy", "region": "Abruzzo", "page": 7 },
      { "name": "Borgone, Organic IGT, Camigliano", "price": 35, "category": "red", "country": "Italy", "region": "Tuscany", "page": 7 },
      { "name": "Appassimento DOC, Dezzani", "price": 34, "category": "red", "country": "Italy", "region": "Piedmont", "page": 7 },
      { "name": "Aglianico del Vulture DOC, D'Angelo", "price": 36, "category": "red", "country": "Italy", "region": "Basilicata", "page": 7 },
      { "name": "Barbera d'Alba DOC, Paolina, Ca' del Baio", "price": 39, "category": "red", "country": "Italy", "region": "Piedmont", "page": 7 },
      { "name": "Salice Salentino DOC, Riserva 50 Vendemmia, Leone de Castris", "price": 42, "category": "red", "country": "Italy", "region": "Puglia", "page": 7 },
      { "name": "Valpolicella Ripasso DOC Superiore Ripassa, Zenato", "price": 57.5, "category": "red", "country": "Italy", "region": "Veneto", "page": 8 },
      { "name": "A.D. 1212, Umbria Rosso IGT 2020, Decugnano dei Barbi", "price": 59, "category": "red", "country": "Italy", "region": "Umbria", "page": 8 },
      { "name": "Amarone Classico della Valpolicella DOCG 2019, Zenato", "price": 90, "category": "red", "country": "Italy", "region": "Veneto", "page": 8 },
      { "name": "Barolo DOCG Monfalletto 2020, Cordero di Montezemolo", "price": 115, "category": "red", "country": "Italy", "region": "Piedmont", "page": 8 },

      { "name": "Aragosta Alghero DOC Rosato, Cantina Santa Maria La Palma", "price": 27.5, "category": "rosé", "country": "Italy", "region": "Sardinia", "page": 9 },
      { "name": "Serra Lori IGT, Isola dei Nuraghi, Argiolas", "price": 33.5, "category": "rosé", "country": "Italy", "region": "Sardinia", "page": 9 },

      { "name": "Akénta Sparkling Extra Dry, Vermentino di Sardegna, Cantina Santa Maria La Palma", "price": 35, "category": "sparkling", "country": "Italy", "region": "Sardinia", "page": 9 },
      { "name": "Prosecco Treviso DOC Extra Dry, Colli del Soligo", "price": 29.5, "category": "sparkling", "country": "Italy", "region": "Veneto", "page": 9 },
      { "name": "Prosecco Rosé Treviso DOC, Colli del Soligo", "price": 32, "category": "sparkling-rosé", "country": "Italy", "region": "Veneto", "page": 9 }
    ]
  },
  "gill-and-co": {
    "source": "Gill & Co Wine List February 2026 (PDF uploaded to public folder)",
    "sourceUrl": "/Gills & Co Wine List February 2026.pdf",
    "checkedOn": "2026-03-05",
    "priceNote": "Bottle prices from venue PDF.",
    "items": [
      {
        "name": "Bodegas Colome, Salta, 2024",
        "price": 31.0,
        "category": "white",
        "country": "Argentina",
        "page": 3
      },
      {
        "name": "Norton, Altura Malbec, 2023",
        "price": 38.0,
        "category": "red",
        "country": "Argentina",
        "page": 3
      },
      {
        "name": "Luca, Old Vine Malbec, 2006",
        "price": 52.0,
        "category": "red",
        "country": "Argentina",
        "page": 3
      },
      {
        "name": "Pulenta, X Gran Malbec, 2020",
        "price": 63.0,
        "category": "red",
        "country": "Argentina",
        "page": 3
      },
      {
        "name": "Pulenta, Naranjo, 2024",
        "price": 38.0,
        "category": "orange",
        "country": "Argentina",
        "page": 3
      },
      {
        "name": "Armas, Voskehat, 2022",
        "price": 33.0,
        "category": "white",
        "country": "Armenia",
        "page": 3
      },
      {
        "name": "Langmeil, Wattle Bay Riesling, 2024",
        "price": 37.0,
        "category": "white",
        "country": "Australia",
        "page": 3
      },
      {
        "name": "Soumah, Hexham Viognier, 2023",
        "price": 57.0,
        "category": "white",
        "country": "Australia",
        "page": 3
      },
      {
        "name": "Langmeil, Three Gardens Viognier, 2020",
        "price": 35.0,
        "category": "white",
        "country": "Australia",
        "page": 3
      },
      {
        "name": "Lone Palm, Old Vine Grenache, 2022",
        "price": 36.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Langmeil, Three Gardens Grenache, 2022",
        "price": 36.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Montara, Shiraz, 1998",
        "price": 50.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Mitolo, Shiraz, 2002",
        "price": 85.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Kalleske Greenock, Shiraz",
        "price": 98.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Hobbs, Gregor Shiraz, 2005",
        "price": 99.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Mazza, Geographe, 2016",
        "price": 43.0,
        "category": "red",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Chambers Rosewood, Rutherglen Muscat (375ml)",
        "price": 27.0,
        "category": "dessert",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Hobbs, Semillon, 2005 (375ml)",
        "price": 33.0,
        "category": "dessert",
        "country": "Australia",
        "page": 4
      },
      {
        "name": "Vitikultur Moser, Gruner Veltliner, 2023",
        "price": 34.0,
        "category": "white",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Loimer, Gruner Veltliner, 2024",
        "price": 38.0,
        "category": "white",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Anton Bauer, Zweigelt, 2018",
        "price": 32.0,
        "category": "red",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Anton Bauer, 'Reserve' Blaufränkisch, 2018",
        "price": 70.0,
        "category": "red",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Heidi Schröck & Söhne, Junge Löwen Blaufränkisch 2018",
        "price": 46.0,
        "category": "red",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Zero G, Zero-GMT, 2021",
        "price": 39.0,
        "category": "orange",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Loimer, Extra Brut Reserve, NV",
        "price": 80.0,
        "category": "sparkling",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Loimer, Brut Rose Reserve, NV",
        "price": 80.0,
        "category": "sparkling-rosé",
        "country": "Austria",
        "page": 5
      },
      {
        "name": "Genoels Elderen, Gold Label Chardonnay, 2019",
        "price": 60.0,
        "category": "white",
        "country": "Belgium",
        "page": 5
      },
      {
        "name": "Estate Koshava, Gamza Cabernet Franc, 2023",
        "price": 35.0,
        "category": "red",
        "country": "Bulgaria",
        "page": 5
      },
      {
        "name": "Pillitteri, Riesling Icewine, 2017",
        "price": 70.0,
        "category": "dessert",
        "country": "Canada",
        "page": 6
      },
      {
        "name": "Morande, Gewurztraminer, 2023",
        "price": 29.0,
        "category": "white",
        "country": "Chile",
        "page": 6
      },
      {
        "name": "Vina Tabali, Sauvignon Blanc, 2023",
        "price": 38.0,
        "category": "white",
        "country": "Chile",
        "page": 6
      },
      {
        "name": "Vina Tabali, Micas Peumo Carmenere, 2023",
        "price": 38.0,
        "category": "red",
        "country": "Chile",
        "page": 6
      },
      {
        "name": "Morande, Late Harvest Sauvignon Blanc, 2023",
        "price": 25.0,
        "category": "dessert",
        "country": "Chile",
        "page": 6
      },
      {
        "name": "Fei Tswei, Magma Chardonnay, 2021",
        "price": 31.0,
        "category": "white",
        "country": "China",
        "page": 6
      },
      {
        "name": "Fei Tswei, Cellared Marselan, 2019",
        "price": 34.0,
        "category": "red",
        "country": "China",
        "page": 6
      },
      {
        "name": "Fei Tswei, Cellared Merlot, 2019",
        "price": 34.0,
        "category": "red",
        "country": "China",
        "page": 6
      },
      {
        "name": "Simpsons Wine Estate, Derringstone, 2023",
        "price": 39.0,
        "category": "white",
        "country": "England",
        "page": 7
      },
      {
        "name": "Simpsons Wine Estate, Rabbit Hole, 2023",
        "price": 45.0,
        "category": "red",
        "country": "England",
        "page": 7
      },
      {
        "name": "Simpsons Wine Estate, Railway Hill, Rosé, 2023",
        "price": 37.0,
        "category": "rosé",
        "country": "England",
        "page": 7
      },
      {
        "name": "Simpsons Wine Estate, Chalklands Classic Cuvee, Brut, NV",
        "price": 47.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Roebuck Estates, Classic Cuvee, 2018",
        "price": 59.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Simpsons Wine Estate, White Cliffs, Blanc de Blanc, 2019",
        "price": 63.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Roebuck Estates, Blanc de Noirs, 2018",
        "price": 69.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Gusbourne Estates, Brut Reserve, 2021",
        "price": 66.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Gusbourne Estates, Blanc de Blanc, 2019",
        "price": 71.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Roebuck Estates, Rare Expressions No19, 2015",
        "price": 112.0,
        "category": "sparkling",
        "country": "England",
        "page": 7
      },
      {
        "name": "Simpsons Wine Estate, Canterbury Rosé, 2019",
        "price": 52.0,
        "category": "sparkling-rosé",
        "country": "England",
        "page": 7
      },
      {
        "name": "Roebuck Estates, Rosé de Noirs, 2017 / 2018",
        "price": 61.0,
        "category": "sparkling-rosé",
        "country": "England",
        "page": 7
      },
      {
        "name": "Gusbourne Estates, Rose, 2019",
        "price": 68.0,
        "category": "sparkling-rosé",
        "country": "England",
        "page": 7
      },
      {
        "name": "Domaine David Duband, Borgogne Aligote, 2020",
        "price": 45.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Domaine de la Motte, Chablis, 2023",
        "price": 42.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Domaine Laroche, Chablis 1er Cru L'Essence Des Climats",
        "price": 57.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Les Tessons Cailloux , Meursault, 2018",
        "price": 97.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Guillemard-Clerc, Puligny Montrachet La Rue Aux Vache",
        "price": 118.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Daniel Jarry, Vouvray, 2003",
        "price": 52.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Trimbach, Gewurztraminer, 2020",
        "price": 45.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Caves De Turckheim, Vieilles Vignes, Gewurztraminer",
        "price": 41.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Domaine Rolly Gassmann, Gewurztraminer, 2019",
        "price": 48.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Domaine Boutinot, La Fleur Solitaire, 2004",
        "price": 29.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Domaine du Haute Bourg, Cuvee Origine, 2014",
        "price": 37.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Château du Coing de St. Fiacre, Monnières Saint-Fiacre, 2018",
        "price": 64.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Villa Noria, La Serre, 2024",
        "price": 32.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Trimbach, Pinot Blanc, 2023",
        "price": 40.0,
        "category": "white",
        "country": "France",
        "page": 8
      },
      {
        "name": "Dopff au Moulin, Riesling, 2022/2023",
        "price": 35.0,
        "category": "white",
        "country": "France",
        "page": 9
      },
      {
        "name": "Domaine de Bel Air, Pouilly Fume, 2024",
        "price": 41.0,
        "category": "white",
        "country": "France",
        "page": 9
      },
      {
        "name": "Domaine Satuereau, Le Vignoble des Sarrottes",
        "price": 55.0,
        "category": "white",
        "country": "France",
        "page": 9
      },
      {
        "name": "La Demoiseelle, Sancerre, 2019",
        "price": 75.0,
        "category": "white",
        "country": "France",
        "page": 9
      },
      {
        "name": "Maison Boutinot, Cuvee Edalise Rose, 2023",
        "price": 32.0,
        "category": "rosé",
        "country": "France",
        "page": 9
      },
      {
        "name": "Chateau Minuty, M de Minuty, 2024",
        "price": 35.0,
        "category": "rosé",
        "country": "France",
        "page": 9
      },
      {
        "name": "Domaine Gayard, Braucol, 2022",
        "price": 30.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Bourgueil Les Brochoires, 2021",
        "price": 35.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Chateau Rivallon, Saint Emillion Grand Cru, 2022",
        "price": 40.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Chateau Giscours, 3eme Grand Cru Classe, 1980",
        "price": 132.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Chateau Giscours, 3eme Grand Cru Classe, 1995",
        "price": 139.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Bordeaux, Pauillac | Cabernet Sauvignon, Merlot, Cabernet Franc, Petit",
        "price": 115.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Bordeaux, Pauillac | Cabernet Sauvignon, Merlot, Cabernet Franc, Petit",
        "price": 118.0,
        "category": "red",
        "country": "France",
        "page": 9
      },
      {
        "name": "Bordeaux, Pauillac | Cabernet Sauvignon, Merlot, Cabernet Franc, Petit",
        "price": 122.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Chateau Batailley, Pauillac, 1995",
        "price": 150.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Margeaux de Chateau Margeaux, 2014",
        "price": 220.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Chateau Talbot, 2006",
        "price": 145.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Dominique Morel, Fleurie, 2024",
        "price": 36.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Jean Marc Burgaud, Morgan Les Charmes, 2023",
        "price": 39.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Domiane of the Bee, Bee-Side Grenache, 2023",
        "price": 41.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Mas Amil, Grenache, 2006",
        "price": 50.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Chateau La Sauvageonne, Terrasses du Larzac, 2017",
        "price": 75.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Château Maucoil, Chateauneuf Du Pape, 2022",
        "price": 76.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Telegramme, Chateauneuf Du Pape, 2002",
        "price": 71.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Chateau de Chambert, Cahors Malbec, 2017",
        "price": 45.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Chateau Beauvillars, Jean-Pierre Moueix Pomerol, 1991",
        "price": 72.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Boutinout France, Les Volets, 2023",
        "price": 25.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Domaine Hudelot, Nuits St George, 1996",
        "price": 114.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Domaine Tortochot, 1er Cru Les Champeaux, 2019",
        "price": 129.0,
        "category": "red",
        "country": "France",
        "page": 10
      },
      {
        "name": "Alsace | Auxerrois, Pinot Blanc",
        "price": 149.0,
        "category": "sparkling",
        "country": "France",
        "page": 11
      },
      {
        "name": "Champagne | Chardonnay",
        "price": 252.0,
        "category": "sparkling",
        "country": "France",
        "page": 11
      },
      {
        "name": "Laurent-Perrier La Cuvée NV",
        "price": 79.0,
        "category": "sparkling",
        "country": "France",
        "page": 11
      },
      {
        "name": "Collet, Collet Vintage, 2016",
        "price": 77.0,
        "category": "sparkling",
        "country": "France",
        "page": 11
      },
      {
        "name": "Bollinger, Special Cuvee, NV",
        "price": 85.0,
        "category": "sparkling",
        "country": "France",
        "page": 11
      },
      {
        "name": "Collet, Brut Rose, NV",
        "price": 75.0,
        "category": "sparkling-rosé",
        "country": "France",
        "page": 11
      },
      {
        "name": "Laurent-Perrier Cuvée Rosé, NV",
        "price": 120.0,
        "category": "sparkling-rosé",
        "country": "France",
        "page": 11
      },
      {
        "name": "Dom Perignon, Brut Rose, 2002 **20/20 Jancis Robinson MW",
        "price": 600.0,
        "category": "sparkling-rosé",
        "country": "France",
        "page": 11
      },
      {
        "name": "Chateau De L'Ou, Cotes Catalanes L'Orange de L'Ou, 2020",
        "price": 52.0,
        "category": "orange",
        "country": "France",
        "page": 11
      },
      {
        "name": "Domaine de Grange Neuve, 2021",
        "price": 30.0,
        "category": "dessert",
        "country": "France",
        "page": 11
      },
      {
        "name": "Dr Fischer, Steinbock, NV",
        "price": 26.0,
        "category": "dessert",
        "country": "Germany",
        "page": 12
      },
      {
        "name": "Axel Pauly, ‘Purist’ Mosel Riesling Kabinett Trocken, 2023",
        "price": 37.0,
        "category": "white",
        "country": "Germany",
        "page": 12
      },
      {
        "name": "Axel Pauly, ‘Generations’ Mosel Riesling Feinherb, 2024",
        "price": 46.0,
        "category": "white",
        "country": "Germany",
        "page": 12
      },
      {
        "name": "Axel Pauly, ‘Helden’ Mosel Riesling Trocken, 2023",
        "price": 71.0,
        "category": "white",
        "country": "Germany",
        "page": 12
      },
      {
        "name": "Markus Molitor, Alte Reben Saar Riesling, 2009",
        "price": 63.0,
        "category": "white",
        "country": "Germany",
        "page": 12
      },
      {
        "name": "Kovács Nimród, Battonage Chardonnay, 2023",
        "price": 60.0,
        "category": "white",
        "country": "Greece",
        "page": 12
      },
      {
        "name": "Eger | Chardonnay",
        "price": 38.0,
        "category": "white",
        "country": "Greece",
        "page": 12
      },
      {
        "name": "Puglia | Chardonnay",
        "price": 36.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Piedmont | Cortese",
        "price": 39.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Pieropan, La Rocca, 2023",
        "price": 57.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Pieropan, Soave Classico 2024",
        "price": 32.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Pieropan, Calvarino, 2023",
        "price": 45.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Cavit, Bottega Viani Nosiola, 2024",
        "price": 31.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Fantini, ‘Calalenta’ Pecorino Terre di Chieti, 2024",
        "price": 44.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Franz Haas, Dolomiti Pinot Grigio, 2024",
        "price": 34.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Edi Keber, Collio, 2021",
        "price": 52.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Tenuta Del Buonamico, Vermentino Vivi Toscana, 2022",
        "price": 33.0,
        "category": "white",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Braida, Bricco dell'Uccellone, 2018",
        "price": 87.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Azienda Francesco, Tornatore Etna Rosso, 2020",
        "price": 48.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "La Giuva, L'Aristide Amarone della Valpolicella, 2017",
        "price": 179.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Brolo Dei Giusti, Amarone Della Valpolicella, 2013",
        "price": 87.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Allegrini, Valpolicella, 2024",
        "price": 32.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Brolo Dei Giusti, Valpolicella Superior, 2017",
        "price": 55.0,
        "category": "red",
        "country": "Italy",
        "page": 13
      },
      {
        "name": "Azienda Virna di Borgogno, Barolo DOCG, Preda",
        "price": 74.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Azienda Virna di Borgogno, Barolo DOCG, Cannubi",
        "price": 78.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Azienda Virna di Borgogno, Barolo DOCG, Preda",
        "price": 89.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Marchesi di Grésy, Villa Martis Rosso Langhe, 2020",
        "price": 61.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Rosone, Negramaro, 2022",
        "price": 38.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Perta, Hebo, 2023",
        "price": 43.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "San Marzano, Anniversario 62, Primitivo, 2019",
        "price": 43.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Morella, La Signora Primitivo, 2010",
        "price": 153.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Fattoria Montellori, Poggio alla Luna Chianti, 2021",
        "price": 29.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Carpineto, Dogajolo Rosso, 2022",
        "price": 31.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Agricola Ficomtanino, Noble Kara, 2023",
        "price": 41.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "San Polo, Brunello Di Montalcino, 2019",
        "price": 95.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "San Polo, Brunello Di Montalcino, 2017",
        "price": 164.0,
        "category": "red",
        "country": "Italy",
        "page": 14
      },
      {
        "name": "Prunotto, Moscato d'Asti, 2024",
        "price": 35.0,
        "category": "sparkling",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "Cantina Tomaso Gianolio, Moscato d'Asti, 2022",
        "price": 35.0,
        "category": "sparkling",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "Cleto Chiarli, Lambrusco Grasparossa di Castelvetro, 2024",
        "price": 38.0,
        "category": "sparkling",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "L’Eremita, Recioto Della Valpolicella DOCG, (500ml)",
        "price": 62.0,
        "category": "dessert",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "All'Uovo, Marsala, 1950",
        "price": 47.0,
        "category": "dessert",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "Bonacchi, Vin Santo del Chianti, 2016",
        "price": 55.0,
        "category": "dessert",
        "country": "Italy",
        "page": 15
      },
      {
        "name": "Chateau Musar, 2012",
        "price": 121.0,
        "category": "red",
        "country": "Italy",
        "page": 16
      },
      {
        "name": "Chateau Musar, 2003",
        "price": 133.0,
        "category": "red",
        "country": "Italy",
        "page": 16
      },
      {
        "name": "Lani, Gewurztraminer, 2022",
        "price": 38.0,
        "category": "white",
        "country": "New Zealand",
        "page": 16
      },
      {
        "name": "Catalina Sounds, Sauvignon Blanc, 2022",
        "price": 35.0,
        "category": "white",
        "country": "New Zealand",
        "page": 16
      },
      {
        "name": "Greywacke, Wild Sauvignon, 2023",
        "price": 45.0,
        "category": "white",
        "country": "New Zealand",
        "page": 16
      },
      {
        "name": "Greywacke, Wild Sauvignon ARCHIVE, 2016",
        "price": 53.0,
        "category": "white",
        "country": "New Zealand",
        "page": 16
      },
      {
        "name": "Quinta da Lixa, Anjos, 2024",
        "price": 29.0,
        "category": "white",
        "country": "Portugal",
        "page": 17
      },
      {
        "name": "Dalia, Trac, 2022",
        "price": 40.0,
        "category": "white",
        "country": "Portugal",
        "page": 17
      },
      {
        "name": "Quercus, Pinot Grigio, 2024",
        "price": 28.0,
        "category": "white",
        "country": "Portugal",
        "page": 17
      },
      {
        "name": "Daschbosch, Mossiesdrift Steen, 2023",
        "price": 32.0,
        "category": "white",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Ken Forrester, FMC, 2024",
        "price": 70.0,
        "category": "white",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Bruce Jack Wines, Chenin Blanc Skin Contact ‘Off the",
        "price": 29.0,
        "category": "white",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Olifantsberg, Soul of the Mountain 'The Matriarch’, 2019",
        "price": 42.0,
        "category": "white",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Waterkloof, Circle of Life, 2023",
        "price": 32.0,
        "category": "red",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Bruce Jack Wines, Pinotage ‘Off the Charts’, 2023",
        "price": 29.0,
        "category": "red",
        "country": "South Africa",
        "page": 17
      },
      {
        "name": "Angel Seqeiros, Albarino, 2022",
        "price": 43.0,
        "category": "white",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Lagar de Pintos, 3000 Cepas, 2023",
        "price": 51.0,
        "category": "white",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "El Escocés Volante, Manga del Brujo Blanco, 2023",
        "price": 32.0,
        "category": "white",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Marques de Reinosa, Rioja Tempranillo Blanco Crianza",
        "price": 36.0,
        "category": "white",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Ontanon, Rioja Blanco, 2021",
        "price": 28.0,
        "category": "white",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Martin Codax, Cuatro Pasos, 2024",
        "price": 32.0,
        "category": "rosé",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Bodegas Borsao, Tres Picos Garnacha, 2023",
        "price": 37.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Finca Bacara, Time Waits For No One, 2021",
        "price": 28.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Ailalá, Souson, 2022",
        "price": 44.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Marques de Burgos, Robel, 2023",
        "price": 33.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Bodegas Lan, D-12, 2021",
        "price": 38.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Rippa Dorii, Ribera del Duero Salomon, 2021",
        "price": 44.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Bodega Arroyo, Ribera del Duero Gran Reserva, 2015",
        "price": 48.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Bodegas Lan, Rioja Gran Reserva, 2017",
        "price": 49.0,
        "category": "red",
        "country": "Spain",
        "page": 18
      },
      {
        "name": "Bodega Garzon, Reserve Albarino, 2024",
        "price": 36.0,
        "category": "white",
        "country": "Spain",
        "page": 19
      },
      {
        "name": "Bodega Garzon, Reserva Marselan, 2021",
        "price": 36.0,
        "category": "red",
        "country": "Spain",
        "page": 19
      },
      {
        "name": "Bodega Garzon, Reserva Tannat, 2022",
        "price": 37.0,
        "category": "red",
        "country": "Spain",
        "page": 19
      },
      {
        "name": "Bodega Garzon, Estate Pinot Rose de Corte, 2024",
        "price": 31.0,
        "category": "rosé",
        "country": "Spain",
        "page": 19
      },
      {
        "name": "De Loach, Heritage Chardonnay, 2022",
        "price": 34.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "J Lohr, Riverstone Chardonnay, 2022",
        "price": 38.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "Michael David, Freakshow Chardonnay, 2023",
        "price": 40.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "Orin Swift, Mannequin, 2022",
        "price": 63.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "Saintsbury Sangiacomo, Chardonnay, 2018",
        "price": 61.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "California, Monterey County | Riesling",
        "price": 35.0,
        "category": "white",
        "country": "USA",
        "page": 19
      },
      {
        "name": "California | Cabernet Sauvignon",
        "price": 121.0,
        "category": "red",
        "country": "USA",
        "page": 20
      },
      {
        "name": "California | Cabernet Sauvignon",
        "price": 153.0,
        "category": "red",
        "country": "USA",
        "page": 20
      },
      {
        "name": "California | Petite Sirah",
        "price": 72.0,
        "category": "red",
        "country": "USA",
        "page": 20
      },
      {
        "name": "Orin Swift, Machete, 2020",
        "price": 82.0,
        "category": "red",
        "country": "USA",
        "page": 20
      },
      {
        "name": "Ridge Vineyards, Paso Robles, 2009",
        "price": 144.0,
        "category": "red",
        "country": "USA",
        "page": 20
      },
      {
        "name": "California | Orange Muscat",
        "price": 47.0,
        "category": "dessert",
        "country": "USA",
        "page": 20
      }
    ]
  },
  "the-swan-walton": {
    "source": "The Swan at Walton wine menu page",
    "sourceUrl": "https://theswanatwalton.co.uk/menu/14",
    "checkedOn": "2026-03-05",
    "priceNote": "Prices are as shown on menu (some are by glass, some by bottle).",
    "items": [
      {
        "name": "Cinsault Jean Didier Rose",
        "price": 19.5,
        "category": "rosé",
        "country": "France"
      },
      {
        "name": "Zeno 0%",
        "price": 25.0,
        "category": "red"
      },
      {
        "name": "Peony Blush 0%",
        "price": 29.0,
        "category": "sparkling"
      },
      {
        "name": "Dry Dragon 0%",
        "price": 29.0,
        "category": "sparkling"
      },
      {
        "name": "Royal Flush 0%",
        "price": 29.0,
        "category": "sparkling"
      },
      {
        "name": "Pure",
        "price": 3.8,
        "category": "white"
      },
      {
        "name": "Whispering Angel",
        "price": 50.0,
        "category": "rosé",
        "country": "France",
        "stars": 4.1,
        "reviewSource": "Vivino community",
        "review": "Consistently praised for dry Provence style, strawberry-citrus fruit and easy food pairing."
      },
      {
        "name": "Rioja Vega Rioja Blanco",
        "price": 28.5,
        "category": "white",
        "country": "Spain"
      },
      {
        "name": "Pure Rose",
        "price": 4.1,
        "category": "rosé"
      },
      {
        "name": "Borsori Blush",
        "price": 3.5,
        "category": "rosé"
      },
      {
        "name": "Da Luca Brut",
        "price": 6.0,
        "category": "sparkling",
        "country": "Italy"
      },
      {
        "name": "Laurent Perrier Rose",
        "price": 82.0,
        "category": "sparkling",
        "country": "France",
        "country": "France"
      },
      {
        "name": "Dom Perignon",
        "price": 199.0,
        "category": "sparkling",
        "country": "France",
        "country": "France",
        "stars": 4.5,
        "reviewSource": "Vivino community",
        "review": "Prestige Champagne profile with fine mousse, brioche complexity and long mineral finish.",
        "libraryWineId": "dom-perignon-2013"
      },
      {
        "name": "Veuve Clicquot NV",
        "price": 62.0,
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Da Luca Rose",
        "price": 31.5,
        "category": "sparkling",
        "country": "Italy"
      },
      {
        "name": "Martini - Extra Dry",
        "price": 3.5,
        "category": "fortified",
        "country": "Italy"
      },
      {
        "name": "Martini - Rosso",
        "price": 3.5,
        "category": "fortified",
        "country": "Italy"
      },
      {
        "name": "Martini - Bianco",
        "price": 3.5,
        "category": "fortified",
        "country": "Italy"
      },
      {
        "name": "Martini Fiero",
        "price": 4.5,
        "category": "fortified",
        "country": "Italy"
      },
      {
        "name": "Lautarul Pinot Noir",
        "price": 4.6,
        "category": "red",
        "country": "Romania"
      },
      {
        "name": "Santa Rosa Malbec",
        "price": 4.3,
        "category": "red",
        "country": "Argentina"
      },
      {
        "name": "Pitchfork Shiraz",
        "price": 4.6,
        "category": "red",
        "country": "Australia"
      },
      {
        "name": "Jean Didier Grenache-Carignan",
        "price": 4.7,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Bodegas Muerza Rioja Tempranillo",
        "price": 4.7,
        "category": "red",
        "country": "Spain"
      },
      {
        "name": "Le Charme Merlot",
        "price": 27.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "De Visu 223 Grenache",
        "price": 27.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Coquille de Terre Carignan",
        "price": 28.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Les Argelières Cabernet Franc",
        "price": 28.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Le Professeur Marselan",
        "price": 29.5,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Bodegas Muerza Rioja Crianza",
        "price": 30.0,
        "category": "red",
        "country": "Spain"
      },
      {
        "name": "Hornhead Malbec",
        "price": 30.5,
        "category": "red",
        "country": "Argentina"
      },
      {
        "name": "Rupe Secca Nero d'Avola",
        "price": 32.0,
        "category": "red",
        "country": "Italy"
      },
      {
        "name": "Les Argelières Pinot Noir",
        "price": 32.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Carlomagno Primitivo Appassimento",
        "price": 33.5,
        "category": "red",
        "country": "Italy"
      },
      {
        "name": "Springhill - Irvine Estate Merlot",
        "price": 37.5,
        "category": "red",
        "country": "Australia"
      },
      {
        "name": "Gouguenheim Malbec Reserva",
        "price": 38.5,
        "category": "red",
        "country": "Argentina"
      },
      {
        "name": "The Crusher Pinot Noir",
        "price": 40.5,
        "category": "red",
        "country": "USA"
      },
      {
        "name": "Jonty's Ducks Shiraz-Cabernet Blend",
        "price": 44.5,
        "category": "red",
        "country": "South Africa"
      },
      {
        "name": "Deux Grives Marsanne-Viognier",
        "price": 27.5,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Las Manitos Chardonnay",
        "price": 23.5,
        "category": "white",
        "country": "Argentina"
      },
      {
        "name": "Tonada Sauvignon Blanc",
        "price": 4.1,
        "category": "white",
        "country": "Chile"
      },
      {
        "name": "Moet Chandon Rose",
        "price": 40.5,
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Moet Chandon Brut",
        "price": 36.0,
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Big Beltie Cabernet Sauvignon",
        "price": 30.5,
        "category": "red",
        "country": "South Africa"
      },
      {
        "name": "Cave de Buxy Macon Azé",
        "price": 39.5,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Mineralium Chenin Blanc",
        "price": 27.0,
        "category": "white",
        "country": "South Africa"
      },
      {
        "name": "Kuki Sauvignon Blanc",
        "price": 5.1,
        "category": "white",
        "country": "New Zealand"
      },
      {
        "name": "Talisman Gruner Veltliner",
        "price": 26.0,
        "category": "white",
        "country": "Austria"
      },
      {
        "name": "Villa Sandi Pinot Grigio",
        "price": 29.5,
        "category": "white",
        "country": "Italy"
      },
      {
        "name": "Coroa d'Ouro Branco",
        "price": 32.5,
        "category": "white",
        "country": "Portugal"
      },
      {
        "name": "Dopff & Irion Riesling",
        "price": 36.5,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Campo Nuevo Tempranillo",
        "price": 4.1,
        "category": "red",
        "country": "Spain"
      },
      {
        "name": "Route 606 Zinfandel Rosé",
        "price": 4.1,
        "category": "rosé",
        "country": "USA"
      },
      {
        "name": "Elysium Black Muscat",
        "price": 7.9,
        "category": "fortified",
        "country": "USA"
      },
      {
        "name": "Poças 10 Year Old Tawny Port",
        "price": 5.2,
        "category": "fortified",
        "country": "Portugal"
      },
      {
        "name": "Poças Ruby",
        "price": 3.5,
        "category": "fortified",
        "country": "Portugal"
      },
      {
        "name": "Las Manitos Malbec-Shiraz",
        "price": 22.0,
        "category": "red",
        "country": "Argentina"
      },
      {
        "name": "Poças LBV Port",
        "price": 4.6,
        "category": "fortified",
        "country": "Portugal"
      },
      {
        "name": "Chateau de Diusse",
        "price": 4.9,
        "category": "fortified",
        "country": "France"
      },
      {
        "name": "El Picador Cabernet Sauvignon",
        "price": 4.0,
        "category": "red",
        "country": "Chile"
      },
      {
        "name": "Tonada Merlot",
        "price": 4.1,
        "category": "red",
        "country": "Chile"
      },
      {
        "name": "Kuraka Sauvignon Blanc",
        "price": 30.0,
        "category": "white",
        "country": "Chile"
      },
      {
        "name": "Le Charme Sauvignon Blanc",
        "price": 4.8,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Coquille de Mer Vermentino",
        "price": 5.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Santa Rosa White Malbec",
        "price": 5.1,
        "category": "white",
        "country": "Argentina"
      },
      {
        "name": "Les Argelières Oak Aged Chardonnay",
        "price": 29.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Picpoul de Pinet",
        "price": 32.5,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Bodegas Aquitania Albariño",
        "price": 39.5,
        "category": "white",
        "country": "Spain"
      },
      {
        "name": "Domaine Jean Thomas Sancerre",
        "price": 45.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Château Terrebonne Provence Rosé",
        "price": 37.0,
        "category": "rosé",
        "country": "France"
      },
      {
        "name": "Pitchfork Chardonnay",
        "price": 4.6,
        "category": "white",
        "country": "Australia"
      }
    ]
  },
  "painwick-hotel": {
    "source": "The Painswick wine list PDF (uploaded to public folder)",
    "sourceUrl": "/The Painswick 12.05.2025-Wine-List.pdf",
    "checkedOn": "2026-03-05",
    "priceNote": "Bottle prices captured from the venue PDF; some wines also offered by the glass.",
    "items": [
      {
        "name": "Steinbock Alcohol-Free Sparkling NV",
        "price": 35.0,
        "category": "sparkling",
        "country": "Germany"
      },
      {
        "name": "Itinera Prosecco DOC Treviso Brut NV",
        "price": 45.0,
        "category": "sparkling",
        "country": "Italy"
      },
      {
        "name": "Woodchester Valley Cotswold Way NV",
        "price": 65.0,
        "category": "sparkling",
        "country": "England",
        "review": "A local Cotswolds sparkling option with orchard fruit and crisp finish."
      },
      {
        "name": "Irroy Extra Brut Champagne NV",
        "price": 72.0,
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Taittinger Brut Reserve NV",
        "price": 90.0,
        "category": "sparkling",
        "country": "France",
        "stars": 4.2,
        "reviewSource": "Vivino community",
        "review": "Elegant Champagne style with citrus, brioche and a clean, refined finish.",
        "libraryWineId": "sainsburys-taittinger"
      },
      {
        "name": "Taittinger Rosé NV",
        "price": 100.0,
        "category": "sparkling-rosé",
        "country": "France"
      },
      {
        "name": "Dom Pérignon 2013",
        "price": 350.0,
        "category": "sparkling",
        "country": "France",
        "stars": 4.5,
        "reviewSource": "Vivino community",
        "review": "Prestige vintage Champagne with layered brioche, citrus and chalky tension.",
        "libraryWineId": "dom-perignon-2013"
      },
      {
        "name": "Cristal Louis Roederer 2014",
        "price": 450.0,
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Joie de Vigne Marsanne 2022",
        "price": 34.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Terre del Noce Pinot Grigio 2023",
        "price": 34.0,
        "category": "white",
        "country": "Italy"
      },
      {
        "name": "Corralillo Sauvignon Blanc 2022",
        "price": 46.0,
        "category": "white",
        "country": "Chile"
      },
      {
        "name": "Bacchus, Woodchester Valley 2022",
        "price": 50.0,
        "category": "white",
        "country": "England"
      },
      {
        "name": "Jean-Marc Brocard Chablis 2023",
        "price": 68.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Quercus Pinot Bianco 2023",
        "price": 31.0,
        "category": "white",
        "country": "Slovenia"
      },
      {
        "name": "Picpoul de Pinet St Clair 2023",
        "price": 42.0,
        "category": "white",
        "country": "France",
        "review": "Classic citrus-and-saline style that works especially well with shellfish and lighter starters."
      },
      {
        "name": "Babich Sauvignon Blanc 2023",
        "price": 53.0,
        "category": "white",
        "country": "New Zealand",
        "stars": 4.1,
        "reviewSource": "Vivino community",
        "review": "Aromatically expressive Marlborough style with passionfruit, citrus and brisk acidity."
      },
      {
        "name": "Gavi di Gavi La Meirana 2023",
        "price": 59.0,
        "category": "white",
        "country": "Italy"
      },
      {
        "name": "Sancerre La Croix du Roy 2023",
        "price": 80.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Puligny-Montrachet 1er Cru Folatières 2022",
        "price": 230.0,
        "category": "white",
        "country": "France"
      },
      {
        "name": "Kleinkloof Mountain Red 2021",
        "price": 36.0,
        "category": "red",
        "country": "South Africa"
      },
      {
        "name": "Les Templiers Pinot Noir 2023",
        "price": 38.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Lestrille Bordeaux Superior 2018",
        "price": 38.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Pulenta La Flor Malbec 2022",
        "price": 49.0,
        "category": "red",
        "country": "Argentina",
        "review": "Modern Mendoza style: ripe black fruit, cocoa spice and smooth tannin."
      },
      {
        "name": "Peppoli Chianti Classico Antinori 2022",
        "price": 65.0,
        "category": "red",
        "country": "Italy",
        "stars": 4.0,
        "reviewSource": "Vivino community",
        "review": "Bright cherry and savoury herb character with balanced acidity for food-led drinking."
      },
      {
        "name": "Conde Valdemar Rioja Reserva 2017",
        "price": 60.0,
        "category": "red",
        "country": "Spain"
      },
      {
        "name": "Woodchester Valley Pinot Précoce 2022",
        "price": 65.0,
        "category": "red",
        "country": "England"
      },
      {
        "name": "Quail's Gate Pinot Noir 2022",
        "price": 84.0,
        "category": "red",
        "country": "Canada"
      },
      {
        "name": "Laurène Pinot Noir, Domaine Drouhin 2017",
        "price": 108.0,
        "category": "red",
        "country": "USA"
      },
      {
        "name": "Amarone Costasera Classico, Masi 2018",
        "price": 115.0,
        "category": "red",
        "country": "Italy"
      },
      {
        "name": "Château Kirwan, Margaux 2017",
        "price": 180.0,
        "category": "red",
        "country": "France"
      },
      {
        "name": "Calafuria Negroamaro Rosato 2023",
        "price": 55.0,
        "category": "rosé",
        "country": "Italy"
      },
      {
        "name": "Scalabrone Rosato di Bolgheri 2022",
        "price": 60.0,
        "category": "rosé",
        "country": "Italy"
      },
      {
        "name": "Minuty Prestige Rosé 2023",
        "price": 65.0,
        "category": "rosé",
        "country": "France"
      },
      {
        "name": "La Fleur d'Or Sauternes 2021 (375ml)",
        "price": 42.0,
        "category": "dessert",
        "country": "France"
      },
      {
        "name": "Pedro Ximénez 'Triana' Hidalgo (500ml)",
        "price": 45.0,
        "category": "fortified",
        "country": "Spain"
      },
      {
        "name": "Ferreira LBV Port 2019",
        "price": 66.0,
        "category": "fortified",
        "country": "Portugal"
      },
      {
        "name": "Tokaji Late Harvest Oremus 2018",
        "price": 75.0,
        "category": "dessert",
        "country": "Hungary"
      }
    ]
  },
  "stroud-hotel": {
    "source": "The Stroud Hotel wine list PDF",
    "sourceUrl": "https://thestroudhotel.com/wp-content/uploads/2025/08/Wine-list-.pdf",
    "checkedOn": "2026-03-05",
    "priceNote": "Bottle prices extracted from the PDF list where available.",
    "items": [
      {
        "name": "Prosecco Borgo SanLeo",
        "category": "sparkling",
        "country": "Italy",
        "price": 40
      },
      {
        "name": "Baron De Villeboerg Brut",
        "category": "sparkling",
        "country": "France",
        "price": 60
      },
      {
        "name": "Woodchester Valley Sparkling Rose",
        "category": "sparkling-rosé",
        "country": "England",
        "price": 65
      },
      {
        "name": "Bollinger Special Cuvée Brut",
        "category": "sparkling",
        "country": "France",
        "price": 95,
        "stars": 4.3,
        "reviewSource": "Vivino community",
        "review": "Powerful non-vintage Champagne style with apple, brioche and toasted notes.",
        "libraryWineId": "bollinger-special-cuvee"
      },
      {
        "name": "Laurent Perrier Rose",
        "category": "sparkling-rosé",
        "country": "France",
        "country": "France",
        "price": 130
      },
      {
        "name": "Dom Perignon",
        "category": "sparkling",
        "country": "France",
        "country": "France",
        "price": 250,
        "stars": 4.5,
        "reviewSource": "Vivino community",
        "review": "Prestige Champagne known for depth, precision and long mineral finish.",
        "libraryWineId": "dom-perignon-2013"
      },
      {
        "name": "Tanti Petali Catarratto-Pinot Grigio",
        "category": "white",
        "country": "Italy",
        "price": 26
      },
      {
        "name": "Alta Baliza Chardonnay",
        "category": "white",
        "country": "Argentina",
        "price": 26
      },
      {
        "name": "Urmeneta Sauvignon Blanc",
        "category": "white",
        "country": "Chile",
        "price": 27
      },
      {
        "name": "Terrazzo Falanghina",
        "category": "white",
        "country": "Italy",
        "price": 28
      },
      {
        "name": "Picpoul de Pinet, Jean-Luc Colombo",
        "category": "white",
        "country": "France",
        "price": 33
      },
      {
        "name": "Outnumbered Sauvignon Blanc",
        "category": "white",
        "country": "New Zealand",
        "price": 36
      },
      {
        "name": "Mâcon Villages, 'Crepillionne' Domaine Fichet",
        "category": "white",
        "country": "France",
        "price": 46
      },
      {
        "name": "Cossetti Gavi di Gavi",
        "category": "white",
        "country": "Italy",
        "price": 51
      },
      {
        "name": "Sancerre, Domaine de la Perrière",
        "category": "white",
        "country": "France",
        "price": 62
      },
      {
        "name": "Chablis, Alain Geoffroy",
        "category": "white",
        "country": "France",
        "price": 65
      },
      {
        "name": "Montagny, Louis Latour",
        "category": "white",
        "country": "France",
        "price": 70
      },
      {
        "name": "Chassagne Montrachet",
        "category": "white",
        "country": "France",
        "price": 120
      },
      {
        "name": "Tanti Petali Pinot Grigio Rosato",
        "category": "rosé",
        "country": "Italy",
        "price": 25
      },
      {
        "name": "Falling Petal Zinfandel Rosé",
        "category": "rosé",
        "country": "USA",
        "price": 27
      },
      {
        "name": "Pierre de Taille Rosé",
        "category": "rosé",
        "country": "France",
        "price": 35
      },
      {
        "name": "Sancerre rosé, Domaine de la Perriere",
        "category": "rosé",
        "country": "France",
        "price": 60
      },
      {
        "name": "Villa Rosaura Merlot Reserva",
        "category": "red",
        "country": "Chile",
        "price": 26
      },
      {
        "name": "Coreto Red",
        "category": "red",
        "country": "Portugal",
        "price": 28
      },
      {
        "name": "Cleefs Classic Cabernet Sauvignon",
        "category": "red",
        "country": "South Africa",
        "price": 36
      },
      {
        "name": "The Den Pinotage, Painted Wolf",
        "category": "red",
        "country": "South Africa",
        "price": 37
      },
      {
        "name": "Côtes du Rhône Rouge, M. Chapoutier",
        "category": "red",
        "country": "France",
        "price": 38
      },
      {
        "name": "Château Lamothe Castera",
        "category": "red",
        "country": "France",
        "price": 42
      },
      {
        "name": "Ermita de San Felices Reserva",
        "category": "red",
        "country": "Spain",
        "price": 52
      },
      {
        "name": "Valmoissine Pinot Noir, Louis Latour",
        "category": "red",
        "country": "France",
        "price": 46
      },
      {
        "name": "The Crossing Pinot Noir",
        "category": "red",
        "country": "New Zealand",
        "price": 53
      },
      {
        "name": "The Federalist Zinfandel",
        "category": "red",
        "country": "USA",
        "price": 55
      },
      {
        "name": "Château Fontesteau Cru Bourgeois 2016",
        "category": "red",
        "country": "France",
        "price": 70
      },
      {
        "name": "Cossetti Barolo",
        "category": "red",
        "country": "Italy",
        "price": 80
      },
      {
        "name": "Châteauneuf-du-Pape, Colombo & Fille",
        "category": "red",
        "country": "France",
        "price": 95
      },
      {
        "name": "Chateau Pichon Longueville Comtesse de Lalande 1983",
        "category": "red",
        "country": "France",
        "price": 165
      }
    ]
  },
  "rafters-restaurant": {
    "source": "Rafters drinks menu PDF",
    "sourceUrl": "https://raftersrestaurant.co.uk/uploads/files/DRINK_MENU_PDF_WEBSITE_COPY.pdf",
    "checkedOn": "2026-03-05",
    "priceNote": "Rafters list is published by 125ml glass prices in this PDF extract.",
    "items": [
      {
        "name": "Gusbourne Blanc de Blancs",
        "price": 13.0,
        "category": "sparkling",
        "measure": "125ml",
        "country": "England"
      },
      {
        "name": "Hoffman & Rathbone Blanc de Blancs",
        "price": 20.0,
        "category": "sparkling",
        "measure": "125ml",
        "country": "England"
      },
      {
        "name": "Riesling, Domdechant Werner VDP, 2019",
        "price": 7.0,
        "category": "white",
        "measure": "125ml",
        "country": "Germany"
      },
      {
        "name": "Sauvignon Blanc, Pappillon Winery, 2018",
        "price": 11.0,
        "category": "white",
        "measure": "125ml",
        "country": "Slovakia"
      },
      {
        "name": "Grauburgunder, Bullshit, Emil Bauer, 2018",
        "price": 11.0,
        "category": "white",
        "measure": "125ml",
        "country": "Germany"
      },
      {
        "name": "Pinot Nero, Franz Haas, 2019",
        "price": 12.0,
        "category": "red",
        "measure": "125ml",
        "country": "Italy"
      },
      {
        "name": "Zinfandel, Levrier Wines by Jo Irvine, 2014",
        "price": 20.0,
        "category": "red",
        "measure": "125ml",
        "country": "Australia"
      },
      {
        "name": "Cabernet Sauvignon Blend, Chateau Musar, 2000",
        "price": 25.0,
        "category": "red",
        "measure": "125ml",
        "country": "Lebanon"
      },
      {
        "name": "Grenache/Syrah, Les Amours Haut Gleon, 2021",
        "price": 7.0,
        "category": "rosé",
        "measure": "125ml",
        "country": "France"
      }
    ]
  },
  "harritt-wine-bar": {
    "source": "The Harritt official website details + user-provided wine profile summary (official full list not publicly published)",
    "sourceUrl": "https://theharritt.co.uk",
    "checkedOn": "2026-03-05",
    "priceNote": "Typical observed range: £7–£12 glass, £28–£70+ bottle, £12–£18 Champagne by glass.",
    "items": [
      {
        "name": "House Champagne (classic brut)",
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Prosecco",
        "category": "sparkling",
        "country": "Italy"
      },
      {
        "name": "Crémant or similar sparkling",
        "category": "sparkling",
        "country": "France"
      },
      {
        "name": "Sauvignon Blanc",
        "category": "white",
        "country": "New Zealand"
      },
      {
        "name": "Chardonnay (mineral to lightly oaked)",
        "category": "white",
        "country": "France / New World"
      },
      {
        "name": "Pinot Grigio",
        "category": "white",
        "country": "Italy"
      },
      {
        "name": "Albariño",
        "category": "white",
        "country": "Spain"
      },
      {
        "name": "Lebanese white (rotating)",
        "category": "white",
        "country": "Lebanon"
      },
      {
        "name": "Provence Rosé",
        "category": "rosé",
        "country": "France"
      },
      {
        "name": "European Rosé selection (seasonal)",
        "category": "rosé",
        "country": "Europe"
      },
      {
        "name": "Pinot Noir",
        "category": "red",
        "country": "France / New World"
      },
      {
        "name": "Malbec",
        "category": "red",
        "country": "Argentina"
      },
      {
        "name": "Rioja (Tempranillo)",
        "category": "red",
        "country": "Spain"
      },
      {
        "name": "Bordeaux blend",
        "category": "red",
        "country": "France"
      },
      {
        "name": "Beaujolais (Gamay)",
        "category": "red",
        "country": "France"
      },
      {
        "name": "Graham's Port",
        "category": "fortified",
        "country": "Portugal"
      }
    ],
    "curatedProfile": true
  },
  "crown-and-glove": {
    "source": "Crown & Glove drinks menu",
    "sourceUrl": "https://www.crownandglove.com/drink/",
    "checkedOn": "2026-03-06",
    "priceNote": "Prices not listed on website.",
    "items": [
      { "name": "Hardys 202 Main Road Chardonnay", "category": "white", "country": "Australia" },
      { "name": "Jack Rabbit Sauvignon Blanc", "category": "white", "country": "Chile" },
      { "name": "Vignana Pinot Grigio", "category": "white", "country": "Italy" },
      { "name": "Millstream Chenin Blanc", "category": "white", "country": "Chile" },
      { "name": "Ponte Pinot Grigio", "category": "white", "country": "Italy" },
      { "name": "Nobilo Sauvignon Blanc", "category": "white", "country": "New Zealand" },
      { "name": "Hardys 202 Main Road Shiraz", "category": "red", "country": "Australia" },
      { "name": "Jack Rabbit Merlot", "category": "red", "country": "Chile" },
      { "name": "Most Wanted Malbec", "category": "red", "country": "South Africa" },
      { "name": "Finca Del Oro Rioja", "category": "red", "country": "Spain" },
      { "name": "Barefoot White Zinfandel", "category": "rosé", "country": "USA" },
      { "name": "Vignana Pinot Grigio Blush", "category": "rosé", "country": "Italy" },
      { "name": "Henri Gaillard Provence", "category": "rosé", "country": "France" },
      { "name": "Morajo Prosecco", "category": "sparkling", "country": "Italy" },
      { "name": "Vignana Prosecco Rosé", "category": "sparkling", "country": "Italy" },
      { "name": "Laurent Perrier Brut NV", "category": "sparkling", "country": "France" }
    ]
  },
  "galvin-green-man": {
    "source": "Galvin Green Man Drinks Menu (PDF from website)",
    "sourceUrl": "https://d28htdh8gmxq1j.cloudfront.net/wp-content/uploads/2025/09/GGM-Restaurant-Pub-Essex-Drinks.pdf",
    "checkedOn": "2026-03-06",
    "priceNote": "Bottle (750ml) prices unless noted. By-the-glass wines available in 125ml/175ml/250ml/750ml. Wine on Tap served from Uncharted Wine kegs. Vegan (Ⓥ) and Vegetarian (V) marked where indicated.",
    "items": [
      // ── WINES BY THE GLASS (on tap / keg) ──
      { "name": "Sauvignon Blanc, VinExploré, France", "price": 35, "category": "white", "country": "France", "grape": "Sauvignon Blanc", "note": "Full & fruity with bright citrus notes & zesty finish. Also by the glass." },
      { "name": "Madregale Pinot Grigio, Abruzzo, Italy", "price": 38, "category": "white", "country": "Italy", "grape": "Pinot Grigio", "note": "Smooth & dry with light citrus and lemon peel. Also by the glass." },
      { "name": "Arinto, A Desconhecida, Lisbon, Portugal", "price": 40, "category": "white", "country": "Portugal", "grape": "Arinto", "note": "Elegant aromas of green peach & apple, with a refreshing salinity on the finish. Also by the glass." },
      { "name": "Chardonnay, Pays D'Oc, France", "price": 44, "category": "white", "country": "France", "grape": "Chardonnay", "note": "Hints of honey, stone fruit & citrus with a nice minerality. Also by the glass." },
      { "name": "Cinsault Rosé, Ventoux, France", "price": 39, "category": "rosé", "country": "France", "grape": "Cinsault", "note": "Shows notes of raspberry and cherry on a refreshing palate. Also by the glass." },
      { "name": "Planeta Rose, Sicily, Italy", "price": 44, "category": "rosé", "country": "Italy", "grape": "Nero d'Avola/Syrah", "note": "Fresh and fruity with hints of rose, pomegranate and strawberries. Also by the glass." },
      { "name": "Grenache Syrah, Mourvèdre, France", "price": 35, "category": "red", "country": "France", "grape": "Grenache/Syrah/Mourvèdre", "note": "Rich aromas of plum and black cherry with notes of cracked black pepper. Also by the glass." },
      { "name": "Cãstelao, A Desconhecida, Portugal", "price": 38, "category": "red", "country": "Portugal", "grape": "Castelão", "note": "Rich, juicy aromas of dark plum and black cherry with sweet spices and soft tannins. Also by the glass." },
      { "name": "Bordeaux, Château des Arras, France", "price": 43, "category": "red", "country": "France", "grape": "Bordeaux blend", "note": "Vibrant flavours of blackberry damson all coming together with a silky smooth finish with long tannins. Also by the glass." },
      { "name": "Pinot Noir, Pays d'Oc, France", "price": 44, "category": "red", "country": "France", "grape": "Pinot Noir", "note": "Fruity and excellently balanced, with expressive nose of black cherry and spices. Also by the glass." },
      { "name": "Malbec, Ballena del Sur, Argentina", "price": 45, "category": "red", "country": "Argentina", "grape": "Malbec", "note": "Soft dark bramble fruits with a nice touch of clean and fresh herb. Almost jammy consistency yet remains clean. Also by the glass." },

      // ── LOW & NO (on tap) ──
      { "name": "Lyre's Classico Grande 0%, UK", "price": 34, "category": "sparkling", "country": "UK", "note": "Light sparkling wine with tart flavour enhanced with peach, pear, and red apple. Alcohol-free." },
      { "name": "Sauvignon Blanc 0.5%, South Africa", "price": 24, "category": "white", "country": "South Africa", "note": "Flavours of ripe tropical fruit, yellow peaches and gooseberries. Low alcohol." },
      { "name": "Shiraz 0.5%, South Africa", "price": 24, "category": "red", "country": "South Africa", "note": "Hints of ripe red fruit, crushed black pepper, dried rose petals & candied cherries. Low alcohol." },

      // ── CHAMPAGNE & SPARKLING ──
      { "name": "Primi Soli Prosecco NV, Italy", "price": 39, "category": "sparkling", "country": "Italy", "note": "Light straw yellow with fine and persistent perlage. Delicate, slightly smooth and particularly fruity." },
      { "name": "Botter Prosecco Rosé, Italy", "price": 41, "category": "sparkling-rosé", "country": "Italy", "note": "A fine and fragrant nose of fruity and floral aromas. Fresh, savoury and well-balanced." },
      { "name": "Galvin Champagne, Beaumont des Crayères, NV", "price": 85, "category": "sparkling", "country": "France", "grape": "Champagne blend", "note": "The palate is well balanced, fresh and lively with aromas of pear, greengages and citrus fruit. House Champagne — also by the glass (£14.50/125ml)." },
      { "name": "New Hall Classic Brut, NV, UK", "price": 86, "category": "sparkling", "country": "UK", "note": "Notes of ripe apricots, baked apple and roasted hazelnuts on the palate leading to a creamy, vibrant finish. Local Essex sparkling." },
      { "name": "New Hall Rosé Brut, NV, UK", "price": 91, "category": "sparkling-rosé", "country": "UK", "note": "Elegant notes of wild strawberry, lemon sherbet and rose water leading to slightly mineral finish and a fine persistent mousse. Local Essex sparkling rosé." },
      { "name": "Beaumont des Crayères Grand Rosé, NV", "price": 93, "category": "sparkling-rosé", "country": "France", "grape": "Champagne blend", "note": "Following 3 years of aging, a very fruity nose and the palate develops cherry and red fruit flavours with a particularly elegant finish. Also by the glass (£16.50/125ml)." },
      { "name": "Taittinger Brut Réserve NV", "price": 106, "category": "sparkling", "country": "France", "grape": "Champagne blend", "note": "Lively, fresh and in total harmony. A delicate wine with flavours of fresh fruit and honey. Also by the glass (£18/125ml)." },
      { "name": "Taittinger Prestige Rosé NV", "price": 128, "category": "sparkling-rosé", "country": "France", "grape": "Champagne blend", "note": "Fresh and young with aromas of red fruit, freshly crushed wild raspberry, cherry and blackcurrant." },
      { "name": "Ruinart Blanc de Blancs NV", "price": 230, "category": "sparkling", "country": "France", "grape": "Chardonnay", "note": "Citrus, peach and white flower aromas evolve into a fresh and supple palate." },

      // ── WHITE (bottle list) ──
      { "name": "Viognier, Villa Vieja, Mendoza, Argentina", "price": 37, "category": "white", "country": "Argentina", "grape": "Viognier", "note": "Lightly perfumed with nectarine and grapefruit aromas." },
      { "name": "Picpoul de Pinet, Grange des Rocs, Languedoc, France", "price": 39, "category": "white", "country": "France", "grape": "Picpoul", "note": "Crisp & herbal with zesty lime & lemon spiked fruit." },
      { "name": "Rioja Blanco, Vina Ilusión, Navarra, Spain", "price": 41, "category": "white", "country": "Spain", "grape": "Tempranillo Blanco", "note": "Aromas of white fruits and lemon. Fresh, delicate wine with a touch of creaminess and a zippy finish." },
      { "name": "Muscadet Sèvre et Maine Sur Lie 'Garance', Luneau, France", "price": 46, "category": "white", "country": "France", "grape": "Melon de Bourgogne", "note": "Herbal, floral, lime aromas. Fresh and mineral tasting with ripe elegant flavours of citrus and stone fruits." },
      { "name": "Staete Landt 'Pure' Sauvignon Blanc, Marlborough, New Zealand", "price": 50, "category": "white", "country": "New Zealand", "grape": "Sauvignon Blanc", "note": "Packed with gooseberry, lime, grapefruit and exotic fruits." },
      { "name": "Côtes du Rhône Blanc, Domaine La Collière, France", "price": 52, "category": "white", "country": "France", "grape": "Grenache Blanc/Clairette", "note": "Fresh tasting with creamy, honeyed flavours of caramelised apples and pears." },
      { "name": "Galvin Pouilly Fumé, Arnaud et Stephanie Dezat, Loire, France", "price": 53, "category": "white", "country": "France", "grape": "Sauvignon Blanc", "note": "Harmonious and predominantly floral with a mixture of light peach and citrus aromas, wrapped in lovely minerality. Galvin's own label." },
      { "name": "Chardonnay, Toques et Clochers, Languedoc-Roussillon, France", "price": 54, "category": "white", "country": "France", "grape": "Chardonnay", "note": "The elevage of the wine is new oak which confers complex flavours of melted butter, nuts, caramel & toast." },
      { "name": "Bacchus, New Hall Wine Estate, Purleigh, UK", "price": 55, "category": "white", "country": "UK", "grape": "Bacchus", "note": "Quintessential English Bacchus. Intensely aromatic with grapefruit, pear, peach, lime and herbaceous vegetal notes. Local Essex winery." },
      { "name": "Albariño, Abadia de San Campio, Galicia, Spain", "price": 56, "category": "white", "country": "Spain", "grape": "Albariño", "note": "Floral aromas lead to grapefruit, lemon & mandarin orange flavours." },
      { "name": "Gavi di Gavi, La Minaia, Piedmont, Italy (Cortese)", "price": 59, "category": "white", "country": "Italy", "grape": "Cortese", "note": "Elegant, mineral wine with subtle citrus & melon flavours." },
      { "name": "Riesling, Te Whare Ra, Marlborough, New Zealand", "price": 62, "category": "white", "country": "New Zealand", "grape": "Riesling", "note": "A sweet palate with creamy notes of green apple, nectarines, apricots & honey melon." },
      { "name": "Gewurztraminer, Domaine Christophe Mittnacht, Alsace, France", "price": 70, "category": "white", "country": "France", "grape": "Gewurztraminer", "note": "Lovely off-dry white with notes of orange blossom & lychee and a honeyed finish." },
      { "name": "Riesling, Domaine Bruno Sorg, Alsace, France", "price": 68, "category": "white", "country": "France", "grape": "Riesling", "note": "A drier Riesling — full of lime zest and a mouth-watering acidity." },
      { "name": "Sancerre, Domaine Balland (Sauvignon Blanc), Loire, France", "price": 73, "category": "white", "country": "France", "grape": "Sauvignon Blanc", "note": "Dry and fruity with a wonderfully delicate bouquet and great length." },
      { "name": "Chablis, Domaine Jean Collet, Burgundy 2021", "price": 75, "category": "white", "country": "France", "grape": "Chardonnay", "note": "Well-balanced, bringing out a complex and warm bouquet. At once mineral and lively with pine tree and grapefruit overtones." },
      { "name": "La Soula, Trigone Blanc, Languedoc-Roussillon, France", "price": 78, "category": "white", "country": "France", "grape": "Sauvignon Blanc/Vermentino/Grenache Blanc", "note": "An intriguing blend of old-vine varieties with a welcoming bouquet of herbal notes and spiced orchard fruits." },
      { "name": "Chardonnay, Riverview, Crouch Valley, UK", "price": 85, "category": "white", "country": "UK", "grape": "Chardonnay", "note": "Delicate creamy lychee giving way to buttery green apple with a nice citrussy acidity giving this stunning English Chardonnay some backbone." },
      { "name": "Bourgogne Blanc 'La Combe' Domaine Derain, Burgundy", "price": 93, "category": "white", "country": "France", "grape": "Chardonnay", "note": "From 30 year old plot close to Puligny Montrachet. Only 1800 bottles are made a year. Elegant with robust flavours of white peach, yellow apple, lemon & pineapple." },
      { "name": "Riesling Grand Cru, Domaine Pierre Frick, Alsace, France", "price": 107, "category": "white", "country": "France", "grape": "Riesling", "note": "Natural wine undergoing 'Vorbourg maceration' with complex and dense aromas of limestone pebbles, grilled hazelnuts, rum and tobacco." },
      { "name": "Condrieu, Domaine Yves Cuilleron, Rhône Valley, France", "price": 120, "category": "white", "country": "France", "grape": "Viognier", "note": "An incredible Viognier with complex aromas of apricot & violet intertwine with toasted almonds. Velvety finish with delicate spices." },
      { "name": "Chardonnay, Ceritas Vineyards 'Charles Heintz', USA", "price": 145, "category": "white", "country": "USA", "grape": "Chardonnay", "note": "A very elegant Burgundian style Chardonnay. Saline notes, white flowers on the nose. Similar to a 1er Cru Chablis." },
      { "name": "Meursault, Vincent Gerardin, Burgundy, France", "price": 150, "category": "white", "country": "France", "grape": "Chardonnay", "note": "A very elegant Burgundian style Chardonnay with a heady bouquet of dried almond, butter and white flowers. Superb mineral structure." },
      { "name": "Chassagne-Montrachet 1er Cru, Les Vergers, F&L Pillot, France", "price": 180, "category": "white", "country": "France", "grape": "Chardonnay", "note": "Lots of fresh grapefruit, lemon peel, crunchy red apple and blossom flavours." },

      // ── ROSÉ (bottle list) ──
      { "name": "Rose Sicilia, Planeta, Sicily, Italy (Nero d'Avola/Syrah)", "price": 44, "category": "rosé", "country": "Italy", "grape": "Nero d'Avola/Syrah", "note": "Fresh and fruity, encompasses all the emotions of the Sicilian summer with hints of rose, pomegranate and strawberries." },
      { "name": "Côtes de Provence Rosé, La Vidaubanaise, France (Grenache Blanc)", "price": 45, "category": "rosé", "country": "France", "grape": "Grenache", "note": "Refreshing red berried rosé with a vibrant spicy dry finish." },
      { "name": "New Hall Pinot Noir Rosé, Purleigh, UK", "price": 56, "category": "rosé", "country": "UK", "grape": "Pinot Noir", "note": "Notes of redcurrant & cream with hints of strawberry. Local Essex winery." },
      { "name": "Secret de Léoube Rosé, Côtes de Provence, France", "price": 95, "category": "rosé", "country": "France", "grape": "Grenache/Cinsault/Cabernet Sauvignon", "note": "Strawberry & watermelon with floral hints of roses, extremely drinkable." },

      // ── RED (bottle list) ──
      { "name": "Cabernet Sauvignon, Mont d'Hortes, Pays d'Oc, France", "price": 38, "category": "red", "country": "France", "grape": "Cabernet Sauvignon", "note": "Full bodied but easy drinking with notes of raspberry & oak." },
      { "name": "Ciù Ciù Piceno Bacchus, Marche, Italy (Sangiovese/Montepulciano)", "price": 39, "category": "red", "country": "Italy", "grape": "Sangiovese/Montepulciano", "note": "Full of life with strong cherry & blackberry notes." },
      { "name": "Rioja Crianza, Lopez de Haro, Spain (Tempranillo)", "price": 40, "category": "red", "country": "Spain", "grape": "Tempranillo", "note": "Rounded, rich red fruit flavours with liquorice, mint & sweet spices." },
      { "name": "Bergerac Rouge, Chateau Laulerie, South West France (Merlot)", "price": 42, "category": "red", "country": "France", "grape": "Merlot", "note": "Full flavoured and well balanced, velvety palate with flavours of red berries." },
      { "name": "Stone Spring Shiraz, Barossa Valley, South Australia", "price": 46, "category": "red", "country": "Australia", "grape": "Shiraz", "note": "Intense savoury flavours of thick blackberry compote, black pepper and typical iron-rich beefy flavours." },
      { "name": "Corbières, Château La Bastide, Languedoc (Syrah/Grenache/Mourvèdre)", "price": 45, "category": "red", "country": "France", "grape": "Syrah/Grenache/Mourvèdre", "note": "Ripe blackberry flavours with sweet spices, herbs & black pepper." },
      { "name": "Chianti, Da Vinci, Tuscany, Italy (Sangiovese/Merlot)", "price": 48, "category": "red", "country": "Italy", "grape": "Sangiovese/Merlot", "note": "Well balanced with bouquet of fresh red fruits, especially cherries mingled with peppery notes. Ripe and lively with soft round tannins." },
      { "name": "Galvin Rasteau, Rhône (Grenache/Syrah/Mourvèdre), France", "price": 49, "category": "red", "country": "France", "grape": "Grenache/Syrah/Mourvèdre", "note": "Powerful southern Rhône red with luxurious dark, ripe fruit. Galvin's own label." },
      { "name": "Régnié, Domaine de la Plaigne, Beaujolais (Gamay)", "price": 52, "category": "red", "country": "France", "grape": "Gamay", "note": "A young but bold Beaujolais with notes of violet, plum & dark cherry." },
      { "name": "Pinot Noir Précoce, New Hall Vineyards, Purleigh, UK", "price": 57, "category": "red", "country": "UK", "grape": "Pinot Noir", "note": "Packed with red cherry, blackberry fruit and earthy notes on the nose. Smoky, savoury complexity. Local Essex winery." },
      { "name": "Pinot Noir, Domaine Bruno Sorg, Alsace, France", "price": 61, "category": "red", "country": "France", "grape": "Pinot Noir", "note": "Elegant and restrained Pinot Noir from Alsace. Youthful with flavours of summer berries, cherries and touch of cracked black pepper." },
      { "name": "Côtes-du-Rhône, Mas de Libian, Khayyâm, Rhone Valley, France (Mourvèdre)", "price": 65, "category": "red", "country": "France", "grape": "Mourvèdre", "note": "Rich & dense: dripping with black cherry, liquorice, bay leaf, white pepper and anise." },
      { "name": "Rioja Reserva, Hacienda Grimon, Spain (Tempranillo)", "price": 75, "category": "red", "country": "Spain", "grape": "Tempranillo", "note": "Mature ripe cherry & black raisins with long complex notes of blackberry." },
      { "name": "Barbera d'Asti Superiore, Trinchero, Piemonte, Italy", "price": 77, "category": "red", "country": "Italy", "grape": "Barbera", "note": "Tart cherry & currants with good acidity, smooth tannins and a complex spiced finish with hints of clove & cinnamon." },
      { "name": "Château Gros Caillou, Grand Cru St Emilion, Bordeaux, France", "price": 85, "category": "red", "country": "France", "grape": "Merlot/Cabernet Franc", "note": "Rich tasting and elegant with good concentrated, nicely developed red and black fruit flavours with notes of cedar and supple tannins." },
      { "name": "Pinot Noir, Riverview, Crouch Valley, UK", "price": 87, "category": "red", "country": "UK", "grape": "Pinot Noir", "note": "Light but intense flavours of cranberry, strawberry & blueberry." },
      { "name": "JM Cazes, St. Estephe, Bordeaux, France (Cab Sauv/Merlot/Cab Franc)", "price": 89, "category": "red", "country": "France", "grape": "Cabernet Sauvignon/Merlot/Cabernet Franc", "note": "Produced from the younger fruit of Château Les Ormes de Pez, delivering a forward, silky style, but the classic Saint Estèphe structure is clearly on show." },
      { "name": "Barolo 'Ascheri' Michele Reverdito, Piedmont, Italy", "price": 95, "category": "red", "country": "Italy", "grape": "Nebbiolo", "note": "Dense, sweet red perfumed aromas are followed by flavours of morello cherry, sweet spices & elegant ripe tannins." },
      { "name": "Zinfandel, Turley Old Vines, Napa Valley, USA", "price": 99, "category": "red", "country": "USA", "grape": "Zinfandel", "note": "Bold & jammy with big flavours of blackberry, plum, vanilla & cedar." },
      { "name": "Brunello di Montalcino, Tenuta di Argiano, Tuscany, Italy", "price": 101, "category": "red", "country": "Italy", "grape": "Sangiovese", "note": "Flavours of ripe cherry fruit with roasted herbs and sweet toasty oak. Complex & powerful wine with a ripe tannic structure." },
      { "name": "Margaux, Chateau Rauzan-Ségla, Bordeaux, France", "price": 107, "category": "red", "country": "France", "grape": "Cabernet Sauvignon/Merlot", "note": "Very fresh with strawberry, mineral and flower aromas following through to a medium body and fine tannins." },
      { "name": "Chateauneuf du Pape, Domaine La Barroche, Rhone, France", "price": 110, "category": "red", "country": "France", "grape": "Grenache/Syrah/Mourvèdre", "note": "A head turning bouquet of kirsch, blackberries, crushed herbs and pepper. Full bodied with silky and ripe tannins and a long finish." },
      { "name": "Pommard 1er Cru, Jean Javillier et Fils, Burgundy, France", "price": 130, "category": "red", "country": "France", "grape": "Pinot Noir", "note": "A classic Pommard with light raspberry acidity and intense cherry fruit on the palate. A long oaky finish with surprisingly low tannins." },
      { "name": "Pomerol, Château Gombaude Guillot, Bordeaux, France", "price": 150, "category": "red", "country": "France", "grape": "Merlot/Cabernet Franc", "note": "Bright fresh and yet aromatic blackcurrant fruit nose with a certain refined elegance. Broad and fine-grained tannins support lovely length." },
      { "name": "Gevrey Chambertin, Domaine René Bouvier, Burgundy, France", "price": 160, "category": "red", "country": "France", "grape": "Pinot Noir", "note": "Ripe, spicy flavours of cherry & red berry fruits with a rich mineral depth." },

      // ── SWEET WINE ──
      { "name": "Coteaux du Layon Saint Lambert, Domaine Ogereau, France", "price": 5, "category": "dessert", "country": "France", "note": "Sweet pear & rich honeyed flavours of apple, peach & cinnamon. 50ml." },
      { "name": "Banyuls Rimages, Domaine du Valcros, France", "price": 6, "category": "dessert", "country": "France", "note": "Rich notes of sweet, honeyed figs and prunes with underlying hints of chocolate. 50ml." },
      { "name": "Lyrarakis Liastos Sun-dried, Crete, Greece", "price": 6, "category": "dessert", "country": "Greece", "note": "A blend of sun-dried local grapes, giving a concentrated juice with density of aromas and taste. 50ml." },
      { "name": "Sauternes, Lieutenant de Sigalas, Bordeaux, France", "price": 7, "category": "dessert", "country": "France", "grape": "Sémillon/Sauvignon Blanc", "note": "Sumptuous, rich & vibrant with honey, lemon & orange. 50ml." },
      { "name": "Tokaji Late Harvest Cuvée, Sauska, Hungary", "price": 8.4, "category": "dessert", "country": "Hungary", "grape": "Furmint", "note": "Rich fruity aromas of apricot, figs, pineapple, citrus to oriental spices. Long and rich aftertaste. 50ml." },

      // ── SHERRY ──
      { "name": "Fino, Cesar Florido", "price": 4, "category": "fortified", "country": "Spain", "note": "Light and soft with a pleasing saline quality. 50ml." },
      { "name": "Pedro Ximenez, Bella Luna", "price": 5, "category": "fortified", "country": "Spain", "note": "Deep ebony colour, dense aromas of raisins, dates and honey. 50ml." },
      { "name": "Tio Pepe", "price": 5.5, "category": "fortified", "country": "Spain", "note": "Bone dry, light, with a long finish with almond notes. 50ml." },
      { "name": "Amontillado, Cesar Florido", "price": 6.5, "category": "fortified", "country": "Spain", "note": "A cross between fino and oloroso sherry. Dry, with notes of dried apricots, hazelnuts and touch of saline. 50ml." },

      // ── PORT ──
      { "name": "Galvin 10 Year Old Tawny Port", "price": 14, "category": "fortified", "country": "Portugal", "note": "Rich and elegant style. Powerful dried fruit, figs, honey and almonds with a long pleasing fresh finish. 100ml." }
    ]
  },
  "lowell-hotel-nyc": {
    "source": "The Club Room Menu at The Lowell (PDF provided in workspace)",
    "sourceUrl": "/The_Club_Room_Menu.pdf",
    "checkedOn": "2026-03-13",
    "priceNote": "Prices captured from the by-the-glass page of the Club Room menu PDF. Food, cocktails, and spirits are also listed in the source menu.",
    "items": [
      { "name": "L. Albrecht Crémant d'Alsace Brut Rosé NV", "price": 19, "category": "sparkling-rosé", "country": "France", "page": 2 },
      { "name": "French Bloom Le Rosé 0% Alcohol", "price": 25, "category": "sparkling-rosé", "country": "France", "page": 2 },
      { "name": "Delamotte, Le Mesnil-sur-Oger NV", "price": 38, "category": "sparkling", "country": "France", "page": 2 },
      { "name": "Vranken Demoiselle Brut Rosé, Reims NV", "price": 38, "category": "sparkling-rosé", "country": "France", "page": 2 },
      { "name": "Louis Roederer Brut Rosé, Reims 2016", "price": 43, "category": "sparkling-rosé", "country": "France", "page": 2 },

      { "name": "La Chapelle Gordonne, Côtes de Provence 2023", "price": 23, "category": "rosé", "country": "France", "page": 2 },
      { "name": "Whispering Angel, Côtes de Provence 2024", "price": 23, "category": "rosé", "country": "France", "page": 2, "libraryWineId": "ms-whispering-angel-rose", "reviewSource": "Wine Guide library" },
      { "name": "Domaine d'Ott, Château de Romassan, Bandol 2023", "price": 33, "category": "rosé", "country": "France", "page": 2 },

      { "name": "Elena Walch Pinot Grigio, Alto Adige 2024", "price": 19, "category": "white", "country": "Italy", "page": 2 },
      { "name": "William Fèvre Chablis 2023", "price": 28, "category": "white", "country": "France", "page": 2 },
      { "name": "Domaine Alphonse Mellot Sancerre 'La Moussière' 2023", "price": 29, "category": "white", "country": "France", "page": 2 },
      { "name": "Domaine Aline Beauné Montagny 2023", "price": 28, "category": "white", "country": "France", "page": 2 },

      { "name": "Domaine Vallot 'Le Coriançon' Côtes du Rhône 2021", "price": 23, "category": "red", "country": "France", "page": 2 },
      { "name": "Fanny Sabre Bourgogne Rouge 2023", "price": 29, "category": "red", "country": "France", "page": 2 },
      { "name": "Chappellet Mountain Cuvée Cabernet, Napa Valley 2023", "price": 26, "category": "red", "country": "United States", "page": 2 },
      { "name": "Château Saint-Georges Saint-Emilion 2016", "price": 35, "category": "red", "country": "France", "page": 2 }
    ]
  },

  // ── Valencia ──────────────────────────────────────────────────────────────
  "forastera-valencia": {
    "source": "Forastera restaurant carta page, fetched 2026-03-13",
    "sourceUrl": "https://forasterarestaurant.es/carta",
    "checkedOn": "2026-03-13",
    "priceNote": "Bottle prices in euros from the online carta. null = price not publicly listed.",
    "items": [
      // ── CHAMPAGNE ──
      { "name": "Les Epinettes, Adrien Renoir, 2019", "price": 190, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Pinot Noir" },
      { "name": "Les Agneaux, Gounel Lasalle, 2019", "price": 90, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Pinot Meunier" },
      { "name": "Blanc de Blancs, Frédéric Savart, NV", "price": 125, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Chardonnay" },
      { "name": "Boréal, Champagne Clandestin, 2021", "price": null, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Pinot Noir" },
      { "name": "Prémices, Jules Brochet, 2022", "price": 120, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Chardonnay/Pinot Noir/Meunier" },
      { "name": "Le Mont-Chainqueux, Elise Bougy, 2022", "price": null, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Pinot Noir/Meunier" },
      { "name": "Cuvée Perpetuelle, Bonnet-Ponson, 2021", "price": null, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Pinot Noir/Chardonnay/Meunier" },
      { "name": "L'Amateur, David Léclapart, 2020", "price": null, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Chardonnay" },
      { "name": "L'Aphrodisiaque, David Léclapart, 2018", "price": 320, "category": "sparkling", "country": "France", "region": "Reims", "grape": "Chardonnay/Pinot Noir" },
      { "name": "Champ Bouton, La Rogerie, 2020", "price": 175, "category": "sparkling", "country": "France", "region": "Côte des Blancs", "grape": "Chardonnay" },
      { "name": "Initial, Jacques Selosse, NV", "price": 340, "category": "sparkling", "country": "France", "region": "Côte des Blancs", "grape": "Chardonnay" },
      { "name": "Les Nogers, Dhondt-Grellet, 2019", "price": 205, "category": "sparkling", "country": "France", "region": "Côte des Blancs", "grape": "Chardonnay" },
      { "name": "Les Terres Fines, Dhondt-Grellet, 2021", "price": 108, "category": "sparkling", "country": "France", "region": "Côte des Blancs", "grape": "Chardonnay" },
      { "name": "«Auge» Lieu-Dit, Domaine Vincey, 2018", "price": null, "category": "sparkling", "country": "France", "region": "Côte des Blancs", "grape": "Chardonnay" },
      { "name": "Les Revenants, Étienne Calsac, 2021", "price": 170, "category": "sparkling", "country": "France", "region": "Côte de Sézanne", "grape": "Pinot Blanc/Petit Meslier/Arbane" },
      { "name": "Jacquesson 747, Famille Chiquet, 2019", "price": 115, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Chardonnay/Meunier/Pinot Noir" },
      { "name": "Ramosa Ripa, Maison Raday, 2023", "price": null, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Chardonnay/Pinot Noir" },
      { "name": "Troissy Les Genevraux, Dehours & Fils, 2013-2020", "price": 105, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Meunier" },
      { "name": "Oeil de Perdrix, Dehours & Fils, 2022", "price": 68, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Meunier/Chardonnay" },
      { "name": "Petraea V, Francis Boulard et Fille, 2024", "price": 120, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Noir" },
      { "name": "ADN de Meunier, Christophe Mignon, 2020-2021", "price": 70, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Meunier" },
      { "name": "Initiation, Benoît Déhu, 2021", "price": 99, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Noir/Meunier" },
      { "name": "La Rue des Noyers, Benoît Déhu, 2019", "price": 120, "category": "sparkling", "country": "France", "region": "Vallée de la Marne", "grape": "Pinot Meunier" },
      { "name": "Côte, Les Monts Fournois, 2017", "price": 180, "category": "sparkling", "country": "France", "region": "Vallée de la Marne Grand Cru", "grape": "Chardonnay" },
      { "name": "Le Jardinot, Amaury Beaufort, 2021", "price": 112, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Pinot Noir/Chardonnay" },
      { "name": "Roses de Jeanne VV/R22, Cédric Bouchard, 2021", "price": null, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Pinot Noir" },
      { "name": "Roses de Jeanne UR/R20, Cédric Bouchard, 2020", "price": null, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Pinot Noir" },
      { "name": "Val L'Hermite, Étienne Calsac, 2020", "price": null, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Pinot Noir" },
      { "name": "La Colline Inspirée, Jacques Lassaigne, NV", "price": 155, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Chardonnay" },
      { "name": "Millésime 2009, Jacques Lassaigne, 2009", "price": 270, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Chardonnay" },
      { "name": "Autour de Minuit La Voie Creuse, Jacques Lassaigne, 2018", "price": 260, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Chardonnay" },
      { "name": "Le Grain de Beauté 2017, Jacques Lassaigne, 2017", "price": 200, "category": "sparkling", "country": "France", "region": "Côte des Bars", "grape": "Chardonnay" },

      // ── SPARKLING (NON-CHAMPAGNE) ──
      { "name": "2n, Celler 9+, NV", "price": 27, "category": "sparkling", "country": "Spain", "region": "Penedès", "grape": "Cartoixà Vermell" },
      { "name": "Cremat du Jura Réserve, Domaine des Marnes Blanches, NV", "price": 47, "category": "sparkling", "country": "France", "region": "Côtes du Jura", "grape": "Chardonnay" },
      { "name": "La Bubulle á Jeannot, Anne & JF Ganevat, NV", "price": null, "category": "sparkling", "country": "France", "region": "Rotalier", "grape": "Pétillant Naturel" },
      { "name": "Blanc de Blanc V03, Johannes Aufricht, 2021", "price": 97, "category": "sparkling", "country": "Germany", "region": "Baden", "grape": "Chardonnay" },
      { "name": "Blanc de Blanc 19, Johannes Aufricht, 2020", "price": 97, "category": "sparkling", "country": "Germany", "region": "Baden", "grape": "Chardonnay" },

      // ── WHITE — SPAIN ──
      { "name": "Eulogio Pomares Maceración con Pieles, GV Desiguales, 2021", "price": 62, "category": "orange", "country": "Spain", "region": "Rías Baixas", "grape": "Albariño" },
      { "name": "Sal da Terra, Eulogio Pomares, 2022", "price": null, "category": "white", "country": "Spain", "region": "Rías Baixas", "grape": "Albariño" },
      { "name": "200 Monges Selección Especial, Bodegas Vinícola Real, 2010", "price": 100, "category": "white", "country": "Spain", "region": "Rioja", "grape": "Viura/Malvasía/Garnacha" },
      { "name": "Las Llanas, Alegre Valgañón, 2020", "price": 45, "category": "white", "country": "Spain", "region": "Rioja", "grape": "Rojal/Viura/Garnacha Blanca" },
      { "name": "DBS, De Blas Serrano, 2019", "price": 48, "category": "white", "country": "Spain", "region": "Ribera del Duero", "grape": "Albillo" },
      { "name": "Comasorts, Furtiva, 2023", "price": 48, "category": "white", "country": "Spain", "region": "Terra Alta", "grape": "Macabeo" },
      { "name": "El Cerrico, Bodega Cerrón, 2023", "price": null, "category": "white", "country": "Spain", "region": "Jumilla", "grape": "Airén" },
      { "name": "Bina, Luis Pérez, 2023", "price": 45, "category": "white", "country": "Spain", "region": "Cádiz", "grape": "Palomino Fino" },
      { "name": "Jable de Tao, Jable de Tao, 2022", "price": 55, "category": "white", "country": "Spain", "region": "Lanzarote", "grape": "Malvasía" },

      // ── WHITE — INTERNATIONAL ──
      { "name": "Tüz, Szóló, 2020", "price": 45, "category": "white", "country": "Hungary", "region": "Tokaj-Hegyalja", "grape": "Tokösmáj" },
      { "name": "Kirchberg GG, Heymann-Löwenstein, 2018", "price": 55, "category": "white", "country": "Germany", "region": "VDP Grosse Lage", "grape": "Riesling" },
      { "name": "Native, Wenzel, 2022", "price": 45, "category": "white", "country": "Austria", "region": "Weinland", "grape": "Furmint" },
      { "name": "Pyritis, Artemis Karamolegos Winery, 2021", "price": 90, "category": "white", "country": "Greece", "region": "Santorini", "grape": "Asyrtiko" },

      // ── WHITE — ITALY ──
      { "name": "Langhe Solea, Az Agricola Roagna, 2021", "price": 120, "category": "white", "country": "Italy", "region": "Piemonte", "grape": "Chardonnay" },
      { "name": "Radikon, Radikon, 2016", "price": 85, "category": "orange", "country": "Italy", "region": "Venezia Giulia", "grape": "Ribolla" },
      { "name": "Trebbiano d'Abruzzo, Emidio Pepe, 2022", "price": 120, "category": "white", "country": "Italy", "region": "Abruzzo", "grape": "Trebbiano" },
      { "name": "Marche Bianco, Contrada Contro, 2023", "price": 70, "category": "white", "country": "Italy", "region": "Marche", "grape": "Trebbiano/Pecorino" },
      { "name": "Soki Soki, Tanca Nica, 2024", "price": null, "category": "white", "country": "Italy", "region": "Sicilia", "grape": "Moscatel de Alejandría" },
      { "name": "Gravner, Josko Gravner, 2014", "price": 132, "category": "orange", "country": "Italy", "region": "Venezia Giulia", "grape": "Ribolla" },

      // ── WHITE — FRANCE ──
      { "name": "Coteaux 2019, Domaine Vincey, 2019", "price": 110, "category": "white", "country": "France", "region": "Coteaux Champenois", "grape": "Chardonnay" },
      { "name": "Rully Les Maizières, François de Nicolay, 2020", "price": 75, "category": "white", "country": "France", "region": "Rully", "grape": "Chardonnay" },
      { "name": "La Lumière Blanc, Maison Glandien, 2023", "price": 205, "category": "white", "country": "France", "region": "Mercurey", "grape": "Chardonnay" },
      { "name": "Pouilly-Fuissé Clos Varambon, Château des Rontets, 2022", "price": 60, "category": "white", "country": "France", "region": "Pouilly-Fuissé", "grape": "Chardonnay" },
      { "name": "Initiales B.B., Domaine Bernard-Bonin, 2022", "price": null, "category": "white", "country": "France", "region": "Bourgogne", "grape": "Chardonnay" },
      { "name": "Bourgogne 2022, Benoit Ente, 2022", "price": 140, "category": "white", "country": "France", "region": "Bourgogne", "grape": "Chardonnay" },
      { "name": "Les Femelottes, Domaine Chavy-Chouet, 2022", "price": 66, "category": "white", "country": "France", "region": "Meursault", "grape": "Chardonnay" },
      { "name": "Meursault 2022, Rodolphe Demougeot, 2022", "price": 105, "category": "white", "country": "France", "region": "Meursault", "grape": "Chardonnay" },
      { "name": "Meursault 2021, Antoine Jobard, 2021", "price": 125, "category": "white", "country": "France", "region": "Meursault", "grape": "Chardonnay" },
      { "name": "Puligny-Montrachet Champ Gain, Olivier Leflaive, 2019", "price": 180, "category": "white", "country": "France", "region": "Puligny-Montrachet 1er Cru", "grape": "Chardonnay" },
      { "name": "Clos de la Truffière, Benoit Ente, 2022", "price": 450, "category": "white", "country": "France", "region": "Puligny-Montrachet 1er Cru", "grape": "Chardonnay" },
      { "name": "Hautes-Côtes de Beaune, Jean Fery, 2021", "price": null, "category": "white", "country": "France", "region": "Hautes-Côtes de Beaune", "grape": "Chardonnay" },
      { "name": "Les Chagniots, Chanterêves, 2022", "price": 65, "category": "white", "country": "France", "region": "Bourgogne", "grape": "Aligoté" },
      { "name": "Les Clous Aimé, Domaine de Villaine, 2022", "price": 56, "category": "white", "country": "France", "region": "Côtes Chalonnaise", "grape": "Chardonnay" },
      { "name": "Vent d'Ange 2022, Pattes Loup, 2022", "price": null, "category": "white", "country": "France", "region": "Chablis", "grape": "Chardonnay" },
      { "name": "Chablis 1er Cru, François de Nicolay, 2018", "price": null, "category": "white", "country": "France", "region": "Chablis 1er Cru", "grape": "Chardonnay" },
      { "name": "Chablis, Tribut-Dauvissat, 2022", "price": 51, "category": "white", "country": "France", "region": "Chablis", "grape": "Chardonnay" },
      { "name": "Bourgogne Chitry, De Moor, 2023", "price": 52, "category": "white", "country": "France", "region": "Bourgogne Chitry", "grape": "Chardonnay" },
      { "name": "Roc Breïa, Théo Dancer, 2022", "price": 100, "category": "white", "country": "France", "region": "Mâcon", "grape": "Chardonnay" },
      { "name": "Les Varrons, Domaine Labet, 2022", "price": null, "category": "white", "country": "France", "region": "Côtes du Jura", "grape": "Chardonnay" },
      { "name": "En Quatre Vis, Domaine des Marnes Blanches, 2020", "price": null, "category": "white", "country": "France", "region": "Côtes du Jura", "grape": "Chardonnay" },
      { "name": "Charmille, Domaine Overnoy, 2021", "price": null, "category": "white", "country": "France", "region": "Côtes du Jura", "grape": "Chardonnay" },
      { "name": "Clos de Jerminy, Domaine Overnoy, 2021", "price": 46, "category": "white", "country": "France", "region": "Côtes du Jura", "grape": "Chardonnay" },
      { "name": "Les Chassagnes, Tony Bornard, 2018", "price": null, "category": "white", "country": "France", "region": "Jura", "grape": "Savagnin" },
      { "name": "Savagnin en Amphore, Bénédicte & Stéphane Tissot, 2017", "price": 100, "category": "orange", "country": "France", "region": "Arbois", "grape": "Savagnin" },
      { "name": "Réserve du Caveau, Lucien Aviet & Fils, 2017", "price": null, "category": "white", "country": "France", "region": "Arbois", "grape": "Savagnin" },
      { "name": "Chardonnay 2023, Fabrice Dodane, 2023", "price": null, "category": "white", "country": "France", "region": "Arbois", "grape": "Chardonnay" },
      { "name": "Cuvée Capucine, Julien Crinquand, 2022", "price": 55, "category": "white", "country": "France", "region": "Arbois", "grape": "Chardonnay" },
      { "name": "En Spois Vin Jaune, Bénédicte & Stéphane Tissot, 2011", "price": 120, "category": "white", "country": "France", "region": "Arbois", "grape": "Savagnin" },
      { "name": "Schiste, Domaine des Ardoisières, 2022", "price": 86, "category": "white", "country": "France", "region": "Savoie", "grape": "Jacquère/Roussanne/Malvoisie" },
      { "name": "Clos de la Hutte, Thibaud Boudignon, 2021", "price": 100, "category": "white", "country": "France", "region": "Savennières", "grape": "Chenin Blanc" },
      { "name": "La Guimardiere, Abel Benmaamar, 2022", "price": 40, "category": "white", "country": "France", "region": "Anjou", "grape": "Chenin Blanc" },
      { "name": "Fidès, Domaine Eric Morgat, 2018", "price": null, "category": "white", "country": "France", "region": "Loire", "grape": "Chenin Blanc" },
      { "name": "Théia, Domaine Bretaudeau, 2023", "price": 40, "category": "white", "country": "France", "region": "Loire", "grape": "Melon de Bourgogne" },
      { "name": "Crozes-Hermitage, Dard & Ribo, 2021", "price": 75, "category": "white", "country": "France", "region": "Crozes-Hermitage", "grape": "Marsanne/Roussanne" },
      { "name": "Grange Bara, Daniel Sage, 2021", "price": null, "category": "white", "country": "France", "region": "Rhône", "grape": "Roussanne" },
      { "name": "Le Serre du Rieu, Domaine Santa Duc, 2022", "price": 42, "category": "white", "country": "France", "region": "Côtes du Rhône", "grape": "Clairette/Bourboulenc" },
      { "name": "St Jean, St Jean de Bebian, 2022", "price": 60, "category": "white", "country": "France", "region": "Languedoc", "grape": "Roussanne/Grenache Gris/Chardonnay" },

      // ── RED — SPAIN ──
      { "name": "Attis Pedral, Attis Bodegas, 2016", "price": 40, "category": "red", "country": "Spain", "region": "Rías Baixas", "grape": "Pedral" },
      { "name": "Finca Genoveva, Forjas del Salnés, 2017", "price": 60, "category": "red", "country": "Spain", "region": "Rías Baixas", "grape": "Caiño Tinto" },
      { "name": "Garnacha Tintorera, Quinta da Muradella, 2016", "price": 75, "category": "red", "country": "Spain", "region": "Monterrei", "grape": "Garnacha Tintorera" },
      { "name": "El Pliegue, Quinta da Muradella, 2015", "price": 70, "category": "red", "country": "Spain", "region": "Monterrei", "grape": "Bastardo/Mencía/Carabuñenta" },
      { "name": "Massuria, Mas Asturias, 2009", "price": 43, "category": "red", "country": "Spain", "region": "Bierzo", "grape": "Mencía" },
      { "name": "Grano a Grano, Abel Mendoza, 2020", "price": 80, "category": "red", "country": "Spain", "region": "Rioja", "grape": "Graciano" },
      { "name": "Kalamity, Oxer Wines, 2017", "price": null, "category": "red", "country": "Spain", "region": "Rioja", "grape": "Tempranillo" },
      { "name": "Campanella, Manuel Cantalapiedra, 2023", "price": 75, "category": "red", "country": "Spain", "region": "Villafranca del Duero", "grape": "Garnacha/Cariñena" },
      { "name": "Las Uvas de la Ira, Vitícola Mentridana, 2021", "price": null, "category": "red", "country": "Spain", "region": "Méntrida", "grape": "Garnacha" },
      { "name": "Dits del Terra, Terroir al Límit, 2021", "price": 100, "category": "red", "country": "Spain", "region": "Priorat", "grape": "Carinyena" },
      { "name": "La Pell, Celler Lagravera, 2018", "price": 87, "category": "red", "country": "Spain", "region": "Lleida", "grape": "Parcelario" },
      { "name": "Mas de la Rosa, Vall Llach, 2010", "price": 280, "category": "red", "country": "Spain", "region": "Priorat", "grape": "Cariñena" },
      { "name": "Quincha Corral, Mustiguillo, 2019", "price": 130, "category": "red", "country": "Spain", "region": "El Terrerazo", "grape": "Bobal" },
      { "name": "Escombro, Laboratorio Rupestre, 2021", "price": 110, "category": "red", "country": "Spain", "region": "Murcia", "grape": "Alicante Bouschet" },
      { "name": "La Calera del Escaramujo, Bodega Cerrón, 2022", "price": 120, "category": "red", "country": "Spain", "region": "Jumilla", "grape": "Monastrell" },
      { "name": "Candelario, Michael Candelario, 2023", "price": 50, "category": "red", "country": "Spain", "region": "La Palma", "grape": "Negramoll/Listán Negro" },

      // ── RED — INTERNATIONAL ──
      { "name": "Cuvée du Soleil, Sept, 2020", "price": null, "category": "red", "country": "Lebanon", "grape": "Cabernet Sauvignon/Tempranillo" },
      { "name": "Kriegsheimer Rosengarten, WongAmat, 2023", "price": 100, "category": "red", "country": "Germany", "grape": "Pinot Noir" },
      { "name": "Nachtweid, Johannes Aufricht, 2022", "price": null, "category": "red", "country": "Austria", "grape": "Pinot Noir" },
      { "name": "Bühl, Claus Preisinger, 2016", "price": 65, "category": "red", "country": "Austria", "grape": "Blaufränkisch" },

      // ── RED — ITALY ──
      { "name": "Vike Vike, Simone Sedilesu, 2019", "price": 49, "category": "red", "country": "Italy", "region": "Sardinia", "grape": "Cannonau" },
      { "name": "Ghirada Ocruarana, Teularju, 2022", "price": 85, "category": "red", "country": "Italy", "region": "Sardinia", "grape": "Garnacha" },
      { "name": "Bramaterra, Odilio Antoniotti, 2020", "price": 60, "category": "red", "country": "Italy", "region": "Bramaterra", "grape": "Nebbiolo/Croatina/Vespolina" },
      { "name": "Coste della Sesia, Odilio Antoniotti, 2022", "price": 40, "category": "red", "country": "Italy", "region": "Bramaterra", "grape": "Nebbiolo" },
      { "name": "Bricco Ernesto Rosso, Bricco Ernesto, 2021", "price": 85, "category": "red", "country": "Italy", "region": "Piemonte", "grape": "Nebbiolo" },
      { "name": "Albesani, Az Agricola Roagna, 2019", "price": 175, "category": "red", "country": "Italy", "region": "Barbaresco", "grape": "Nebbiolo" },
      { "name": "Figli Luigi Oddero, Figli Luigi Oddero, 2019", "price": null, "category": "red", "country": "Italy", "region": "Barolo", "grape": "Nebbiolo" },
      { "name": "Barolo, Francesco Versio, 2021", "price": 72, "category": "red", "country": "Italy", "region": "Barolo", "grape": "Nebbiolo" },
      { "name": "Rosso di Montalcino, J G Benda, 2021", "price": 68, "category": "red", "country": "Italy", "region": "Rosso di Montalcino", "grape": "Sangiovese" },
      { "name": "Brunello di Montalcino, Salvioni, 2020", "price": 160, "category": "red", "country": "Italy", "region": "Brunello di Montalcino", "grape": "Sangiovese" },
      { "name": "Istine, Angela Fronti, 2020", "price": 66, "category": "red", "country": "Italy", "region": "Chianti Classico", "grape": "Sangiovese" },
      { "name": "Priore Mozzatta, La Visciola, 2020", "price": 60, "category": "red", "country": "Italy", "region": "Cesanese del Piglio", "grape": "Cesanese" },

      // ── RED — FRANCE ──
      { "name": "Château Tour Peyronneau, Famille Lavau, 2016", "price": 40, "category": "red", "country": "France", "region": "Saint-Émilion", "grape": "Merlot" },
      { "name": "Clos du Bas de Teurons, Domaine R&P Bouley, 2017", "price": 80, "category": "red", "country": "France", "region": "Bourgogne", "grape": "Pinot Noir" },
      { "name": "Emphase, Antoine Lienhardt, 2022", "price": 82, "category": "red", "country": "France", "region": "Bourgogne", "grape": "Pinot Noir" },
      { "name": "Clos Vougeot Grand Cru, Domaine Phillippe Charlopin, 2014", "price": 425, "category": "red", "country": "France", "region": "Clos Vougeot Grand Cru", "grape": "Pinot Noir" },
      { "name": "Aux Chaignots, Chanterêves, 2022", "price": 170, "category": "red", "country": "France", "region": "Nuits-Saint-Georges 1er Cru", "grape": "Pinot Noir" },
      { "name": "L'Atmosphère, Maison Glandien, 2022", "price": 220, "category": "red", "country": "France", "region": "Bourgogne", "grape": "Pinot Noir" },
      { "name": "Morey-Saint-Denis, Domaine Phillippe Charlopin, 2020", "price": 125, "category": "red", "country": "France", "region": "Morey-Saint-Denis", "grape": "Pinot Noir" },
      { "name": "Marsannay Les Échezots, Domaine Phillippe Charlopin, 2020", "price": 80, "category": "red", "country": "France", "region": "Marsannay", "grape": "Pinot Noir" },
      { "name": "Les Petites Pierres-Gandelins, Julien Guillot, 2021", "price": 60, "category": "red", "country": "France", "region": "Chénas", "grape": "Gamay" },
      { "name": "Bourgogne Côte-d'Or, Domaine Méo-Camuzet, 2020", "price": 62, "category": "red", "country": "France", "region": "Bourgogne Côte-d'Or", "grape": "Pinot Noir" },
      { "name": "Auxey-Duresses, Comte Armand, 2023", "price": 75, "category": "red", "country": "France", "region": "Côte-d'Or", "grape": "Pinot Noir" },
      { "name": "Volnay VS, Domaine Michel Lafarge, 2020", "price": 100, "category": "red", "country": "France", "region": "Volnay", "grape": "Pinot Noir" },
      { "name": "Clos des Epenaux, Comte Armand, 2022", "price": 200, "category": "red", "country": "France", "region": "Pommard 1er Cru", "grape": "Pinot Noir" },
      { "name": "Au Chant de la Huppe, Henri Chauvet, 2023", "price": null, "category": "red", "country": "France", "region": "Côtes d'Auvergne", "grape": "Gamay" },
      { "name": "Vie Ordinaire, Henri Chauvet, 2023", "price": 70, "category": "red", "country": "France", "region": "Vin de France", "grape": "Pinot Noir" },
      { "name": "Abrupts, Henri Chauvet, 2023", "price": 70, "category": "red", "country": "France", "region": "Côtes d'Auvergne", "grape": "Gamay" },
      { "name": "Ciel à Perdre, Henri Chauvet, 2023", "price": 50, "category": "red", "country": "France", "region": "Vin de France", "grape": "Carignan" },
      { "name": "Les Chonchons, Domaine Ganevat, 2022", "price": null, "category": "red", "country": "France", "region": "Côtes du Jura", "grape": "Pinot Noir" },
      { "name": "Les Chazaux, Nicolas Jacob, 2023", "price": null, "category": "red", "country": "France", "region": "Côtes du Jura", "grape": "Poulsard" },
      { "name": "Les Corvées, Domaine de Saint Pierre, 2023", "price": null, "category": "red", "country": "France", "region": "Arbois", "grape": "Pinot Noir/Trousseau" },
      { "name": "Le Ginglet, Tony Bornard, 2022", "price": 47, "category": "red", "country": "France", "region": "Arbois", "grape": "Trousseau" },
      { "name": "Aufil des Générations, Tony Bornard, 2021", "price": 60, "category": "red", "country": "France", "region": "Vin de France", "grape": "Poulsard" },
      { "name": "Cuvée du P'tit Prince, Julien Crinquand, 2023", "price": null, "category": "red", "country": "France", "region": "Arbois", "grape": "Trousseau" },
      { "name": "Flotsam, Mai & Kenji Hodgson, 2019", "price": 41, "category": "red", "country": "France", "region": "Loire", "grape": "Cabernet Franc" },
      { "name": "Gabouchons, Terra Vita Vinum, 2021", "price": null, "category": "red", "country": "France", "region": "Loire", "grape": "Cabernet Franc" },
      { "name": "Les Cormiers, Le Porte Saint Jean, 2022", "price": 80, "category": "red", "country": "France", "region": "Saumur", "grape": "Cabernet Franc" },
      { "name": "Montée des Roches, Arnaud Lambert, 2018", "price": 41, "category": "red", "country": "France", "region": "Saumur-Champigny", "grape": "Cabernet Franc" },
      { "name": "Lirac Rouge, Gaël Petit, 2021", "price": 43, "category": "red", "country": "France", "region": "Lirac", "grape": "Garnacha/Cariñena" },
      { "name": "Pitrou, Dard & Ribo, 2023", "price": 80, "category": "red", "country": "France", "region": "Saint-Joseph", "grape": "Syrah" },
      { "name": "Pe de Loup, Dard & Ribo, 2023", "price": 70, "category": "red", "country": "France", "region": "Crozes-Hermitage", "grape": "Syrah" },
      { "name": "Tavel Sables, L'Anglore, 2023", "price": 60, "category": "rosé", "country": "France", "region": "Tavel", "grape": "Garnacha/Cinsault/Clairette/Carignan" },
      { "name": "Tavel Vaucrose, L'Anglore, 2023", "price": 60, "category": "rosé", "country": "France", "region": "Tavel", "grape": "Garnacha/Cinsault/Clairette" },
      { "name": "Tavel, L'Anglore, 2023", "price": 48, "category": "rosé", "country": "France", "region": "Tavel", "grape": "Garnacha/Cinsault/Clairette" },
      { "name": "La Montagne, L'Anglore, 2021", "price": 46, "category": "red", "country": "France", "region": "Tavel", "grape": "Garnacha/Cinsault" },
      { "name": "Prima, L'Anglore, 2023", "price": null, "category": "red", "country": "France", "region": "Tavel", "grape": "Garnacha/Cinsault/Clairette" },
      { "name": "Chemin de la Brune, L'Anglore, 2023", "price": 40, "category": "red", "country": "France", "region": "Rhône", "grape": "Garnacha/Cinsault/Aramon" },
      { "name": "Terre d'Ombre, L'Anglore, 2022", "price": 45, "category": "red", "country": "France", "region": "Rhône", "grape": "Garnacha/Syrah/Clairette" },
      { "name": "Nizon, L'Anglore, 2022", "price": null, "category": "red", "country": "France", "region": "Rhône", "grape": "Garnacha" },
      { "name": "Cuvée Emma, A. Galetty, 2019", "price": 56, "category": "red", "country": "France", "region": "Côtes du Vivarais", "grape": "Garnacha/Syrah" },
      { "name": "Une Vie la Nuit, Clos du Rouge Gorge, 2021", "price": 35, "category": "red", "country": "France", "region": "Roussillon", "grape": "Syrah/Garnacha" },
      { "name": "Les Myrs, Danjou & Banessy, 2021", "price": 60, "category": "red", "country": "France", "region": "Côtes Catalanes", "grape": "Cariñena" },

      // ── ROSÉ ──
      { "name": "Vida Líquida, A. Pedrón & Eclèctic Vins, 2020", "price": null, "category": "rosé", "country": "Spain", "region": "Los Pedrones", "grape": "Garnacha" },
      { "name": "200 Monges Rosado Reserva, Bodegas Vinícola Real, 2017", "price": 65, "category": "rosé", "country": "Spain", "region": "Rioja", "grape": "Viura/Garnacha" },
      { "name": "Gran Cáus Rosé, Can Ràfols dels Caus, 2006", "price": 48, "category": "rosé", "country": "Spain", "region": "Penedès", "grape": "Merlot" },
      { "name": "Rosato 2024, Marino Colleoni, 2024", "price": 35, "category": "rosé", "country": "Italy", "region": "Toscana", "grape": "Sangiovese Grosso" },
      { "name": "Brunes Blanches, Gaël Petit, 2022", "price": 37, "category": "rosé", "country": "France", "region": "Tavel", "grape": "Grenache/Cinsault/Carignan" },
      { "name": "Cuvée Prestige Caroline, Clos Cibonne, 2021", "price": 65, "category": "rosé", "country": "France", "region": "Côtes de Provence", "grape": "Tibouren/Garnacha" }
    ]
  },

  "rausell-valencia": {
    "source": "Rausell restaurant bodega page, fetched 2026-03-13",
    "sourceUrl": "https://www.rausell.es/bodega",
    "checkedOn": "2026-03-13",
    "priceNote": "Prices in euros. Individual Spanish wine bottle names were not published on the web page; only champagnes and by-the-glass fortified wines had specific names and prices. Spanish wine sections recorded at region/price-range level only.",
    "items": [
      // ── CHAMPAGNE (bottles) ──
      { "name": "Moët & Chandon Brut Imperial NV", "price": 52, "category": "sparkling", "country": "France" },
      { "name": "Dom Pérignon Vintage", "price": 190, "category": "sparkling", "country": "France" },
      { "name": "Louis Roederer Cristal", "price": 220, "category": "sparkling", "country": "France" },
      { "name": "Krug Grande Cuvée", "price": 220, "category": "sparkling", "country": "France" },

      // ── BY THE GLASS — FORTIFIED & DESSERT ──
      { "name": "Verdil de Gel", "price": 4, "category": "dessert", "country": "Spain", "grape": "Verdil", "note": "By the glass" },
      { "name": "Sitta Pereiras", "price": 5, "category": "white", "country": "Spain", "grape": "Albariño", "note": "By the glass" },
      { "name": "Vi de Glass", "price": 6, "category": "white", "country": "Spain", "grape": "Gewurztraminer", "note": "By the glass" },
      { "name": "Château Dereszla Tokaji 5 Puttonyos", "price": 8, "category": "dessert", "country": "Hungary", "note": "By the glass" },
      { "name": "Fino, Palomino Fino", "price": 3.5, "category": "fortified", "country": "Spain", "grape": "Palomino Fino", "note": "By the glass" },
      { "name": "Pedro Ximénez", "price": 4, "category": "fortified", "country": "Spain", "grape": "Pedro Ximénez", "note": "By the glass" }
    ]
  }
}

export const venueWineListIds = Object.keys(venueWineLists)
