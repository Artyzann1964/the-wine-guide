# Codex Handoff - Berlin Places and Photography Release

Last updated: 2026-08-26

## Outcome

The Berlin Places guide has been expanded to 16 recommendations and reorganised around Richard's actual brief: cool, well-regarded wine bars, bistros, small plates and relaxed rooms, with different price points and straightforward access from Mitte.

The Berlin release and its photography correction have been committed, pushed, deployed to Railway production and verified in the live browser.

## What Changed

Ten relaxed venues now lead the Berlin guide:

- Trio - modern German Wirtshaus
- Pluto - biodynamic wine and small plates
- Ottorink Weinbar - Mosel-focused neighbourhood bar
- ORA - seasonal sharing plates in a former pharmacy
- Jaja - natural-wine bistro
- La Buvette - French bar a vin and bistro
- Briefmarken Weine / Il Brief - Italian natural wine in a former stamp shop
- Der Weinlobbyist - German and Austrian wine, Flammkuchen and courtyard
- Barra - seasonal small plates and low-intervention wine
- Standard Serious Pizza - Neapolitan pizza and low-intervention wine

The six earlier Berlin recommendations remain available after that shortlist:

- Muret la Barba
- Freundschaft
- Restaurant Chateau Royal
- Bandol sur mer
- Cookies Cream
- Rutz

## Editorial Decisions

- Berlin is included in the Europe town filter.
- Relaxed choices appear before Michelin and destination-dining entries.
- The guide extends beyond the administrative Mitte boundary only where a venue is distinctive and well connected.
- All 16 Berlin cards now use genuine venue photography. Trio, Pluto, Ottorink and Jaja use browser-verified publisher or venue-guide sources where the official source was missing, blocked or visually unsuitable.
- All venue copy is editorial research, not a claim that Amanda or Richard has personally visited.

## Code and Test Scope

- `src/data/places.js`
  - adds 16 Berlin entries in total across this release tranche
  - adds Berlin to `TOWN_GROUPS`
  - replaces the failed or unsuitable Trio and Pluto images and adds genuine Ottorink and Jaja room photography
- `src/__tests__/venueWineLists.invariants.test.js`
  - ensures every venue ID is unique
  - ensures every venue wine recommendation references a real wine ID

No cellar, sync, authentication, database or server code was changed.

## Verified Local State

- Tests: `124/124` passed
- Production build: passed
- Diff whitespace check: passed
- Desktop Places QA: passed at 1280px
- Mobile Places QA: passed at 390 x 844
- Berlin result count: 16
- New relaxed Berlin cards present: 10
- Berlin cards with photography: 16/16
- Failed images: 0
- Horizontal overflow: none
- Browser console errors: 0

## Release Evidence

- Original Berlin guide commit: `47cddf2 feat: add Berlin wine bar guide`
- Photography correction commit: `7076f31 fix: add Berlin venue photography`
- Photography correction commit pushed to `origin/main`
- Railway deployment: `b4c91d0e-8c48-40b6-b228-edafff568e35`
- Railway status: `SUCCESS`
- Production `/healthz`: `{"ok":true}`
- Production root: HTTP 200
- Runtime startup: clean; Express listening on port 8080
- Live Berlin Places check:
  - 16 considered places
  - all 10 new relaxed venue cards present
  - Trio, Pluto, Ottorink and Jaja photographs loaded at their expected natural dimensions
  - no failed images
  - no desktop or 390 x 844 mobile overflow
  - browser console: 0 errors, 0 warnings
- The final handoff/status update is a documentation-only commit after the application release. If Git integration rebuilds it, the application content is equivalent.

## Workspace Boundary

Only the Berlin Places tranche and current project documentation belong in this release. Existing untracked images, CSVs, sourcing packs, scripts and `output/` material are unrelated local work and must not be staged implicitly.

Railway's build reported 20 dependency audit findings (1 low, 9 moderate and 10 high). Treat this as a separate dependency-maintenance task; it was not introduced or resolved by the Berlin content release.

## Recommended Next Work

1. Add `region` and `town` URL parameters to Places for a direct Berlin-filtered link.
2. Capture stable public wine lists for the most wine-focused Berlin venues.
3. Re-verify hours and booking policies shortly before travel.
4. Treat shared-bundle performance work as a separate change.
